import express from "express";
import cors from "cors";
import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { connectDB } from "./db.js";
import { Session } from "./models/Session.js";
import { nextPhase } from "./phases.js";
import { fixTranscript } from "./transcriptFix.js";
import { adjustDifficulty } from "./difficulty.js";
import { coverageHint } from "./coverage.js";
import { pickQuestion } from "./questionBank.js";
import multer from "multer";
import { extractResumeText, structureResume } from "./resume.js";
import { systemPrompt, buildMessages, bankFallbackContext } from "./interviewer.js";

const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const BANK_PHASES_BY_MODE = {
  resume: [],
  fundamentals: ["project_depth", "fundamentals", "design"],
  balanced: ["fundamentals", "design"],
};

app.post("/api/session", async (req, res) => {
  try {
    const mode = ["resume", "fundamentals", "balanced"].includes(req.body?.mode)
      ? req.body.mode
      : "balanced";
    const session = await Session.create({
      role: req.body?.role || "software engineering intern",
      mode,
    });
    res.json({
      sessionId: session._id,
      phase: session.phase,
      mode: session.mode,
      opening: "Hi, thanks for joining. Let's start simple. Tell me about a project you've built recently.",
    });
  } catch (err) {
    console.error("Session create failed:", err);
    res.status(500).json({ error: "Could not start session" });
  }
});

app.post("/api/session/:id/resume", upload.single("resume"), async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ error: "Session not found" });
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const text = await extractResumeText(req.file.buffer);
    if (text.length < 50) {
      return res.status(400).json({ error: "Could not read text from this PDF" });
    }

    const structured = await structureResume(text);

    session.role = structured.role || session.role;
    session.resumeSummary = {
      skills: structured.skills || [],
      projects: structured.projects || [],
      experience: structured.experience || [],
    };
    await session.save();

    res.json({ role: session.role, resumeSummary: session.resumeSummary });
  } catch (err) {
    console.error("Resume upload failed:", err);
    res.status(500).json({ error: "Could not process resume" });
  }
});

app.post("/api/turn", async (req, res) => {
  const { sessionId, text, responseTimeMs } = req.body;
  if (!text?.trim()) return res.status(400).json({ error: "Empty answer" });

  try {
    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ error: "Session not found" });
    if (session.status !== "active") return res.status(400).json({ error: "Session ended" });

    const cleanText = fixTranscript(text);
    const started = Date.now();

        const bankPhases = BANK_PHASES_BY_MODE[session.mode] || BANK_PHASES_BY_MODE.balanced;
    let suggested = null;
    let fallbackNote = "";
    if (bankPhases.includes(session.phase)) {
      suggested = pickQuestion(session.phase, session.difficulty, session.askedQuestionIds);
      if (!suggested) {
        const coveredTopics = [...new Set(session.turns.map((t) => t.topic).filter((t) => t && t !== "unknown"))];
        fallbackNote = bankFallbackContext(session.phase, coveredTopics);
      }
    }

    const resumeForPrompt = session.mode === "fundamentals" ? null : session.resumeSummary;

    const model = genAI.getGenerativeModel({
      model: "gemini-3.6-flash",
      systemInstruction: systemPrompt(
        session.phase,
        session.role,
        session.difficulty,
        coverageHint(session.turns, session.phase) + fallbackNote,
        resumeForPrompt,
        suggested?.question || null
      ),
    });

    const geminiHistory = buildMessages(session.history, cleanText).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const lastMessage = geminiHistory.pop();
    const chat = model.startChat({ history: geminiHistory });
    const result = await chat.sendMessage(lastMessage.parts[0].text);

    const raw = result.response
      .text()
      .replace(/```json|```/g, "")
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      console.log("JSON parse failed:", e.message);
      parsed = {};
    }

    if (!parsed.speech || typeof parsed.speech !== "string") {
      parsed.speech = raw || "Sorry, could you repeat that?";
    }
    if (!["strong", "partial", "weak"].includes(parsed.assessment)) {
      parsed.assessment = "partial";
    }
    parsed.topic = parsed.topic || "unknown";
    const latencyMs = Date.now() - started;

    const turnsInPhase = session.turns.filter((t) => t.phase === session.phase).length + 1;
 const advancedPhase = nextPhase(session.phase, turnsInPhase, session.mode);

    session.history.push({ role: "user", content: cleanText });
    session.history.push({ role: "assistant", content: raw });
    const askedAtDifficulty = session.difficulty;
    session.consecutiveWeak = parsed.assessment === "weak" ? session.consecutiveWeak + 1 : 0;
    session.difficulty = adjustDifficulty(session.difficulty, parsed.assessment, session.consecutiveWeak);
    if (suggested) session.askedQuestionIds.push(suggested.id);
    session.turns.push({
      index: session.turns.length + 1,
      phase: session.phase,
      candidateText: cleanText,
      difficulty: askedAtDifficulty,
      interviewerText: parsed.speech,
      assessment: parsed.assessment,
      topic: parsed.topic,
      latencyMs,
      responseTimeMs: typeof responseTimeMs === "number" ? responseTimeMs : null,
    });
    session.phase = advancedPhase;
    await session.save();

    console.log(`[${session.mode}][${session.phase}] turn ${session.turns.length} | L${askedAtDifficulty}→L${session.difficulty} | bank:${suggested?.id || "none"} | ${latencyMs}ms | ${parsed.assessment} | ${parsed.topic}`);

    res.json({
      speech: parsed.speech,
      assessment: parsed.assessment,
      phase: session.phase,
      difficulty: session.difficulty,
      latencyMs,
      transcribed: cleanText,
    });
  } catch (err) {
    console.error("Turn failed:", err);
    res.status(500).json({ error: "Interview turn failed" });
  }
});

app.post("/api/session/:id/end", async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ error: "Not found" });
    session.status = "completed";
    session.endedAt = new Date();
    await session.save();
    res.json({ stats: session.stats });
  } catch (err) {
    res.status(500).json({ error: "Could not end session" });
  }
});

app.get("/api/session/:id", async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ error: "Not found" });
    res.json({ turns: session.turns, phase: session.phase, stats: session.stats });
  } catch (err) {
    res.status(500).json({ error: "Could not fetch session" });
  }
});

const PORT = process.env.PORT || 3000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
});
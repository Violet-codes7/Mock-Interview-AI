import express from "express";
import cors from "cors";
import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";
import { connectDB } from "./db.js";
import { Session } from "./models/Session.js";
import { systemPrompt, buildMessages } from "./interviewer.js";
import { nextPhase } from "./phases.js";
import { fixTranscript } from "./transcriptFix.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

app.post("/api/session", async (req, res) => {
  try {
    const session = await Session.create({
      role: req.body?.role || "software engineering intern",
    });
    res.json({
      sessionId: session._id,
      phase: session.phase,
      opening: "Hi, thanks for joining. Let's start simple. Tell me about a project you've built recently.",
    });
  } catch (err) {
    console.error("Session create failed:", err);
    res.status(500).json({ error: "Could not start session" });
  }
});

app.post("/api/turn", async (req, res) => {
  const { sessionId, text } = req.body;
  if (!text?.trim()) return res.status(400).json({ error: "Empty answer" });

  try {
    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ error: "Session not found" });
    if (session.status !== "active") return res.status(400).json({ error: "Session ended" });

    const cleanText = fixTranscript(text);
    const started = Date.now();

    const response = await client.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 300,
      system: systemPrompt(session.phase, session.role),
      messages: buildMessages(session.history, cleanText),
    });

    const raw = response.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("")
      .replace(/```json|```/g, "")
      .trim();

   console.log("RAW FROM CLAUDE:", raw);

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
    const advancedPhase = nextPhase(session.phase, turnsInPhase);

    session.history.push({ role: "user", content: cleanText });
    session.history.push({ role: "assistant", content: raw });
    session.turns.push({
      index: session.turns.length + 1,
      phase: session.phase,
      candidateText: cleanText,
      interviewerText: parsed.speech,
      assessment: parsed.assessment,
      topic: parsed.topic,
      latencyMs,
    });
    session.phase = advancedPhase;
    await session.save();

    console.log(`[${session.phase}] turn ${session.turns.length} | ${latencyMs}ms | ${parsed.assessment} | ${parsed.topic}`);

    res.json({
      speech: parsed.speech,
      assessment: parsed.assessment,
      phase: session.phase,
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
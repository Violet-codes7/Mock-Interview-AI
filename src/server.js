import express from "express";
import cors from "cors";
import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT, buildMessages } from "./interviewer.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const sessions = new Map();

app.post("/api/session", (req, res) => {
  const id = crypto.randomUUID();
  sessions.set(id, { history: [], turns: [], startedAt: Date.now() });
  res.json({
    sessionId: id,
    opening: "Hi, thanks for joining. Let's start simple. Tell me about a project you've built recently.",
  });
});

app.post("/api/turn", async (req, res) => {
  const { sessionId, text } = req.body;
  const session = sessions.get(sessionId);
  if (!session) return res.status(404).json({ error: "Session not found" });
  if (!text?.trim()) return res.status(400).json({ error: "Empty answer" });

  const started = Date.now();

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages: buildMessages(session.history, text),
    });

    const raw = response.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("")
      .replace(/```json|```/g, "")
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = { speech: raw, assessment: "partial", topic: "unknown" };
    }

    const latencyMs = Date.now() - started;

    session.history.push({ role: "user", content: text });
    session.history.push({ role: "assistant", content: raw });
    session.turns.push({
      candidateText: text,
      assessment: parsed.assessment,
      topic: parsed.topic,
      latencyMs,
    });

    console.log(`[turn ${session.turns.length}] ${latencyMs}ms | ${parsed.assessment} | ${parsed.topic}`);

    res.json({ speech: parsed.speech, assessment: parsed.assessment, latencyMs });
  } catch (err) {
    console.error("Turn failed:", err);
    res.status(500).json({ error: "Interview turn failed" });
  }
});

app.get("/api/session/:id", (req, res) => {
  const session = sessions.get(req.params.id);
  if (!session) return res.status(404).json({ error: "Not found" });
  const lat = session.turns.map((t) => t.latencyMs).sort((a, b) => a - b);
  res.json({
    turns: session.turns,
    p50: lat[Math.floor(lat.length / 2)] ?? null,
    durationSec: Math.round((Date.now() - session.startedAt) / 1000),
  });
});

app.listen(process.env.PORT || 3000, () =>
  console.log(`http://localhost:${process.env.PORT || 3000}`)
);
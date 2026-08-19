import mongoose from "mongoose";

const turnSchema = new mongoose.Schema({
  index: Number,
  phase: String,
  candidateText: String,
  interviewerText: String,
  assessment: { type: String, enum: ["strong", "partial", "weak"] },
  difficulty: Number,
  topic: String,
  latencyMs: Number,
  createdAt: { type: Date, default: Date.now },
}, { _id: false });

const sessionSchema = new mongoose.Schema({
  role: { type: String, default: "software engineering intern" },
  resumeSummary: {
    skills: [String],
    projects: [{ name: String, description: String, tech: [String] }],
    experience: [String],
  },
  phase: { type: String, default: "warmup" },
  difficulty: { type: Number, default: 2, min: 1, max: 5 },
  consecutiveWeak: { type: Number, default: 0 },
  status: { type: String, enum: ["active", "completed", "abandoned"], default: "active" },
  history: [{ role: String, content: String, _id: false }],
  turns: [turnSchema],
  startedAt: { type: Date, default: Date.now },
  endedAt: Date,
});

sessionSchema.virtual("stats").get(function () {
  const lat = this.turns.map((t) => t.latencyMs).sort((a, b) => a - b);
  const counts = { strong: 0, partial: 0, weak: 0 };
  this.turns.forEach((t) => counts[t.assessment] !== undefined && counts[t.assessment]++);
  const diffs = this.turns.map((t) => t.difficulty).filter(Boolean);
  return {
    turnCount: this.turns.length,
    p50LatencyMs: lat[Math.floor(lat.length / 2)] ?? null,
    p95LatencyMs: lat[Math.floor(lat.length * 0.95)] ?? null,
    assessments: counts,
    peakDifficulty: diffs.length ? Math.max(...diffs) : null,
    avgDifficulty: diffs.length ? +(diffs.reduce((a, b) => a + b, 0) / diffs.length).toFixed(1) : null,
  };
});

sessionSchema.set("toJSON", { virtuals: true });

export const Session = mongoose.model("Session", sessionSchema);
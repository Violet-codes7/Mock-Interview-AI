import mongoose from "mongoose";

const turnSchema = new mongoose.Schema({
  index: Number,
  phase: String,
  candidateText: String,
  interviewerText: String,
  assessment: { type: String, enum: ["strong", "partial", "weak"] },
  topic: String,
  latencyMs: Number,
  createdAt: { type: Date, default: Date.now },
}, { _id: false });

const sessionSchema = new mongoose.Schema({
  role: { type: String, default: "software engineering intern" },
  phase: { type: String, default: "warmup" },
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
  return {
    turnCount: this.turns.length,
    p50LatencyMs: lat[Math.floor(lat.length / 2)] ?? null,
    p95LatencyMs: lat[Math.floor(lat.length * 0.95)] ?? null,
    assessments: counts,
  };
});

sessionSchema.set("toJSON", { virtuals: true });

export const Session = mongoose.model("Session", sessionSchema);
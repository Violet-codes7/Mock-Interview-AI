export const PHASES = [
  {
    id: "warmup",
    minTurns: 2,
    goal: "Put the candidate at ease. Ask about background and a recent project at a high level.",
  },
  {
    id: "project_depth",
    minTurns: 3,
    goal: "Drill into a project they mentioned. Probe technical decisions, tradeoffs, and what broke.",
  },
  {
    id: "fundamentals",
    minTurns: 3,
    goal: "Test CS fundamentals relevant to what they claimed: data structures, complexity, databases, or networking.",
  },
  {
    id: "design",
    minTurns: 2,
    goal: "Pose an open-ended design or debugging scenario. Look for structured thinking, not a perfect answer.",
  },
  {
    id: "wrapup",
    minTurns: 1,
    goal: "Ask if they have questions, then close warmly.",
  },
];

// Different modes walk a different set of phases. Fundamentals mode skips
// project_depth entirely — there's no resume to draw a project from — and
// spends that time on more technical-question coverage instead.
const SEQUENCES = {
  balanced: ["warmup", "project_depth", "fundamentals", "design", "wrapup"],
  resume: ["warmup", "project_depth", "fundamentals", "design", "wrapup"],
  fundamentals: ["warmup", "fundamentals", "design", "wrapup"],
};

// Fundamentals mode spends longer in the technical phases since it has no
// project_depth phase to fill that time instead.
const MIN_TURNS_OVERRIDE = {
  fundamentals: { fundamentals: 6, design: 3 },
};

function phaseConfig(phaseId, mode) {
  const base = PHASES.find((p) => p.id === phaseId);
  const override = MIN_TURNS_OVERRIDE[mode]?.[phaseId];
  return override ? { ...base, minTurns: override } : base;
}

export function nextPhase(currentPhaseId, turnsInPhase, mode = "balanced") {
  const sequence = SEQUENCES[mode] || SEQUENCES.balanced;
  const idx = sequence.indexOf(currentPhaseId);
  const current = phaseConfig(currentPhaseId, mode);
  if (idx === -1) return currentPhaseId;
  if (turnsInPhase >= current.minTurns && idx < sequence.length - 1) {
    return sequence[idx + 1];
  }
  return currentPhaseId;
}

export function phaseGoal(phaseId) {
  return PHASES.find((p) => p.id === phaseId)?.goal ?? PHASES[0].goal;
}
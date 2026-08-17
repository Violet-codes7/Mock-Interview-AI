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

export function nextPhase(currentPhaseId, turnsInPhase) {
  const idx = PHASES.findIndex((p) => p.id === currentPhaseId);
  const current = PHASES[idx];
  if (turnsInPhase >= current.minTurns && idx < PHASES.length - 1) {
    return PHASES[idx + 1].id;
  }
  return currentPhaseId;
}

export function phaseGoal(phaseId) {
  return PHASES.find((p) => p.id === phaseId)?.goal ?? PHASES[0].goal;
}
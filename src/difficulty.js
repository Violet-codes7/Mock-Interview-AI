export const LEVELS = {
  1: { label: "foundational", guide: "Ask a definitional or recall question. Single concept, no depth." },
  2: { label: "applied", guide: "Ask them to apply a concept to a concrete case. One step of reasoning." },
  3: { label: "analytical", guide: "Ask about tradeoffs or why they chose one approach over another." },
  4: { label: "design", guide: "Pose an open-ended scenario with no single right answer. Look for structured thinking." },
  5: { label: "expert", guide: "Probe edge cases, failure modes, or scale. Assume strong fundamentals." },
};

const DELTA = { strong: +1, partial: 0, weak: -2 };

export function adjustDifficulty(current, assessment, consecutiveWeak) {
  let next = current + (DELTA[assessment] ?? 0);
  if (consecutiveWeak >= 2) next -= 1;
  return Math.max(1, Math.min(5, next));
}

export function levelGuide(level) {
  return LEVELS[level]?.guide ?? LEVELS[2].guide;
}

export function levelLabel(level) {
  return LEVELS[level]?.label ?? "applied";
}
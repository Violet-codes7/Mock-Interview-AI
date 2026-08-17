export function topicsCovered(turns, phase) {
  return [...new Set(turns.filter((t) => t.phase === phase).map((t) => t.topic).filter((t) => t && t !== "unknown"))];
}

export function coverageHint(turns, phase) {
  const covered = topicsCovered(turns, phase);
  if (covered.length === 0) return "";
  return `\nALREADY COVERED THIS PHASE: ${covered.join(", ")}. Do not repeat these unless probing deeper on a weak answer.`;
}
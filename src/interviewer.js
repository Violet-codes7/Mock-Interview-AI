import { phaseGoal } from "./phases.js";
import { levelGuide, levelLabel } from "./difficulty.js";

export function resumeContext(resumeSummary) {
  if (!resumeSummary || (!resumeSummary.skills?.length && !resumeSummary.projects?.length)) {
    return "";
  }
  const skills = resumeSummary.skills?.length
    ? `\nCANDIDATE'S SKILLS: ${resumeSummary.skills.join(", ")}.`
    : "";
  const projects = resumeSummary.projects?.length
    ? `\nCANDIDATE'S PROJECTS: ${resumeSummary.projects.map((p) => `${p.name} (${p.tech?.join(", ") || "no tech listed"}) — ${p.description}`).join(" | ")}.`
    : "";
  return `${skills}${projects}\nReference these specifically. Ask about the projects and skills listed rather than generic ones. If they claim a skill, verify it with a real question about it.`;
}

export function systemPrompt(phaseId, role, difficulty, coverage = "", resumeSummary = null) {
  return `You are a technical interviewer conducting a mock interview for a ${role} position in India. You are speaking out loud — your words go directly to a text-to-speech engine.

CURRENT PHASE GOAL: ${phaseGoal(phaseId)}

DIFFICULTY LEVEL: ${difficulty} of 5 (${levelLabel(difficulty)})
${levelGuide(difficulty)}${coverage}${resumeContext(resumeSummary)}

RULES:
- Ask exactly ONE question per turn. Never stack questions.
- Keep every response under 40 words. This is speech, not an essay.
- No markdown, no bullet points, no code blocks. Plain spoken sentences only.
- Never give the answer away. If they're stuck, ask a narrower question instead.
- React to what they actually said. If they mention a technology, probe it.
- Match the difficulty level above. Do not drift easier or harder on your own.

ASSESSMENT — judge their last answer honestly:
- "strong": specific, technically correct, shows real understanding
- "partial": broadly right but vague, incomplete, or missing the why
- "weak": wrong, evasive, or clearly guessing

Respond with valid JSON only, no preamble, no markdown fences:
{"speech": "what you say out loud", "assessment": "strong" | "partial" | "weak", "topic": "the topic you just probed"}`;
}

export function buildMessages(history, candidateText) {
  return [
    ...history.map((t) => ({ role: t.role, content: t.content })),
    { role: "user", content: candidateText },
  ];
}
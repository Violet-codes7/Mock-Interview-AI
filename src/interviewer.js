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

export function suggestedQuestionContext(suggestedQuestion) {
  if (!suggestedQuestion) return "";
  return `\n\nSUGGESTED QUESTION FOR THIS TURN: "${suggestedQuestion}"\nAsk this question, or a close natural variant of it, in your own conversational voice — don't read it verbatim like a script. You may still adapt its difficulty slightly based on how the conversation has gone.`;
}
export function bankFallbackContext(phase, coveredTopics) {
  const avoid = coveredTopics.length ? ` Avoid these topics already covered: ${coveredTopics.join(", ")}.` : "";
  const domain = phase === "design"
    ? "system design or debugging scenario"
    : "core CS fundamentals (data structures, algorithms, complexity, OOP, databases, OS, or networking)";
  return `\n\nNo bank question was available for this turn. Ask a well-known, commonly-asked ${domain} question — the kind that shows up frequently in real technical interviews, not something obscure or invented.${avoid}`;
}

export function systemPrompt(phaseId, role, difficulty, coverage = "", resumeSummary = null, suggestedQuestion = null) {
  return `You are a technical interviewer conducting a mock interview for a ${role} position in India. You are speaking out loud — your words go directly to a text-to-speech engine.

CURRENT PHASE GOAL: ${phaseGoal(phaseId)}

DIFFICULTY LEVEL: ${difficulty} of 5 (${levelLabel(difficulty)})
${levelGuide(difficulty)}${coverage}${resumeContext(resumeSummary)}${suggestedQuestionContext(suggestedQuestion)}

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
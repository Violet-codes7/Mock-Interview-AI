# Interview Room — AI Mock Interview Platform

![Tests](https://github.com/Violet-codes7/mock-interview-ai/actions/workflows/test.yml/badge.svg)

A voice-based mock interview simulator that adapts to you. It listens to your spoken answers, adjusts question difficulty in real time based on how you're doing, grounds its questions in either your resume or a curated technical question bank, and gives you a scored report at the end.

Built to solve a real problem: mock interviews are the highest-leverage prep activity for placement season, and almost nobody gets enough of them, because they require another person's time.

## Live demo

**https://mock-interview-ai-9l5o.onrender.com**

Note: runs on a free-tier instance that sleeps after 15 minutes of inactivity — the first request after a period of no traffic can take up to 50 seconds to wake up. Subsequent requests are fast.

## What it does

- **Voice-native interview loop** — speaks questions aloud, listens to your spoken answers, no typing
- **Three question modes**
  - **Resume-focused** — parses an uploaded PDF resume and asks about your actual projects and skills
  - **Fundamentals-focused** — draws from a curated bank of standard CS/DSA/system-design questions, no resume needed, skips straight past project-specific phases
  - **Balanced** — mixes both, resume-aware early on, technical bank questions in later phases
- **Adaptive difficulty engine** — a five-level difficulty score that climbs on strong answers and drops sharply on weak ones (with an extra penalty for consecutive weak answers), shown live as a signal meter
- **Structured interview phases** — warmup → project deep-dive (mode-dependent) → CS fundamentals → system design → wrap-up
- **Curated question bank with AI fallback** — ~65 hand-written standard technical interview questions across DSA, OOP, DBMS, OS, networking, and system design; once exhausted for a phase, the model generates further well-known questions instead of running dry
- **Question-driven response timer** — a countdown scaled to question difficulty that starts the moment the question is asked (not when the candidate starts talking), with a grace period before auto-submitting
- **End-of-session report** — a visual scorecard: turn count, peak/average difficulty reached, average response time, reply latency percentiles, and a strong/partial/weak breakdown
- **Provider-agnostic LLM layer** — originally built on Anthropic's API, swapped to Google Gemini without touching any interview logic, phase structure, or difficulty code
- **Automated tests + CI** — unit tests for the difficulty engine, phase sequencing, transcript cleanup, and question bank integrity, run automatically on every push via GitHub Actions
- **Measured AI assessment reliability** — an eval harness validates the model's strong/partial/weak grading against 17 hand-labeled test cases, achieving **88.2% agreement** with human judgment (see `eval/RESULTS.md`)

## Architecture

\`\`\`
Browser (Web Speech API)
   │  speech → text
   ▼
Express server ── MongoDB (session state, transcripts, stats)
   │  prompt + history
   ▼
Gemini (question generation, answer assessment)
   │  JSON: { speech, assessment, topic }
   ▼
Browser (speech synthesis) → spoken back to candidate
\`\`\`

Each turn: the transcript is cleaned of common speech-recognition errors (technical terms like "mongo db" get normalized to "MongoDB"), a system prompt is built from the current phase, difficulty level, resume context (if applicable), and a question suggested by the technical question bank (if applicable), then sent to the LLM. The response is parsed as structured JSON, difficulty is adjusted based on the assessment, and the phase advances once enough turns have passed in the current stage.

## Tech stack

- **Backend:** Node.js, Express, MongoDB (Atlas) via Mongoose
- **LLM:** Google Gemini (`gemini-3.6-flash`), structured JSON output
- **Voice:** Web Speech API (SpeechRecognition + SpeechSynthesis)
- **Resume parsing:** `pdf-parse` for text extraction, Gemini for structured extraction (skills, projects, tech stack)
- **Frontend:** Vanilla HTML/CSS/JS, no framework — custom dark "studio console" UI with a live recording indicator and animated waveform
- **Testing:** Vitest, GitHub Actions CI
- **Deployment:** Render

## Design decisions worth knowing about

**Asymmetric difficulty adjustment.** A strong answer raises difficulty by one level; a weak answer drops it by two, with an extra penalty for two weak answers in a row. Interviews should get harder slowly and back off quickly — nobody learns anything from a question they're clearly drowning in.

**Bank-first, AI-fallback question sourcing.** Fundamentals and design phases draw from a hand-curated set of standard technical interview questions before falling back to AI-generated ones once exhausted. This keeps question quality high and predictable for the bulk of a typical session while still supporting long or repeated use, without ever reproducing scraped or copyrighted question sets.

**Provider portability.** The system prompt and interview logic have zero knowledge of which LLM provider is answering. Switching from Anthropic to Gemini during development required changing exactly one file.

**Timer starts on the question, not the click.** The response countdown begins the moment the interviewer finishes speaking, mirroring how time pressure actually works in a real interview, not when the candidate happens to press a button.

**Measuring the AI, not just trusting it.** Rather than assuming the model's strong/partial/weak grading was reliable, an eval harness checks it against hand-labeled ground truth. The result (88.2% agreement) also surfaced a specific pattern: both disagreements involved the model being more lenient than a human on borderline-weak answers, never the reverse.

## Running locally

```bash
git clone https://github.com/Violet-codes7/mock-interview-ai.git
cd mock-interview-ai
npm install
```

Create a `.env` file:

GEMINI_API_KEY=your-key-here
MONGODB_URI=your-mongodb-atlas-connection-string
PORT=3000


```bash
npm run dev
```

Open `http://localhost:3000` in Chrome (Web Speech API support is inconsistent across other browsers).

## Testing

```bash
npm test
```

Runs the full unit test suite (difficulty engine, phase sequencing, transcript cleanup, question bank integrity) via Vitest. Also runs automatically on every push via GitHub Actions.

```bash
npm run eval
```

Runs the LLM assessment eval harness against 17 hand-labeled cases and reports an agreement percentage. Requires a valid `GEMINI_API_KEY` and consumes API quota — see `eval/RESULTS.md` for the last recorded run.

## Roadmap

- [x] Voice interview loop with MongoDB persistence
- [x] Phased interview structure
- [x] Adaptive difficulty engine
- [x] Resume upload and resume-aware questioning
- [x] Provider-agnostic LLM layer
- [x] Question-driven response timer
- [x] End-of-session scoring report
- [x] Mode selector (resume / fundamentals / balanced)
- [x] Curated technical question bank with AI-generation fallback
- [x] Automated tests + CI pipeline
- [x] Eval harness measuring AI assessment reliability
- [x] Public deployment
- [ ] Streaming speech-to-text and text-to-speech for lower latency
- [ ] Barge-in support (interrupt the interviewer mid-question)
- [ ] Login and session history
- [ ] Beta with real users at scale

## Why this exists

Built during placement season as a genuine attempt to solve my own prep problem — and to build something with real users rather than another CRUD project nobody touches. Every design decision above was made because it mattered for a real practice session, not to check a box.

## License

MIT

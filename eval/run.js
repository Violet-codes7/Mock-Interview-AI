import "dotenv/config";
import { systemPrompt } from "../src/interviewer.js";
import { EVAL_CASES } from "./dataset.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function assessOne(question, answer) {
  const model = genAI.getGenerativeModel({
    model: "gemini-3.6-flash",
    systemInstruction: systemPrompt("fundamentals", "software engineering intern", 3, "", null, question),
  });

  const result = await model.generateContent(answer);
  const raw = result.response.text().replace(/```json|```/g, "").trim();

  try {
    const parsed = JSON.parse(raw);
    return parsed.assessment;
  } catch {
    return "PARSE_ERROR";
  }
}

async function main() {
  console.log(`Running eval on ${EVAL_CASES.length} labeled cases...\n`);

  let agree = 0;
  let disagree = 0;
  const mismatches = [];

  for (const [i, testCase] of EVAL_CASES.entries()) {
    const actual = await assessOne(testCase.question, testCase.answer);
    const match = actual === testCase.expected;
    match ? agree++ : disagree++;

    console.log(
      `${i + 1}/${EVAL_CASES.length} | expected: ${testCase.expected.padEnd(8)} | got: ${actual.padEnd(8)} | ${match ? "✓" : "✗ MISMATCH"}`
    );

    if (!match) {
      mismatches.push({ ...testCase, actual });
    }
  }

  const total = agree + disagree;
  const agreementPct = ((agree / total) * 100).toFixed(1);

  console.log(`\n${"=".repeat(50)}`);
  console.log(`Agreement rate: ${agreementPct}% (${agree}/${total})`);
  console.log(`${"=".repeat(50)}\n`);

  if (mismatches.length > 0) {
    console.log("Mismatches:\n");
    mismatches.forEach((m) => {
      console.log(`Q: ${m.question}`);
      console.log(`A: ${m.answer}`);
      console.log(`Expected: ${m.expected} | Got: ${m.actual}\n`);
    });
  }
}

main();
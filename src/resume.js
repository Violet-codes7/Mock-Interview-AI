import * as pdfParseModule from "pdf-parse";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const PDFParse = pdfParseModule.PDFParse || pdfParseModule.default?.PDFParse || pdfParseModule.default;

export async function extractResumeText(buffer) {
  try {
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    const text = typeof result === "string" ? result : (result.text ?? "");
    return text.replace(/\s+/g, " ").trim();
  } catch (err) {
    console.error("PDF PARSE FAILED — raw error:", err);
    throw new Error("PDF parsing failed: " + err.message);
  }
}
const EXTRACT_PROMPT = `You will receive raw text extracted from a resume. Extract structured information from it.

Respond with valid JSON only, no preamble, no markdown fences:
{
  "role": "the job title/field this person is targeting, e.g. 'software engineering intern'",
  "skills": ["array", "of", "specific", "technologies", "and", "languages"],
  "projects": [
    {"name": "project name", "description": "one sentence on what it does", "tech": ["tech", "used"]}
  ],
  "experience": ["any internships or work experience, one string per entry, empty array if none"]
}

Keep skills and tech names exact as written (e.g. "MongoDB" not "database"). Include at most 5 projects, the most substantial ones. If the resume text is garbled or unclear in places, extract what you can confidently identify and skip the rest.`;

export async function structureResume(rawText, retries = 2) {
  const model = genAI.getGenerativeModel({
    model: "gemini-3.6-flash",
    systemInstruction: EXTRACT_PROMPT,
  });

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const result = await model.generateContent(rawText.slice(0, 8000));
      const raw = result.response.text().replace(/```json|```/g, "").trim();
      try {
        return JSON.parse(raw);
      } catch {
        return { role: "software engineering intern", skills: [], projects: [], experience: [] };
      }
    } catch (err) {
      const isOverloaded = err.status === 503 || err.message?.includes("Service Unavailable");
      if (isOverloaded && attempt < retries) {
        console.log(`Gemini overloaded, retrying (${attempt + 1}/${retries})...`);
        await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
        continue;
      }
      throw err;
    }
  }
}
const CORRECTIONS = [
  [/\bmongo\s?db\b/gi, "MongoDB"],
  [/\bnode\s?j\.?s\.?\b/gi, "Node.js"],
  [/\bno\s?j\.?s\.?\b/gi, "Node.js"],
  [/\breact\s?j\.?s\.?\b/gi, "React"],
  [/\bexpress\s?j\.?s\.?\b/gi, "Express"],
  [/\bsequel\b/gi, "SQL"],
  [/\bmy\s?sequel\b/gi, "MySQL"],
  [/\bpost\s?gres\w*\b/gi, "PostgreSQL"],
  [/\bA\.?P\.?I\.?\b/g, "API"],
  [/\bleet\s?code\b/gi, "LeetCode"],
  [/\bgit\s?hub\b/gi, "GitHub"],
  [/\bjava\s?script\b/gi, "JavaScript"],
  [/\bbig\s?o\b/gi, "Big-O"],
  [/\brest\s?full\b/gi, "RESTful"],
  [/\bJ\.?W\.?T\.?\b/gi, "JWT"],
];

export function fixTranscript(text) {
  return CORRECTIONS.reduce((acc, [re, sub]) => acc.replace(re, sub), text).trim();
}
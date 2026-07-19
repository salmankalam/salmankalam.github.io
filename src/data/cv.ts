import cvText from "../../cv.txt?raw";

const lines = cvText.split("\n").filter((l) => l.trim());

function extractSection(name: string): string[] {
  const idx = lines.findIndex(
    (l) => l.toLowerCase().includes(name.toLowerCase())
  );
  if (idx === -1) return [];
  const result: string[] = [];
  for (let i = idx + 1; i < lines.length; i++) {
    if (/^[A-Z]/.test(lines[i]) && lines[i].length < 40) break;
    if (lines[i].trim()) result.push(lines[i].trim());
  }
  return result;
}

export const cv = {
  raw: cvText,
  name: extractSection("Salman Kalam")[0] || "Salman Kalam",
  education: extractSection("Education"),
  experience: extractSection("Experience"),
  skills: extractSection("Skills"),
  languages: extractSection("Languages"),
  summary: extractSection("Summary"),
  about: extractSection("About"),
};

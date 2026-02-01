// src/services/aiEvaluate.service.ts
import { GoogleGenAI } from "@google/genai";

const genai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
  apiVersion: "v1",
});

export interface MatchResult {
  score: number;
  match_reasons: string[];
  missing_skills: string[];
  advice: string;
}

export async function evaluateMatch(
  job: {
    title: string;
    description: string;
    skills?: string[];
  },
  cv: {
    skills: string[];
    experience: any[];
    summary?: string;
  },
): Promise<MatchResult> {
  const prompt = `
You are an AI technical recruiter.

Evaluate how well the candidate matches the job.

EVALUATION RULES:
- Score range: 0–100
- Base score on HARD SKILLS and RELEVANT EXPERIENCE only
- Penalize missing REQUIRED skills mentioned explicitly in the job description
- Do NOT infer skills not present in the CV
- Do NOT mention soft skills unless explicitly required

JOB:
Title: ${job.title}

Description:
${job.description}

Candidate CV (structured JSON):
${JSON.stringify(cv)}

OUTPUT FORMAT:
Return ONLY valid JSON exactly in this shape:
{
  "score": number,
  "match_reasons": string[],
  "missing_skills": string[],
  "advice": string
}

OUTPUT RULES:
- match_reasons: factual, skill-based, max 4 items
- missing_skills: concrete technical skills only
- advice: 1–2 sentences, actionable, no motivational fluff
`;

  try {
    const response = await genai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.response.text();
    const parsed = JSON.parse(text);

    // 🔒 Hard validation (important)
    return {
      score: Number(parsed.score) || 0,
      match_reasons: Array.isArray(parsed.match_reasons)
        ? parsed.match_reasons
        : [],
      missing_skills: Array.isArray(parsed.missing_skills)
        ? parsed.missing_skills
        : [],
      advice: typeof parsed.advice === "string" ? parsed.advice : "",
    };
  } catch (err) {
    console.error("AI match evaluation failed:", err);

    // Fail-safe fallback
    return {
      score: 0,
      match_reasons: [],
      missing_skills: [],
      advice: "Unable to evaluate match automatically.",
    };
  }
}

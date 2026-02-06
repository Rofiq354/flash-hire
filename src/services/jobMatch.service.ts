// services/jobMatch.service.ts
import { GoogleGenAI } from "@google/genai";

const genai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function evaluateJobMatch({ jobDescription, cvData }: any) {
  const response = await genai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `
            You are an AI technical recruiter.

            Analyze the match between job and CV.

            Job Description:
            ${jobDescription}

            Candidate CV:
            ${JSON.stringify(cvData)}

            Return ONLY valid JSON:
            {
              "score": number,
              "match_reasons": string[],
              "missing_skills": string[],
              "advice": string
            }
            `,
          },
        ],
      },
    ],
    config: { responseMimeType: "application/json" },
  });

  const text = response.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("Empty response from Gemini");
  }

  return JSON.parse(text);
}

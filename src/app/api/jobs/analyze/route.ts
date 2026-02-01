// app/api/job/analyze/route.ts
import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const genai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { jobDescription, userCvData } = await req.json();

    const prompt = `
      You are an AI technical recruiter.

      Analyze how well the candidate matches the job description.

      EVALUATION RULES:
      - Score range: 0–100
      - Base the score primarily on HARD SKILLS and relevant EXPERIENCE.
      - Penalize missing REQUIRED skills mentioned explicitly in the job description.
      - Soft skills may be mentioned only if explicitly stated in the job description.
      - Do NOT infer skills that are not present in the CV.

      Job Description:
      ${jobDescription}

      Candidate CV (structured data):
      ${JSON.stringify(userCvData)}

      OUTPUT FORMAT:
      Return ONLY valid JSON in exactly this shape:
      {
        "score": number,
        "match_reasons": string[],
        "missing_skills": string[],
        "advice": string
      }

      OUTPUT RULES:
      - match_reasons: concise, factual, skill-based
      - missing_skills: only concrete technical skills
      - advice: 1-2 sentences, actionable, no generic motivation
    `;

    const response = await genai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      config: { responseMimeType: "application/json" },
    });

    const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log(text);

    if (!text) {
      return NextResponse.json(
        { message: "Empty AI response" },
        { status: 500 },
      );
    }

    return NextResponse.json(JSON.parse(text));
  } catch (e) {
    console.error("Job analyze API error:", e);
    return NextResponse.json(
      {
        score: 0,
        match_reasons: ["Analysis failed"],
        missing_skills: [],
        advice: "AI service unavailable.",
      },
      { status: 500 },
    );
  }
}

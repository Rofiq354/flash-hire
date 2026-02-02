"use server";

import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { GoogleGenAI } from "@google/genai";

export async function uploadAndAnalyzeCV(formData: FormData) {
  const supabase = createClient();

  // 1️⃣ AUTH (pasti kebaca)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // 2️⃣ FILE VALIDATION
  const file = formData.get("cv") as File | null;
  if (!file) {
    throw new Error("No CV file provided");
  }

  // 3️⃣ UPLOAD KE SUPABASE STORAGE
  const ext = file.name.split(".").pop();
  const fileName = `${user.id}-${Date.now()}.${ext}`;
  const filePath = `resume/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("cv-files")
    .upload(filePath, file);

  if (uploadError) {
    throw new Error("Failed to upload CV");
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("cv-files").getPublicUrl(filePath);

  // 4️⃣ GEMINI ANALYSIS
  const genai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!,
  });

  const buffer = Buffer.from(await file.arrayBuffer());

  const prompt = `
    You are a senior Technical Recruiter and CV Parsing Engine.

    Your task is to analyze the provided CV (PDF) and convert it into a clean, normalized, and strictly structured JSON object suitable for automated job matching against English-language job listings (e.g., Adzuna Singapore).

    ALL OUTPUT MUST BE IN ENGLISH.

    STRICT JSON SCHEMA:
    {
      "full_name": "string",
      "email": "string",
      "skills": "string[]",
      "experience": [
        {
          "company": "string",
          "role": "string",
          "duration": "string",
          "description": "string"
        }
      ],
      "education": [
        {
          "institution": "string",
          "degree": "string",
          "year": "string"
        }
      ],
      "summary": "string",
      "match_power": "number"
    }

    FIELD RULES:
    - full_name: Extract the candidate's full name exactly as written.
    - email: Valid email address found in the CV.
    - skills:
      - Focus ONLY on technical and professional hard skills (languages, frameworks, tools, platforms).
      - Normalize capitalization (e.g., "react js", "ReactJS" → "React.js").
      - Deduplicate similar skills.
      - Do NOT include soft skills (e.g., teamwork, communication).
    - experience:
      - Translate all roles and descriptions to English if originally written in Indonesian.
      - description must be ONE concise sentence describing a concrete responsibility or achievement.
    - education:
      - Translate degree names to English when applicable.
    - summary:
      - Write a professional 2–3 sentence recruiter-style summary.
      - Emphasize core technical expertise and years of experience.
      - Avoid buzzwords and generic claims.

    MATCH_POWER SCORING (0–100):
    - This score represents CV completeness and professional clarity.
    - Deduct points for:
      - Missing email or unclear identity
      - Very short or vague experience
      - Extremely limited skill set
    - Add points for:
      - Clear technical focus
      - Consistent career progression
      - Well-defined experience and skills
    - Do NOT base this score on any job description.

    STRICT OUTPUT RULES:
    1. OUTPUT ONLY THE RAW JSON OBJECT — no markdown, no explanations, no extra text.
    2. If a value is missing or not explicitly stated:
      - Use "" for strings
      - Use [] for arrays
    3. Do NOT hallucinate or infer information not present in the CV.
    4. Ensure the JSON is valid, parsable, and matches the schema exactly.
  `;

  const response = await genai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        role: "user",
        parts: [
          { text: prompt },
          {
            inlineData: {
              data: buffer.toString("base64"),
              mimeType: "application/pdf",
            },
          },
        ],
      },
    ],
  });

  const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("Gemini returned empty response");
  }

  const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());

  // 5️⃣ DATABASE SYNC
  await prisma.cvs.upsert({
    where: { user_id: user.id },
    update: {
      file_url: publicUrl,
      file_name: file.name,
      skills: parsed.skills,
      experience: JSON.stringify(parsed.experience),
      education: JSON.stringify(parsed.education),
      raw_text: parsed.summary,
      parsed_data: parsed,
      updated_at: new Date(),
    },
    create: {
      user_id: user.id,
      file_url: publicUrl,
      file_name: file.name,
      skills: parsed.skills,
      experience: JSON.stringify(parsed.experience),
      education: JSON.stringify(parsed.education),
      raw_text: parsed.summary,
      parsed_data: parsed,
    },
  });

  return {
    success: true,
    data: parsed,
  };
}

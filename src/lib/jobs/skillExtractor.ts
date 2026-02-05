// lib/jobs/skillExtractor.ts
import { GoogleGenAI } from "@google/genai";
import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { redis } from "../redis";

// Inisialisasi Gemini AI dengan API key dari environment
// const genai = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY!,
// });

const model = groq("llama-3.1-8b-instant");

type ExtractedJobSkills = {
  required_skills: string[];
  experience_level?: string; // Junior, Mid, Senior
  location?: string;
  is_remote: boolean;
};

export async function extractJobSkills(
  jobTitle: string,
  jobDescription: string,
): Promise<ExtractedJobSkills> {
  try {
    // Membuat prompt yang jelas dan terstruktur untuk Gemini
    // Kunci dari extraction yang baik adalah prompt yang spesifik
    const prompt = `Extract the following information from this job posting:

    Job Title: ${jobTitle}
    Job Description: ${jobDescription}

    Please extract:
    1. Required technical skills (programming languages, frameworks, tools)
    2. Experience level required (Junior/Mid/Senior)
    3. Location mentioned
    4. Whether it's a remote position

    Return ONLY a JSON object with this exact format:
    {
      "required_skills": ["skill1", "skill2"],
      "experience_level": "Mid",
      "location": "Jakarta",
      "is_remote": false
    }

    Rules:
    - required_skills should be an array of specific technical skills
    - experience_level should be one of: Junior, Mid, Senior (or null if not specified)
    - location should be the city/region mentioned (or null if not specified)
    - is_remote should be true if the job mentions remote work
    - Return ONLY valid JSON, no markdown, no explanation`;

    //     const prompt = `
    // Extract the following information from this job posting.

    // Job Title:
    // ${jobTitle}

    // Job Description:
    // ${jobDescription}

    // Return ONLY a valid JSON object with this exact structure:

    // {
    //   "required_skills": ["skill1", "skill2"],
    //   "experience_level": "Junior | Mid | Senior | null",
    //   "location": "string | null",
    //   "is_remote": true | false
    // }

    // Rules:
    // - required_skills: only technical skills (languages, frameworks, tools)
    // - experience_level: infer if clearly stated, otherwise null
    // - location: city or region if explicitly mentioned, otherwise null
    // - is_remote: true only if remote/hybrid is mentioned
    // - Do NOT include markdown
    // - Do NOT include explanations
    // `;

    // Memanggil Gemini untuk generate content
    // Kita menggunakan gemini-2.0-flash karena lebih cepat dan murah
    // untuk task extraction seperti ini
    // const result = await genai.models.generateContent({
    //   model: "gemini-2.0-flash", // Model yang cepat dan efisien untuk extraction
    //   contents: [
    //     {
    //       role: "user",
    //       parts: [{ text: prompt }],
    //     },
    //   ],
    // });

    const result = await generateText({
      model,
      prompt,
      temperature: 0,
      maxOutputTokens: 512,
    });

    // Mengambil text response dari Gemini
    // Gemini kadang membungkus response dalam struktur yang agak nested
    // const responseText =
    //   result?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    // if (!responseText) {
    //   console.warn("Empty response from Gemini");
    //   return getFallbackSkills();
    // }

    // // Membersihkan markdown fences yang mungkin muncul
    // // Gemini kadang masih menambahkan markdown meskipun kita minta JSON saja
    // const cleanedText = responseText
    //   .trim()
    //   .replace(/^```json\n?/i, "")
    //   .replace(/^```\n?/i, "")
    //   .replace(/```$/i, "")
    //   .trim();

    // // Parse JSON yang sudah dibersihkan
    // const extracted = JSON.parse(cleanedText) as ExtractedJobSkills;

    // // Validasi hasil extraction untuk memastikan structure yang benar
    // // Ini penting karena AI bisa saja return format yang sedikit berbeda
    // const validated: ExtractedJobSkills = {
    //   required_skills: Array.isArray(extracted.required_skills)
    //     ? extracted.required_skills.filter((skill) => typeof skill === "string")
    //     : [],
    //   experience_level: extracted.experience_level || undefined,
    //   location: extracted.location || undefined,
    //   is_remote: Boolean(extracted.is_remote),
    // };

    const responseText = result.text?.trim();

    if (!responseText) {
      console.warn("Empty response from Groq");
      return getFallbackSkills();
    }

    // Groq/LLaMA kadang masih kasih ```json
    const cleanedText = responseText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```$/i, "")
      .trim();

    let extracted: ExtractedJobSkills;

    try {
      extracted = JSON.parse(cleanedText);
    } catch (err) {
      console.error("Invalid JSON from Groq:", cleanedText);
      return getFallbackSkills();
    }

    const validated: ExtractedJobSkills = {
      required_skills: Array.isArray(extracted.required_skills)
        ? extracted.required_skills.filter(
            (s) => typeof s === "string" && s.length > 0,
          )
        : [],
      experience_level: extracted.experience_level ?? undefined,
      location: extracted.location ?? undefined,
      is_remote: Boolean(extracted.is_remote),
    };

    return validated;
  } catch (error) {
    console.error("Failed to extract job skills with Gemini:", error);

    // Jika Gemini gagal, kita gunakan fallback extraction sederhana
    // Fallback ini berguna ketika API down atau response tidak valid
    return getFallbackSkills();
  }
}

/**
 * Fallback extraction menggunakan regex dan keyword matching
 * Ini digunakan ketika AI extraction gagal
 * Meskipun tidak seakurat AI, tetap bisa memberikan hasil yang cukup baik
 */
function getFallbackSkills(): ExtractedJobSkills {
  return {
    required_skills: [],
    experience_level: undefined,
    location: undefined,
    is_remote: false,
  };
}

/**
 * Versi enhanced dengan fallback extraction yang lebih pintar
 * Ini menggunakan pattern matching untuk extract skills umum
 */
export async function extractJobSkillsWithFallback(
  jobTitle: string,
  jobDescription: string,
): Promise<ExtractedJobSkills> {
  try {
    // Coba dulu dengan Gemini AI
    const aiResult = await extractJobSkills(jobTitle, jobDescription);

    // Jika AI berhasil extract minimal beberapa skills, gunakan hasilnya
    if (aiResult.required_skills.length > 0) {
      return aiResult;
    }

    // Jika AI tidak menemukan skills, gunakan regex fallback
    console.log("AI found no skills, using regex fallback");
    return extractSkillsWithRegex(jobTitle, jobDescription);
  } catch (error) {
    console.error("Enhanced extraction failed:", error);
    return extractSkillsWithRegex(jobTitle, jobDescription);
  }
}

/**
 * Fallback extraction menggunakan regex pattern matching
 * Ini adalah safety net ketika AI completely fails
 */
function extractSkillsWithRegex(
  jobTitle: string,
  jobDescription: string,
): ExtractedJobSkills {
  const fullText = `${jobTitle} ${jobDescription}`.toLowerCase();

  // Daftar skills umum yang sering muncul di job posting
  // Anda bisa expand list ini sesuai kebutuhan
  const commonSkills = [
    "javascript",
    "typescript",
    "python",
    "java",
    "react",
    "vue",
    "angular",
    "node.js",
    "express",
    "nest.js",
    "django",
    "flask",
    "spring boot",
    "sql",
    "postgresql",
    "mysql",
    "mongodb",
    "redis",
    "aws",
    "azure",
    "gcp",
    "docker",
    "kubernetes",
    "git",
    "ci/cd",
    "agile",
    "scrum",
    "html",
    "css",
    "tailwind",
    "sass",
    "graphql",
    "rest api",
    "microservices",
  ];

  // Extract skills yang ditemukan di text
  const foundSkills = commonSkills.filter((skill) =>
    fullText.includes(skill.toLowerCase()),
  );

  // Extract experience level
  let experienceLevel: string | undefined;
  if (fullText.includes("senior")) {
    experienceLevel = "Senior";
  } else if (fullText.includes("junior") || fullText.includes("entry")) {
    experienceLevel = "Junior";
  } else if (fullText.includes("mid") || fullText.includes("intermediate")) {
    experienceLevel = "Mid";
  }

  // Check for remote
  const isRemote =
    fullText.includes("remote") ||
    fullText.includes("work from home") ||
    fullText.includes("wfh");

  // Simple location extraction (ini bisa diperbaiki dengan NLP yang lebih advanced)
  let location: string | undefined;
  const locationPatterns = [
    /location[:\s]+([a-z\s]+)/i,
    /based in[:\s]+([a-z\s]+)/i,
    /office in[:\s]+([a-z\s]+)/i,
  ];

  for (const pattern of locationPatterns) {
    const match = fullText.match(pattern);
    if (match && match[1]) {
      location = match[1].trim();
      break;
    }
  }

  return {
    required_skills: foundSkills,
    experience_level: experienceLevel,
    location,
    is_remote: isRemote,
  };
}

// lib/jobs/skillExtractor.ts (lanjutan)

/**
 * Cache hasil extraction di Redis untuk menghindari API calls berulang
 * Job yang sama tidak perlu di-extract berkali-kali
 */
export async function extractJobSkillsCached(
  jobId: string,
  jobTitle: string,
  jobDescription: string,
): Promise<ExtractedJobSkills> {
  // Coba ambil dari cache dulu
  const cacheKey = `job_skills:${jobId}`;

  try {
    if (redis) {
      const cached = await redis.get(cacheKey);

      if (cached) {
        try {
          return JSON.parse(cached) as ExtractedJobSkills;
        } catch (e) {
          // Cache corrupt, lanjut ke extraction
          console.warn("Corrupt cache for job skills:", jobId);
        }
      }
    }
  } catch (e) {
    // Redis error, lanjut tanpa cache
    console.warn("Redis cache check failed:", e);
  }

  // Extract skills menggunakan AI
  const skills = await extractJobSkillsWithFallback(jobTitle, jobDescription);

  // Simpan ke cache dengan TTL 7 hari
  // Skills dari job posting jarang berubah, jadi safe untuk cache lama
  try {
    if (redis) {
      await redis.setex(
        cacheKey,
        60 * 60 * 24 * 7, // 7 days
        JSON.stringify(skills),
      );
    }
  } catch (e) {
    console.warn("Failed to cache extracted skills:", e);
  }

  return skills;
}

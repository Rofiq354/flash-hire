// lib/jobs/skillExtractor.ts
import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { redis } from "../redis";

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
    const prompt = `Strictly extract technical skills from this job posting.
      Job: ${jobTitle}
      Description: ${jobDescription}

      JSON Output Format:
      {
        "required_skills": ["Language/Framework/Tool"],
        "experience_level": "Junior" | "Mid" | "Senior" | null,
        "location": "City" | null,
        "is_remote": boolean
      }

      Note: If you find ANY technical terms like React, SQL, Excel, or SalesForce, you MUST put them in "required_skills". 
      Return ONLY JSON.
    `;

    const result = await generateText({
      model,
      prompt,
      temperature: 0,
      maxOutputTokens: 512,
    });

    const responseText = result.text?.trim();

    if (!responseText) {
      console.warn("Empty response from Groq");
      return getFallbackSkills();
    }

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
    console.error("Failed to extract job skills with Groq:", error);

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

function normalizeExtractedSkills(
  skills: ExtractedJobSkills,
): ExtractedJobSkills {
  return {
    required_skills: Array.isArray(skills.required_skills)
      ? skills.required_skills
      : [],
    experience_level:
      skills.experience_level === "Junior" ||
      skills.experience_level === "Mid" ||
      skills.experience_level === "Senior"
        ? skills.experience_level
        : undefined,
    location:
      typeof skills.location === "string" && skills.location.length > 0
        ? skills.location
        : undefined,
    is_remote: Boolean(skills.is_remote),
  };
}

export async function extractJobSkillsWithFallback(
  jobTitle: string,
  jobDescription: string,
): Promise<ExtractedJobSkills> {
  const aiRaw = await extractJobSkills(jobTitle, jobDescription);
  const aiResult = normalizeExtractedSkills(aiRaw);

  if (
    Array.isArray(aiResult.required_skills) &&
    aiResult.required_skills.length >= 2
  ) {
    console.log("✅ Using AI Extraction results");
    return aiResult;
  }

  console.log("⚠️ AI found no skills, falling back to Regex matching...");
  const regexResult = extractSkillsWithRegex(jobTitle, jobDescription);

  return regexResult;
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

export async function extractJobSkillsCached(
  jobId: string,
  jobTitle: string,
  jobDescription: string,
): Promise<ExtractedJobSkills> {
  const cacheKey = `job_skills:${jobId}`;

  try {
    if (redis) {
      const cached = await redis.get(cacheKey);

      if (cached) {
        try {
          const parsed = JSON.parse(cached as string);

          if (!Array.isArray(parsed.required_skills)) {
            throw new Error("Invalid cache shape");
          }

          return parsed as ExtractedJobSkills;
        } catch {
          console.warn("Corrupt cache for job skills:", jobId);
          await redis.del(cacheKey); // 🔥 penting
        }
      }
    }
  } catch (e) {
    console.warn("Redis cache check failed:", e);
  }

  // Extract skills menggunakan AI
  const skills = await extractJobSkillsWithFallback(jobTitle, jobDescription);

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

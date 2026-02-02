// app/api/job/analyze/route.ts
import { NextResponse } from "next/server";
import { ratelimit, cache } from "@/lib/redis";
import { callGeminiWithRetry } from "@/lib/gemini-helper";

interface CVData {
  skills: string[];
  experience?: {
    years: number;
    level?: "junior" | "mid" | "senior";
  };
  location?: string;
}

interface AnalysisResult {
  score: number;
  match_reasons: string[];
  missing_skills: string[];
  advice: string;
  cached?: boolean; // Flag to show if result is from cache
}

function normalizeJobDescription(text: string) {
  return text
    .replace(/<\/?[^>]+(>|$)/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function normalizeCvData(cv: CVData) {
  return {
    skills: [...cv.skills].map((s) => s.toLowerCase().trim()).sort(),
    experience: cv.experience?.level ?? null,
  };
}

export async function POST(req: Request) {
  try {
    // ============================================
    // 1. RATE LIMITING
    // ============================================
    const ip =
      req.headers.get("x-forwarded-for") ??
      req.headers.get("x-real-ip") ??
      "anonymous";

    const { success, limit, remaining, reset } = await ratelimit.limit(ip);

    // Add rate limit headers to response
    const headers = {
      "X-RateLimit-Limit": limit.toString(),
      "X-RateLimit-Remaining": remaining.toString(),
      "X-RateLimit-Reset": reset.toString(),
    };

    if (!success) {
      const retryAfter = Math.ceil((reset - Date.now()) / 1000);
      return NextResponse.json(
        {
          message: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
          retryAfter,
        },
        {
          status: 429,
          headers: {
            ...headers,
            "Retry-After": retryAfter.toString(),
          },
        },
      );
    }

    // ============================================
    // 2. VALIDATE INPUT
    // ============================================
    const body = await req.json();
    const { jobDescription, userCvData } = body as {
      jobDescription: string;
      userCvData: CVData;
    };

    if (!jobDescription?.trim() || jobDescription.length < 20) {
      return NextResponse.json(
        { message: "Job description is required (min 20 characters)" },
        { status: 400, headers },
      );
    }

    if (!userCvData?.skills || !Array.isArray(userCvData.skills)) {
      return NextResponse.json(
        { message: "CV data must include skills array" },
        { status: 400, headers },
      );
    }

    // ============================================
    // 3. CHECK CACHE FIRST
    // ============================================
    const normalizedJob = normalizeJobDescription(jobDescription);
    const normalizedCv = normalizeCvData(userCvData);

    const cacheKey = cache.generateKey(normalizedJob, normalizedCv);
    const cachedResult = await cache.get<AnalysisResult>(cacheKey);

    if (cachedResult) {
      console.log("✅ Cache hit for key:", cacheKey);
      return NextResponse.json(
        {
          ...cachedResult,
          cached: true, // Let frontend know this was cached
        },
        { status: 200, headers },
      );
    }

    console.log("❌ Cache miss for key:", cacheKey);

    // ============================================
    // 4. CALL AI (Cache miss)
    // ============================================
    const prompt = `
      You are an AI recruiter scoring candidate-job fit.

      Rules:
      - Identify REQUIRED skills from the job.
      - Compare only REQUIRED skills vs candidate skills.
      - Missing REQUIRED skill = skill gap (-15 points each).
      - Experience mismatch (2+ levels): -10 points.
      - Nice-to-have skill match: +5 points (do not include in skill gap).

      Score:
      80-100 excellent
      60-79 good
      40-59 moderate
      20-39 weak
      0-19 poor

      Job:
      ${normalizedJob}

      Candidate:
      Skills: ${normalizedCv.skills.join(", ")}
      Experience level: ${normalizedCv.experience ?? "unknown"}

      Return JSON only:
      {
        "score": number,
        "match_reasons": string[] (max 3, concise),
        "missing_skills": string[] (REQUIRED skill gaps only, max 5),
        "advice": string (actionable, max 120 chars)
      }
    `.trim();

    const rawText = await callGeminiWithRetry(prompt, 1);

    if (!rawText) {
      throw new Error("Empty AI response");
    }

    // ============================================
    // 5. PARSE & VALIDATE RESPONSE
    // ============================================
    let result: AnalysisResult;
    try {
      result = JSON.parse(rawText);

      // Validate structure
      if (
        typeof result.score !== "number" ||
        !Array.isArray(result.match_reasons) ||
        !Array.isArray(result.missing_skills) ||
        typeof result.advice !== "string"
      ) {
        throw new Error("Invalid JSON structure from AI");
      }

      // Clamp score to 0-100
      result.score = Math.min(100, Math.max(0, Math.round(result.score)));
      result.cached = false;
    } catch (parseError) {
      console.error("AI response parse error:", parseError, "\nRaw:", rawText);

      return NextResponse.json(
        {
          score: 0,
          match_reasons: ["AI analysis failed - invalid response format"],
          missing_skills: [],
          advice: "Please try again in a moment.",
        },
        { status: 500, headers },
      );
    }

    // ============================================
    // 6. STORE IN CACHE (1 hour TTL)
    // ============================================
    const cached = await cache.set(cacheKey, result, 3600); // 1 hour
    const verify = await cache.get(cacheKey);
    console.log("Cache verify:", verify ? "OK" : "FAILED");
    if (cached) {
      console.log("✅ Cached result for key:", cacheKey);
    } else {
      console.warn("⚠️ Failed to cache result");
    }

    return NextResponse.json(result, { status: 200, headers });
  } catch (error: any) {
    console.error("Job analyze API error:", error);

    // Categorize errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { message: "Invalid JSON in request body" },
        { status: 400 },
      );
    }

    if (
      error.message?.toLowerCase()?.includes("quota") ||
      error.message?.toLowerCase()?.includes("rate limit") ||
      error.message?.toLowerCase()?.includes("api key")
    ) {
      return NextResponse.json(
        {
          message: "AI quota exceeded. Please try again later.",
        },
        { status: 503 },
      );
    }

    // Generic fallback
    return NextResponse.json(
      {
        score: 0,
        match_reasons: ["Analysis encountered an error"],
        missing_skills: [],
        advice: "Please try again later.",
      },
      { status: 500 },
    );
  }
}

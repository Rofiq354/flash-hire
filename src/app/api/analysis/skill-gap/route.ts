// app/api/analysis/skill-gap/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { createClient } from "@/utils/supabase/server";
import { callGeminiWithRetry } from "@/lib/gemini-helper";

// const genai = new GoogleGenAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { jobDescription, userCV, jobId } = await req.json();

    // Validation
    if (!jobDescription || !userCV) {
      return NextResponse.json(
        {
          success: false,
          error: "jobDescription and userCV are required",
        },
        { status: 400 },
      );
    }

    // ⚡ Check cache first (if jobId provided)
    if (jobId) {
      const cached = await getCachedAnalysis(user.id, jobId);
      if (cached) {
        console.log("✅ Returning cached analysis");
        return NextResponse.json({
          success: true,
          data: cached,
          cached: true,
        });
      }
    }

    // ⚡ OPTIMIZE: Extract only essential data
    const optimizedCV = extractEssentialCVData(userCV);
    const optimizedJobDesc = truncateText(jobDescription, 1500);

    // Build efficient prompt
    const prompt = buildEfficientPrompt(optimizedJobDesc, optimizedCV);

    console.log("🤖 Calling Gemini API for skill gap analysis...");

    // Call Gemini with optimized settings
    // const model = genai.getGenerativeModel({
    //   model: "gemini-2.0-flash-exp",
    // });

    // const result = await model.generateContent({
    //   contents: [{ role: "user", parts: [{ text: prompt }] }],
    //   generationConfig: {
    //     temperature: 0.3,
    //     maxOutputTokens: 2000,
    //     responseMimeType: "application/json",
    //   },
    // });

    // const response = result.response;
    const text = await callGeminiWithRetry(prompt);

    if (!text) {
      return NextResponse.json(
        { success: false, error: "Empty AI response" },
        { status: 500 },
      );
    }

    const analysis = JSON.parse(text);

    // ⚡ Save to cache
    if (jobId) {
      await saveAnalysisCache(user.id, jobId, analysis);
    }

    console.log("✅ Analysis completed successfully");

    return NextResponse.json({
      success: true,
      data: analysis,
      cached: false,
    });
  } catch (error) {
    console.error("❌ Skill gap analysis error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to analyze skill gap",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function extractEssentialCVData(userCV: any) {
  return {
    skills: {
      technical: Array.isArray(userCV.skills)
        ? userCV.skills.slice(0, 20)
        : userCV.skills?.technical?.slice(0, 20) || [],
      tools: userCV.skills?.tools?.slice(0, 10) || [],
    },
    experience: userCV.experience?.slice(0, 3) || [],
    education: userCV.education?.slice(0, 2) || [],
  };
}

function truncateText(text: string, maxLength: number): string {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}

function buildEfficientPrompt(jobDescription: string, userCV: any): string {
  return `Analyze job-candidate match. Return ONLY valid JSON.

JOB DESCRIPTION:
${jobDescription}

CANDIDATE:
Skills: ${userCV.skills.technical.join(", ")}
Tools: ${userCV.skills.tools.join(", ")}
Experience: ${userCV.experience.map((e: any) => `${e.title || e} (${e.duration || ""})`).join("; ")}
Education: ${userCV.education.map((e: any) => e.degree || e).join(", ")}

Return JSON with this EXACT structure:
{
  "overall_score": <number 0-100>,
  "category_scores": {
    "technical_skills": <number 0-100>,
    "experience": <number 0-100>,
    "education": <number 0-100>,
    "soft_skills": <number 0-100>
  },
  "matching_skills": {
    "hard_skills": [<max 10 strings>],
    "soft_skills": [<max 5 strings>],
    "tools": [<max 8 strings>]
  },
  "missing_skills": {
    "critical": [<max 5 strings - must-have skills>],
    "important": [<max 5 strings - preferred skills>],
    "nice_to_have": [<max 3 strings - bonus skills>]
  },
  "recommendations": {
    "immediate_actions": [<max 3 strings>],
    "short_term_learning": [<max 3 strings>],
    "long_term_development": [<max 2 strings>]
  },
  "strengths": [<max 3 strings>],
  "weaknesses": [<max 3 strings>],
  "overall_advice": "<1-2 sentences>",
  "estimated_time_to_ready": "<e.g., '2-3 months' or 'Ready now'>"
}

SCORING RULES:
- Technical skills: 40% weight
- Experience: 30% weight
- Education: 15% weight
- Soft skills: 15% weight
- Be honest but constructive
- Focus on concrete skills, not generic advice`;
}

// ============================================================================
// CACHING FUNCTIONS
// ============================================================================

async function getCachedAnalysis(
  userId: string,
  jobId: string,
): Promise<any | null> {
  try {
    const { createClient } = await import("@/utils/supabase/server");
    const supabase = createClient();

    const { data, error } = await supabase
      .from("saved_jobs")
      .select("job_data")
      .eq("user_id", userId)
      .eq("job_id", jobId)
      .gte(
        "created_at",
        new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      )
      .single();

    if (error || !data) return null;

    // Check if analysis exists in job_data
    const jobData = data.job_data as any;
    if (jobData?.analysis) {
      return jobData.analysis;
    }

    return null;
  } catch (error) {
    console.error("Cache retrieval error:", error);
    return null;
  }
}

async function saveAnalysisCache(userId: string, jobId: string, analysis: any) {
  try {
    const { createClient } = await import("@/utils/supabase/server");
    const supabase = createClient();

    // First, get existing job_data
    const { data: existing } = await supabase
      .from("saved_jobs")
      .select("job_data, job_title, company, location, job_url")
      .eq("user_id", userId)
      .eq("job_id", jobId)
      .single();

    if (existing) {
      // Update existing saved job
      await supabase
        .from("saved_jobs")
        .update({
          match_score: analysis.overall_score,
          job_data: {
            ...(existing.job_data as any),
            analysis,
          },
        })
        .eq("user_id", userId)
        .eq("job_id", jobId);
    }
    // If not saved, we don't store the analysis (only store for saved jobs)
  } catch (error) {
    console.error("Cache save error:", error);
  }
}

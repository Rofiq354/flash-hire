// src/services/analysis/skill-gap.service.ts
import { GoogleGenAI } from "@google/genai";

const genai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface UserCV {
  personal_info?: {
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    portfolio?: string;
  };
  summary?: string;
  skills?: {
    technical?: string[];
    soft?: string[];
    languages?: string[];
    tools?: string[];
  };
  experience?: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
    responsibilities?: string[];
    achievements?: string[];
  }>;
  education?: Array<{
    degree: string;
    institution: string;
    year: string;
    gpa?: string;
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
    year: string;
  }>;
  projects?: Array<{
    name: string;
    description: string;
    technologies: string[];
    link?: string;
  }>;
}

export interface JobAlert {
  id: string;
  title: string;
  keywords: string[];
  preferred_location?: string;
  salary_min?: number;
  salary_max?: number;
  job_type?: string[];
  remote_preference?: "remote" | "onsite" | "hybrid" | "any";
  experience_level?: string;
  created_at: Date;
}

export interface SkillGapAnalysis {
  overall_score: number;
  category_scores: {
    technical_skills: number;
    experience: number;
    education: number;
    soft_skills: number;
  };
  matching_skills: {
    hard_skills: string[];
    soft_skills: string[];
    tools: string[];
  };
  missing_skills: {
    critical: string[];
    important: string[];
    nice_to_have: string[];
  };
  experience_gap: {
    required_years?: number;
    candidate_years?: number;
    gap?: number;
    relevant_experience: string[];
    missing_experience: string[];
  };
  recommendations: {
    immediate_actions: string[];
    short_term_learning: string[];
    long_term_development: string[];
  };
  job_alert_alignment: {
    matches_preferences: boolean;
    alignment_score: number;
    mismatches: string[];
  };
  strengths: string[];
  weaknesses: string[];
  overall_advice: string;
  estimated_time_to_ready?: string;
}

export interface BatchAnalysisResult {
  job_id: string;
  job_title: string;
  company: string;
  analysis: SkillGapAnalysis;
  recommendation_priority: "high" | "medium" | "low";
}

// ============================================================================
// MAIN ANALYSIS FUNCTION
// ============================================================================

export async function analyzeSkillGap(
  jobDescription: string,
  userCV: UserCV,
  jobAlert?: JobAlert,
): Promise<SkillGapAnalysis> {
  try {
    const prompt = buildAnalysisPrompt(jobDescription, userCV, jobAlert);

    const response = await genai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      config: {
        responseMimeType: "application/json",
        temperature: 0.3, // Lower temperature for more consistent analysis
      },
    });

    const text = response.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error("Empty AI response");
    }

    const analysis: SkillGapAnalysis = JSON.parse(text);

    // Post-process and validate
    return validateAndEnhanceAnalysis(analysis);
  } catch (error) {
    console.error("Skill gap analysis error:", error);
    throw new Error("Failed to analyze skill gap");
  }
}

// ============================================================================
// BATCH ANALYSIS FOR MULTIPLE JOBS
// ============================================================================

export async function analyzeBatchJobs(
  jobs: Array<{
    id: string;
    title: string;
    company: string;
    description: string;
  }>,
  userCV: UserCV,
  jobAlert?: JobAlert,
): Promise<BatchAnalysisResult[]> {
  const analyses: BatchAnalysisResult[] = [];

  for (const job of jobs) {
    try {
      const analysis = await analyzeSkillGap(job.description, userCV, jobAlert);

      const priority = determinePriority(analysis.overall_score);

      analyses.push({
        job_id: job.id,
        job_title: job.title,
        company: job.company,
        analysis,
        recommendation_priority: priority,
      });

      // Rate limiting - wait 1 second between requests
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Failed to analyze job ${job.id}:`, error);
    }
  }

  // Sort by overall score (highest first)
  return analyses.sort(
    (a, b) => b.analysis.overall_score - a.analysis.overall_score,
  );
}

// ============================================================================
// COMPARE CANDIDATE WITH JOB ALERTS
// ============================================================================

export async function analyzeJobAlertFit(
  userCV: UserCV,
  jobAlerts: JobAlert[],
): Promise<{
  overall_readiness: number;
  alerts_analysis: Array<{
    alert: JobAlert;
    readiness_score: number;
    gaps: string[];
    ready_for_application: boolean;
  }>;
  common_skill_gaps: string[];
  recommended_learning_path: string[];
}> {
  const alertAnalyses = [];

  for (const alert of jobAlerts) {
    const mockJobDescription = buildMockJobDescriptionFromAlert(alert);
    const analysis = await analyzeSkillGap(mockJobDescription, userCV, alert);

    alertAnalyses.push({
      alert,
      readiness_score: analysis.overall_score,
      gaps: [
        ...analysis.missing_skills.critical,
        ...analysis.missing_skills.important,
      ],
      ready_for_application: analysis.overall_score >= 70,
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  // Find common skill gaps across all job alerts
  const allGaps = alertAnalyses.flatMap((a) => a.gaps);
  const gapFrequency = allGaps.reduce(
    (acc, gap) => {
      acc[gap] = (acc[gap] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const commonGaps = Object.entries(gapFrequency)
    .filter(([_, count]) => count >= Math.ceil(jobAlerts.length / 2))
    .map(([gap]) => gap)
    .slice(0, 10);

  const overallReadiness =
    alertAnalyses.reduce((sum, a) => sum + a.readiness_score, 0) /
    alertAnalyses.length;

  return {
    overall_readiness: Math.round(overallReadiness),
    alerts_analysis: alertAnalyses,
    common_skill_gaps: commonGaps,
    recommended_learning_path: await generateLearningPath(commonGaps),
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function buildAnalysisPrompt(
  jobDescription: string,
  userCV: UserCV,
  jobAlert?: JobAlert,
): string {
  const jobAlertContext = jobAlert
    ? `
  The candidate has set up a job alert with these preferences:
  - Desired role keywords: ${jobAlert.keywords.join(", ")}
  - Preferred location: ${jobAlert.preferred_location || "Any"}
  - Remote preference: ${jobAlert.remote_preference || "Any"}
  - Desired salary: ${jobAlert.salary_min ? `$${jobAlert.salary_min}+` : "Not specified"}
  - Job type: ${jobAlert.job_type?.join(", ") || "Any"}
  
  Please also evaluate if this job aligns with their job alert preferences.
  `
    : "";

  return `You are an expert technical recruiter and career advisor with deep knowledge of tech industry standards.

Your task is to perform a COMPREHENSIVE SKILL GAP ANALYSIS between a candidate's CV and a job description.

JOB DESCRIPTION:
${jobDescription}

CANDIDATE CV (Structured Data):
${JSON.stringify(userCV, null, 2)}

${jobAlertContext}

ANALYSIS REQUIREMENTS:

1. **SCORING METHODOLOGY** (0-100):
   - Technical Skills Match: 40% weight
   - Relevant Experience: 30% weight
   - Education & Certifications: 15% weight
   - Soft Skills & Culture Fit: 15% weight

2. **SKILL CATEGORIZATION**:
   - Extract ALL technical skills mentioned in job description
   - Categorize missing skills as: CRITICAL, IMPORTANT, or NICE_TO_HAVE
   - Critical = explicitly required, deal-breaker if missing
   - Important = strongly preferred, affects competitiveness
   - Nice to have = mentioned but not emphasized

3. **EXPERIENCE ANALYSIS**:
   - Calculate years of relevant experience from CV
   - Compare with job requirements
   - Identify relevant vs irrelevant experience
   - Note transferable skills from different domains

4. **PRACTICAL RECOMMENDATIONS**:
   - Immediate actions: What can be done in 1-2 weeks (resume tweaks, portfolio updates)
   - Short-term learning: Skills achievable in 1-3 months (online courses, certifications)
   - Long-term development: Skills requiring 6+ months (deep expertise, career pivot)

5. **JOB ALERT ALIGNMENT** (if provided):
   - Does this job match their search criteria?
   - Are there any red flags or mismatches?
   - Should they adjust their job alert preferences?

6. **READINESS ASSESSMENT**:
   - Estimate time needed to become competitive for this role
   - Provide honest assessment of current fit

OUTPUT FORMAT (strict JSON):
{
  "overall_score": number (0-100),
  "category_scores": {
    "technical_skills": number (0-100),
    "experience": number (0-100),
    "education": number (0-100),
    "soft_skills": number (0-100)
  },
  "matching_skills": {
    "hard_skills": string[],
    "soft_skills": string[],
    "tools": string[]
  },
  "missing_skills": {
    "critical": string[],
    "important": string[],
    "nice_to_have": string[]
  },
  "experience_gap": {
    "required_years": number | null,
    "candidate_years": number | null,
    "gap": number | null,
    "relevant_experience": string[],
    "missing_experience": string[]
  },
  "recommendations": {
    "immediate_actions": string[],
    "short_term_learning": string[],
    "long_term_development": string[]
  },
  "job_alert_alignment": {
    "matches_preferences": boolean,
    "alignment_score": number (0-100),
    "mismatches": string[]
  },
  "strengths": string[],
  "weaknesses": string[],
  "overall_advice": string,
  "estimated_time_to_ready": string
}

IMPORTANT RULES:
- Be HONEST and SPECIFIC - don't sugarcoat gaps
- Use CONCRETE skill names, not generic terms
- Base scores on EVIDENCE from CV, not assumptions
- Recommendations must be ACTIONABLE and REALISTIC
- If CV data is incomplete, note it as a weakness
- Consider industry standards and typical hiring criteria`;
}

function validateAndEnhanceAnalysis(
  analysis: SkillGapAnalysis,
): SkillGapAnalysis {
  // Ensure scores are within valid range
  analysis.overall_score = Math.max(0, Math.min(100, analysis.overall_score));

  // Ensure all arrays exist
  if (!analysis.matching_skills) {
    analysis.matching_skills = { hard_skills: [], soft_skills: [], tools: [] };
  }

  if (!analysis.missing_skills) {
    analysis.missing_skills = { critical: [], important: [], nice_to_have: [] };
  }

  if (!analysis.recommendations) {
    analysis.recommendations = {
      immediate_actions: [],
      short_term_learning: [],
      long_term_development: [],
    };
  }

  return analysis;
}

function determinePriority(score: number): "high" | "medium" | "low" {
  if (score >= 75) return "high";
  if (score >= 50) return "medium";
  return "low";
}

function buildMockJobDescriptionFromAlert(alert: JobAlert): string {
  return `
Position: ${alert.title}
Keywords: ${alert.keywords.join(", ")}
Location: ${alert.preferred_location || "Remote/Flexible"}
Type: ${alert.job_type?.join(" or ") || "Full-time"}
Experience Level: ${alert.experience_level || "Mid-level"}
Salary Range: ${alert.salary_min ? `$${alert.salary_min}+` : "Competitive"}

We are looking for a ${alert.title} with expertise in ${alert.keywords.join(", ")}.
  `.trim();
}

async function generateLearningPath(gaps: string[]): Promise<string[]> {
  if (gaps.length === 0) return [];

  const prompt = `Given these skill gaps: ${gaps.join(", ")}

Generate a prioritized learning path (maximum 5 items) with realistic timeframes.

Format each as: "Skill/Topic - Method - Estimated Time"

Example: "React.js - Online course (Udemy/Coursera) - 4 weeks"

Return as JSON array of strings.`;

  try {
    const response = await genai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { responseMimeType: "application/json" },
    });

    const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
    return text ? JSON.parse(text) : [];
  } catch (error) {
    console.error("Learning path generation error:", error);
    return gaps.slice(0, 5).map((gap) => `${gap} - Self-study recommended`);
  }
}

// ============================================================================
// TRACK PROGRESS OVER TIME
// ============================================================================

export interface ProgressTracking {
  user_id: string;
  cv_version: number;
  analysis_date: Date;
  overall_score: number;
  skills_acquired: string[];
  skills_still_missing: string[];
  improvement_percentage: number;
}

export function compareAnalysisOverTime(
  previousAnalysis: SkillGapAnalysis,
  currentAnalysis: SkillGapAnalysis,
): {
  score_improvement: number;
  skills_acquired: string[];
  new_gaps_identified: string[];
  overall_progress: "improving" | "stagnant" | "declining";
} {
  const scoreImprovement =
    currentAnalysis.overall_score - previousAnalysis.overall_score;

  const previousMissing = [
    ...previousAnalysis.missing_skills.critical,
    ...previousAnalysis.missing_skills.important,
  ];

  const currentMissing = [
    ...currentAnalysis.missing_skills.critical,
    ...currentAnalysis.missing_skills.important,
  ];

  const skillsAcquired = previousMissing.filter(
    (skill) => !currentMissing.includes(skill),
  );

  const newGapsIdentified = currentMissing.filter(
    (skill) => !previousMissing.includes(skill),
  );

  let overallProgress: "improving" | "stagnant" | "declining" = "stagnant";
  if (scoreImprovement > 5) overallProgress = "improving";
  else if (scoreImprovement < -5) overallProgress = "declining";

  return {
    score_improvement: scoreImprovement,
    skills_acquired: skillsAcquired,
    new_gaps_identified: newGapsIdentified,
    overall_progress: overallProgress,
  };
}

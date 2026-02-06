// lib/jobs/mvpMatcher.ts
import { extractJobSkills, extractJobSkillsCached } from "./skillExtractor";
import { prisma } from "@/lib/prisma";

type MatchResult = {
  score: number;
  matched_skills: string[];
  missing_skills: string[];
  breakdown: {
    base_score: number;
    experience_bonus: number;
    location_penalty: number;
  };
};

/**
 * Menghitung match score sesuai ketentuan MVP:
 * - Base score = (matched_skills / total_required_skills) × 100
 * - Bonus: experience level match (+10%)
 * - Penalty: location mismatch (-10% jika not remote)
 */
export async function calculateMVPMatchScore(
  userId: string,
  jobId: string,
  jobTitle: string,
  jobDescription: string,
  locationType: "remote" | "onsite" | "hybrid",
  userWantsRemote: boolean = false,
  jobLocation?: string,
): Promise<MatchResult> {
  // Ambil data CV user dari database
  const userCV = await prisma.cvs.findUnique({
    where: { user_id: userId },
    select: {
      skills: true,
      experience: true, // Misal: "Mid", "Senior", dll
    },
  });

  // Ambil data profile user untuk location
  const userProfile = await prisma.profiles.findUnique({
    where: { id: userId },
    select: {
      location: true,
    },
  });

  if (!userCV || !userCV.skills || userCV.skills.length === 0) {
    // User belum upload CV atau belum ada skills
    return {
      score: 0,
      matched_skills: [],
      missing_skills: [],
      breakdown: {
        base_score: 0,
        experience_bonus: 0,
        location_penalty: 0,
      },
    };
  }

  const jobRequirements = await extractJobSkillsCached(
    jobId,
    jobTitle,
    jobDescription,
  );

  if (jobRequirements.required_skills.length === 0) {
    // Tidak bisa extract skills dari job, return score default
    return {
      score: 50, // Neutral score
      matched_skills: [],
      missing_skills: [],
      breakdown: {
        base_score: 50,
        experience_bonus: 0,
        location_penalty: 0,
      },
    };
  }

  // Normalisasi skills untuk comparison (case-insensitive)
  const normalizeSkill = (skill: string) => skill.toLowerCase().trim();

  const userSkillsNormalized = userCV.skills.map(normalizeSkill);
  const requiredSkillsNormalized =
    jobRequirements.required_skills.map(normalizeSkill);

  // Hitung matched skills
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  for (const requiredSkill of jobRequirements.required_skills) {
    const normalizedRequired = normalizeSkill(requiredSkill);

    const isMatched = userSkillsNormalized.some(
      (userSkill) =>
        normalizedRequired.includes(userSkill) ||
        userSkill.includes(normalizedRequired),
    );

    if (isMatched) {
      matchedSkills.push(requiredSkill);
    } else {
      missingSkills.push(requiredSkill);
    }
  }

  // Hitung base score
  const baseScore =
    (matchedSkills.length / jobRequirements.required_skills.length) * 100;

  // Hitung experience bonus
  let experienceBonus = 0;
  if (userCV.experience && jobRequirements.experience_level) {
    const userExp = normalizeSkill(userCV.experience);
    const requiredExp = normalizeSkill(jobRequirements.experience_level);

    if (userExp === requiredExp) {
      experienceBonus = 10; // +10% jika experience level match
    }
  }

  // Hitung location penalty
  let locationPenalty = 0;

  if (userWantsRemote) {
    if (locationType === "onsite") {
      locationPenalty = 25; // Penalti sangat besar
    } else if (locationType === "hybrid") {
      locationPenalty = 10; // Penalti sedang karena masih harus ngantor
    }
  } else {
    // Jika User mencari kerjaan On-site (userWantsRemote = false)
    if (locationType === "onsite" || locationType === "hybrid") {
      // Cek apakah lokasinya cocok dengan domisili di profil
      const userLoc = normalizeSkill(userProfile?.location || "");
      const jobLoc = normalizeSkill(jobLocation || "");

      if (
        userLoc &&
        jobLoc &&
        !jobLoc.includes(userLoc) &&
        !userLoc.includes(jobLoc)
      ) {
        locationPenalty = 10; // Penalti jika kota berbeda
      }
    }
  }

  // Hitung final score
  const finalScore = Math.max(
    0,
    Math.min(100, baseScore + experienceBonus - locationPenalty),
  );

  return {
    score: Math.round(finalScore),
    matched_skills: matchedSkills,
    missing_skills: missingSkills,
    breakdown: {
      base_score: Math.round(baseScore),
      experience_bonus: experienceBonus,
      location_penalty: locationPenalty,
    },
  };
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function calculateMatchScore(
  cvSkills: string[],
  jobText: string,
): number {
  if (!cvSkills.length || !jobText) return 0;

  const normalizedJob = normalizeText(jobText);

  const matchedSkills = cvSkills.filter((skill) => {
    const normalizedSkill = normalizeText(skill);
    return normalizedJob.includes(normalizedSkill);
  });

  const rawScore = (matchedSkills.length / cvSkills.length) * 100;

  return Math.min(100, Math.round(rawScore));
}

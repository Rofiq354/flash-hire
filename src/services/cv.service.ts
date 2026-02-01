// src/services/cv.service.ts
import { prisma } from "@/lib/prisma";

export interface CvDTO {
  id: string;
  userId: string;
  skills: string[];
  parsedData?: {
    summary?: string;
    matchPower?: number;
  };
  updatedAt?: string;
}

export async function getCvByUserId(userId: string): Promise<CvDTO | null> {
  const cv = await prisma.cvs.findUnique({
    where: { user_id: userId },
  });

  if (!cv) return null;

  return {
    id: cv.id,
    userId: cv.user_id,
    skills: cv.skills ?? [],
    parsedData: cv.parsed_data as any,
    updatedAt: cv.updated_at?.toISOString(),
  };
}

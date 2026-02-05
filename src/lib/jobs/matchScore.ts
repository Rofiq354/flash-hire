import { GoogleGenAI } from "@google/genai";

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

// Di file action/service kamu
type JobMatchScore = {
  id: string;
  score: number;
};

// export async function calculateJobMatches(
//   userSkills: string[],
//   jobs: { id: string; content: string }[],
// ): Promise<JobMatchScore[]> {
//   if (jobs.length === 0) return [];

//   const genai = new GoogleGenAI({
//     apiKey: process.env.GEMINI_API_KEY!,
//   });

//   const prompt = `
//     You are an ATS (Applicant Tracking System).

//     User Skills:
//     ${userSkills.join(", ")}

//     Jobs:
//     ${jobs.map((j) => `ID: ${j.id}\n${j.content}`).join("\n---\n")}

//     Rules:
//     - Score MUST be an integer between 0 and 100
//     - Output MUST be valid JSON
//     - No markdown
//     - No explanation
//     - Only return JSON array

//     Format:
//     [
//       { "id": "job_id", "score": 75 }
//     ]
//   `;

//   try {
//     const result = await genai.models.generateContent({
//       model: "gemini-2.5-flash",
//       contents: [{ role: "user", parts: [{ text: prompt }] }],
//     });

//     const rawText = result?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

//     // 🧹 Clean possible markdown fences
//     const cleaned = rawText
//       .trim()
//       .replace(/^```json/i, "")
//       .replace(/^```/i, "")
//       .replace(/```$/, "")
//       .trim();

//     let parsed: unknown;

//     try {
//       parsed = JSON.parse(cleaned);
//     } catch {
//       return [];
//     }

//     if (!Array.isArray(parsed)) return [];

//     // ✅ Sanitize result
//     const validScores: JobMatchScore[] = [];

//     for (const item of parsed) {
//       if (
//         typeof item === "object" &&
//         item !== null &&
//         typeof (item as any).id === "string" &&
//         Number.isInteger((item as any).score)
//       ) {
//         const score = Math.min(100, Math.max(0, (item as any).score));

//         validScores.push({
//           id: (item as any).id,
//           score,
//         });
//       }
//     }

//     return validScores;
//   } catch (error) {
//     console.error("❌ AI match calculation failed:", error);
//     return [];
//   }
// }

// Fungsi helper untuk menghitung cosine similarity
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) return 0;

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Fungsi utama dengan embedding - JAUH LEBIH HEMAT!
export async function calculateJobMatchesWithEmbedding(
  userSkills: string[],
  jobs: { id: string; content: string }[],
): Promise<JobMatchScore[]> {
  if (jobs.length === 0 || userSkills.length === 0) return [];

  const genai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!,
  });

  try {
    // Gabungkan skills user jadi satu string
    const userSkillsText = userSkills.join(", ");

    // Siapkan semua teks yang perlu di-embed
    // Index 0 = user skills, index 1-n = jobs
    const textsToEmbed = [
      userSkillsText,
      ...jobs.map((j) => {
        // Potong content jika terlalu panjang (ambil 500 karakter pertama)
        // Ini untuk hemat token tanpa kehilangan info penting
        const trimmed =
          j.content.length > 500 ? j.content.substring(0, 500) : j.content;
        return trimmed;
      }),
    ];

    // KUNCI: Satu request untuk semua embeddings sekaligus!
    // Ini hanya hitung vektor, bukan generate text, jadi super murah
    const embeddingResult = await genai.models.embedContent({
      model: "text-embedding-004", // Model khusus embedding, lebih murah
      contents: textsToEmbed.map((text) => ({
        parts: [{ text }],
      })),
    });

    const embeddings = embeddingResult.embeddings;

    if (!embeddings || embeddings.length === 0) {
      console.warn("No embeddings returned");
      return [];
    }

    // Embedding pertama adalah user skills
    const userEmbedding = embeddings[0].values;

    // Hitung similarity untuk setiap job
    const scores: JobMatchScore[] = [];

    for (let i = 0; i < jobs.length; i++) {
      const jobEmbedding = embeddings[i + 1].values; // +1 karena index 0 adalah user

      // Hitung similarity (0 sampai 1)
      const similarity = cosineSimilarity(
        userEmbedding as number[],
        jobEmbedding as number[],
      );

      // Convert ke score 0-100 dengan sedikit adjustment
      // Similarity 0.5 ke atas biasanya sudah bagus, jadi kita scale ulang
      const normalizedScore = Math.max(0, (similarity - 0.3) / 0.7); // Map 0.3-1.0 ke 0-1
      const score = Math.round(normalizedScore * 100);

      scores.push({
        id: jobs[i].id,
        score: Math.min(100, Math.max(0, score)),
      });
    }

    return scores;
  } catch (error) {
    console.error("❌ Embedding calculation failed:", error);

    // Fallback ke metode sederhana jika embedding gagal
    return calculateMatchScoreFallback(userSkills, jobs);
  }
}

// Fallback sederhana tanpa AI (gratis sepenuhnya!)
function calculateMatchScoreFallback(
  userSkills: string[],
  jobs: { id: string; content: string }[],
): JobMatchScore[] {
  return jobs.map((job) => {
    const normalizedContent = job.content.toLowerCase();

    // Hitung berapa banyak skills yang muncul di job description
    const matchedSkills = userSkills.filter((skill) => {
      const normalizedSkill = skill.toLowerCase();
      return normalizedContent.includes(normalizedSkill);
    });

    // Score berdasarkan persentase skills yang match
    const rawScore = (matchedSkills.length / userSkills.length) * 100;

    return {
      id: job.id,
      score: Math.min(100, Math.round(rawScore)),
    };
  });
}

// Fungsi lama Anda (untuk backward compatibility)
// Tapi saya SANGAT TIDAK MEREKOMENDASIKAN menggunakan ini
export async function calculateJobMatches(
  userSkills: string[],
  jobs: { id: string; content: string }[],
): Promise<JobMatchScore[]> {
  // Redirect ke fungsi embedding yang lebih efisien
  return calculateJobMatchesWithEmbedding(userSkills, jobs);
}

export async function calculateJobMatchesWithBatching(
  userSkills: string[],
  jobs: { id: string; content: string }[],
  batchSize: number = 50, // Process 50 jobs per batch
): Promise<JobMatchScore[]> {
  const allScores: JobMatchScore[] = [];

  // Split jobs into batches
  for (let i = 0; i < jobs.length; i += batchSize) {
    const batch = jobs.slice(i, i + batchSize);
    const batchScores = await calculateJobMatchesWithEmbedding(
      userSkills,
      batch,
    );
    allScores.push(...batchScores);

    // Small delay to avoid rate limiting
    if (i + batchSize < jobs.length) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  return allScores;
}

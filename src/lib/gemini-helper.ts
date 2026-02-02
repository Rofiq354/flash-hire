// lib/gemini-helper.ts
import { GoogleGenAI } from "@google/genai";

const genai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

function isRetryableError(error: any) {
  const message = error?.message?.toLowerCase() ?? "";

  // ❌ NEVER retry quota / auth / rate limit
  if (
    message.includes("429") ||
    message.includes("quota") ||
    message.includes("resource_exhausted") ||
    message.includes("rate limit") ||
    message.includes("api key")
  ) {
    return false;
  }

  // ✅ Retry only transient infra issues
  if (
    message.includes("timeout") ||
    message.includes("temporarily") ||
    message.includes("unavailable")
  ) {
    return true;
  }

  return false;
}

export async function callGeminiWithRetry(
  prompt: string,
  maxRetries = 1, // 1 retry max
): Promise<string> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await genai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json",
          temperature: 0.3,
        },
      });

      const rawText = response.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText) {
        throw new Error("Empty AI response");
      }

      return rawText;
    } catch (error: any) {
      lastError = error;

      if (!isRetryableError(error)) {
        throw error;
      }

      if (attempt === maxRetries) {
        throw error;
      }

      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  throw lastError!;
}

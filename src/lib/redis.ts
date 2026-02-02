// lib/redis.ts
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import crypto from "crypto";

// Initialize Redis client
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Rate limiter: 5 requests per 60 seconds per IP
export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "60 s"),
  analytics: true,
  prefix: "ratelimit:job-analyze",
});

// Cache utility functions
export const cache = {
  // Get cached analysis
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redis.get(key);
      return data as T | null;
    } catch (error) {
      console.error("Cache get error:", error);
      return null;
    }
  },

  // Set cache with TTL (default 1 hour)
  async set(
    key: string,
    value: any,
    ttlSeconds: number = 3600,
  ): Promise<boolean> {
    try {
      await redis.set(key, value, { ex: ttlSeconds });
      return true;
    } catch (error) {
      console.error("Cache set error:", error);
      return false;
    }
  },

  // Delete cache
  async delete(key: string): Promise<boolean> {
    try {
      await redis.del(key);
      return true;
    } catch (error) {
      console.error("Cache delete error:", error);
      return false;
    }
  },

  // Generate cache key from job description + CV data
  generateKey(jobDescription: string, cvData: any): string {
    const normalizedJob = jobDescription
      .replace(/<\/?[^>]+(>|$)/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();

    const normalizedCv = {
      skills: Array.isArray(cvData.skills)
        ? [...cvData.skills].map((s: string) => s.toLowerCase().trim()).sort()
        : [],
      experience: cvData.experience?.level ?? null,
    };

    const payload = {
      job: normalizedJob,
      cv: normalizedCv,
    };

    const hash = crypto
      .createHash("sha256")
      .update(JSON.stringify(payload))
      .digest("hex");

    return `job-analysis:${hash}`;
  },
};

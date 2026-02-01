// src/services/jobs/adzuna.service.ts
import { normalizeAdzunaJob } from "@/lib/jobs/normalizeAzunaJob";

interface FetchAdzunaParams {
  keyword?: string;
  location?: string;
  isRemote?: boolean;
  countryCode?: string;
  page?: number;
  resultsPerPage?: number;
  maxDays?: number;
  salaryMin?: number;
  salaryMax?: number;
  fullTime?: boolean;
  partTime?: boolean;
  contract?: boolean;
  permanent?: boolean;
  category?: string;
  companyName?: string;
}

interface AdzunaJob {
  id: string;
  created: string;
  title: string;
  location: {
    area: string[];
    display_name: string;
  };
  description: string;
  salary_min?: number;
  salary_max?: number;
  salary_is_predicted?: string;
  contract_type?: string;
  contract_time?: string;
  company: {
    display_name: string;
  };
  category: {
    label: string;
    tag: string;
  };
  redirect_url: string;
}

interface AdzunaResponse {
  results: AdzunaJob[];
  count: number;
  mean?: number;
  __CLASS__?: string;
}

/**
 * Fetch jobs from Adzuna API with advanced filtering
 * @param params - Search parameters
 * @returns Normalized job listings
 */
export async function fetchAdzunaJobs({
  keyword = "Developer",
  location,
  isRemote = false,
  countryCode = "sg",
  page = 1,
  resultsPerPage = 10,
  maxDays = 14,
  salaryMin,
  salaryMax,
  fullTime,
  partTime,
  contract,
  permanent,
  category,
  companyName,
}: FetchAdzunaParams) {
  try {
    // Validasi credentials
    if (!process.env.ADZUNA_APP_ID || !process.env.ADZUNA_APP_KEY) {
      throw new Error("Adzuna API credentials are missing");
    }

    const url = new URL(
      `https://api.adzuna.com/v1/api/jobs/${countryCode}/search/${page}`,
    );

    // Required parameters
    url.searchParams.set("app_id", process.env.ADZUNA_APP_ID);
    url.searchParams.set("app_key", process.env.ADZUNA_APP_KEY);
    url.searchParams.set("results_per_page", resultsPerPage.toString());
    url.searchParams.set("content-type", "application/json");

    // Search keyword
    if (keyword) {
      url.searchParams.set("what", keyword);
    }

    // Location handling
    if (location) {
      url.searchParams.set("where", location);
    }

    // Remote jobs filter
    if (isRemote) {
      // Combine dengan keyword untuk mencari remote jobs
      const remoteKeyword = keyword
        ? `${keyword} remote OR work from home`
        : "remote OR work from home";
      url.searchParams.set("what", remoteKeyword);
    }

    // Salary range filter
    if (salaryMin !== undefined) {
      url.searchParams.set("salary_min", salaryMin.toString());
    }
    if (salaryMax !== undefined) {
      url.searchParams.set("salary_max", salaryMax.toString());
    }

    // Contract type filters
    if (fullTime) {
      url.searchParams.set("full_time", "1");
    }
    if (partTime) {
      url.searchParams.set("part_time", "1");
    }
    if (contract) {
      url.searchParams.set("contract", "1");
    }
    if (permanent) {
      url.searchParams.set("permanent", "1");
    }

    // Category filter
    if (category) {
      url.searchParams.set("category", category);
    }

    // Company filter
    if (companyName) {
      url.searchParams.set("company", companyName);
    }

    // Max days old filter (menggunakan max_days_old parameter dari Adzuna)
    if (maxDays) {
      url.searchParams.set("max_days_old", maxDays.toString());
    }

    // Sorting
    url.searchParams.set("sort_by", "date");

    console.log("Fetching from Adzuna:", url.toString());

    const res = await fetch(url.toString(), {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Adzuna API Error:", {
        status: res.status,
        statusText: res.statusText,
        body: errorText,
      });
      return {
        jobs: [],
        total: 0,
        page,
        resultsPerPage,
      };
    }

    const data: AdzunaResponse = await res.json();
    const rawJobs = data.results || [];

    console.log(`Found ${rawJobs.length} jobs from Adzuna`);

    // Additional client-side filtering (backup jika API filter tidak work)
    const filteredJobs = rawJobs.filter((job: AdzunaJob) => {
      // Filter by date if created field exists
      if (job.created && maxDays) {
        const diffDays =
          (Date.now() - new Date(job.created).getTime()) /
          (1000 * 60 * 60 * 24);
        if (diffDays > maxDays) return false;
      }

      // Filter remote jobs (case-insensitive)
      if (isRemote) {
        const titleLower = job.title?.toLowerCase() || "";
        const descLower = job.description?.toLowerCase() || "";
        const hasRemoteKeyword =
          titleLower.includes("remote") ||
          titleLower.includes("work from home") ||
          titleLower.includes("wfh") ||
          descLower.includes("remote") ||
          descLower.includes("work from home");

        if (!hasRemoteKeyword) return false;
      }

      return true;
    });

    // Normalize jobs
    const normalizedJobs = filteredJobs.map(normalizeAdzunaJob);

    // console.log(normalizedJobs)

    return {
      jobs: normalizedJobs,
      total: data.count || 0,
      page,
      resultsPerPage,
    };
  } catch (err) {
    console.error("Error in fetchAdzunaJobs:", err);
    return {
      jobs: [],
      total: 0,
      page,
      resultsPerPage,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/**
 * Get available job categories from Adzuna
 */
export async function fetchAdzunaCategories(countryCode: string = "sg") {
  try {
    if (!process.env.ADZUNA_APP_ID || !process.env.ADZUNA_APP_KEY) {
      throw new Error("Adzuna API credentials are missing");
    }

    const url = new URL(
      `https://api.adzuna.com/v1/api/jobs/${countryCode}/categories`,
    );
    url.searchParams.set("app_id", process.env.ADZUNA_APP_ID);
    url.searchParams.set("app_key", process.env.ADZUNA_APP_KEY);

    const res = await fetch(url.toString(), {
      cache: "force-cache",
      next: { revalidate: 86400 }, // Cache for 24 hours
    });

    if (!res.ok) {
      console.error("Failed to fetch categories:", res.statusText);
      return [];
    }

    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.error("Error fetching categories:", err);
    return [];
  }
}

/**
 * Get location suggestions from Adzuna
 */
export async function getLocationSuggestions(
  query: string,
  countryCode: string = "sg",
) {
  try {
    if (!process.env.ADZUNA_APP_ID || !process.env.ADZUNA_APP_KEY) {
      throw new Error("Adzuna API credentials are missing");
    }

    // Adzuna doesn't have dedicated location autocomplete,
    // but we can provide common locations based on country
    const locationsByCountry: Record<string, string[]> = {
      sg: [
        "Singapore",
        "Central Region",
        "East Region",
        "North Region",
        "North-East Region",
        "West Region",
      ],
      id: [
        "Jakarta",
        "Surabaya",
        "Bandung",
        "Medan",
        "Semarang",
        "Makassar",
        "Palembang",
        "Tangerang",
        "Depok",
        "Bekasi",
      ],
      us: [
        "New York",
        "Los Angeles",
        "Chicago",
        "Houston",
        "Phoenix",
        "San Francisco",
        "Seattle",
        "Boston",
        "Austin",
        "Denver",
      ],
      gb: [
        "London",
        "Manchester",
        "Birmingham",
        "Leeds",
        "Glasgow",
        "Liverpool",
        "Edinburgh",
        "Bristol",
        "Sheffield",
        "Cardiff",
      ],
    };

    const locations = locationsByCountry[countryCode] || [];
    return locations.filter((loc) =>
      loc.toLowerCase().includes(query.toLowerCase()),
    );
  } catch (err) {
    console.error("Error getting location suggestions:", err);
    return [];
  }
}

/**
 * Get salary statistics for a specific search
 */
export async function getAdzunaSalaryStats({
  keyword = "Developer",
  location,
  countryCode = "sg",
}: {
  keyword?: string;
  location?: string;
  countryCode?: string;
}) {
  try {
    if (!process.env.ADZUNA_APP_ID || !process.env.ADZUNA_APP_KEY) {
      throw new Error("Adzuna API credentials are missing");
    }

    const url = new URL(
      `https://api.adzuna.com/v1/api/jobs/${countryCode}/history`,
    );
    url.searchParams.set("app_id", process.env.ADZUNA_APP_ID);
    url.searchParams.set("app_key", process.env.ADZUNA_APP_KEY);
    url.searchParams.set("what", keyword);
    if (location) {
      url.searchParams.set("where", location);
    }

    const res = await fetch(url.toString(), {
      cache: "force-cache",
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!res.ok) {
      console.error("Failed to fetch salary stats:", res.statusText);
      return null;
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetching salary stats:", err);
    return null;
  }
}

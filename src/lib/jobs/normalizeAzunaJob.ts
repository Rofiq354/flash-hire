// src/lib/jobs/normalizeAzunaJob.ts
export interface NormalizedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  locationType: "remote" | "onsite" | "hybrid";
  description: string;
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
    isPredicted?: boolean;
  };
  contractType?: string;
  contractTime?: string;
  category?: string;
  postedDate: Date;
  url: string;
  source: "adzuna";
  matchScore?: number;
}

export function normalizeAdzunaJob(job: any): NormalizedJob {
  // Determine location type
  const title = job.title?.toLowerCase() || "";
  const desc = job.description?.toLowerCase() || "";
  let locationType: "remote" | "onsite" | "hybrid" = "onsite";

  if (
    title.includes("remote") ||
    title.includes("work from home") ||
    desc.includes("remote") ||
    desc.includes("work from home")
  ) {
    locationType = "remote";
  } else if (title.includes("hybrid") || desc.includes("hybrid")) {
    locationType = "hybrid";
  }

  return {
    id: job.id,
    title: job.title,
    company: job.company?.display_name || "Unknown Company",
    location: job.location?.display_name || "Not specified",
    locationType,
    description: job.description || "",
    salary: {
      min: job.salary_min,
      max: job.salary_max,
      currency: getCurrencyByCountry(job.location?.area?.[0]),
      isPredicted: job.salary_is_predicted === "1",
    },
    contractType: job.contract_type,
    contractTime: job.contract_time,
    category: job.category?.label,
    postedDate: new Date(job.created),
    url: job.redirect_url,
    source: "adzuna",
  };
}

function getCurrencyByCountry(country?: string): string {
  const currencyMap: Record<string, string> = {
    sg: "SGD",
    id: "IDR",
    us: "USD",
    gb: "GBP",
    au: "AUD",
    ca: "CAD",
    nz: "NZD",
    in: "INR",
    za: "ZAR",
    pl: "PLN",
    nl: "EUR",
    de: "EUR",
    fr: "EUR",
    at: "EUR",
    be: "EUR",
    ch: "CHF",
    br: "BRL",
  };

  return currencyMap[country?.toLowerCase() || ""] || "USD";
}

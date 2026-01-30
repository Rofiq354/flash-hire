// src/app/api/jobs/route.ts
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get("keyword");
  const location = searchParams.get("location") || "indonesia";

  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;

  const url = `https://api.adzuna.com/v1/api/jobs/id/search/1?app_id=${appId}&app_key=${appKey}&results_per_page=10&what=${encodeURIComponent(keyword || "")}&where=${encodeURIComponent(location)}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    return NextResponse.json(data.results);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

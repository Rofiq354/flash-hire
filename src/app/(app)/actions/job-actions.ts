// app/(app)/actions/job-actions.ts
"use server";

export async function getJobAnalysis(jobDescription: string, userCvData: any) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/jobs/analyze`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobDescription, userCvData }),
    },
  );

  if (!res.ok) {
    throw new Error("Job analysis failed");
  }

  return res.json();
}

export async function fetchAdzunaJobs({
  keyword,
  location = "indonesia",
  page = 1,
}: {
  keyword: string;
  location?: string;
  page?: number;
}) {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;
  const country = "id";

  const url = `https://api.adzuna.com/v1/api/jobs/${country}/search/${page}?app_id=${appId}&app_key=${appKey}&results_per_page=10&what=${encodeURIComponent(keyword)}&where=${encodeURIComponent(location)}&content-type=application/json`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch jobs from Adzuna");

    const data = await res.json();

    return data.results.map((job: any) => ({
      id: job.id,
      title: job.title.replace(/<\/?[^>]+(>|$)/g, ""), // Bersihkan tag HTML dari title
      company: job.company.display_name,
      location: job.location.display_name,
      description: job.description.replace(/<\/?[^>]+(>|$)/g, ""), // Bersihkan tag HTML
      url: job.redirect_url,
      created: new Date(job.created).toLocaleDateString("id-ID"),
      salary_min: job.salary_min,
    }));
  } catch (error) {
    console.error("Adzuna Fetch Error:", error);
    return [];
  }
}

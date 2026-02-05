export async function getMatchedJobs(alert: any) {
  const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID;
  const ADZUNA_APP_KEY = process.env.ADZUNA_APP_KEY;
  const COUNTRY = "sg"; // atau sesuaikan dengan kebutuhan

  // 1. Fetch data dari Adzuna berdasarkan job_title dan location
  // Kita ambil 20 data terbaru untuk diseleksi
  const url = `https://api.adzuna.com/v1/api/jobs/${COUNTRY}/search/1?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_APP_KEY}&results_per_page=20&what=${encodeURIComponent(alert.job_title)}&where=${encodeURIComponent(alert.location || "")}${alert.is_remote ? '&remote=1' : ''}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const rawJobs = data.results || [];

    // 2. Mapping dan Scoring
    const matchedJobs = rawJobs
      .map((job: any) => {
        // Hitung skor berdasarkan data dari Adzuna
        // Adzuna mengembalikan: title, description, location.display_name, dll.
        const score = calculateAdzunaScore(job, alert);
        
        return {
          id: job.id,
          title: job.title,
          company: job.company.display_name,
          location: job.location.display_name,
          url: job.redirect_url,
          matchScore: score,
        };
      })
      // 3. Filter berdasarkan min_match_score yang di-input user di modal
      .filter((job: any) => job.matchScore >= (alert.min_match_score ?? 70))
      // Urutkan yang paling relevan
      .sort((a: any, b: any) => b.matchScore - a.matchScore)
      .slice(0, 5); // Ambil Top 5

    return matchedJobs;
  } catch (error) {
    console.error("Adzuna API Error:", error);
    return [];
  }
}

function calculateAdzunaScore(job: any, alert: any) {
  let score = 60; // Base score karena Adzuna sudah memfilter 'what' (title)

  // Bonus jika lokasi di deskripsi Adzuna sangat mirip dengan input user
  if (alert.location && job.location.display_name.toLowerCase().includes(alert.location.toLowerCase())) {
    score += 20;
  }

  // Bonus jika ada kata 'Remote' di title atau deskripsi (jika user minta remote)
  if (alert.is_remote) {
    const isRemoteInText = job.title.toLowerCase().includes('remote') || job.description.toLowerCase().includes('remote');
    if (isRemoteInText) score += 20;
  }

  return Math.min(score, 100);
}
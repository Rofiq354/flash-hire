export async function fetchAdzunaJobs(alert: any) {
  const ADZUNA_ID = process.env.ADZUNA_APP_ID;
  const ADZUNA_KEY = process.env.ADZUNA_APP_KEY;
  
  // 1. Gunakan 'id' untuk Indonesia atau 'sg' untuk Singapore (pastikan konsisten)
  const country = "sg"; 

  // 2. URL yang lebih bersih (tanpa content-type di dalam string URL)
  const url = `https://api.adzuna.com/v1/api/jobs/${country}/search/1?app_id=${ADZUNA_ID}&app_key=${ADZUNA_KEY}&results_per_page=5&what=${encodeURIComponent(alert.job_title)}`;

  try {
    console.log("📡 Fetching from Adzuna:", url);
    
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json' // Pindahkan content-type ke Header, bukan URL
      }
    });

    if (!res.ok) {
      console.error(`❌ Adzuna Error: ${res.status} ${res.statusText}`);
      return [];
    }

    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error("❌ Fetch Crash:", error);
    return [];
  }
}
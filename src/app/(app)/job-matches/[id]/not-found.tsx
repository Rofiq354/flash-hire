// app/jobs/[id]/not-found.tsx
import Link from "next/link";

export default function JobNotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <h2 className="text-xl font-bold mb-2">Job tidak ditemukan</h2>
      <p className="text-sm text-gray-500 mb-6">
        Lowongan ini sudah tidak tersedia atau URL tidak valid.
      </p>

      <Link
        href="/job-matches"
        className="text-sm font-semibold text-indigo-600 hover:underline"
      >
        Kembali ke daftar job
      </Link>
    </div>
  );
}

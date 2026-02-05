"use client";

import React, { useState, useEffect } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "./Button";

interface SaveJobButtonProps {
  job: any;
  userId: string | undefined;
  variant?: "minimal" | "full"; // Kita tambah variant supaya bisa dipakai di Detail & Card
}

export const SaveJobButton = ({
  job,
  userId,
  variant = "full",
}: SaveJobButtonProps) => {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  // 1. Logic Check Saved Status
  useEffect(() => {
    if (!userId) return;

    const checkSaved = async () => {
      try {
        const response = await fetch(`/api/jobs/saved?userId=${userId}`);
        const result = await response.json();

        if (result.success) {
          const isSaved = result.data.jobs.some(
            (j: any) => j.job_id === job.id,
          );
          setSaved(isSaved);
        }
      } catch (error) {
        console.error("Failed to check saved status:", error);
      }
    };

    checkSaved();
  }, [userId, job.id]);

  // 2. Logic Toggle Save (POST/DELETE)
  const toggleSave = async (e: React.MouseEvent) => {
    e.preventDefault(); // Mencegah navigasi jika tombol di dalam Link/Card

    if (!userId) {
      alert("Please login to save jobs");
      return;
    }

    setLoading(true);
    try {
      if (saved) {
        const response = await fetch("/api/jobs/saved", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, jobId: job.id }),
        });
        const result = await response.json();
        if (result.success) setSaved(false);
      } else {
        const response = await fetch("/api/jobs/saved", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            job,
            matchScore: null,
          }),
        });
        const result = await response.json();
        if (result.success || result.error === "Job already saved") {
          setSaved(true);
        }
      }
    } catch (error) {
      console.error("Failed to toggle save:", error);
    } finally {
      setLoading(false);
    }
  };

  // 3. Render Minimal (Untuk di Job Card)
  if (variant === "minimal") {
    return (
      <button
        onClick={toggleSave}
        disabled={loading}
        className="group p-2 -mr-2 text-slate-400 hover:text-primary transition-all focus:outline-none disabled:opacity-50"
        title={saved ? "Remove from saved" : "Save job"}
      >
        <Bookmark
          className={`h-5 w-5 transition-all duration-300 ${
            saved
              ? "fill-primary text-primary scale-110"
              : "group-hover:scale-110"
          } ${loading ? "animate-pulse" : ""}`}
        />
      </button>
    );
  }

  // 4. Render Full (Untuk di Job Detail Page)
  return (
    <Button
      variant="outline"
      onClick={toggleSave}
      isLoading={loading}
      className={`flex-1 md:flex-none transition-all duration-300 ${
        saved
          ? "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
          : ""
      }`}
    >
      {saved ? (
        <>
          <BookmarkCheck className="w-4 h-4 fill-current" />
          <span>Saved</span>
        </>
      ) : (
        <>
          <Bookmark className="w-4 h-4" />
          <span>Save</span>
        </>
      )}
    </Button>
  );
};

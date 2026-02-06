"use client";

import React, { useMemo } from "react";
import { Button } from "@/components/atoms/Button";
import { JobCard } from "@/components/molecules/JobCard";
import { ChevronLeft, Search, Bell, ChevronDown } from "lucide-react";
import { calculateMatchScore } from "@/lib/jobs/matchScore";
import SearchComponent from "@/components/molecules/job-matches/SearchComponent";

export default function JobClient({
  initialJobs,
  initialCv,
  userId,
}: {
  initialJobs: any[];
  initialCv: any;
  userId?: string;
}) {
  const jobs = initialJobs;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-slate-100 rounded-xl border border-border-custom bg-card transition-all">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">
              Job Matches{" "}
              <span className="text-primary">({initialJobs.length} found)</span>
            </h1>
            <p className="text-muted text-xs mt-0.5">
              Updated recently based on your career profile
            </p>
          </div>
        </div>
        <SearchComponent />
      </div>

      {/* Alert Banner (Compact) */}
      <div className="bg-primary rounded-3xl p-6 text-primary-foreground flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-indigo-100">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="h-12 w-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
            <Bell className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Want daily updates?</h3>
            <p className="opacity-90 text-sm">
              Get notified as soon as matching roles are posted.
            </p>
          </div>
        </div>
        <Button
          variant="secondary"
          className="text-primary hover:bg-slate-50 w-full md:w-auto px-8 border-none"
        >
          Setup Job Alert
        </Button>
      </div>

      {/* Job Grid - 3 Columns on Large Screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} userId={userId} cvData={initialCv} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center pt-6">
        <Button
          variant="outline"
          className="rounded-full px-10 py-3 flex items-center gap-2 border-border-custom bg-card hover:bg-slate-50 transition-all text-sm font-bold shadow-sm"
        >
          Load more recommendations <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

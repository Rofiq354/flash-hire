"use client";

import React, { useMemo } from "react";
import { Button, LinkButton } from "@/components/atoms/Button";
import { JobCard } from "@/components/molecules/JobCard";
import { ChevronLeft, Bell, ChevronDown } from "lucide-react";
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
  const memoizedJobs = useMemo(() => {
    return initialJobs.map((job) => (
      <JobCard 
        key={job.id} 
        job={job} 
        userId={userId} 
        cvData={initialCv} 
      />
    ));
  }, [initialJobs, userId, initialCv]);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-muted/10 rounded-xl border border-border-custom bg-card text-foreground transition-all active:scale-95">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-foreground">
              Job Matches{" "}
              <span className="text-primary">({initialJobs.length} found)</span>
            </h1>
            <p className="text-muted text-xs mt-0.5 font-medium">
              Updated recently based on your career profile
            </p>
          </div>
        </div>
        <SearchComponent />
      </div>

      {/* Alert Banner */}
      <div className="bg-primary rounded-4xl p-6 text-primary-foreground flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-primary/20 relative overflow-hidden">
        <div className="flex items-center gap-4 text-center md:text-left relative z-10">
          <div className="h-12 w-12 bg-primary-foreground/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
            <Bell className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Want daily updates?</h3>
            <p className="text-primary-foreground/80 text-sm">
              Get notified as soon as matching roles are posted.
            </p>
          </div>
        </div>

        <LinkButton href="/job-alerts"
          variant="secondary"
          className="text-primary w-full md:w-auto px-8 border-none"
        >
          Setup Job Alert
        </LinkButton>

        <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary-foreground/5 rounded-full blur-3xl" />
      </div>

      {/* Job Grid - Menggunakan hasil memoized */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {memoizedJobs}
      </div>

      {/* Pagination */}
      <div className="flex justify-center pt-6">
        <Button
          variant="outline"
          className="rounded-full px-10 py-3 flex items-center gap-2 border-border-custom bg-card hover:bg-muted/5 transition-all text-sm font-bold shadow-sm"
        >
          Load more recommendations <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
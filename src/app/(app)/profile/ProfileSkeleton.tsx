// src/app/profile/ProfileSkeleton.tsx
import React from "react";

export default function ProfileSkeleton() {
  return (
    <div className="mx-auto grid grid-cols-1 gap-8 lg:grid-cols-12 animate-pulse">
      {/* Left Column: Profile Card Skeleton */}
      <aside className="lg:col-span-4">
        <div className="rounded-3xl border border-border-custom bg-card p-8 shadow-sm">
          {/* Avatar Skeleton */}
          <div className="relative mx-auto mb-6 w-fit">
            <div className="h-32 w-32 rounded-full bg-slate-200 shadow-lg" />
            <div className="absolute bottom-1 right-1 h-8 w-8 rounded-full bg-slate-300" />
          </div>

          {/* Name & Title Skeleton */}
          <div className="flex flex-col items-center space-y-3 text-center">
            <div className="h-7 w-48 rounded-lg bg-slate-200" />
            <div className="h-5 w-32 rounded-lg bg-slate-100" />
          </div>

          {/* Buttons Skeleton */}
          <div className="mt-6 flex gap-3">
            <div className="h-12 flex-1 rounded-xl bg-slate-200" />
            <div className="h-12 w-12 rounded-xl bg-slate-100" />
          </div>

          <hr className="my-8 border-border-custom" />

          {/* Contact Info Skeleton */}
          <div className="space-y-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-slate-100" />
                <div className="space-y-2">
                  <div className="h-2 w-12 rounded bg-slate-100" />
                  <div className="h-4 w-32 rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Right Column: CV Management Skeleton */}
      <main className="lg:col-span-8">
        <div className="rounded-3xl border border-border-custom bg-card p-8 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10" />
              <div className="h-6 w-24 rounded-lg bg-slate-200" />
            </div>
            <div className="h-6 w-32 rounded-full bg-slate-100" />
          </div>

          {/* CV Cards Skeleton */}
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="flex flex-col md:flex-row items-start md:items-center justify-between rounded-2xl border border-border-custom p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-slate-100" />
                  <div className="space-y-2">
                    <div className="h-4 w-40 rounded bg-slate-200" />
                    <div className="h-3 w-24 rounded bg-slate-100" />
                  </div>
                </div>
                <div className="mt-4 flex w-full md:mt-0 md:w-auto gap-2">
                  <div className="h-9 w-20 rounded-lg bg-slate-100" />
                  <div className="h-9 w-28 rounded-lg bg-slate-100" />
                  <div className="h-9 w-9 rounded-lg bg-slate-100" />
                </div>
              </div>
            ))}

            {/* FileUpload Placeholder */}
            <div className="h-32 w-full rounded-2xl border-2 border-dashed border-slate-100" />
          </div>
        </div>

        {/* AI Insights Skeleton */}
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="h-24 rounded-2xl bg-slate-50 border border-slate-100" />
          <div className="h-24 rounded-2xl bg-slate-50 border border-slate-100" />
        </div>
      </main>
    </div>
  );
}

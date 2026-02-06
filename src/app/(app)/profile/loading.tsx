// src/app/profile/loading.tsx
import React from "react";
import ProfileSkeleton from "./ProfileSkeleton";
import { Globe } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="mx-auto px-4 sm:px-6">
        <nav className="mx-auto mb-8 flex items-center gap-2 text-sm text-muted opacity-50">
          <Globe size={16} />
          <span>Dashboard</span>
          <span className="opacity-50">/</span>
          <span>Profile Settings</span>
        </nav>

        <ProfileSkeleton />
      </div>
    </div>
  );
}

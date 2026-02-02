// src/app/profile/page.tsx
import React from "react";
import ProfileClient from "./profileClient";
import { Globe } from "lucide-react";

export default function ProfileSettingsPage() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="mx-auto px-4 sm:px-6">
        {/* Static Header / Breadcrumbs */}
        <nav className="mx-auto mb-8 flex items-center gap-2 text-sm text-muted">
          <Globe size={16} />
          <span>Dashboard</span>
          <span className="opacity-50">/</span>
          <span className="font-semibold text-foreground">
            Profile Settings
          </span>
        </nav>

        {/* Interactivity starts here */}
        <ProfileClient />

        {/* Static Footer */}
        <footer className="mx-auto mt-16 border-t border-border-custom pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted">
          <div className="flex items-center gap-2 font-bold text-slate-400 uppercase tracking-tighter">
            <span className="text-primary italic">⚡ Flash Hire</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Help Center
            </a>
          </div>
          <p>© 2024 Flash Hire AI. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

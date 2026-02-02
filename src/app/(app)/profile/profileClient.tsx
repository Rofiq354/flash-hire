// src/app/profile/ProfileClient.tsx
"use client";

import React from "react";
import { Button } from "@/components/atoms/Button";
import { FileUpload } from "@/components/atoms/FileUpload";
import {
  Mail,
  Phone,
  MapPin,
  Link as LinkIcon,
  Globe,
  Terminal,
  Eye,
  Download,
  Sparkles,
  Trash2,
  Share2,
  FileText,
  Pencil,
} from "lucide-react";

export default function ProfileClient() {
  return (
    <div className="mx-auto grid grid-cols-1 gap-8 lg:grid-cols-12">
      {/* Left Column: Profile Card */}
      <aside className="lg:col-span-4">
        <div className="rounded-3xl border border-border-custom bg-card p-8 shadow-sm">
          <div className="relative mx-auto mb-6 w-fit">
            <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-background bg-slate-100">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
                alt="Profile"
                className="h-full w-full object-cover"
              />
            </div>
            <button className="absolute bottom-1 right-1 rounded-full bg-primary p-2 text-white shadow-md hover:bg-primary-hover transition-colors">
              <Pencil size={14} />
            </button>
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-bold text-card-foreground">
              John Doe
            </h1>
            <p className="text-primary font-medium">Frontend Developer</p>
          </div>

          <div className="mt-6 flex gap-3">
            <Button className="flex-1" variant="primary">
              Edit Profile
            </Button>
            <Button variant="outline" className="px-3">
              <Share2 size={18} />
            </Button>
          </div>

          <hr className="my-8 border-border-custom" />

          {/* Contact Info */}
          <div className="space-y-5">
            {[
              {
                icon: <Mail size={18} />,
                label: "Email",
                value: "john.doe@example.com",
              },
              {
                icon: <Phone size={18} />,
                label: "Phone",
                value: "+1 234 567 890",
              },
              {
                icon: <MapPin size={18} />,
                label: "Location",
                value: "San Francisco, CA",
              },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 text-sm">
                <div className="rounded-lg bg-slate-100 p-2 text-primary">
                  {item.icon}
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted font-bold">
                    {item.label}
                  </p>
                  <p className="font-medium">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Social Links */}
          <div className="mt-8 flex justify-center gap-4 text-muted">
            <LinkIcon
              size={20}
              className="cursor-pointer hover:text-primary transition-colors"
            />
            <Globe
              size={20}
              className="cursor-pointer hover:text-primary transition-colors"
            />
            <Terminal
              size={20}
              className="cursor-pointer hover:text-primary transition-colors"
            />
          </div>
        </div>
      </aside>

      {/* Right Column: CV Management */}
      <main className="lg:col-span-8">
        <div className="rounded-3xl border border-border-custom bg-card p-8 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <FileText size={24} />
              </div>
              <h2 className="text-xl font-bold">Your CVs</h2>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-primary">
              1 of 3 uploaded
            </span>
          </div>

          <div className="space-y-4">
            {/* Primary CV Card */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between rounded-2xl border-2 border-primary/20 bg-primary/5 p-4 transition-all">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-white p-3 shadow-sm border border-primary/10">
                  <span className="text-xs font-black text-primary">PDF</span>
                </div>
                <div>
                  <h3 className="font-bold text-sm">
                    john_doe_frontend_2024.pdf
                  </h3>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="rounded bg-primary px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                      Primary
                    </span>
                    <span className="text-[11px] text-muted">
                      Uploaded Oct 24, 2024 • 1.2 MB
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex w-full md:mt-0 md:w-auto gap-2">
                <Button variant="outline" className="h-9 text-xs py-1 px-3">
                  <Eye size={14} className="mr-1" /> View
                </Button>
                <Button variant="outline" className="h-9 text-xs py-1 px-3">
                  <Download size={14} className="mr-1" /> Download
                </Button>
                <Button variant="secondary" className="h-9 text-xs py-1 px-3">
                  <Sparkles size={14} className="mr-1" /> Edit Skills
                </Button>
                <button className="p-2 text-red-400 hover:text-red-600 transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <FileUpload onFileSelect={(f) => console.log(f.name)} />
          </div>
        </div>

        {/* AI Insights */}
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          <InsightCard
            title="AI Skill Match"
            desc="Your primary CV matches 85% of current Frontend roles."
            color="indigo"
          />
          <InsightCard
            title="Optimize CV"
            desc="Flash Hire AI can suggest keywords to improve your ranking."
            color="violet"
          />
        </div>
      </main>
    </div>
  );
}

function InsightCard({
  title,
  desc,
  color,
}: {
  title: string;
  desc: string;
  color: string;
}) {
  return (
    <div
      className={`flex items-start gap-4 rounded-2xl bg-${color}-50/50 border border-${color}-100 p-6`}
    >
      <div className={`rounded-full bg-white p-2 text-${color}-600 shadow-sm`}>
        <Sparkles size={20} />
      </div>
      <div>
        <h4 className="font-bold text-sm">{title}</h4>
        <p className="mt-1 text-xs text-slate-600 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

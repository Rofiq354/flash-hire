// src/app/profile/ProfileClient.tsx
"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/atoms/Button";
import { FileUpload } from "@/components/atoms/FileUpload";
import { format } from "date-fns";
import {
  Mail,
  Phone,
  MapPin,
  Eye,
  Download,
  Sparkles,
  Trash2,
  Share2,
  FileText,
  Pencil,
} from "lucide-react";
import { Avatar } from "@/components/atoms/Avatar";
import { ProfileForm } from "@/components/molecules/profile/ProfileForm";
import { useRouter } from "next/navigation";
import { CvItem } from "@/components/molecules/profile/CvItem";

export default function ProfileClient({ user, initialCvs }: any) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const profile = user?.profile;

  const handleEditPhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi sederhana: harus gambar dan maksimal 2MB
    if (!file.type.startsWith("image/")) return alert("Please upload an image");
    if (file.size > 2 * 1024 * 1024)
      return alert("Image size must be less than 2MB");

    setIsUploading(true);

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await fetch("/api/profile/upload-avatar", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert("Upload failed");
      }
    } catch (error) {
      console.error(error);
      alert("Error uploading image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mx-auto grid grid-cols-1 gap-8 lg:grid-cols-12">
      {/* Left Column: Profile Card */}
      <aside className="lg:col-span-4">
        <div className="rounded-3xl border border-border-custom bg-card p-8 shadow-sm">
          <div className="relative mx-auto mb-6 w-fit">
            <div
              className={`h-32 w-32 rounded-full overflow-hidden border-4 border-background bg-slate-100 ${isUploading ? "opacity-50" : ""}`}
            >
              <Avatar src={profile?.avatar_url} className="h-32 w-32" />
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            <button
              onClick={handleEditPhotoClick}
              disabled={isUploading}
              className="absolute bottom-1 right-1 rounded-full bg-primary p-2 text-white shadow-md hover:bg-primary-hover transition-colors disabled:bg-slate-400"
            >
              <Pencil size={14} />
            </button>
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-bold text-card-foreground">
              {profile?.full_name || user?.email?.split("@")[0]}
            </h1>
            <p className="text-primary font-medium">
              {profile?.job_title || "Professional"}
            </p>
          </div>

          <div className="mt-6 flex gap-3">
            <Button
              className="flex-1"
              variant="primary"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
            <Button variant="outline" className="px-3">
              <Share2 size={18} />
            </Button>
          </div>

          <hr className="my-8 border-border-custom" />

          {/* Contact Info */}
          <div className="space-y-5">
            <ContactItem
              icon={<Mail size={18} />}
              label="Email"
              value={user?.email}
            />
            <ContactItem
              icon={<Phone size={18} />}
              label="Phone"
              value={profile?.phone_number || "-"}
            />
            <ContactItem
              icon={<MapPin size={18} />}
              label="Location"
              value={profile?.location || "Not set"}
            />
          </div>
        </div>
      </aside>

      {/* Right Column: CV Management */}
      <main className="lg:col-span-8">
        {isEditing ? (
          <ProfileForm profile={profile} onCancel={() => setIsEditing(false)} />
        ) : (
          <>
            <div className="rounded-3xl border border-border-custom bg-card p-8 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 text-primary">
                    <FileText size={24} />
                  </div>
                  <h2 className="text-xl font-bold">Your CVs</h2>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-primary">
                  {initialCvs.length} of 3 uploaded
                </span>
              </div>

              <div className="space-y-4">
                {initialCvs.map((cv: any) => (
                  <CvItem
                    key={cv.id}
                    cv={cv}
                    onDelete={(id) => console.log("Hapus CV:", id)}
                  />
                ))}

                {initialCvs.length < 3 && (
                  <FileUpload onFileSelect={(f) => console.log(f.name)} />
                )}
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
          </>
        )}
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

function ContactItem({
  icon,
  label,
  value,
  className,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className="flex items-center gap-4 text-sm">
      <div className="rounded-lg bg-slate-100 p-2 text-primary">{icon}</div>
      <div>
        <p
          className={`text-[10px] uppercase tracking-wider text-muted font-bold ${className}`}
        >
          {label}
        </p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}

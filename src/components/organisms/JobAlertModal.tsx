"use client";

import { useState } from "react";
import { createJobAlert } from "@/app/dashboard/alert-action";
import { Input } from "../atoms/Input";
import { Button } from "../atoms/Button";
import { BellIcon } from "../atoms/icons/BellIcon";
import { AuthAlert } from "../molecules/AuthAlert";

interface Props {
  onSuccess: (data: any) => void;
  onClose: () => void;
}

export default function JobAlertModal({ onSuccess, onClose }: Props) {
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(false);

  const [status, setStatus] = useState<{ error?: string; message?: string }>(
    {},
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus({});

    const formData = new FormData(e.currentTarget);
    const data = {
      jobTitle: formData.get("jobTitle") as string,
      location: formData.get("location") as string,
      frequency: formData.get("frequency") as string,
      minScore: Number(formData.get("minScore")),
    };

    const result = await createJobAlert(data);
    if (result.success) {
      setStatus({ message: "Kriteria tersimpan! Mencari lowongan..." });
      setTimeout(() => {
        onSuccess(data); // Beritahu dashboard untuk fetch jobs
      }, 1500);
    } else {
      setStatus({ error: result.error });
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header Section */}
        <div className="p-6 border-b flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
              <BellIcon className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">
              Setup Job Alert
            </h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <AuthAlert error={status.error} message={status.message} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">
                Job Title
              </label>
              <Input
                name="jobTitle"
                placeholder="e.g., Frontend Developer"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">
                Location
              </label>
              <Input name="location" placeholder="e.g., Jakarta" />
            </div>
          </div>

          <div className="flex items-center gap-2 py-2">
            <input
              type="checkbox"
              id="remote"
              name="remote"
              className="w-4 h-4 rounded text-indigo-600"
            />
            <label htmlFor="remote" className="text-sm text-slate-600">
              Include Remote jobs
            </label>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700">
              Alert Frequency
            </label>
            <div className="grid grid-cols-1 gap-2">
              {["Daily", "Weekly"].map((freq) => (
                <label
                  key={freq}
                  className="flex items-center justify-between p-3 border rounded-xl cursor-pointer hover:bg-slate-50 transition"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{freq}</span>
                    <span className="text-xs text-slate-400">
                      {freq === "Daily" ? "Every morning" : "Every Monday"}
                    </span>
                  </div>
                  <input
                    type="radio"
                    name="frequency"
                    value={freq}
                    defaultChecked={freq === "Daily"}
                    className="w-4 h-4"
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">
                Notification Email
              </label>
              <Input name="email" type="email" placeholder="your@email.com" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">
                Min. Match Score
              </label>
              <select
                name="minScore"
                className="w-full h-10 px-3 border rounded-md bg-slate-50 text-sm focus:ring-2 ring-indigo-500 outline-none"
              >
                <option value="70">70% (Recommended)</option>
                <option value="80">80% (Strict)</option>
                <option value="90">90% (Very Strict)</option>
              </select>
            </div>
          </div>

          <div className="bg-indigo-50 p-4 rounded-xl flex gap-3 italic">
            <span className="text-indigo-600 text-lg">ℹ️</span>
            <p className="text-xs text-indigo-800 leading-relaxed">
              Based on your AI profile, you'll receive the{" "}
              <span className="font-bold">top 5 matched jobs</span> curated for
              your expertise directly via email.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
              isLoading={loading}
            >
              Create Alert ⚡
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// src/app/(app)/job-alert/JobAlertClient.tsx
"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Input } from "@/components/atoms/Input";
import { Select } from "@/components/atoms/Select";
import { Button } from "@/components/atoms/Button";
import { BellRing } from "lucide-react";
import { createJobAlert } from "./actions";
import { Alert } from "@/components/molecules/job-alert/Alert";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" isLoading={pending} className="w-full py-4 text-base">
      {pending ? "Activating..." : "Activate Job Alert ⚡"}
    </Button>
  );
}

export default function JobAlertClient({
  initialEmail,
}: {
  initialEmail?: string;
}) {
  const [score, setScore] = useState(70);
  const [status, setStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  async function clientAction(formData: FormData) {
    setStatus(null);
    const result = await createJobAlert(formData);
    setStatus(result);
  }

  return (
    <div className="max-w-md mx-auto bg-card text-card-foreground p-8 rounded-2xl shadow-xl border border-border-custom transition-all duration-300">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <BellRing className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Setup Job Alert</h2>
        </div>
        <p className="text-sm text-muted font-medium">
          Get notified when Adzuna finds jobs matching your criteria.
        </p>
      </header>

      <form action={clientAction} className="space-y-6">
        {status && (
          <Alert
            message={status.message}
            type={status.success ? "success" : "error"}
          />
        )}

        <Input
          label="Job Title"
          name="job_title"
          placeholder="e.g. Fullstack Developer"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input label="Location" name="location" placeholder="Jakarta, ID" />
          <div className="flex flex-col justify-end pb-1.5">
            <label className="relative inline-flex items-center cursor-pointer group">
              <input
                type="checkbox"
                name="is_remote"
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 dark:bg-slate-800 rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
              <span className="ml-3 text-sm font-semibold text-muted group-hover:text-primary">
                Remote
              </span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Frequency"
            name="frequency"
            id="frequency"
            placeholder="Select frequency"
            options={[
              { value: "daily", label: "Daily" },
              { value: "weekly", label: "Weekly" },
            ]}
            defaultValue="daily"
          />
          <Input
            label="Email"
            name="email"
            id="email"
            defaultValue={initialEmail}
            disabled
            placeholder="your@email.com"
            required
          />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold">Min. Match Score</label>
            <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full border border-primary/20">
              {score}% Match
            </span>
          </div>
          <input
            type="range"
            name="min_match_score"
            min="0"
            max="100"
            value={score}
            onChange={(e) => setScore(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

        <SubmitButton />
      </form>
    </div>
  );
}

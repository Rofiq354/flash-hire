// src/components/organisms/RightDashboardColumn.tsx
"use client";

import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface RightDashboardColumnProps {
  alertData?: any;
  userEmail: string;
  userId: string;
  setAlertData: any;
  onAlertChange: any;
}

export const RightDashboardColumn = ({
  alertData,
  setAlertData,
  onAlertChange,
  userEmail,
  userId,
}: RightDashboardColumnProps) => {
  const [currentAlert, setCurrentAlert] = useState(alertData);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    job_title: "",
    location: "",
    frequency: "Daily",
  });

  useEffect(() => {
    setCurrentAlert(alertData);
  }, [alertData]);

  const handleCreateAlert = async () => {
    if (!formData.job_title) return toast.error("Please enter a job title");
    setLoading(true);
    onAlertChange(formData.job_title, formData.location);
    try {
      const res = await fetch("/api/job-alerts", {
        method: "POST",
        body: JSON.stringify({ ...formData, email: userEmail, userId }),
      });

      if (res.ok) {
        const result = await res.json();
        setAlertData(result.data);
        onAlertChange(formData.job_title, formData.location);
        toast.success("Job Alert created! We'll update your matches.");
      } else {
        toast.error("Failed to create alert.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAlert = async () => {
    if (!confirm("Hapus alert?")) return;

    onAlertChange("Software Engineer", "");

    try {
      const res = await fetch(`/api/job-alerts?userId=${userId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setAlertData(null);
        onAlertChange("Software Engineer", "");
        toast.info("Alert deleted. Showing default recommendations.");
      } else {
        toast.error("Failed to delete alert.");
      }
    } catch (error) {
      toast.error("Could not delete alert.");
      console.error(error);
    }
  };

  return (
    <div className="col-span-12 xl:col-span-3">
      <div className="bg-card p-6 rounded-3xl shadow-sm border border-border-custom sticky top-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <span className="text-primary text-lg leading-none">🔔</span>
          </div>
          <h3 className="font-bold text-foreground tracking-tight">
            Set Job Alert
          </h3>
        </div>

        <div className="space-y-5">
          {/* Keywords */}
          <div>
            <label className="text-[10px] font-bold text-muted uppercase mb-2 block tracking-wider">
              Keywords
            </label>
            <Input
              type="text"
              placeholder="e.g. Frontend, React"
              value={formData.job_title}
              onChange={(e) =>
                setFormData({ ...formData, job_title: e.target.value })
              }
              className="bg-muted/5 border-border-custom rounded-xl focus:bg-card focus:border-primary transition-all placeholder:text-muted/50"
            />
          </div>

          {/* Location */}
          <div>
            <label className="text-[10px] font-bold text-muted uppercase mb-2 block tracking-wider">
              Location
            </label>
            <div className="relative">
              <Input
                type="text"
                placeholder="City or Remote"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="bg-muted/5 border-border-custom rounded-xl pl-10 focus:bg-card focus:border-primary transition-all placeholder:text-muted/50"
              />
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted text-sm opacity-70">
                📍
              </span>
            </div>
          </div>

          {/* Frequency */}
          <div>
            <label className="text-[10px] font-bold text-muted uppercase mb-2 block tracking-wider">
              Frequency
            </label>
            <select
              value={formData.frequency}
              onChange={(e) =>
                setFormData({ ...formData, frequency: e.target.value })
              }
              className="w-full bg-muted/5 border border-border-custom rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
            >
              <option value="Daily" className="bg-card">
                Daily
              </option>
              <option value="Weekly" className="bg-card">
                Weekly
              </option>
            </select>
          </div>

          <Button
            onClick={handleCreateAlert}
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-hover text-primary-foreground py-3.5 rounded-xl font-bold text-sm shadow-md shadow-primary/20 transition-all active:scale-[0.98]"
          >
            {loading ? "Creating..." : "Create Alert"}
          </Button>

          {/* Active Alerts List */}
          <div className="pt-6 border-t border-border-custom">
            <p className="text-[10px] font-bold text-muted uppercase mb-3 tracking-wider">
              Your Active Alert
            </p>

            {currentAlert ? (
              <div className="p-3 bg-muted/5 border border-border-custom rounded-xl flex justify-between items-center group">
                <div>
                  <p className="text-xs font-bold text-foreground">
                    {currentAlert.job_title}
                  </p>
                  <p className="text-[10px] text-muted">
                    {currentAlert.frequency} •{" "}
                    {currentAlert.location || "Anywhere"}
                  </p>
                </div>
                <button
                  onClick={handleDeleteAlert}
                  className="text-muted/40 hover:text-red-500 transition-colors p-1"
                  type="button"
                >
                  🗑️
                </button>
              </div>
            ) : (
              <p className="text-[10px] text-muted italic">
                No active alert. Set one above!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

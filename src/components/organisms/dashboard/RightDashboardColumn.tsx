// src/components/organisms/RightDashboardColumn.tsx
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";

interface RightDashboardColumnProps {
  alertData?: any;
}

export const RightDashboardColumn = ({
  alertData,
}: RightDashboardColumnProps) => {
  return (
    <div className="col-span-12 xl:col-span-3">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 sticky top-8">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <span className="text-indigo-600 text-lg">🔔</span>
          </div>
          <h3 className="font-bold text-slate-800 tracking-tight">
            Set Job Alert
          </h3>
        </div>

        {/* Form */}
        <div className="space-y-5">
          {/* Keywords */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block tracking-wider">
              Keywords
            </label>
            <Input
              type="text"
              placeholder="e.g. Frontend, React"
              defaultValue={alertData?.job_title || ""}
              className="bg-slate-50 border-slate-200 rounded-xl focus:bg-white transition-all"
            />
          </div>

          {/* Location */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block tracking-wider">
              Location
            </label>
            <div className="relative">
              <Input
                type="text"
                placeholder="City or Remote"
                className="bg-slate-50 border-slate-200 rounded-xl pl-10 focus:bg-white transition-all"
              />
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                📍
              </span>
            </div>
          </div>

          {/* Frequency */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block tracking-wider">
              Frequency
            </label>
            <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer">
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>

          {/* Send to email */}
          <div className="flex items-center gap-2 py-1">
            <input
              type="checkbox"
              id="sendEmail"
              className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
            <label
              htmlFor="sendEmail"
              className="text-xs font-medium text-slate-500 cursor-pointer"
            >
              Send to my email
            </label>
          </div>

          <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-bold text-sm shadow-md shadow-indigo-100 transition-all active:scale-[0.98]">
            Create Alert
          </Button>

          {/* Active Alerts */}
          <div className="pt-6 border-t border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-3 tracking-wider">
              Your Active Alerts
            </p>
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center group">
              <div>
                <p className="text-xs font-bold text-slate-800">Remote React</p>
                <p className="text-[10px] text-slate-400">Daily</p>
              </div>
              <button className="text-slate-300 hover:text-red-500 transition-colors p-1">
                🗑️
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

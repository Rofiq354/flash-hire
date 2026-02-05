"use client";

import React, { useState } from "react";
import { createJobAlert } from "./actions";

const JobAlertPage = () => {
  const [score, setScore] = useState(70);
  const [status, setStatus] = useState<{success?: boolean, message?: string} | null>(null);

  async function handleFormAction(formData: FormData) {
    const result = await createJobAlert(formData);
    setStatus(result);
    if (result.success) {
      alert("Alert Berhasil Disimpan!");
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100 mt-10">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Setup Job Alert</h2>
        <p className="text-sm text-gray-500">
          Get notified when Adzuna finds jobs matching your criteria.
        </p>
      </header>

      <form action={handleFormAction} className="space-y-5">
        {status?.message && (
          <div className={`p-3 rounded-lg text-sm ${status.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {status.message}
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-gray-700">Job Title</label>
          <input
            type="text"
            name="job_title"
            placeholder="e.g. Fullstack Developer"
            className="w-full mt-1 p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition shadow-sm text-black"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Location</label>
            <input
              type="text"
              name="location"
              placeholder="Jakarta, ID"
              className="w-full mt-1 p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition shadow-sm text-black"
            />
          </div>
          <div className="flex items-center mt-7">
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                name="is_remote" 
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-600">Remote Only</span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Frequency</label>
            <select
              name="frequency"
              className="w-full mt-1 p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none shadow-sm bg-white text-black"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="alex@example.com"
              className="w-full mt-1 p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none shadow-sm text-black"
              required
            />
          </div>
        </div>

        <div className="pt-2">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-semibold text-gray-700">Min. Match Score</label>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-md">
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
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
        >
          Activate Job Alert ⚡
        </button>
      </form>
    </div>
  );
};

export default JobAlertPage;
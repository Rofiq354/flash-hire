// components/SkillGapDashboard.tsx
"use client";

import { useState } from "react";

interface SkillGapAnalysis {
  overall_score: number;
  category_scores: {
    technical_skills: number;
    experience: number;
    education: number;
    soft_skills: number;
  };
  matching_skills: {
    hard_skills: string[];
    soft_skills: string[];
    tools: string[];
  };
  missing_skills: {
    critical: string[];
    important: string[];
    nice_to_have: string[];
  };
  recommendations: {
    immediate_actions: string[];
    short_term_learning: string[];
    long_term_development: string[];
  };
  strengths: string[];
  weaknesses: string[];
  overall_advice: string;
  estimated_time_to_ready?: string;
}

interface SkillGapDashboardProps {
  analysis: SkillGapAnalysis;
}

export default function SkillGapDashboard({
  analysis,
}: SkillGapDashboardProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "skills" | "recommendations"
  >("overview");

  return (
    <div className="w-full space-y-6">
      {/* Overall Score Card */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Match Score</h2>
            <p className="text-gray-600 mt-1">
              Your compatibility with this position
            </p>
          </div>
          <div className="relative w-32 h-32">
            {/* Circular Progress */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#e5e7eb"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke={getScoreColor(analysis.overall_score)}
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - analysis.overall_score / 100)}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-4xl font-bold">
                {analysis.overall_score}
              </span>
              <span className="text-sm text-gray-600">/ 100</span>
            </div>
          </div>
        </div>

        {/* Category Scores */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {Object.entries(analysis.category_scores).map(([category, score]) => (
            <div key={category} className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-xs text-gray-600 capitalize mb-2 font-medium">
                {category.replace(/_/g, " ")}
              </div>
              <div
                className="text-2xl font-semibold"
                style={{ color: getScoreColor(score) }}
              >
                {score}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                <div
                  className="h-1.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${score}%`,
                    backgroundColor: getScoreColor(score),
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Estimated Time */}
        {analysis.estimated_time_to_ready && (
          <div className="mt-4 p-3 bg-blue-100 rounded-lg border border-blue-200">
            <p className="text-sm font-medium text-blue-900">
              ⏱️ Estimated time to become competitive:{" "}
              <strong>{analysis.estimated_time_to_ready}</strong>
            </p>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {(["overview", "skills", "recommendations"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition ${
                  activeTab === tab
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "overview" && <OverviewTab analysis={analysis} />}
          {activeTab === "skills" && <SkillsTab analysis={analysis} />}
          {activeTab === "recommendations" && (
            <RecommendationsTab analysis={analysis} />
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// TAB COMPONENTS
// ============================================================================

function OverviewTab({ analysis }: { analysis: SkillGapAnalysis }) {
  return (
    <div className="space-y-6">
      {/* Strengths */}
      {analysis.strengths.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <span className="text-green-500 mr-2">✅</span>
            Your Strengths
          </h3>
          <ul className="space-y-2">
            {analysis.strengths.map((strength, idx) => (
              <li
                key={idx}
                className="flex items-start bg-green-50 p-3 rounded-lg border border-green-100"
              >
                <span className="text-green-500 mr-2 mt-0.5">•</span>
                <span className="text-gray-700">{strength}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Weaknesses */}
      {analysis.weaknesses.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <span className="text-orange-500 mr-2">⚠️</span>
            Areas for Improvement
          </h3>
          <ul className="space-y-2">
            {analysis.weaknesses.map((weakness, idx) => (
              <li
                key={idx}
                className="flex items-start bg-orange-50 p-3 rounded-lg border border-orange-100"
              >
                <span className="text-orange-500 mr-2 mt-0.5">•</span>
                <span className="text-gray-700">{weakness}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Overall Advice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
          <span className="mr-2">💡</span>
          Overall Advice
        </h4>
        <p className="text-sm text-blue-800">{analysis.overall_advice}</p>
      </div>
    </div>
  );
}

function SkillsTab({ analysis }: { analysis: SkillGapAnalysis }) {
  return (
    <div className="space-y-6">
      {/* Matching Skills */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <span className="text-green-500 mr-2">✅</span>
          Skills You Have
        </h3>
        <div className="space-y-4">
          {analysis.matching_skills.hard_skills.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Technical Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {analysis.matching_skills.hard_skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {analysis.matching_skills.tools.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Tools & Technologies
              </h4>
              <div className="flex flex-wrap gap-2">
                {analysis.matching_skills.tools.map((tool, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}

          {analysis.matching_skills.soft_skills.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Soft Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {analysis.matching_skills.soft_skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Missing Skills */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <span className="text-red-500 mr-2">📚</span>
          Skills to Acquire
        </h3>
        <div className="space-y-4">
          {analysis.missing_skills.critical.length > 0 && (
            <div className="border-l-4 border-red-500 pl-4 bg-red-50 p-3 rounded-r-lg">
              <h4 className="text-sm font-semibold text-red-700 mb-2">
                🔴 Critical (Must Have)
              </h4>
              <div className="flex flex-wrap gap-2">
                {analysis.missing_skills.critical.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-red-100 text-red-800 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {analysis.missing_skills.important.length > 0 && (
            <div className="border-l-4 border-orange-500 pl-4 bg-orange-50 p-3 rounded-r-lg">
              <h4 className="text-sm font-semibold text-orange-700 mb-2">
                🟠 Important (Highly Preferred)
              </h4>
              <div className="flex flex-wrap gap-2">
                {analysis.missing_skills.important.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-orange-100 text-orange-800 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {analysis.missing_skills.nice_to_have.length > 0 && (
            <div className="border-l-4 border-yellow-500 pl-4 bg-yellow-50 p-3 rounded-r-lg">
              <h4 className="text-sm font-semibold text-yellow-700 mb-2">
                🟡 Nice to Have (Bonus)
              </h4>
              <div className="flex flex-wrap gap-2">
                {analysis.missing_skills.nice_to_have.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function RecommendationsTab({ analysis }: { analysis: SkillGapAnalysis }) {
  return (
    <div className="space-y-6">
      {/* Immediate Actions */}
      {analysis.recommendations.immediate_actions.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-green-900 mb-3 flex items-center">
            <span className="mr-2">🚀</span>
            Immediate Actions (1-2 weeks)
          </h3>
          <ul className="space-y-2">
            {analysis.recommendations.immediate_actions.map((action, idx) => (
              <li key={idx} className="flex items-start">
                <span className="text-green-600 mr-2 mt-1">✓</span>
                <span className="text-green-800">{action}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Short-term Learning */}
      {analysis.recommendations.short_term_learning.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
            <span className="mr-2">📖</span>
            Short-term Learning (1-3 months)
          </h3>
          <ul className="space-y-2">
            {analysis.recommendations.short_term_learning.map((item, idx) => (
              <li key={idx} className="flex items-start">
                <span className="text-blue-600 mr-2 mt-1">📚</span>
                <span className="text-blue-800">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Long-term Development */}
      {analysis.recommendations.long_term_development.length > 0 && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-purple-900 mb-3 flex items-center">
            <span className="mr-2">🎯</span>
            Long-term Development (6+ months)
          </h3>
          <ul className="space-y-2">
            {analysis.recommendations.long_term_development.map((item, idx) => (
              <li key={idx} className="flex items-start">
                <span className="text-purple-600 mr-2 mt-1">🎓</span>
                <span className="text-purple-800">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Helper function
function getScoreColor(score: number): string {
  if (score >= 75) return "#10b981"; // green
  if (score >= 50) return "#3b82f6"; // blue
  if (score >= 25) return "#f59e0b"; // orange
  return "#ef4444"; // red
}

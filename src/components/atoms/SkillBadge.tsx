// src/components/atoms/SkillBadge.tsx
export const SkillBadge = ({ skill }: { skill: string }) => (
  <span className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-semibold text-slate-600">
    {skill}
  </span>
);

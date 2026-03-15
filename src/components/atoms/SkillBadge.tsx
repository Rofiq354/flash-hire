// src/components/atoms/SkillBadge.tsx
export const SkillBadge = ({ skill }: { skill: string }) => (
  <span
    className="bg-border-custom text-muted border border-border-custom px-3 py-1.5 rounded-xl text-xs font-medium hover:border-primary/50 transition-colors"
  >
    {skill}
  </span>
);

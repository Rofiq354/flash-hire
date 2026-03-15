// src/components/molecules/dashboard/CVAnalysisCard.tsx
import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import { ProgressCircle } from "@/components/atoms/ProgressCircle";
import { SkillBadge } from "@/components/atoms/SkillBadge";

interface CVAnalysisCardProps {
  skills: string[];
  matchPower: number;
  lastUpdated: string;
  uploadLink: string;
}

export const CVAnalysisCard = ({
  skills,
  matchPower,
  lastUpdated,
  uploadLink,
}: CVAnalysisCardProps) => (
  <div className="bg-card p-6 rounded-4xl shadow-sm border border-border-custom">
    <h3 className="font-bold text-foreground mb-6 text-center">
      Your CV Analysis
    </h3>

    {/* Pastikan ProgressCircle juga menggunakan warna primary/border-custom di dalamnya */}
    <ProgressCircle radius={58} progress={matchPower} />

    <p className="text-[11px] text-muted text-center mb-6 italic">
      Last updated {lastUpdated}
    </p>

    <div className="space-y-3">
      <p className="text-[10px] font-bold text-muted uppercase tracking-widest">
        Extracted Skills
      </p>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <SkillBadge key={skill} skill={skill} />
        ))}
      </div>
    </div>

    <Link href={uploadLink} prefetch={false}>
      <Button
        variant="outline"
        showLoadingOnClick
        className="w-full mt-8 rounded-2xl border-primary/20 text-primary font-bold text-xs hover:bg-primary/5 transition-all"
      >
        🔄 Re-upload CV
      </Button>
    </Link>
  </div>
);

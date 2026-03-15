// src/components/molecules/dashboard/AITipCard.tsx
interface AITipCardProps {
  summary?: string;
}

export const AITipCard = ({ summary }: AITipCardProps) => {
  const defaultTip =
    "Based on your skills, focusing on cloud architecture could boost your visibility.";

  return (
    <div className="bg-primary p-6 rounded-4xl text-primary-foreground shadow-xl shadow-primary/20 relative overflow-hidden transition-all hover:scale-[1.02]">
      <div className="relative z-10">
        <h4 className="font-bold mb-2 flex items-center gap-2">
          <span>✨</span> AI Career Tip
        </h4>
        <p className="text-sm text-primary-foreground/80 leading-relaxed font-medium">
          {summary ? `${summary.substring(0, 100)}...` : defaultTip}
        </p>
      </div>

      {/* Efek dekoratif menggunakan opacity dari foreground agar sinkron */}
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary-foreground/10 rounded-full blur-2xl" />
      <div className="absolute -left-4 -top-4 w-16 h-16 bg-primary-foreground/5 rounded-full blur-xl" />
    </div>
  );
};

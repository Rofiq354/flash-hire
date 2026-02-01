// src/components/molecules/dashboard/AITipCard.tsx
interface AITipCardProps {
  summary?: string;
}

export const AITipCard = ({ summary }: AITipCardProps) => {
  const defaultTip =
    "Based on your skills, focusing on cloud architecture could boost your visibility.";

  return (
    <div className="bg-primary p-6 rounded-4xl text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
      <div className="relative z-10">
        <h4 className="font-bold mb-2 flex items-center gap-2">
          <span>✨</span> AI Career Tip
        </h4>
        <p className="text-sm text-indigo-100 leading-relaxed">
          {summary ? `${summary.substring(0, 100)}...` : defaultTip}
        </p>
      </div>
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
    </div>
  );
};

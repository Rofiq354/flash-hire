// src/components/atoms/ProgressCircle.tsx
interface ProgressCircleProps {
  radius: number;
  progress: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
}

export const ProgressCircle = ({
  radius,
  progress,
  strokeWidth = 10,
  color = "var(--primary)",
  bgColor = "var(--border-custom)",
}: ProgressCircleProps) => {
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center my-4">
      <svg width={radius * 2} height={radius * 2} className="-rotate-90">
        {/* Lingkaran Background */}
        <circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          stroke={bgColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          className="opacity-20"
        />
        {/* Lingkaran Progress */}
        <circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 1.5s ease-in-out",
          }}
        />
      </svg>

      <div className="absolute text-center leading-tight">
        {/* Text Utama (Persentase) */}
        <span className="text-2xl font-black block text-foreground">
          {progress}%
        </span>
        {/* Label Bawah */}
        <span className="text-[9px] text-muted uppercase font-bold tracking-[0.15em]">
          Match Power
        </span>
      </div>
    </div>
  );
};

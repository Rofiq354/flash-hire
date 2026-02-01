// src/components/atoms/ProgressCircle.tsx
interface ProgressCircleProps {
  radius: number;
  progress: number; // 0-100
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
}

export const ProgressCircle = ({
  radius,
  progress,
  strokeWidth = 10,
  color = "#4F46E5",
  bgColor = "#F1F5F9",
}: ProgressCircleProps) => {
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg width={radius * 2} height={radius * 2} className="-rotate-90">
        <circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          stroke={bgColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
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
        <span className="text-2xl font-bold block text-slate-900">
          {progress}%
        </span>
        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
          Match Power
        </span>
      </div>
    </div>
  );
};

// src/components/atoms/Alert.tsx
import { CheckCircle2, AlertCircle } from "lucide-react";

interface AlertProps {
  message: string;
  type: "success" | "error";
}

export const Alert = ({ message, type }: AlertProps) => {
  const styles = {
    success:
      "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400",
    error: "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400",
  };

  const Icon = type === "success" ? CheckCircle2 : AlertCircle;

  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-xl border ${styles[type]} animate-in fade-in slide-in-from-top-2 duration-300`}
    >
      <Icon className="w-5 h-5 shrink-0" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
};

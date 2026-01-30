import { Zap } from "lucide-react";

export const Logo = () => (
  <div className="flex items-center gap-3 px-2">
    <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
      <Zap size={24} fill="currentColor" />
    </div>
    <span className="text-xl font-bold text-foreground tracking-tight">
      Flash Hire
    </span>
  </div>
);

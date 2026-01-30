// src/components/molecules/UserBadge.tsx
import { Avatar } from "@/components/atoms/Avatar";

interface UserBadgeProps {
  name: string;
  role: string;
}

export const UserBadge = ({ name, role }: UserBadgeProps) => (
  // Tambahkan h-full agar divider vertikalnya terlihat bagus sejajar navbar
  <div className="flex items-center gap-4 pl-6 border-l border-slate-200 dark:border-slate-800 h-10">
    <div className="flex flex-col items-end whitespace-nowrap">
      <span className="text-sm font-bold text-slate-900 dark:text-white leading-none">
        {name}
      </span>
      <span className="text-[11px] text-slate-500 font-medium mt-1">
        {role}
      </span>
    </div>
    <Avatar src="https://i.pravatar.cc/150?u=alex" />
  </div>
);

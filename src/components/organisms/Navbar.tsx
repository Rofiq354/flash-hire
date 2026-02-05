// src/components/organisms/Navbar.tsx
import { SearchBar } from "@/components/molecules/SearchBar";
import { UserBadge } from "@/components/molecules/UserBadge";
import { Button } from "@/components/atoms/Button";
import { UploadCloud } from "lucide-react";
import Link from "next/link";
import { getCurrentUser } from "@/services/auth/user.service";

export const Navbar = async () => {
  const userData = await getCurrentUser();

  const userName =
    userData?.profile?.full_name || userData?.email?.split("@")[0] || "User";
  const userRole = userData?.profile?.job_title || "Professional";
  const userAvatar = userData?.profile?.avatar_url;
  return (
    <header className="h-20 border-b border-border-custom bg-white dark:bg-slate-950 px-8 flex items-center justify-between sticky top-0 z-50">
      <div className="flex-1 pr-8">
        <SearchBar />
      </div>

      <div className="flex items-center gap-6 shrink-0">
        <Button
          variant="primary"
          className="w-auto px-5 py-2.5 text-xs font-bold rounded-xl flex items-center gap-2"
        >
          <UploadCloud size={16} />
          <span className="whitespace-nowrap">Quick Upload CV</span>
        </Button>

        <Link href="/profile" prefetch={false}>
          <UserBadge name={userName} role={userRole} avatar={userAvatar} />
        </Link>
      </div>
    </header>
  );
};

// src/components/organisms/Navbar.tsx
import { SearchBar } from "@/components/molecules/SearchBar";
import { UserBadge } from "@/components/molecules/UserBadge";
import { Button } from "@/components/atoms/Button";
import { UploadCloud } from "lucide-react";
import Link from "next/link";

export const Navbar = () => {
  return (
    <header className="h-20 border-b border-border-custom bg-white dark:bg-slate-950 px-8 flex items-center justify-between sticky top-0 z-50">
      {/* Search Bar */}
      <div className="flex-1 pr-8">
        <SearchBar />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6 shrink-0">
        <Button
          variant="primary"
          className="w-auto px-5 py-2.5 text-xs font-bold rounded-xl flex items-center gap-2"
        >
          <UploadCloud size={16} />
          <span className="whitespace-nowrap">Quick Upload CV</span>
        </Button>

        <Link href="/profile" prefetch={false}>
          <UserBadge name="Alex Rivera" role="Frontend Dev" />
        </Link>
      </div>
    </header>
  );
};

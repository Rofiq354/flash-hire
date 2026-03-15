// src/components/molecules/LogoutButton.tsx
"use client";

import { LogOut } from "lucide-react";
import { Button } from "../atoms/Button";

export function LogoutButton({ onLogout }: { onLogout: () => void }) {
  return (
    <form action={onLogout} className="w-full">
      <Button
        type="submit"
        variant="ghost"
        className="w-full cursor-pointer justify-start gap-3 px-3 py-2 text-muted hover:bg-primary-foreground transition-colors group"
      >
        <LogOut className="h-5 w-5 text-muted/90 rotate-180" />
        <span className="font-medium">Sign Out</span>
      </Button>
    </form>
  );
}

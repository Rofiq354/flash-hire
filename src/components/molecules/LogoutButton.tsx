"use client";

import { Button } from "../atoms/Button";

export function LogoutButton({ onLogout }: { onLogout: () => void }) {
  return (
    <form action={onLogout}>
      <Button
        type="submit"
        className="border border-red-200 text-red-600 hover:bg-red-50 rounded-md px-4 py-2"
      >
        Sign Out
      </Button>
    </form>
  );
}

"use client";

import { signInWithGoogle } from "@/features/auth/auth.oauth";
import type { AuthMode } from "@/features/auth/auth.types";
import { useState } from "react";
import { GoogleIcon } from "@/components/atoms/icons/GoogleIcon";
import { Loader2 } from "lucide-react";

interface Props {
  mode: AuthMode;
}

export default function GoogleAuthButton({ mode }: Props) {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleClick = async () => {
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle(mode);
    } catch (error) {
      console.error("Google auth failed:", error);
      setIsGoogleLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isGoogleLoading}
      type="button"
      className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 py-3 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100"
    >
      {isGoogleLoading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
          <span>Connecting to Google...</span>
        </>
      ) : (
        <>
          <GoogleIcon className="h-5 w-5" />
          <span>
            {mode === "login" ? "Sign in with Google" : "Sign up with Google"}
          </span>
        </>
      )}
    </button>
  );
}

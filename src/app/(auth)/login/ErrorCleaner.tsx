// src/app/(auth)/login/ErrorCleaner.tsx
"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export function ErrorCleaner() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (window.location.search.includes("error=")) {
      router.replace(pathname);
    }
  }, [router, pathname]);

  return null;
}

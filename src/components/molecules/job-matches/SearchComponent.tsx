"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, Command, Loader2 } from "lucide-react";
import { Button } from "@/components/atoms/Button";

export default function SearchComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();

  const toggleModal = useCallback(() => setIsOpen((prev) => !prev), []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  // Shortcut CMD+K atau CTRL+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (query.trim()) {
        params.set("q", query.trim());
      } else {
        params.delete("q");
      }

      startTransition(() => {
        router.push(`?${params.toString()}`, { scroll: false });
      });
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query, router, searchParams, isOpen]);

  return (
    <>
      <Button
        variant="outline"
        onClick={toggleModal}
        className="h-11 px-5 text-sm gap-3 rounded-xl border-border-custom bg-card shadow-sm hover:bg-muted/5 transition-all font-semibold text-foreground"
      >
        <Search className="h-4 w-4 text-muted" />
        Refine Search
        <kbd className="hidden md:inline-flex h-6 items-center gap-1 rounded-md border border-border-custom bg-muted/10 px-2 font-mono text-[10px] font-bold text-muted shadow-sm">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      {/* Manual Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-start justify-center pt-[12vh] px-4 sm:px-0">
          <div
            className="fixed inset-0 bg-background/60 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative w-full max-w-xl bg-card rounded-2xl shadow-2xl border border-border-custom overflow-hidden animate-in zoom-in-95 slide-in-from-top-4 duration-200">
            <form
              onSubmit={handleSearch}
              className="flex items-center p-5 gap-3"
            >
              {/* Ikon Search mengikuti warna primary */}
              <Search className="h-5 w-5 text-primary shrink-0" />

              <input
                autoFocus
                type="text"
                placeholder="Job title, company, or keywords..."
                className="flex-1 text-base outline-none text-foreground placeholder:text-muted/50 bg-transparent"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />

              {/* AREA LOADING & CLEAR */}
              <div className="flex items-center gap-2 shrink-0 min-w-8 justify-end">
                {isPending ? (
                  <Loader2 className="h-5 w-5 text-primary animate-spin" />
                ) : (
                  query && (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      className="p-1 hover:bg-muted/10 rounded-full text-muted transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )
                )}
              </div>
            </form>

            {/* Footer Modal */}
            <div className="px-5 py-3 bg-muted/5 border-t border-border-custom flex justify-between items-center">
              <p className="text-[11px] font-bold text-muted uppercase tracking-wider">
                {isPending ? (
                  <span className="text-primary animate-pulse">
                    Searching jobs...
                  </span>
                ) : (
                  <>Searching as you type...</>
                )}
              </p>
              <kbd className="h-5 flex items-center px-1.5 rounded border border-border-custom bg-card text-[9px] font-bold text-muted shadow-sm">
                ESC
              </kbd>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

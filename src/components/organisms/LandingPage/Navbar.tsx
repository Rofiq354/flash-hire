// src/components/organisms/Navbar.tsx
"use client";

import { Logo } from "@/components/atoms/Logo";
import { LinkButton } from "@/components/atoms/Button";
import { useState } from "react";
import { LayoutDashboard, LogIn, Menu, Sparkles, X } from "lucide-react";

interface NavbarProps {
  user?: any;
}

export const Navbar = ({ user }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4 md:p-6">
      <nav className="relative flex items-center justify-between w-full max-w-7xl px-6 py-3 md:px-8 md:py-4 bg-white/70 backdrop-blur-xl border border-white/20 shadow-sm rounded-2xl md:rounded-3xl">
        {/* Sisi Kiri: Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <Logo />
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#how-it-works"
            className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
          >
            How it Works
          </a>
          <div className="w-px h-6 bg-slate-200" />

          <div className="flex items-center gap-2">
            {user ? (
              <LinkButton href="/dashboard" showLoadingOnClick>
                <LayoutDashboard size={16} className="mr-2" /> Go to Dashboard
              </LinkButton>
            ) : (
              <>
                <LinkButton href="/login" variant="ghost" showLoadingOnClick>
                  Login
                </LinkButton>
                <LinkButton
                  href="/register"
                  variant="primary"
                  showLoadingOnClick
                >
                  Get Started
                </LinkButton>
              </>
            )}
          </div>
        </div>

        {/* Mobile Toggle Button */}
        <button
          className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu Overlay */}
        {isOpen && (
          <div className="absolute top-[calc(100%+12px)] left-0 right-0 bg-white border border-slate-100 shadow-xl rounded-2xl p-6 flex flex-col gap-6 animate-in slide-in-from-top-2 md:hidden">
            <div className="flex flex-col gap-4">
              <a
                href="#how-it-works"
                onClick={() => setIsOpen(false)}
                className="text-base font-semibold text-slate-600 hover:text-indigo-600 px-2"
              >
                How it Works
              </a>
            </div>

            <hr className="border-slate-100" />

            <div className="flex flex-col gap-3">
              {user ? (
                <LinkButton href="/dashboard" size="md" showLoadingOnClick>
                  <LayoutDashboard size={18} className="mr-2" /> Dashboard
                </LinkButton>
              ) : (
                <>
                  <LinkButton
                    href="/login"
                    variant="ghost"
                    size="md"
                    showLoadingOnClick
                  >
                    <LogIn size={18} className="mr-2" /> Login
                  </LinkButton>
                  <LinkButton
                    href="/register"
                    variant="primary"
                    size="md"
                    showLoadingOnClick
                  >
                    <Sparkles size={18} className="mr-2" /> Get Started
                  </LinkButton>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

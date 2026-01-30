// src/components/organisms/Navbar.tsx
import { Logo } from "@/components/atoms/Logo";
import { Button } from "@/components/atoms/Button";

export const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center p-6">
      <nav className="flex items-center justify-between w-full max-w-7xl px-8 py-4 bg-white/70 backdrop-blur-xl border border-white/20 shadow-sm rounded-2xl">
        {/* Sisi Kiri: Logo */}
        <div className="flex items-center gap-3">
          <Logo />
          <span className="text-xl font-bold text-slate-900 tracking-tight">
            Flash Hire
          </span>
        </div>

        <div className="flex items-center gap-8">
          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <a
              href="#features"
              className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition"
            >
              How it Works
            </a>
          </div>

          <div className="hidden md:block w-px h-6 bg-slate-200" />

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="hidden sm:flex px-5 py-2 text-sm text-slate-700"
            >
              Login
            </Button>
            <Button
              variant="primary"
              className="px-6 py-2.5 bg-indigo-600 text-white text-sm rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
};

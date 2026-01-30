// src/components/organisms/Hero.tsx
import { Button } from "@/components/atoms/Button";

export const Hero = () => {
  return (
    <section className="px-6 sm:px-10 pt-40 md:pt-48 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
      {/* Left Content */}
      <div className="space-y-6">
        {/* Headline pakai warna primary lo */}
        <h1 className="text-5xl md:text-6xl lg:text-[72px] font-black text-primary leading-[1.1] tracking-tight">
          Find jobs that match your skills.
        </h1>

        {/* Deskripsi pakai warna muted */}
        <p className="text-lg md:text-xl text-muted leading-relaxed max-w-xl">
          Our AI-powered engine maps your professional DNA to thousands of open
          roles in seconds. Stop searching, start matching.
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-4">
          <Button
            variant="primary"
            className="px-10 py-4 text-lg rounded-2xl w-full sm:w-auto"
          >
            Get Started Now
          </Button>

          {/* Badge pakai warna primary yang transparan (opacity 10%) */}
          <div className="flex items-center gap-2 px-6 py-4 bg-primary/10 rounded-2xl border border-primary/20">
            <div className="text-primary">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            </div>
            <span className="text-sm font-bold text-primary">
              10,000+ Matching Daily
            </span>
          </div>
        </div>
      </div>

      {/* Right Content (Visual) */}
      <div className="relative flex justify-center items-center">
        {/* Container Visual pakai background primary super tipis atau bg-background */}
        <div className="relative w-full aspect-square max-w-[500px] bg-primary/5 rounded-[40px] flex items-center justify-center overflow-hidden border border-primary/10">
          {/* Lingkaran Putus-putus pakai border primary */}
          <div className="absolute w-[80%] h-[80%] border-2 border-dashed border-primary/20 rounded-full animate-[spin_30s_linear_infinite]" />

          {/* Icon Kepala AI di Tengah */}
          <div className="relative z-10 text-primary/40">
            <svg
              width="180"
              height="180"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5z" />
              <circle cx="12" cy="12" r="2.5" />
            </svg>
          </div>

          {/* Floating Badges */}
          <div className="absolute top-16 right-16 bg-card p-4 rounded-xl shadow-lg border border-border-custom">
            <span className="text-2xl">🤖</span>
          </div>
          <div className="absolute bottom-16 left-16 bg-card p-4 rounded-xl shadow-lg border border-border-custom">
            <span className="text-2xl text-primary">⚡</span>
          </div>
        </div>
      </div>
    </section>
  );
};

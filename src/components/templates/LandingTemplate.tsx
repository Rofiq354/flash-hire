// src/components/templates/LandingTemplate.tsx

import { getCurrentUser } from "@/services/auth/user.service";
import { Hero } from "../organisms/LandingPage/HeroSection";
import { HowItWorks } from "../organisms/LandingPage/HowItsWork";
import { Navbar } from "../organisms/LandingPage/Navbar";
import { UploadSection } from "../organisms/LandingPage/UploadSection";

export const LandingTemplate = async () => {
  const user = await getCurrentUser();
  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />
      <main>
        <Hero />
        <UploadSection />
        <HowItWorks />
      </main>
      <footer className="py-12 border-t border-border-custom text-center text-muted text-sm">
        © 2024 Flash Hire AI. All rights reserved.
      </footer>
    </div>
  );
};

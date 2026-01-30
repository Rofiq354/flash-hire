// src/components/organisms/LoginInfo.tsx
export const LoginInfo = () => (
  <>
    <div className="text-2xl font-bold italic">☁️ Flash Hire</div>
    <div className="space-y-6">
      <div className="h-48 w-48 bg-white/20 rounded-full blur-2xl absolute -top-10 -left-10" />
      <h2 className="text-4xl font-extrabold leading-tight">
        Analyze your CV <br /> with AI precision.
      </h2>
      <p className="text-white/80">
        Enter your credentials to continue your career journey.
      </p>
    </div>
    <div className="bg-white/10 p-4 rounded-2xl">
      <p className="text-sm">"The fastest way to get hired in 2026."</p>
    </div>
  </>
);

// src/components/organisms/RegisterInfo.tsx
export const RegisterInfo = () => (
  <>
    <div className="text-2xl font-bold italic">☁️ Flash Hire</div>
    <div className="space-y-8">
      <div className="relative mx-auto h-64 w-64 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-3xl">
        {/* Gambar atau Icon berbeda untuk Register */}
        <span className="text-6xl">🚀</span>
      </div>
      <div className="text-center">
        <h2 className="text-3xl font-bold">Join the Future</h2>
        <p className="text-white/70 mt-2">
          Get matched with top-tier tech companies instantly.
        </p>
      </div>
    </div>
    <p className="text-sm text-white/50 text-center">Trusted by 10k+ users.</p>
  </>
);

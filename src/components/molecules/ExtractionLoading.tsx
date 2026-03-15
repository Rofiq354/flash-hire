// src/components/molecules/ExtractionLoading.tsx
export const ExtractionLoading = () => (
  <div className="flex flex-col items-center justify-center p-20 space-y-6">
    <div className="relative h-24 w-24">
      {/* Ring Luar - Efek Glow */}
      <div className="absolute inset-0 border-4 border-primary/40 rounded-full scale-110 animate-pulse"></div>

      {/* Background Ring */}
      <div className="absolute inset-0 border-4 border-border-custom rounded-full"></div>

      {/* Spinning Ring - Gunakan warna indigo-600 (Primary) */}
      <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-primary"></div>

      {/* Center Label */}
      <div className="absolute inset-0 flex items-center justify-center font-black text-primary text-sm tracking-tighter">
        GEMINI
      </div>
    </div>

    <div className="text-center space-y-2">
      <h3 className="font-bold text-foreground text-xl tracking-tight">
        Analyzing your profile...
      </h3>
      <p className="text-muted text-sm max-w-55 mx-auto leading-relaxed">
        Gemini 2.5 Flash is extracting{" "}
        <span className="text-primary font-medium">skills & experience</span>
      </p>
    </div>
  </div>
);

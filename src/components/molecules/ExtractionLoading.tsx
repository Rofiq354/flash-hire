// src/components/molecules/ExtractionLoading.tsx
export const ExtractionLoading = () => (
  <div className="flex flex-col items-center justify-center p-20 space-y-6">
    <div className="relative h-24 w-24">
      {/* Ring Luar - Efek Glow */}
      <div className="absolute inset-0 border-4 border-indigo-500/10 rounded-full scale-110 animate-pulse"></div>

      {/* Background Ring */}
      <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>

      {/* Spinning Ring - Gunakan warna indigo-600 (Primary) */}
      <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin shadow-indigo-500"></div>

      {/* Center Label */}
      <div className="absolute inset-0 flex items-center justify-center font-black text-indigo-600 text-sm tracking-tighter">
        GEMINI
      </div>
    </div>

    <div className="text-center space-y-2">
      <h3 className="font-bold text-slate-900 text-xl tracking-tight">
        Analyzing your profile...
      </h3>
      <p className="text-slate-500 text-sm max-w-55 mx-auto leading-relaxed">
        Gemini 2.5 Flash is extracting{" "}
        <span className="text-indigo-600 font-medium">skills & experience</span>
      </p>
    </div>
  </div>
);

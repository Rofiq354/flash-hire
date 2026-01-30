// src/components/templates/AuthTemplate.tsx
interface AuthTemplateProps {
  formSection: React.ReactNode;
  infoSection: React.ReactNode;
  reverse?: boolean; // Jika true, form di kanan. Jika false, form di kiri.
}

export const AuthTemplate = ({
  formSection,
  infoSection,
  reverse = false,
}: AuthTemplateProps) => (
  <div
    className={`flex min-h-screen ${reverse ? "flex-row" : "flex-row-reverse"}`}
  >
    {/* Section Form */}
    <div className="flex w-full items-center justify-center bg-white p-8 lg:w-1/2">
      <div className="w-full max-w-md">{formSection}</div>
    </div>

    {/* Section Info/Gambar */}
    <div className="hidden w-1/2 flex-col justify-between bg-primary p-12 text-white lg:flex">
      {infoSection}
    </div>
  </div>
);

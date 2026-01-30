// src/components/molecules/AuthAlert.tsx
export const AuthAlert = ({
  error,
  message,
}: {
  error?: string;
  message?: string;
}) => {
  if (!error && !message) return null;
  const isError = !!error;

  return (
    <div
      className={`p-4 rounded-xl text-sm font-medium border ${
        isError
          ? "bg-red-50 border-red-100 text-red-600"
          : "bg-emerald-50 border-emerald-100 text-emerald-600"
      }`}
    >
      {isError ? `⚠️ ${error}` : `✨ ${message}`}
    </div>
  );
};

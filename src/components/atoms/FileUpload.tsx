// src/components/atoms/FileUpload.tsx

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
}

export const FileUpload = ({
  onFileSelect,
  accept = ".pdf",
}: FileUploadProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  return (
    <div className="relative group border-2 border-dashed border-border-custom rounded-3xl p-10 hover:border-primary transition-all bg-primary/5 text-center">
      <input
        type="file"
        accept={accept}
        onChange={handleChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <div className="space-y-2">
        <div className="text-4xl">📄</div>
        <p className="text-sm font-semibold text-muted">
          Click or drag your CV here
        </p>
        <p className="text-xs text-muted/80">Support PDF only (Max 5MB)</p>
      </div>
    </div>
  );
};

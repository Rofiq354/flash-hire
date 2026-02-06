// src/components/molecules/CvItem.tsx
import { Eye, Sparkles, Trash2, FileText } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { format } from "date-fns";

export const CvItem = ({
  cv,
  onDelete,
}: {
  cv: any;
  onDelete: (id: string) => void;
}) => {
  const handleView = () => {
    if (cv.file_url) {
      window.open(cv.file_url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start md:items-center rounded-2xl border-2 border-primary/20 bg-primary/5 p-4 transition-all hover:bg-primary/8">
      <div className="flex items-center gap-4 w-full">
        <div className="rounded-xl bg-white p-3 shadow-sm border border-primary/10 shrink-0">
          <FileText size={20} className="text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-sm truncate max-w-50 md:max-w-50">
            {cv.file_name || "Untitled CV"}
          </h3>
          <p className="text-[11px] text-muted">
            Uploaded {format(new Date(cv.created_at), "MMM dd, yyyy")}
          </p>
        </div>
      </div>

      <div className="flex w-full md:justify-end gap-2 border-t border-primary/5 pt-3 md:border-0 md:pt-0">
        <Button
          variant="outline"
          size="sm"
          className="h-9 text-xs flex-1 md:flex-none"
          onClick={handleView}
        >
          <Eye size={14} className="mr-1" /> View
        </Button>

        <Button
          variant="secondary"
          size="sm"
          className="h-9 text-xs flex-1 md:flex-none"
        >
          <Sparkles size={14} className="mr-1" /> Edit Skills
        </Button>

        <button
          onClick={() => onDelete(cv.id)}
          className="p-2 text-red-400 hover:text-red-600 transition-colors shrink-0"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

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
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between rounded-2xl border-2 border-primary/20 bg-primary/5 p-4 transition-all hover:bg-primary/8">
      <div className="flex items-center gap-4">
        <div className="rounded-xl bg-white p-3 shadow-sm border border-primary/10">
          <FileText size={20} className="text-primary" />
        </div>
        <div>
          <h3 className="font-bold text-sm truncate max-w-50">
            {cv.file_name || "Untitled CV"}
          </h3>
          <p className="text-[11px] text-muted">
            Uploaded {format(new Date(cv.created_at), "MMM dd, yyyy")}
          </p>
        </div>
      </div>

      <div className="mt-4 flex w-full md:mt-0 md:w-auto gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-9 text-xs"
          onClick={handleView}
        >
          <Eye size={14} className="mr-1" /> View
        </Button>

        <Button variant="secondary" size="sm" className="h-9 text-xs">
          <Sparkles size={14} className="mr-1" /> Edit Skills
        </Button>

        <button
          onClick={() => onDelete(cv.id)}
          className="p-2 text-red-400 hover:text-red-600 transition-colors ml-1"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

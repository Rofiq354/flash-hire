// src/components/molecules/SubmitButton.tsx
"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/atoms/Button";
import { Loader2 } from "lucide-react";

export const SubmitButton = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className={className}>
      {pending ? (
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Signing in...</span>
        </div>
      ) : (
        children
      )}
    </Button>
  );
};

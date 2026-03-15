// src/components/ui/Input.tsx
import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = ({ label, id, className = "", ...props }: InputProps) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-foreground">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`
          w-full rounded-lg border border-muted/30 bg-input px-4 py-2.5 
          text-sm text-foreground outline-none transition-all 
          placeholder:text-muted
          focus:border-primary focus:ring-2 focus:ring-primary/40
          disabled:cursor-not-allowed disabled:opacity-50
          ${className}
        `}
        {...props}
      />
    </div>
  );
};

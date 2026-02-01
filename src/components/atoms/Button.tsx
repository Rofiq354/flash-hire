"use client"; // Pastikan ada ini karena pake useState

import React, { useState } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "secondary";
  isLoading?: boolean;
  showLoadingOnClick?: boolean; // Tambahin ini buat auto-spinner pas navigasi
}

export const Button = ({
  children,
  variant = "primary",
  isLoading: externalLoading,
  showLoadingOnClick = false,
  className = "",
  onClick,
  ...props
}: ButtonProps) => {
  const [internalLoading, setInternalLoading] = useState(false);
  const isLoading = externalLoading || internalLoading;

  const handlePress = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (showLoadingOnClick) {
      setInternalLoading(true);
    }
    if (onClick) onClick(e);
  };

  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-lg py-3 px-4 font-semibold transition-all duration-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700",
    secondary: "bg-slate-800 text-white hover:bg-slate-900",
    outline: "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
    ghost: "bg-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      onClick={handlePress}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span className="text-sm">Wait a sec...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};
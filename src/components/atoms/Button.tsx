"use client"; // Pastikan ada ini karena pake useState

import Link from "next/link";
import React, { useState } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "secondary";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  showLoadingOnClick?: boolean;
}

interface LinkButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "outline" | "ghost" | "secondary";
  size?: "sm" | "md" | "lg" | "icon";
  className?: string;
  showLoadingOnClick?: boolean;
  onClick?: () => void;
}

export const Button = ({
  children,
  variant = "primary",
  size = "md",
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
    primary:
      "bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700",
    secondary: "bg-slate-800 text-white hover:bg-slate-900",
    outline:
      "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
    ghost:
      "bg-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs rounded-lg",
    md: "px-4 py-2.5 text-sm rounded-xl",
    lg: "px-6 py-3.5 text-base rounded-2xl",
    icon: "p-2 rounded-full",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
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

interface LinkButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "outline" | "ghost" | "secondary";
  className?: string;
  showLoadingOnClick?: boolean;
  onClick?: () => void;
  target?: string; // Tambahkan ini
  rel?: string; // Tambahkan ini
}

export const LinkButton = ({
  href,
  children,
  variant = "primary",
  className = "",
  showLoadingOnClick = false,
  onClick,
  target, // Ambil dari props
  rel, // Ambil dari props
}: LinkButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-lg py-3 px-4 font-semibold transition-all duration-200 active:scale-[0.98]";

  const variants = {
    primary:
      "bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700",
    secondary: "bg-slate-800 text-white hover:bg-slate-900",
    outline:
      "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
    ghost:
      "bg-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100",
  };

  const handleClick = () => {
    if (showLoadingOnClick) {
      setIsLoading(true);
    }
    onClick?.();
    setIsLoading(false);
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      target={target} // Pasang di sini
      rel={rel} // Pasang di sini
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span className="text-sm">Wait a sec...</span>
        </div>
      ) : (
        children
      )}
    </Link>
  );
};

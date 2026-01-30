"use client";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface NavItemProps {
  name: string;
  href: string;
  icon: LucideIcon;
  isActive: boolean;
}

export const NavItem = ({ name, href, icon: Icon, isActive }: NavItemProps) => (
  <Link
    href={href}
    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold transition-all ${
      isActive
        ? "bg-primary/10 text-primary"
        : "text-muted hover:bg-accent hover:text-foreground"
    }`}
  >
    <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
    <span className="text-[15px]">{name}</span>
  </Link>
);

"use client";

import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Handshake,
  Bell,
  Settings,
} from "lucide-react";
import { NavItem } from "@/components/molecules/NavItem";
import { Logo } from "@/components/atoms/Logo";
import { LogoutButton } from "@/components/molecules/LogoutButton";

interface SidebarClientProps {
  onLogout: () => void;
}

const mainMenus = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { name: "My CV", icon: FileText, href: "/my-cv" },
  { name: "Job Matches", icon: Handshake, href: "/job-matches" },
  { name: "Job Alerts", icon: Bell, href: "/job-alerts" },
];

export function SidebarClient({ onLogout }: SidebarClientProps) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 border-r border-border-custom bg-card flex flex-col p-8">
      <div className="mb-12">
        <Logo />
      </div>

      <nav className="flex-1 flex flex-col gap-2">
        {mainMenus.map((menu) => (
          <NavItem key={menu.name} {...menu} isActive={isActive(menu.href)} />
        ))}
      </nav>

      <div className="pt-6 border-t border-border-custom space-y-2">
        <LogoutButton onLogout={onLogout} />

        <NavItem
          name="Settings"
          icon={Settings}
          href="/dashboard/settings"
          isActive={isActive("/dashboard/settings")}
        />
      </div>
    </aside>
  );
}

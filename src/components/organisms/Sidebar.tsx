"use client";
import { usePathname } from "next/navigation";
import { logout } from "@/app/(auth)/actions";
import {
  LayoutDashboard,
  FileText,
  Handshake,
  Bell,
  Settings,
} from "lucide-react";
import { NavItem } from "@/components/molecules/NavItem";
import { Logo } from "@/components/atoms/Logo";
import { Button } from "../atoms/Button";

const mainMenus = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { name: "My CV", icon: FileText, href: "/dashboard/my-cv" },
  { name: "Job Matches", icon: Handshake, href: "/dashboard/matches" },
  { name: "Job Alerts", icon: Bell, href: "/dashboard/alerts" },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 border-r border-border-custom bg-card flex flex-col p-8">
      {/* Logo Section */}
      <div className="mb-12">
        <Logo />
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 flex flex-col gap-2">
        {mainMenus.map((menu) => (
          <NavItem
            key={menu.name}
            {...menu}
            isActive={pathname === menu.href}
          />
        ))}
      </nav>

      {/* Bottom Section (Settings) */}
      <div className="pt-6 border-t border-border-custom">
        {/* Form Logout */}
        <form action={logout}>
          <Button
            type="submit"
            variant="outline"
            className="border-red-200 text-red-600 hover:bg-red-50"
          >
            Sign Out
          </Button>
        </form>
        <NavItem
          name="Settings"
          icon={Settings}
          href="/dashboard/settings"
          isActive={pathname === "/dashboard/settings"}
        />
      </div>
    </aside>
  );
};

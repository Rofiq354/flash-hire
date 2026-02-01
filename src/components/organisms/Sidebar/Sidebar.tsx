import { logout } from "@/app/(auth)/actions";
import { SidebarClient } from "./SidebarClient";

export function Sidebar() {
  return <SidebarClient onLogout={logout} />;
}

// src/components/templates/DashboardTemplate.tsx
import { Sidebar } from "@/components/organisms/Sidebar/Sidebar";
import { Navbar } from "@/components/organisms/Navbar";

export const ApplicationTemplate = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <div className="flex min-h-screen">
    <Sidebar />
    <div className="flex-1 ml-72 flex flex-col">
      {" "}
      {/* ml-72 karena sidebar w-72 */}
      <Navbar />
      <main className="p-8 bg-background flex-1">{children}</main>
    </div>
  </div>
);

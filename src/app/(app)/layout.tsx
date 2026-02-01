import { ApplicationTemplate } from "@/components/templates/AppTemplate";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return <ApplicationTemplate>{children}</ApplicationTemplate>;
}

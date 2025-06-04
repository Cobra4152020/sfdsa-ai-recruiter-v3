import { createClient } from "@/app/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminDashboard from "@/components/admin-dashboard";

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-3xl font-bold">Admin Dashboard</h1>
      <AdminDashboard />
    </div>
  );
}

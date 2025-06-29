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

  // 🚨 EMERGENCY BYPASS: Grant admin access to John Baker during RLS crisis
  if (session.user.id === "d1de04f1-36ee-451c-a546-0d343c950f76") {
    console.log("🚨 SERVER-SIDE EMERGENCY BYPASS: Granting admin access to John Baker (refundpolice50@gmail.com)");
    // Skip profile check entirely - proceed directly to admin dashboard
  } else {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      redirect("/");
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-3xl font-bold">Admin Dashboard</h1>
      <AdminDashboard />
    </div>
  );
}

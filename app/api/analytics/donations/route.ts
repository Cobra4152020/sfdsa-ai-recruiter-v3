import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/app/lib/supabase/server";

export async function GET() {
  const supabase = getServiceSupabase();
  const { data, error } = await supabase
    .from("donations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

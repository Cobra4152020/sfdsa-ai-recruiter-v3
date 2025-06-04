import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  // const requestUrl = new URL(request.url);

  if (token_hash && type) {
    // ... existing code ...
  }
}

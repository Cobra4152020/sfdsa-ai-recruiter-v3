"use client";

import { useState, useEffect } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

export function useSupabase() {
  const [supabase, setSupabase] = useState<SupabaseClient<Database> | null>(
    null,
  );

  useEffect(() => {
    const initSupabase = async () => {
      const { getClientSideSupabase } = require("@/lib/supabase");
      const client = getClientSideSupabase();
      setSupabase(client);
    };
    initSupabase();
  }, []);

  return supabase;
}

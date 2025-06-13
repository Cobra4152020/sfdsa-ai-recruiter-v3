"use client";

import { createContext, useContext, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getClientSideSupabase } from "@/lib/supabase";
import type { Database } from "@/types/supabase";

type SupabaseContextType = SupabaseClient<Database> | null;

const SupabaseContext = createContext<SupabaseContextType>(null);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => getClientSideSupabase());

  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  );
}

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error("useSupabase must be used within a SupabaseProvider");
  }
  return context;
}; 
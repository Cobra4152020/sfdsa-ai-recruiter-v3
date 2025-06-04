"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/user-context";
import { useAuthModal } from "@/context/auth-modal-context";
import { getClientSideSupabase } from "@/lib/supabase";

export default function HomePage() {
  const router = useRouter();
  useAuthModal();
  const { setCurrentUser } = useUser();

  useEffect(() => {
    const supabase = getClientSideSupabase();
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (currentSession?.user) {
        const { user } = currentSession;
        setCurrentUser({
          ...user,
          email: user.email ?? "",
        });
      } else {
        setCurrentUser(null);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        if (currentSession?.user) {
          const { user } = currentSession;
          setCurrentUser({
            ...user,
            email: user.email ?? "",
          });
        } else {
          setCurrentUser(null);
        }
      },
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [setCurrentUser, router]);

  // ... rest of the component
}

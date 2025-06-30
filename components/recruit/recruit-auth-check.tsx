"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getClientSideSupabase } from "@/lib/supabase";

const supabase = getClientSideSupabase();

export function RecruitAuthCheck({ children }: { children: React.ReactNode }) {
  const [isRecruit, setIsRecruit] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    async function checkRecruitStatus() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          if (isMounted) {
            router.push("/login");
          }
          return;
        }

        // Check if user exists in recruit.users table
        const { data: recruitData, error: recruitError } = await supabase
          .from("recruit.users")
          .select("id")
          .eq("id", session.user.id)
          .single();

        if (recruitError || !recruitData) {
          console.error("User not found in recruit.users:", recruitError);
          if (isMounted) {
            router.push("/login");
          }
          return;
        }

        if (isMounted) {
          setIsRecruit(true);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error checking recruit status:", error);
        if (isMounted) {
          router.push("/login");
        }
      }
    }

    checkRecruitStatus();

    return () => {
      isMounted = false;
    };
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return isRecruit ? <>{children}</> : null;
}

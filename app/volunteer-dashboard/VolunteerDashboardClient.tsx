"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VolunteerRecruiterDashboard } from "@/components/volunteer-recruiter-dashboard";
import { RecruiterAnalyticsDashboard } from "@/components/recruiter-analytics-dashboard";
import { ReferralLinkGenerator } from "@/components/referral-link-generator";
import { useRouter } from "next/navigation";
import { logError } from "@/lib/error-monitoring";

export default function VolunteerDashboardClient() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    // Import and call getClientSideSupabase only on the client
    async function checkAuth() {
      const supabase = (await import("@/lib/supabase")).getClientSideSupabase();

      try {
        setIsLoading(true);
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          if (isMounted) {
            router.push("/volunteer-login");
          }
          return;
        }

        // Check if user has volunteer_recruiter role
        const { data: userRoles, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .single();

        if (error || !userRoles || userRoles.role !== "volunteer_recruiter") {
          logError(
            "Role verification failed",
            error instanceof Error
              ? error
              : new Error(error?.message || "No volunteer role found"),
            "VolunteerDashboardClient",
          );
          if (isMounted) {
            router.push("/volunteer-login");
          }
          return;
        }

        const { data: volunteerData, error: volunteerError } = await supabase
          .from("volunteers")
          .select(
            "*", // Adjust columns as needed
          )
          .eq("user_id", session.user.id)
          .single();

        if (volunteerError) {
          console.error("Error fetching volunteer data:", volunteerError);
          setError("Failed to load volunteer information.");
        } else if (volunteerData) {
          setVolunteer(volunteerData);
        } else {
          setVolunteer(null);
        }

        if (isMounted) {
          setIsLoading(false);
        }
      } catch (error) {
        logError(
          "Auth check error",
          error instanceof Error ? error : new Error(String(error)),
          "VolunteerDashboardClient",
        );
        if (isMounted) {
          router.push("/volunteer-login");
        }
      }
    }

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [router]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A3C1F]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="referrals">Referral Links</TabsTrigger>
          <TabsTrigger value="contacts">Contact Recruits</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <VolunteerRecruiterDashboard className="mt-6" />
        </TabsContent>

        <TabsContent value="analytics">
          <RecruiterAnalyticsDashboard />
        </TabsContent>

        <TabsContent value="referrals">
          <ReferralLinkGenerator />
        </TabsContent>

        <TabsContent value="contacts">
          {/* Contact form component would go here */}
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold text-[#0A3C1F] mb-4">
              Contact Potential Recruits
            </h2>
            <p className="text-gray-600 mb-4">
              This section allows you to directly contact potential recruits.
              The feature is coming soon.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

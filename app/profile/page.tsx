"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/user-context";
import { PageWrapper } from "@/components/page-wrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit, 
  Calendar,
  Shield,
  Trophy,
  Star
} from "lucide-react";
import { getClientSideSupabase } from "@/lib/supabase";

export default function ProfilePage() {
  const router = useRouter();
  const { currentUser, isLoggedIn } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [userStats, setUserStats] = useState({
    totalPoints: 0,
    achievements: 0,
    joinDate: null as string | null
  });

  useEffect(() => {
    if (!isLoggedIn && !currentUser) {
      router.push("/?auth=login");
      return;
    }

    const fetchUserProfile = async () => {
      if (!currentUser?.id) return;

      try {
        const supabase = getClientSideSupabase();
        
        // Fetch user profile
        const { data: profile } = await supabase
          .from("users")
          .select("*")
          .eq("id", currentUser.id)
          .single();

        if (profile) {
          setUserProfile(profile);
          
          // Parse name for display
          const nameParts = (profile.name || "").split(" ");
          setUserProfile({
            ...profile,
            first_name: nameParts[0] || "",
            last_name: nameParts.slice(1).join(" ") || ""
          });
        }

        // Fetch user points
        const pointsResponse = await fetch(`/api/user/points?userId=${currentUser.id}`);
        if (pointsResponse.ok) {
          const pointsData = await pointsResponse.json();
          setUserStats({
            totalPoints: pointsData.totalPoints || 0,
            achievements: Math.floor((pointsData.totalPoints || 0) / 50),
            joinDate: profile?.created_at || null
          });
        }

      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [isLoggedIn, currentUser, router]);

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Skeleton className="h-64 w-full" />
              </div>
              <div>
                <Skeleton className="h-48 w-full" />
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (!currentUser) {
    return (
      <PageWrapper>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="mb-4">Please log in to view your profile.</p>
          <Button onClick={() => router.push("/?auth=login")}>Login</Button>
        </div>
      </PageWrapper>
    );
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-[#0A3C1F] dark:text-[#FFD700]">
              Profile
            </h1>
            <Button 
              onClick={() => router.push("/profile/edit")}
              className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main Profile Info */}
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">First Name</label>
                      <p className="text-lg">
                        {userProfile?.first_name || currentUser.user_metadata?.first_name || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Last Name</label>
                      <p className="text-lg">
                        {userProfile?.last_name || currentUser.user_metadata?.last_name || "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500 flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      Email
                    </label>
                    <p className="text-lg">{currentUser.email}</p>
                  </div>

                  {userProfile?.bio && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Bio</label>
                      <p className="text-lg">{userProfile.bio}</p>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-gray-500 flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Member Since
                    </label>
                    <p className="text-lg">{formatDate(userStats.joinDate)}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Application Status</label>
                    <div className="mt-1">
                      <Badge variant={userProfile?.has_applied ? "default" : "secondary"}>
                        {userProfile?.has_applied ? "Application Submitted" : "Not Applied"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Information */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Additional Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Participation Count</label>
                    <p className="text-lg">{userProfile?.participation_count || 0} events</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Last Active</label>
                    <p className="text-lg">{formatDate(userProfile?.last_active_at)}</p>
                  </div>

                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500 mb-2">
                      Complete your profile to unlock all features and earn points!
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => router.push("/profile/edit")}
                    >
                      Complete Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Stats Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Trophy className="h-5 w-5 mr-2" />
                    Your Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#0A3C1F] dark:text-[#FFD700]">
                      {userStats.totalPoints}
                    </div>
                    <p className="text-sm text-gray-500">Total Points</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#0A3C1F] dark:text-[#FFD700]">
                      {userStats.achievements}
                    </div>
                    <p className="text-sm text-gray-500">Achievements</p>
                  </div>

                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#0A3C1F] dark:text-[#FFD700]">
                      {userProfile?.participation_count || 0}
                    </div>
                    <p className="text-sm text-gray-500">Events Attended</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="h-5 w-5 mr-2" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => router.push("/dashboard")}
                  >
                    View Dashboard
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => router.push("/apply")}
                  >
                    Apply Now
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => router.push("/profile/settings")}
                  >
                    Account Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

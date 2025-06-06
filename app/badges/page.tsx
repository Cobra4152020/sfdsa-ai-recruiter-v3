"use client";

import React, { useState, Suspense } from "react";
import { PageWrapper } from "@/components/page-wrapper";
import { BadgeShowcase } from "@/components/badge-showcase";
import { BadgeDisplay } from "@/components/badge-display";
import BadgeCollection from "@/components/badge-collection";
import { useUser } from "@/context/user-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, Trophy, Star, Shield, AlertCircle, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Error boundary component
class BadgePageErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Badges page error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card className="max-w-2xl mx-auto mt-8">
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <AlertCircle className="mr-2 h-5 w-5" />
              Something went wrong
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              There was an error loading the badges page. Please refresh the page to try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#0A3C1F] text-white rounded hover:bg-[#0A3C1F]/90 transition-colors"
            >
              Refresh Page
            </button>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

// Loading component for suspense fallbacks
function LoadingSection() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-64" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center space-y-2">
            <Skeleton className="h-16 w-16 rounded-full" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Badge stats component with error handling
function BadgeStatsSection() {
  try {
    const BadgeStats = React.lazy(() => import("@/components/badges/badge-stats"));
    return (
      <Suspense fallback={<LoadingSection />}>
        <BadgeStats />
      </Suspense>
    );
  } catch (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            Badge statistics are temporarily unavailable.
          </div>
        </CardContent>
      </Card>
    );
  }
}

// Badge leaderboard component with error handling
function BadgeLeaderboardSection() {
  try {
    const BadgeLeaderboard = React.lazy(() => import("@/components/badges/badge-leaderboard").then(module => ({ default: module.BadgeLeaderboard })));
    return (
      <Suspense fallback={<LoadingSection />}>
        <BadgeLeaderboard />
      </Suspense>
    );
  } catch (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            Badge leaderboard is temporarily unavailable.
          </div>
        </CardContent>
      </Card>
    );
  }
}

export default function BadgesPage() {
  const { currentUser, isLoading: userLoading } = useUser();
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <PageWrapper>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <Skeleton className="h-12 w-64 mx-auto mb-4" />
              <Skeleton className="h-6 w-96 mx-auto" />
            </div>
            <LoadingSection />
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <BadgePageErrorBoundary>
      <PageWrapper>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Enhanced header section */}
            <div className="text-center mb-12 mt-8">
              <div className="relative">
                <h1 className="text-5xl md:text-6xl font-bold text-[#0A3C1F] mb-6 relative z-10">
                  Badge Gallery
                </h1>
                {/* Decorative underline */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-[#0A3C1F] via-[#FFD700] to-[#0A3C1F] rounded-full"></div>
              </div>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mt-8">
                Earn badges by completing challenges, participating in events, and
                contributing to the SFDSA community. Track your progress and
                compete with other recruits.
              </p>
            </div>

            {/* Badge Stats Section */}
            <div className="mb-12">
              <BadgeStatsSection />
            </div>

            <Tabs defaultValue="showcase" className="space-y-8">
              <TabsList className="grid grid-cols-2 sm:grid-cols-4 gap-2 h-auto p-2">
                <TabsTrigger value="showcase" className="flex items-center p-3">
                  <Award className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Showcase</span>
                </TabsTrigger>
                <TabsTrigger value="collection" className="flex items-center p-3">
                  <Trophy className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">My Collection</span>
                </TabsTrigger>
                <TabsTrigger value="available" className="flex items-center p-3">
                  <Star className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Available</span>
                </TabsTrigger>
                <TabsTrigger value="leaderboard" className="flex items-center p-3">
                  <Shield className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Leaderboard</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="showcase" className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-[#0A3C1F] mb-4">
                    Badge Showcase
                  </h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Discover all available badges and learn how to earn them.
                  </p>
                </div>
                <Suspense fallback={<LoadingSection />}>
                  <BadgeShowcase />
                </Suspense>
              </TabsContent>

              <TabsContent value="collection" className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-[#0A3C1F] mb-4">
                    My Badge Collection
                  </h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    View your earned badges and track your achievements.
                  </p>
                </div>
                {userLoading ? (
                  <LoadingSection />
                ) : currentUser ? (
                  <Suspense fallback={<LoadingSection />}>
                    <BadgeCollection user={currentUser as any} />
                  </Suspense>
                ) : (
                  <Card className="max-w-md mx-auto">
                    <CardHeader>
                      <CardTitle className="text-center">Sign In Required</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-gray-600 mb-4">
                        Please sign in to view your badge collection and track your achievements.
                      </p>
                      <button
                        onClick={() => {
                          // You can implement sign-in logic here
                          console.log('Sign in clicked');
                        }}
                        className="px-6 py-2 bg-[#0A3C1F] text-white rounded hover:bg-[#0A3C1F]/90 transition-colors"
                      >
                        Sign In
                      </button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="available" className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-[#0A3C1F] mb-4">
                    Available Badges
                  </h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Browse all available badges and see how to earn them.
                  </p>
                </div>
                <Suspense fallback={<LoadingSection />}>
                  <BadgeDisplay />
                </Suspense>
              </TabsContent>

              <TabsContent value="leaderboard" className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-[#0A3C1F] mb-4">
                    Badge Leaderboard
                  </h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    See how you rank among other badge collectors in the community.
                  </p>
                </div>
                <BadgeLeaderboardSection />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </PageWrapper>
    </BadgePageErrorBoundary>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { AdvancedLeaderboard } from "@/components/advanced-leaderboard";
import { ShareToUnlock } from "@/components/share-to-unlock";
import { ReferRecruiter } from "@/components/refer-recruiter";
import TopRecruitsScroll from "@/components/top-recruits-scroll";

// Error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Awards page error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-7xl mx-auto px-4 pt-8 pb-8">
          <div className="text-center mt-8">
            <h1 className="text-4xl font-bold text-[#0A3C1F] mb-4">
              Top Recruit Awards
            </h1>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-800">
                Something went wrong loading the awards page. Please refresh the page to try again.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-[#0A3C1F] text-white rounded hover:bg-[#0A3C1F]/90 transition-colors"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function AwardsClient() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-8">
        <div className="mb-12 text-center mt-8">
          <div className="h-12 bg-gray-200 rounded animate-pulse mb-4"></div>
          <div className="h-6 bg-gray-200 rounded animate-pulse max-w-3xl mx-auto"></div>
        </div>
        <div className="mb-12">
          <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <main className="max-w-7xl mx-auto px-4 pt-8 pb-8">
        <div className="mb-16 text-center mt-12">
          <div className="relative">
            <h1 className="text-5xl md:text-6xl font-bold text-[#0A3C1F] mb-6 relative z-10">
              Top Recruit Awards
            </h1>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-[#0A3C1F] via-[#FFD700] to-[#0A3C1F] rounded-full"></div>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mt-8">
            Recognize outstanding achievement in our recruitment program. Like,
            share, and refer to earn points and unlock exclusive badges.
          </p>
        </div>

        <div className="mb-16">
          <TopRecruitsScroll />
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-[#0A3C1F] text-center mb-8">
            Unlock Your Achievements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ShareToUnlock
              badgeType="chat-participation"
              badgeName="Community Advocate"
              badgeDescription="Unlock this badge by sharing the SFDSA recruitment program with your network"
              requiredShares={2}
            />
            <ReferRecruiter />
          </div>
        </div>

        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0A3C1F] mb-4">
              Live Community Leaderboard
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
              See how you rank among fellow recruits and celebrate the achievements of our top performers. This leaderboard updates in real-time as users participate!
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-3xl mx-auto">
              <div className="flex items-center justify-center mb-2">
                <div className="flex items-center space-x-4 text-sm text-blue-800">
                  <span className="flex items-center">
                    <span className="w-3 h-3 bg-green-400 rounded-full mr-2"></span>
                    Real Users
                  </span>
                  <span className="flex items-center">
                    <span className="w-3 h-3 bg-blue-400 rounded-full mr-2"></span>
                    Example Users
                  </span>
                </div>
              </div>
              <p className="text-sm text-blue-700">
                Earn points by chatting with Sgt. Ken, sharing content, participating in challenges, and more. New users are automatically added to the leaderboard!
              </p>
            </div>
          </div>
          <AdvancedLeaderboard useMockData={false} />
        </div>
      </main>
    </ErrorBoundary>
  );
}

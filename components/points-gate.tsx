"use client";

import type { ReactNode } from "react";
import { useUser } from "@/context/user-context";
import { AuthTriggerButton } from "@/components/auth-trigger-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Star, Trophy } from "lucide-react";
import Image from "next/image";
import { useUserPoints } from "@/hooks/use-user-points";

interface PointsGateProps {
  children: ReactNode;
  requiredPoints: number;
  fallbackMessage?: string;
  pageName?: string;
  pageDescription?: string;
  imageUrl?: string;
}

export function PointsGate({
  children,
  requiredPoints,
  fallbackMessage = "You need more points to access this content",
  pageName,
  pageDescription,
  imageUrl,
}: PointsGateProps) {
  const { currentUser, isLoading: isUserLoading } = useUser();
  const { points: userPoints, isLoading: isPointsLoading } = useUserPoints(currentUser?.id);

  const isLoading = isUserLoading || isPointsLoading;
  
  if (isLoading) {
    // Loading state
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-96 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-lg border-[#0A3C1F]/20">
            <CardHeader className="text-center bg-gradient-to-r from-[#0A3C1F] to-[#0A3C1F]/80 text-white">
              <div className="flex justify-center mb-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <Lock className="h-8 w-8" />
                </div>
              </div>
              <CardTitle className="text-2xl">
                {pageName ? `Access Required: ${pageName}` : "Access Required"}
              </CardTitle>
              {pageDescription && (
                <p className="text-white/90 mt-2">{pageDescription}</p>
              )}
            </CardHeader>
            <CardContent className="p-8">
              {imageUrl && (
                <div className="relative w-full h-48 rounded-lg overflow-hidden mb-6">
                  <Image
                    src={imageUrl}
                    alt={pageName || "Protected content preview"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Badge className="bg-white/90 text-[#0A3C1F] px-4 py-2">
                      <Star className="h-4 w-4 mr-2" />
                      {requiredPoints} Points Required
                    </Badge>
                  </div>
                </div>
              )}
              
              <div className="text-center space-y-4">
                <p className="text-lg font-medium text-gray-700">
                  {fallbackMessage}
                </p>
                <div className="bg-[#0A3C1F]/5 border border-[#0A3C1F]/20 rounded-lg p-4">
                  <div className="flex items-center justify-center mb-2">
                    <Trophy className="h-5 w-5 text-[#0A3C1F] mr-2" />
                    <span className="font-medium text-[#0A3C1F]">
                      Sign up to start earning points and unlock exclusive content!
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Join thousands of recruits and start your journey with the SF Deputy Sheriff's Office.
                  </p>
                </div>
                <AuthTriggerButton
                  modalType="signup"
                  userType="recruit"
                  className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white px-8 py-3 text-lg"
                  size="lg"
                >
                  Sign Up to Access
                </AuthTriggerButton>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (userPoints < requiredPoints) {
    const pointsNeeded = requiredPoints - userPoints;
    
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-lg border-amber-200">
            <CardHeader className="text-center bg-gradient-to-r from-amber-500 to-amber-600 text-white">
              <div className="flex justify-center mb-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <Lock className="h-8 w-8" />
                </div>
              </div>
              <CardTitle className="text-2xl">
                {pageName ? `More Points Needed: ${pageName}` : "More Points Needed"}
              </CardTitle>
              {pageDescription && (
                <p className="text-white/90 mt-2">{pageDescription}</p>
              )}
            </CardHeader>
            <CardContent className="p-8">
              {imageUrl && (
                <div className="relative w-full h-48 rounded-lg overflow-hidden mb-6">
                  <Image
                    src={imageUrl}
                    alt={pageName || "Protected content preview"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Badge className="bg-white/90 text-amber-600 px-4 py-2">
                      <Star className="h-4 w-4 mr-2" />
                      {requiredPoints} Points Required
                    </Badge>
                  </div>
                </div>
              )}
              
              <div className="text-center space-y-6">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                  <div className="flex items-center justify-center space-x-8 text-center">
                    <div>
                      <div className="text-2xl font-bold text-amber-600">{userPoints}</div>
                      <div className="text-sm text-amber-700">Your Points</div>
                    </div>
                    <div className="text-amber-400">→</div>
                    <div>
                      <div className="text-2xl font-bold text-[#0A3C1F]">{requiredPoints}</div>
                      <div className="text-sm text-gray-600">Required Points</div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-amber-400 to-amber-500 h-full transition-all duration-500"
                        style={{ width: `${Math.min((userPoints / requiredPoints) * 100, 100)}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      You need <strong>{pointsNeeded} more points</strong> to unlock this content
                    </p>
                  </div>
                </div>

                <div className="bg-[#0A3C1F]/5 border border-[#0A3C1F]/20 rounded-lg p-4">
                  <h3 className="font-semibold text-[#0A3C1F] mb-2">Earn Points By:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="bg-blue-100 p-2 rounded-full w-10 h-10 mx-auto mb-2 flex items-center justify-center">
                        💬
                      </div>
                      <p><strong>Chat with Sgt. Ken</strong><br/>5-7 points per conversation</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-green-100 p-2 rounded-full w-10 h-10 mx-auto mb-2 flex items-center justify-center">
                        🎯
                      </div>
                      <p><strong>Play Games</strong><br/>10-50 points per game</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-purple-100 p-2 rounded-full w-10 h-10 mx-auto mb-2 flex items-center justify-center">
                        📝
                      </div>
                      <p><strong>Complete Forms</strong><br/>10+ points per submission</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

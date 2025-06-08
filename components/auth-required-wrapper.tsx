"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/context/user-context";
import { useAuthModal } from "@/context/auth-modal-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Lock, 
  Trophy, 
  Star, 
  MessageSquare, 
  Gamepad2, 
  FileText, 
  UserPlus,
  CheckCircle,
  Clock
} from "lucide-react";

interface AuthRequiredWrapperProps {
  children: React.ReactNode;
  requiredFeature: "deputy_application" | "sgt_ken_chat" | "games" | "practice_tests" | "locked_content";
  minimumPoints?: number;
  title?: string;
  description?: string;
  className?: string;
  heroImage?: string;
}

export function AuthRequiredWrapper({
  children,
  requiredFeature,
  minimumPoints = 0,
  title,
  description,
  className,
  heroImage
}: AuthRequiredWrapperProps) {
  const { currentUser, isLoading } = useUser();
  const { openModal } = useAuthModal();
  const [userPoints, setUserPoints] = useState(0);
  const [isLoadingPoints, setIsLoadingPoints] = useState(false);

  const featureConfig = {
    deputy_application: {
      title: "Deputy Sheriff Application",
      description: "Submit your application to become a San Francisco Deputy Sheriff",
      icon: <FileText className="h-6 w-6 text-blue-600" />,
      pointsRequired: 0,
      color: "bg-blue-50 border-blue-200"
    },
    sgt_ken_chat: {
      title: "Ask Sgt. Ken AI",
      description: "Chat with our AI recruitment assistant for guidance and answers",
      icon: <MessageSquare className="h-6 w-6 text-green-600" />,
      pointsRequired: 0,
      color: "bg-green-50 border-green-200"
    },
    games: {
      title: "Training Games",
      description: "Access all recruitment training games and challenges",
      icon: <Gamepad2 className="h-6 w-6 text-purple-600" />,
      pointsRequired: 0,
      color: "bg-purple-50 border-purple-200"
    },
    practice_tests: {
      title: "Practice Tests",
      description: "Take practice tests to prepare for your deputy sheriff exam",
      icon: <FileText className="h-6 w-6 text-orange-600" />,
      pointsRequired: 0,
      color: "bg-orange-50 border-orange-200"
    },
    locked_content: {
      title: "Premium Content",
      description: "Access exclusive recruitment resources and materials",
      icon: <Lock className="h-6 w-6 text-gray-600" />,
      pointsRequired: minimumPoints,
      color: "bg-gray-50 border-gray-200"
    }
  };

  const config = featureConfig[requiredFeature];
  const actualPointsRequired = minimumPoints || config.pointsRequired;

  // Fetch user points if authenticated
  useEffect(() => {
    const fetchUserPoints = async () => {
      if (!currentUser) return;
      
      setIsLoadingPoints(true);
      try {
        const response = await fetch(`/api/user/points?userId=${currentUser.id}`);
        if (response.ok) {
          const data = await response.json();
          setUserPoints(data.totalPoints || 0);
        }
      } catch (error) {
        console.error("Error fetching user points:", error);
      } finally {
        setIsLoadingPoints(false);
      }
    };

    fetchUserPoints();
  }, [currentUser]);

  // Loading state
  if (isLoading) {
    return (
      <div className={`min-h-[400px] flex items-center justify-center ${className}`}>
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A3C1F] mx-auto"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - show sign up prompt
  if (!currentUser) {
    return (
      <div className={`${className}`}>
        <Card className={`${config.color} max-w-2xl mx-auto overflow-hidden`}>
          {heroImage && (
            <div className="relative h-48 w-full overflow-hidden">
              <img 
                src={heroImage} 
                alt={title || config.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
                <CardTitle className="text-3xl font-bold text-white mb-2">
                  {title || config.title}
                </CardTitle>
                <p className="text-gray-100 text-lg">
                  {description || config.description}
                </p>
              </div>
            </div>
          )}
          <CardHeader className={`text-center ${heroImage ? 'pt-6 pb-4' : 'pb-4'}`}>
            {!heroImage && (
              <>
                <div className="mx-auto mb-4 p-4 bg-white rounded-full shadow-sm">
                  {config.icon}
                </div>
                <CardTitle className="text-2xl">
                  {title || config.title}
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  {description || config.description}
                </p>
              </>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <UserPlus className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-yellow-800">Account Required</h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    Please sign up or sign in to access this feature. It's free and takes less than a minute!
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-medium text-gray-800 mb-2">✨ Sign Up Benefits:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Get 50 points instantly</li>
                  <li>• Access all training games</li>
                  <li>• Chat with Sgt. Ken AI</li>
                  <li>• Submit your application</li>
                  <li>• Track your progress</li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-medium text-gray-800 mb-2">🏆 Point System:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Registration: +50 points</li>
                  <li>• Application: +500 points</li>
                  <li>• Social sharing: +25 points</li>
                  <li>• Chat interactions: +5 points</li>
                  <li>• Practice tests: +20 points</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={() => openModal("signup", "recruit", "")}
                className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white px-8 py-3"
                size="lg"
              >
                <Trophy className="h-5 w-5 mr-2" />
                Sign Up & Get 50 Points
              </Button>
              <Button 
                onClick={() => openModal("signin", "recruit", "")}
                variant="outline"
                className="border-[#0A3C1F] text-[#0A3C1F] hover:bg-[#0A3C1F]/5 px-8 py-3"
                size="lg"
              >
                Already have an account? Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Authenticated but insufficient points
  if (actualPointsRequired > 0 && userPoints < actualPointsRequired) {
    const progress = (userPoints / actualPointsRequired) * 100;
    const pointsNeeded = actualPointsRequired - userPoints;

    return (
      <div className={`${className}`}>
        <Card className={`${config.color} max-w-2xl mx-auto overflow-hidden`}>
          {heroImage && (
            <div className="relative h-48 w-full overflow-hidden">
              <img 
                src={heroImage} 
                alt={title || config.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
                <CardTitle className="text-3xl font-bold text-white mb-2">
                  {title || `${config.title} Locked`}
                </CardTitle>
                <p className="text-gray-100 text-lg">
                  You need more points to access this feature
                </p>
              </div>
            </div>
          )}
          <CardHeader className={`text-center ${heroImage ? 'pt-6 pb-4' : 'pb-4'}`}>
            {!heroImage && (
              <>
                <div className="mx-auto mb-4 p-4 bg-white rounded-full shadow-sm">
                  <Lock className="h-6 w-6 text-gray-600" />
                </div>
                <CardTitle className="text-2xl">
                  {title || `${config.title} Locked`}
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  You need more points to access this feature
                </p>
              </>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Your Progress</span>
                <Badge variant="outline">
                  {userPoints} / {actualPointsRequired} points
                </Badge>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-gray-600 text-center">
                You need {pointsNeeded} more points to unlock this feature
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-800 mb-2">💡 How to earn points:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Submit your deputy application (+500 points)</li>
                <li>• Share on social media (+25 points)</li>
                <li>• Complete practice tests (+20 points)</li>
                <li>• Chat with Sgt. Ken (+5 points per conversation)</li>
                <li>• Play training games (+10 points per game)</li>
              </ul>
            </div>

            <div className="text-center">
              <Button 
                onClick={() => window.location.href = "/apply"}
                className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90"
              >
                Apply Now for 500 Points
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // User has access - render the protected content
  return (
    <div className={className}>
      {/* Optional success badge for unlocked content */}
      {actualPointsRequired > 0 && (
        <div className="mb-4 text-center">
          <Badge className="bg-green-600 text-white">
            <CheckCircle className="h-3 w-3 mr-1" />
            Unlocked with {userPoints} points
          </Badge>
        </div>
      )}
      {children}
    </div>
  );
} 
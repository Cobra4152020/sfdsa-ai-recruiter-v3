"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, Zap, CheckCircle, Clock, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function BadgeDemoPage() {
  const [isAwarding, setIsAwarding] = useState(false);
  const [awardedBadges, setAwardedBadges] = useState<string[]>([]);
  const { toast } = useToast();

  const availableBadges = [
    { type: 'first-response', name: 'Welcome Warrior', description: 'First response badge', points: 10 },
    { type: 'chat-participation', name: 'Sgt. Ken\'s Buddy', description: 'Chat engagement badge', points: 25 },
    { type: 'application-started', name: 'Journey Beginner', description: 'Started application process', points: 50 },
    { type: 'frequent-user', name: 'Platform Explorer', description: 'Regular platform usage', points: 75 },
    { type: 'resource-downloader', name: 'Knowledge Seeker', description: 'Downloaded resources', points: 30 },
  ];

  const awardBadge = async (badgeType: string, badgeName: string) => {
    setIsAwarding(true);
    try {
      const response = await fetch('/api/test-badge-award', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'demo-user',
          badgeType: badgeType,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setAwardedBadges(prev => [...prev, badgeType]);
        toast({
          title: "🏅 Badge Awarded!",
          description: `You've earned the "${badgeName}" badge!`,
          variant: "default",
        });
      } else {
        toast({
          title: "Badge Award Failed",
          description: result.message || "Could not award badge",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error awarding badge:', error);
      toast({
        title: "Error",
        description: "Failed to award badge due to system error",
        variant: "destructive",
      });
    } finally {
      setIsAwarding(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-full">
              <Award className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Live Badge System Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the real-time badge awarding system! Click the buttons below to award badges and see the live system in action.
          </p>
        </div>

        {/* System Status */}
        <Card className="mb-8 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center text-green-700">
              <CheckCircle className="mr-2 h-5 w-5" />
              System Status: LIVE
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center">
                <Zap className="h-4 w-4 text-yellow-500 mr-2" />
                <span>Real-time badge awarding</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 text-blue-500 mr-2" />
                <span>User progress tracking</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-green-500 mr-2" />
                <span>Instant updates</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Badge Demo Section */}
        <Card>
          <CardHeader>
            <CardTitle>Award Demo Badges</CardTitle>
            <p className="text-gray-600">
              Click any badge below to award it to the demo user. This demonstrates the live badge system functionality.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableBadges.map((badge) => (
                <div
                  key={badge.type}
                  className={`p-6 border-2 rounded-lg transition-all ${
                    awardedBadges.includes(badge.type)
                      ? 'border-green-300 bg-green-50'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <div className="text-center mb-4">
                    <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                      awardedBadges.includes(badge.type)
                        ? 'bg-green-500'
                        : 'bg-blue-500'
                    }`}>
                      <Award className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-center mb-2">{badge.name}</h3>
                  <p className="text-sm text-gray-600 text-center mb-3">
                    {badge.description}
                  </p>
                  
                  <div className="flex justify-center mb-4">
                    <Badge variant="outline">
                      {badge.points} points
                    </Badge>
                  </div>

                  <Button
                    onClick={() => awardBadge(badge.type, badge.name)}
                    disabled={isAwarding || awardedBadges.includes(badge.type)}
                    className={`w-full ${
                      awardedBadges.includes(badge.type)
                        ? 'bg-green-500 hover:bg-green-600'
                        : ''
                    }`}
                  >
                    {awardedBadges.includes(badge.type) ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Awarded!
                      </>
                    ) : (
                      <>
                        <Award className="mr-2 h-4 w-4" />
                        Award Badge
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Info Section */}
        <Card className="mt-8 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-700">How It Works</CardTitle>
          </CardHeader>
          <CardContent className="text-blue-700">
            <div className="space-y-3 text-sm">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                  1
                </div>
                <div>
                  <strong>Real Database Integration:</strong> Badges are stored in and retrieved from the live database
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                  2
                </div>
                <div>
                  <strong>Mock Data Fallback:</strong> Enhanced static badges ensure the system always works even if database is unavailable
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                  3
                </div>
                <div>
                  <strong>Live Updates:</strong> User progress and badges update immediately across the platform
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                  4
                </div>
                <div>
                  <strong>Points System:</strong> Each badge awards points that contribute to user rankings and leaderboards
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* View Badges Link */}
        <div className="mt-8 text-center">
          <Button asChild size="lg" className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
            <a href="/badges">
              <Award className="mr-2 h-5 w-5" />
              View Full Badge Gallery
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
} 
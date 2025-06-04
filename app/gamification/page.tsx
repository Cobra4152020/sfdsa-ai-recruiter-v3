"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageWrapper } from "@/components/page-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Trophy,
  Award,
  Lock,
  Star,
  MessageSquare,
  FileText,
  Download,
  Users,
  Gift,
  Share2,
} from "lucide-react";

export default function GamificationPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the new leaderboard page
    router.replace("/leaderboard");
  }, [router]);

  // Fallback content in case redirect doesn't work immediately
  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-[#0A3C1F] mb-4">
              Gamification
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Earn points, unlock achievements, and compete with other recruits
              in our gamified recruitment process.
            </p>
          </div>

          <Tabs defaultValue="points" className="space-y-6">
            <TabsList className="grid grid-cols-6 mb-8">
              <TabsTrigger value="points" className="text-sm sm:text-base">
                <Trophy className="h-4 w-4 mr-2 hidden sm:inline" /> Points
              </TabsTrigger>
              <TabsTrigger value="badges" className="text-sm sm:text-base">
                <Award className="h-4 w-4 mr-2 hidden sm:inline" /> Badges
              </TabsTrigger>
              <TabsTrigger value="referrals" className="text-sm sm:text-base">
                <Users className="h-4 w-4 mr-2 hidden sm:inline" /> Referrals
              </TabsTrigger>
              <TabsTrigger value="unlockables" className="text-sm sm:text-base">
                <Lock className="h-4 w-4 mr-2 hidden sm:inline" /> Unlockables
              </TabsTrigger>
              <TabsTrigger value="nfts" className="text-sm sm:text-base">
                <Star className="h-4 w-4 mr-2 hidden sm:inline" /> NFTs
              </TabsTrigger>
              <TabsTrigger value="trivia" className="text-sm sm:text-base">
                <MessageSquare className="h-4 w-4 mr-2 hidden sm:inline" />{" "}
                Trivia
              </TabsTrigger>
            </TabsList>

            <TabsContent value="points">
              <Card>
                <CardHeader className="bg-[#0A3C1F] text-white">
                  <CardTitle>Points System</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        How to Earn Points
                      </h3>
                      <ul className="space-y-4">
                        <li className="flex items-start">
                          <MessageSquare className="h-5 w-5 text-[#0A3C1F] mr-2 mt-0.5" />
                          <div>
                            <p className="font-medium">Chat with Sgt. Ken</p>
                            <p className="text-sm text-gray-600">
                              5 points per meaningful interaction
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <FileText className="h-5 w-5 text-[#0A3C1F] mr-2 mt-0.5" />
                          <div>
                            <p className="font-medium">
                              Complete Practice Tests
                            </p>
                            <p className="text-sm text-gray-600">
                              20 points per test
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <Download className="h-5 w-5 text-[#0A3C1F] mr-2 mt-0.5" />
                          <div>
                            <p className="font-medium">Review Materials</p>
                            <p className="text-sm text-gray-600">
                              10 points per review
                            </p>
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        Point Tiers
                      </h3>
                      <ul className="space-y-4">
                        <li className="flex items-start">
                          <Trophy className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
                          <div>
                            <p className="font-medium">Bronze Recruit</p>
                            <p className="text-sm text-gray-600">
                              1,000 points
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <Trophy className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                          <div>
                            <p className="font-medium">Silver Recruit</p>
                            <p className="text-sm text-gray-600">
                              2,500 points
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <Trophy className="h-5 w-5 text-yellow-400 mr-2 mt-0.5" />
                          <div>
                            <p className="font-medium">Gold Recruit</p>
                            <p className="text-sm text-gray-600">
                              5,000 points
                            </p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="badges">
              <Card>
                <CardHeader className="bg-[#0A3C1F] text-white">
                  <CardTitle>Badge System</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="mb-6">
                    Earn badges by completing specific actions and milestones in
                    your recruitment journey. Each badge represents a
                    significant achievement in your path to becoming a San
                    Francisco Deputy Sheriff.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Badge cards will be dynamically populated */}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="referrals">
              <Card>
                <CardHeader className="bg-[#0A3C1F] text-white">
                  <CardTitle>Referral Program</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="mb-6">
                    Earn bonus points and exclusive rewards by referring
                    qualified candidates to the SF Sheriff&apos;s Department.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        How It Works
                      </h3>
                      <ul className="space-y-4">
                        <li className="flex items-start">
                          <Share2 className="h-5 w-5 text-[#0A3C1F] mr-2 mt-0.5" />
                          <div>
                            <p className="font-medium">
                              Share Your Referral Link
                            </p>
                            <p className="text-sm text-gray-600">
                              Get a unique link to share with potential recruits
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <Users className="h-5 w-5 text-[#0A3C1F] mr-2 mt-0.5" />
                          <div>
                            <p className="font-medium">Track Referrals</p>
                            <p className="text-sm text-gray-600">
                              Monitor your referrals&apos; progress
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <Gift className="h-5 w-5 text-[#0A3C1F] mr-2 mt-0.5" />
                          <div>
                            <p className="font-medium">Earn Rewards</p>
                            <p className="text-sm text-gray-600">
                              Get points and exclusive badges for successful
                              referrals
                            </p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="unlockables">
              <Card>
                <CardHeader className="bg-[#0A3C1F] text-white">
                  <CardTitle>Unlockable Content</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="mb-6">
                    Unlock exclusive content and resources as you progress
                    through the recruitment process.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Unlockable content cards will be dynamically populated */}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="nfts">
              <Card>
                <CardHeader className="bg-[#0A3C1F] text-white">
                  <CardTitle>NFT Rewards</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="mb-6">
                    Earn exclusive NFT awards for your achievements in the
                    recruitment process.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* NFT reward cards will be dynamically populated */}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trivia">
              <Card>
                <CardHeader className="bg-[#0A3C1F] text-white">
                  <CardTitle>SF Trivia</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="mb-6">
                    Test your knowledge about San Francisco and law enforcement
                    through our daily trivia challenges.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Trivia content will be dynamically populated */}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageWrapper>
  );
}

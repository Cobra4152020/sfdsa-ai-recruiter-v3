"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { 
  Share2, 
  Trophy,
  Users,
  Zap,
  Target,
  Gift,
  Copy,
  CheckCircle,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  MessageSquare,
  Mail,
  Clock,
  Flame,
  Crown,
  Star,
  TrendingUp,
  Heart,
  Award
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/context/user-context";
import { useAuthModal } from "@/context/auth-modal-context";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ViralChallengeProps {
  className?: string;
}

interface ShareStats {
  totalShares: number;
  weeklyShares: number;
  pointsEarned: number;
  referralsGenerated: number;
  viralScore: number;
}

interface ViralChallenge {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  pointReward: number;
  timeLimit: string;
  difficulty: "Easy" | "Medium" | "Hard";
  icon: any;
  bgColor: string;
  active: boolean;
}

export function ViralShareIncentives({ className }: ViralChallengeProps) {
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareStats, setShareStats] = useState<ShareStats>({
    totalShares: 0,
    weeklyShares: 0,
    pointsEarned: 0,
    referralsGenerated: 0,
    viralScore: 0
  });
  const [selectedPlatform, setSelectedPlatform] = useState<string>("");
  const [shareMessage, setShareMessage] = useState("");
  const [referralLink, setReferralLink] = useState("");
  const [activeTab, setActiveTab] = useState("challenges");
  
  const { toast } = useToast();
  const { currentUser } = useUser();
  const { openModal } = useAuthModal();

  // Viral challenges that reset weekly/monthly
  const viralChallenges: ViralChallenge[] = [
    {
      id: "daily-share",
      title: "Daily Sharer",
      description: "Share 3 times today",
      target: 3,
      current: shareStats.weeklyShares % 3,
      pointReward: 75,
      timeLimit: "24 hours",
      difficulty: "Easy",
      icon: Zap,
      bgColor: "from-green-50 to-green-100",
      active: true
    },
    {
      id: "social-butterfly",
      title: "Social Butterfly",
      description: "Share on 5 different platforms this week",
      target: 5,
      current: Math.min(shareStats.weeklyShares, 5),
      pointReward: 200,
      timeLimit: "7 days",
      difficulty: "Medium",
      icon: Users,
      bgColor: "from-blue-50 to-blue-100",
      active: true
    },
    {
      id: "viral-champion",
      title: "Viral Champion",
      description: "Generate 10 referrals through shares this month",
      target: 10,
      current: shareStats.referralsGenerated,
      pointReward: 1000,
      timeLimit: "30 days",
      difficulty: "Hard",
      icon: Crown,
      bgColor: "from-purple-50 to-purple-100",
      active: true
    },
    {
      id: "engagement-master",
      title: "Engagement Master",
      description: "Get 25 total shares this month",
      target: 25,
      current: shareStats.totalShares,
      pointReward: 500,
      timeLimit: "30 days",
      difficulty: "Medium",
      icon: TrendingUp,
      bgColor: "from-amber-50 to-amber-100",
      active: true
    }
  ];

  // Enhanced sharing platforms with specific incentives
  const sharingPlatforms = [
    {
      id: "facebook",
      name: "Facebook",
      icon: Facebook,
      color: "bg-blue-600 hover:bg-blue-700",
      textColor: "text-white",
      points: 25,
      description: "Great for reaching family & friends",
      multiplier: "2x points for personal story shares"
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: Linkedin,
      color: "bg-blue-700 hover:bg-blue-800", 
      textColor: "text-white",
      points: 35,
      description: "Perfect for professional networks",
      multiplier: "3x points - professionals are likely recruits!"
    },
    {
      id: "twitter",
      name: "Twitter/X",
      icon: Twitter,
      color: "bg-black hover:bg-gray-800",
      textColor: "text-white", 
      points: 30,
      description: "Quick shares, wide reach",
      multiplier: "Bonus for using trending hashtags"
    },
    {
      id: "instagram",
      name: "Instagram",
      icon: Instagram,
      color: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600",
      textColor: "text-white",
      points: 40,
      description: "Visual content gets most engagement",
      multiplier: "Story shares get 2x points"
    },
    {
      id: "whatsapp",
      name: "WhatsApp",
      icon: MessageSquare,
      color: "bg-green-500 hover:bg-green-600",
      textColor: "text-white",
      points: 45,
      description: "Direct personal shares",
      multiplier: "Highest conversion rate!"
    },
    {
      id: "email",
      name: "Email",
      icon: Mail,
      color: "bg-gray-600 hover:bg-gray-700",
      textColor: "text-white",
      points: 50,
      description: "Personal recommendations",
      multiplier: "Best for serious prospects"
    }
  ];

  // Pre-written viral messages
  const viralMessages = [
    {
      category: "Personal Achievement",
      message: "🚔 Just earned {{points}} points in the San Francisco Deputy Sheriff recruitment program! The background prep checklist alone could save months. Who's ready to serve and protect with me? #JoinSFDSA #LawEnforcement",
      hashtags: ["JoinSFDSA", "LawEnforcement", "SanFrancisco", "ServeAndProtect"]
    },
    {
      category: "Career Opportunity",
      message: "💼 $91K starting salary + amazing benefits! The SF Deputy Sheriff recruitment program is incredible - they even have AI chat support and step-by-step guidance. Check it out:",
      hashtags: ["CareerChange", "LawEnforcement", "GoodPay", "SFJobs"]
    },
    {
      category: "Community Service",
      message: "🌟 Want to make a real difference in San Francisco? The Deputy Sheriff program is recruiting amazing people. No experience required - they train you! Here's how to get started:",
      hashtags: ["MakeADifference", "Community", "SanFrancisco", "PublicService"]
    },
    {
      category: "Call to Action",
      message: "📢 San Francisco needs YOU! Deputy Sheriff positions open NOW. Great pay, training provided, amazing benefits. Don't miss this opportunity to serve your community:",
      hashtags: ["NowHiring", "SFDSA", "JoinTheForce", "SFCareers"]
    }
  ];

  useEffect(() => {
    if (currentUser) {
      generateReferralLink();
      // Load user's sharing stats
      fetchShareStats();
    }
  }, [currentUser]);

  const generateReferralLink = () => {
    if (currentUser) {
      const domain = typeof window !== 'undefined' ? window.location.origin : '';
      const uniqueCode = btoa(currentUser.id).replace(/[^a-zA-Z0-9]/g, '').substring(0, 8);
      setReferralLink(`${domain}/join?ref=${uniqueCode}`);
    }
  };

  const fetchShareStats = async () => {
    try {
      const response = await fetch('/api/user/share-stats');
      if (response.ok) {
        const stats = await response.json();
        setShareStats(stats);
      }
    } catch (error) {
      console.error('Error fetching share stats:', error);
    }
  };

  const handleShare = async (platform: any, message?: string) => {
    if (!currentUser) {
      openModal("signup", "recruit");
      return;
    }

    const shareText = message || shareMessage || viralMessages[0].message.replace('{{points}}', '150');
    const finalMessage = `${shareText}\n\n${referralLink}`;

    try {
      // Track the share attempt
      await fetch('/api/social-share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          platform: platform.id,
          contentType: 'recruitment',
          contentTitle: 'SFDSA Recruitment Opportunity',
          url: referralLink,
          message: shareText
        })
      });

      // Open platform-specific sharing
      let shareUrl = '';
      const encodedText = encodeURIComponent(shareText);
      const encodedUrl = encodeURIComponent(referralLink);

      switch (platform.id) {
        case 'facebook':
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
          break;
        case 'twitter':
          shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
          break;
        case 'linkedin':
          shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodeURIComponent('Join SFDSA')}&summary=${encodedText}`;
          break;
        case 'whatsapp':
          shareUrl = `https://wa.me/?text=${encodeURIComponent(finalMessage)}`;
          break;
        case 'email':
          shareUrl = `mailto:?subject=${encodeURIComponent('Join the San Francisco Deputy Sheriff Program')}&body=${encodeURIComponent(finalMessage)}`;
          break;
        case 'instagram':
          // Instagram doesn't support direct URL sharing, copy to clipboard
          await navigator.clipboard.writeText(finalMessage);
          toast({
            title: "Message copied!",
            description: "Paste this in your Instagram story or post. +40 points awarded!",
            duration: 5000,
          });
          awardSharePoints(platform.points);
          return;
      }

      if (shareUrl) {
        const popup = window.open(shareUrl, '_blank', 'width=600,height=500');
        
        // Award points immediately for the sharing attempt
        awardSharePoints(platform.points);
        
        // Check if user completed the share (popup closed)
        const checkClosed = setInterval(() => {
          if (popup?.closed) {
            clearInterval(checkClosed);
            // Bonus points for completing the share
            setTimeout(() => {
              awardSharePoints(5, "Share completion bonus");
            }, 1000);
          }
        }, 1000);

        // Auto-close check after 2 minutes
        setTimeout(() => {
          clearInterval(checkClosed);
        }, 120000);
      }

      setShowShareDialog(false);
    } catch (error) {
      console.error('Error sharing:', error);
      toast({
        title: "Share failed",
        description: "Please try again or copy the link manually.",
        variant: "destructive"
      });
    }
  };

  const awardSharePoints = async (points: number, description = "Social media share") => {
    try {
      const response = await fetch('/api/points/award', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'social_share',
          points,
          description
        })
      });

      if (response.ok) {
        toast({
          title: `+${points} Points Earned! 🎉`,
          description: description,
          duration: 3000,
        });
        
        // Update local stats
        setShareStats(prev => ({
          ...prev,
          pointsEarned: prev.pointsEarned + points,
          totalShares: prev.totalShares + 1,
          weeklyShares: prev.weeklyShares + 1
        }));
      }
    } catch (error) {
      console.error('Error awarding points:', error);
    }
  };

  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      toast({
        title: "Link copied! 📋",
        description: "Share this link to earn points for each signup!",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please select and copy the link manually.",
        variant: "destructive"
      });
    }
  };

  if (!currentUser) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-blue-600" />
            Unlock Viral Sharing Rewards
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Trophy className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Join to Start Earning</h3>
          <p className="text-gray-600 mb-4">
            Earn up to 50 points per share + bonuses for viral challenges!
          </p>
          <Button onClick={() => openModal("signup", "recruit")} size="lg">
            Sign Up & Start Sharing
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      {/* Main Sharing CTA */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Flame className="h-6 w-6 text-orange-500" />
            Go Viral & Earn Big!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{shareStats.totalShares}</div>
              <div className="text-sm text-gray-600">Total Shares</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{shareStats.pointsEarned}</div>
              <div className="text-sm text-gray-600">Points Earned</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{shareStats.referralsGenerated}</div>
              <div className="text-sm text-gray-600">Referrals Generated</div>
            </div>
          </div>
          
          <Button 
            onClick={() => setShowShareDialog(true)}
            size="lg" 
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Share2 className="h-5 w-5 mr-2" />
            Share Now & Earn Points
          </Button>
        </CardContent>
      </Card>

      {/* Viral Challenges */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="challenges">Viral Challenges</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="challenges" className="space-y-4">
          {viralChallenges.map(challenge => (
            <Card key={challenge.id} className={`bg-gradient-to-r ${challenge.bgColor}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <challenge.icon className="h-5 w-5" />
                    <h3 className="font-semibold">{challenge.title}</h3>
                    <Badge variant={challenge.difficulty === "Easy" ? "default" : challenge.difficulty === "Medium" ? "secondary" : "destructive"}>
                      {challenge.difficulty}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-amber-500" />
                    <span className="font-bold">{challenge.pointReward} pts</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>
                
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Progress: {challenge.current}/{challenge.target}</span>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="h-3 w-3" />
                    {challenge.timeLimit}
                  </div>
                </div>
                
                <Progress 
                  value={(challenge.current / challenge.target) * 100} 
                  className="h-2"
                />
                
                {challenge.current >= challenge.target && (
                  <div className="mt-2 flex items-center gap-1 text-green-600 text-sm">
                    <CheckCircle className="h-4 w-4" />
                    Challenge Complete! Claiming reward...
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="platforms" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {sharingPlatforms.map(platform => (
              <Card key={platform.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${platform.color}`}>
                        <platform.icon className={`h-5 w-5 ${platform.textColor}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold">{platform.name}</h3>
                        <p className="text-sm text-gray-600">{platform.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">{platform.points} pts</div>
                      <div className="text-xs text-gray-500">per share</div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-blue-600 mb-3">{platform.multiplier}</div>
                  
                  <Button 
                    onClick={() => handleShare(platform)}
                    className={`w-full ${platform.color} ${platform.textColor}`}
                    size="sm"
                  >
                    Share & Earn {platform.points} Points
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="leaderboard">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500" />
                Top Sharers This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Mock leaderboard data */}
                {[
                  { rank: 1, name: "Sarah M.", shares: 47, points: 1880, avatar: "SM" },
                  { rank: 2, name: "Mike R.", shares: 34, points: 1360, avatar: "MR" },
                  { rank: 3, name: "Jessica L.", shares: 28, points: 1120, avatar: "JL" },
                  { rank: 4, name: "You", shares: shareStats.weeklyShares, points: shareStats.pointsEarned, avatar: "YOU", isCurrentUser: true }
                ].map(user => (
                  <div key={user.rank} className={`flex items-center justify-between p-3 rounded-lg ${user.isCurrentUser ? 'bg-blue-50 border-blue-200 border' : 'bg-muted'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                        user.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                        user.rank === 2 ? 'bg-gray-100 text-gray-800' :
                        user.rank === 3 ? 'bg-amber-100 text-amber-800' :
                        user.isCurrentUser ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.rank === 1 && <Crown className="h-4 w-4" />}
                        {user.rank === 2 && <Award className="h-4 w-4" />} 
                        {user.rank === 3 && <Star className="h-4 w-4" />}
                        {user.rank > 3 && user.rank}
                      </div>
                      <div>
                        <div className={`font-semibold ${user.isCurrentUser ? 'text-blue-700' : ''}`}>{user.name}</div>
                        <div className="text-sm text-gray-600">{user.shares} shares this week</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">{user.points}</div>
                      <div className="text-xs text-gray-500">points</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            Quick Share
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input 
                value={referralLink}
                readOnly
                className="flex-1"
              />
              <Button onClick={copyReferralLink} variant="outline">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {sharingPlatforms.slice(0, 6).map(platform => (
                <Button
                  key={platform.id}
                  onClick={() => handleShare(platform)}
                  variant="outline"
                  size="sm"
                  className="p-2"
                >
                  <platform.icon className="h-4 w-4" />
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Choose Your Sharing Strategy
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Select a pre-written message:</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {viralMessages.map((msg, index) => (
                  <Button
                    key={index}
                    onClick={() => setShareMessage(msg.message.replace('{{points}}', shareStats.pointsEarned.toString()))}
                    variant="outline"
                    className="text-left h-auto p-3"
                  >
                    <div>
                      <div className="font-semibold text-sm">{msg.category}</div>
                      <div className="text-xs text-gray-600 truncate">
                        {msg.message.substring(0, 60)}...
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Or customize your message:</label>
              <textarea
                value={shareMessage}
                onChange={(e) => setShareMessage(e.target.value)}
                className="w-full p-3 border rounded-lg resize-none"
                rows={3}
                placeholder="Write your own compelling message..."
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Your referral link:</label>
              <div className="flex gap-2">
                <Input value={referralLink} readOnly />
                <Button onClick={copyReferralLink} variant="outline">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {sharingPlatforms.map(platform => (
                <Button
                  key={platform.id}
                  onClick={() => handleShare(platform, shareMessage)}
                  className={`${platform.color} ${platform.textColor} flex flex-col gap-1 h-auto py-3`}
                >
                  <platform.icon className="h-5 w-5" />
                  <span className="text-xs">{platform.name}</span>
                  <span className="text-xs opacity-80">+{platform.points} pts</span>
                </Button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 
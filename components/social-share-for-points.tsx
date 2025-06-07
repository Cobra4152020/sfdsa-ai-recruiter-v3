"use client";

import { useState } from "react";
import { 
  Share2, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram,
  CheckCircle,
  ExternalLink,
  Star,
  Trophy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/context/user-context";

interface SocialShareForPointsProps {
  pointsToEarn: number;
  shareType: "application_submitted" | "registration" | "general";
  customMessage?: string;
  onPointsEarned?: () => void;
}

export function SocialShareForPoints({ 
  pointsToEarn, 
  shareType, 
  customMessage,
  onPointsEarned 
}: SocialShareForPointsProps) {
  const [sharedPlatforms, setSharedPlatforms] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(false);
  const { currentUser } = useUser();
  const { toast } = useToast();

  const shareTexts = {
    application_submitted: "Just submitted my application to become a San Francisco Deputy Sheriff! 🚔⭐ Join me in making our community safer. Learn more and apply: https://www.sfdeputysheriff.com/apply #SFSheriff #LawEnforcement #PublicSafety",
    registration: "Excited to start my journey toward becoming a San Francisco Deputy Sheriff! 🚔⭐ Check out this amazing recruitment platform: https://www.sfdeputysheriff.com #SFSheriff #CareerGoals #PublicService",
    general: "Discover amazing career opportunities with the San Francisco Sheriff's Department! 🚔⭐ https://www.sfdeputysheriff.com #SFSheriff #Careers #PublicSafety"
  };

  const shareUrl = "https://www.sfdeputysheriff.com";
  const shareText = customMessage || shareTexts[shareType];

  const platforms = [
    {
      name: "Facebook",
      icon: <Facebook className="h-5 w-5" />,
      color: "bg-blue-600 hover:bg-blue-700",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`
    },
    {
      name: "Twitter",
      icon: <Twitter className="h-5 w-5" />,
      color: "bg-black hover:bg-gray-800",
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="h-5 w-5" />,
      color: "bg-blue-700 hover:bg-blue-800",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&summary=${encodeURIComponent(shareText)}`
    },
    {
      name: "Instagram",
      icon: <Instagram className="h-5 w-5" />,
      color: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600",
      url: `https://www.instagram.com/` // Note: Instagram doesn't support direct sharing URLs, so this opens Instagram
    }
  ];

  const handleShare = async (platform: string, url: string) => {
    // Open sharing window
    const popup = window.open(
      url, 
      'share', 
      'width=600,height=400,scrollbars=no,resizable=no'
    );

    // Track the share attempt
    setSharedPlatforms(prev => new Set([...Array.from(prev), platform]));

    // Check if popup was closed (indicates user likely shared)
    const checkClosed = setInterval(() => {
      if (popup?.closed) {
        clearInterval(checkClosed);
        // Wait a moment then offer to claim points
        setTimeout(() => {
          verifyShare(platform);
        }, 1000);
      }
    }, 1000);

    // Auto-close check after 30 seconds
    setTimeout(() => {
      clearInterval(checkClosed);
      if (popup && !popup.closed) {
        popup.close();
      }
    }, 30000);
  };

  const verifyShare = (platform: string) => {
    toast({
      title: "Did you complete the share?",
      description: `Click "Yes, I shared it!" if you successfully posted to ${platform}`,
      action: (
        <Button 
          size="sm" 
          onClick={() => confirmShare(platform)}
          className="bg-green-600 hover:bg-green-700"
        >
          Yes, I shared it!
        </Button>
      ),
    });
  };

  const confirmShare = async (platform: string) => {
    if (!currentUser) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to earn points",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch("/api/points/award", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          points: pointsToEarn,
          action: `social_share_${shareType}`,
          description: `Earned ${pointsToEarn} points for sharing on ${platform}`,
          metadata: {
            platform,
            shareType,
            sharedAt: new Date().toISOString()
          }
        })
      });

      if (response.ok) {
        setPointsEarned(true);
        toast({
          title: "🎉 Points Earned!",
          description: `You earned ${pointsToEarn} points for sharing on ${platform}!`,
        });

        if (onPointsEarned) {
          onPointsEarned();
        }
      } else {
        throw new Error("Failed to award points");
      }
    } catch (error) {
      console.error("Error awarding points:", error);
      toast({
        title: "Error",
        description: "Failed to award points. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (pointsEarned) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="h-16 w-16 bg-green-600 rounded-full flex items-center justify-center">
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-800">Points Earned!</h3>
              <p className="text-green-600">Thank you for helping us grow our community!</p>
            </div>
            <Badge className="bg-green-600 text-white text-lg px-4 py-2">
              +{pointsToEarn} Points
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-blue-800">
          <Share2 className="h-5 w-5 mr-2" />
          Earn {pointsToEarn} Points by Sharing!
        </CardTitle>
        <p className="text-sm text-blue-600">
          Help us spread the word about SF Sheriff recruitment and earn bonus points!
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-white p-4 rounded-lg border">
          <h4 className="font-medium text-gray-800 mb-2">Share this message:</h4>
          <p className="text-sm text-gray-600 italic">"{shareText}"</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {platforms.map((platform) => (
            <Button
              key={platform.name}
              onClick={() => handleShare(platform.name, platform.url)}
              className={`${platform.color} text-white relative`}
              disabled={isProcessing}
            >
              <div className="flex items-center space-x-2">
                {platform.icon}
                <span>{platform.name}</span>
                {sharedPlatforms.has(platform.name) && (
                  <CheckCircle className="h-4 w-4 text-green-400" />
                )}
              </div>
              <ExternalLink className="h-3 w-3 absolute top-1 right-1 opacity-60" />
            </Button>
          ))}
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 text-sm text-blue-600">
            <Star className="h-4 w-4" />
            <span>Share on any platform to earn {pointsToEarn} points!</span>
            <Star className="h-4 w-4" />
          </div>
        </div>

        {sharedPlatforms.size > 0 && !pointsEarned && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-yellow-700 text-center">
              After sharing, click "Yes, I shared it!" in the notification to claim your points.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 
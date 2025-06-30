"use client";

import { useState, useEffect } from "react";
import { Share2, X, Trophy, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/context/user-context";
import { useAuthModal } from "@/context/auth-modal-context";
import { useToast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";

export function FloatingShareWidget() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [dailyShareCount, setDailyShareCount] = useState(0);
  
  const { currentUser } = useUser();
  const { openModal } = useAuthModal();
  const { toast } = useToast();

  useEffect(() => {
    // Show widget after 30 seconds of page load
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 30000);

    // Load daily share count from localStorage
    const today = new Date().toDateString();
    const storedData = localStorage.getItem('dailyShareData');
    if (storedData) {
      const data = JSON.parse(storedData);
      if (data.date === today) {
        setDailyShareCount(data.count);
      } else {
        // Reset for new day
        localStorage.setItem('dailyShareData', JSON.stringify({ date: today, count: 0 }));
        setDailyShareCount(0);
      }
    } else {
      localStorage.setItem('dailyShareData', JSON.stringify({ date: today, count: 0 }));
    }

    return () => clearTimeout(timer);
  }, []);

  const incrementShareCount = () => {
    const newCount = dailyShareCount + 1;
    setDailyShareCount(newCount);
    
    const today = new Date().toDateString();
    localStorage.setItem('dailyShareData', JSON.stringify({ date: today, count: newCount }));
  };

  const quickShare = async (platform: string) => {
    if (!currentUser) {
      openModal("signup", "recruit");
      return;
    }

    const shareText = "🚔 Just discovered an amazing opportunity to become a San Francisco Deputy Sheriff! $91K starting salary, full training provided, amazing benefits. Check it out:";
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    
    let url = '';
    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent('SF Deputy Sheriff Opportunity')}&summary=${encodeURIComponent(shareText)}`;
        break;
    }

    if (url) {
      window.open(url, '_blank', 'width=600,height=500');
      incrementShareCount();
      
      // Award points
      try {
        await fetch('/api/points/award', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'quick_share',
            points: 25,
            description: `Quick share on ${platform}`
          })
        });

        toast({
          title: "Share complete! +25 points 🎉",
          description: `Thanks for spreading the word on ${platform}!`,
          duration: 3000,
        });
      } catch (error) {
        console.error('Error awarding points:', error);
      }
    }

    setIsExpanded(false);
  };

  const dismissWidget = () => {
    setIsVisible(false);
    // Don't show again for this session
    sessionStorage.setItem('shareWidgetDismissed', 'true');
  };

  // Don't show if user dismissed in this session
  if (sessionStorage.getItem('shareWidgetDismissed') === 'true') {
    return null;
  }

  // Don't show if daily goal reached
  if (dailyShareCount >= 3) {
    return null;
  }

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isExpanded ? (
        <Button
          onClick={() => setIsExpanded(true)}
          className="rounded-full h-16 w-16 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg animate-pulse"
        >
          <Share2 className="h-6 w-6 text-white" />
        </Button>
      ) : (
        <Card className="w-80 shadow-2xl border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Share2 className="h-5 w-5 text-blue-600" />
                <span className="font-semibold text-blue-900">Quick Share</span>
              </div>
              <Button
                onClick={dismissWidget}
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Daily Progress</span>
                <span className="text-sm font-medium">{dailyShareCount}/3</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(dailyShareCount / 3) * 100}%` }}
                />
              </div>
              <div className="flex items-center gap-1 mt-1">
                <Trophy className="h-3 w-3 text-amber-500" />
                <span className="text-xs text-gray-600">
                  {3 - dailyShareCount} shares left for +75 bonus points!
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-700 mb-3">
                Help us find great candidates! Share this opportunity and earn <strong>25 points</strong> per share.
              </p>
              
              <div className="grid grid-cols-3 gap-2">
                <Button
                  onClick={() => quickShare('facebook')}
                  className="bg-blue-600 hover:bg-blue-700 text-xs p-2"
                  size="sm"
                >
                  Facebook
                </Button>
                <Button
                  onClick={() => quickShare('twitter')}
                  className="bg-black hover:bg-gray-800 text-xs p-2"
                  size="sm"
                >
                  Twitter
                </Button>
                <Button
                  onClick={() => quickShare('linkedin')}
                  className="bg-blue-700 hover:bg-blue-800 text-xs p-2"
                  size="sm"
                >
                  LinkedIn
                </Button>
              </div>

              <Button
                onClick={() => {
                  setIsExpanded(false);
                  // Navigate to full awards page
                  if (typeof window !== 'undefined') {
                    window.location.href = '/awards';
                  }
                }}
                variant="outline"
                className="w-full text-xs mt-3"
              >
                <Zap className="h-3 w-3 mr-1" />
                View All Sharing Options
              </Button>
            </div>

            {!currentUser && (
              <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded">
                <p className="text-xs text-amber-800">
                  <span className="font-semibold">Sign up</span> to track your shares and earn points!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
} 
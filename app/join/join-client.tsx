"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/context/user-context";
import {
  Trophy,
  Users,
  Shield,
  Award,
  CheckCircle,
  ArrowRight,
  Star,
  Heart,
  UserPlus,
} from "lucide-react";
import { AuthForm } from "@/components/auth-form";
import Link from "next/link";
import confetti from "canvas-confetti";

interface ReferrerInfo {
  id: string;
  name: string;
  avatar_url?: string;
  points: number;
  badges: number;
  rank?: string;
}

export default function JoinClient() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { isLoggedIn, currentUser } = useUser();
  const [referrerInfo, setReferrerInfo] = useState<ReferrerInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [referralCode, setReferralCode] = useState<string | null>(null);

  useEffect(() => {
    const ref = searchParams?.get('ref');
    if (ref) {
      setReferralCode(ref);
      // Extract user ID from referral code (format: userId-randomCode)
      const userId = ref.split('-')[0];
      fetchReferrerInfo(userId);
    } else {
      setIsLoading(false);
    }
  }, [searchParams]);

  const fetchReferrerInfo = async (userId: string) => {
    try {
      // In a real app, this would fetch from your API
      // For now, we'll simulate fetching referrer info
      setTimeout(() => {
        setReferrerInfo({
          id: userId,
          name: "Deputy Martinez",
          avatar_url: "/male-law-enforcement-headshot.png",
          points: 1250,
          badges: 5,
          rank: "Senior Deputy"
        });
        setIsLoading(false);
        
        // Show welcome confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { x: 0.5, y: 0.6 },
          colors: ["#0A3C1F", "#FFD700", "#FFFFFF"],
        });
      }, 1000);
    } catch (error) {
      console.error('Error fetching referrer info:', error);
      setIsLoading(false);
    }
  };

  const handleAuthSuccess = () => {
    toast({
      title: "Welcome to SFDSA!",
      description: referrerInfo 
        ? `Thanks for joining through ${referrerInfo.name}'s referral!`
        : "Welcome to the San Francisco Deputy Sheriff's Association!",
      duration: 5000,
    });

    // Track the referral if there's a code
    if (referralCode && currentUser) {
      trackReferral();
    }
  };

  const trackReferral = async () => {
    try {
      const response = await fetch('/api/track-referral', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          referralCode,
          newUserId: currentUser?.id,
        }),
      });

      if (response.ok) {
        toast({
          title: "Referral bonus applied!",
          description: "Both you and your referrer earned bonus points!",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Error tracking referral:', error);
    }
  };

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-4">
              You're Already Part of the Team!
            </h1>
            <p className="text-lg text-gray-600">
              Welcome back! Ready to continue your journey with SFDSA?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link href="/dashboard">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Trophy className="h-12 w-12 text-[#FFD700] mx-auto mb-4" />
                  <h3 className="font-semibold text-primary mb-2">Dashboard</h3>
                  <p className="text-sm text-gray-600">View your progress and achievements</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/awards">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-primary mb-2">Awards</h3>
                  <p className="text-sm text-gray-600">Check out the leaderboard</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/could-you-make-the-cut">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-primary mb-2">Challenges</h3>
                  <p className="text-sm text-gray-600">Test your skills</p>
                </CardContent>
              </Card>
            </Link>
          </div>

          {referrerInfo && (
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-center text-primary">
                  Thanks for using {referrerInfo.name}'s referral link!
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <Avatar className="h-16 w-16 mx-auto mb-4">
                  <AvatarImage src={referrerInfo.avatar_url} alt={referrerInfo.name} />
                  <AvatarFallback>
                    {referrerInfo.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <p className="text-gray-600">
                  Both you and {referrerInfo.name} have earned bonus points for this referral!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-primary mb-6">
            Join the San Francisco Deputy Sheriff's Association
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Serve your community, protect what matters, and build a career with purpose. 
            Join our elite team of law enforcement professionals.
          </p>
          
          {referrerInfo && !isLoading && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8 max-w-md mx-auto border-l-4 border-primary">
              <div className="flex items-center mb-4">
                <UserPlus className="h-6 w-6 text-primary mr-2" />
                <span className="font-semibold text-primary">Referred by</span>
              </div>
              <div className="flex items-center">
                <Avatar className="h-12 w-12 mr-4">
                  <AvatarImage src={referrerInfo.avatar_url} alt={referrerInfo.name} />
                  <AvatarFallback>
                    {referrerInfo.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">{referrerInfo.name}</div>
                  <div className="text-sm text-gray-600">{referrerInfo.rank}</div>
                  <div className="flex items-center mt-1">
                    <Star className="h-4 w-4 text-[#FFD700] mr-1" />
                    <span className="text-sm">{referrerInfo.points} points • {referrerInfo.badges} badges</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="text-center">
            <CardContent className="p-6">
              <Shield className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-primary mb-3">Serve & Protect</h3>
              <p className="text-gray-600">
                Make a real difference in your community while building a rewarding career in law enforcement.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <Users className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-primary mb-3">Elite Team</h3>
              <p className="text-gray-600">
                Join a brotherhood/sisterhood of dedicated professionals committed to excellence and integrity.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <Trophy className="h-16 w-16 text-[#FFD700] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-primary mb-3">Career Growth</h3>
              <p className="text-gray-600">
                Advance through ranks with comprehensive training, competitive benefits, and leadership opportunities.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sign Up Form */}
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-center text-primary">
              {referrerInfo ? "Complete Your Registration" : "Get Started Today"}
            </CardTitle>
            {referrerInfo && (
              <div className="text-center">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Referral Bonus Eligible
                </Badge>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <AuthForm 
              onSuccess={handleAuthSuccess}
            />
            
            {referralCode && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md text-center">
                <Heart className="h-5 w-5 text-green-600 inline-block mr-2" />
                <span className="text-sm text-green-700">
                  You and your referrer will both earn bonus points when you sign up!
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Ready to start your law enforcement career?
          </p>
          <Link href="/application-process">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Learn About the Application Process
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 
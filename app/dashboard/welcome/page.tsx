import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star, Share2, Trophy, Users } from "lucide-react";
import Link from "next/link";

export default function WelcomePage() {
  return (
    <div className="container max-w-4xl py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to SFDSA Recruiter! 🎉
        </h1>
        <div className="flex justify-center items-center gap-2 mb-4">
          <Badge variant="secondary" className="text-xl py-2">
            <Star className="w-5 h-5 mr-1 text-yellow-500" />
            50 Points Earned!
          </Badge>
        </div>
        <p className="text-xl text-muted-foreground">
          Your journey to become a San Francisco Deputy Sheriff starts here
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">🎮 Earn More Points</h2>
          <ul className="space-y-3">
            <li className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-blue-500" />
              Share on social media (+10 points)
            </li>
            <li className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-purple-500" />
              Complete challenges (+20 points)
            </li>
            <li className="flex items-center gap-2">
              <Users className="w-5 h-5 text-green-500" />
              Refer friends (+30 points)
            </li>
          </ul>
          <Button asChild className="w-full mt-4">
            <Link href="/challenges">
              View Challenges
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">🎯 Next Steps</h2>
          <ul className="space-y-3">
            <li className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                1
              </div>
              Complete your profile
            </li>
            <li className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                2
              </div>
              Take the aptitude quiz
            </li>
            <li className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                3
              </div>
              Join daily challenges
            </li>
          </ul>
          <Button asChild variant="outline" className="w-full mt-4">
            <Link href="/profile">
              Complete Profile
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </Card>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">
          🌟 Unlock Special Features
        </h2>
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <div className="p-4 rounded-lg bg-primary/5">
            <h3 className="font-semibold">100 Points</h3>
            <p className="text-sm text-muted-foreground">
              Access exclusive content
            </p>
          </div>
          <div className="p-4 rounded-lg bg-primary/5">
            <h3 className="font-semibold">200 Points</h3>
            <p className="text-sm text-muted-foreground">Join special events</p>
          </div>
          <div className="p-4 rounded-lg bg-primary/5">
            <h3 className="font-semibold">500 Points</h3>
            <p className="text-sm text-muted-foreground">
              Get mentorship access
            </p>
          </div>
        </div>
        <Button asChild size="lg">
          <Link href="/dashboard">
            Go to Dashboard
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { Trophy, Award, Lock, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PointsIntroduction() {
  return (
    <div className="bg-card p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-foreground mb-4">
        Explore the Deputy Sheriff Position
      </h2>
      <p className="text-muted-foreground mb-4">
        Our platform is designed to help you learn about the San Francisco
        Deputy Sheriff role and prepare for the recruitment process. We&apos;ve
        created an engaging experience that rewards your participation and
        progress.
      </p>
      <div className="grid md:grid-cols-3 gap-6 mt-6">
        <div className="bg-card p-4 rounded-lg shadow-sm border border-border">
          <div className="rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center mb-3">
            <Trophy className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold mb-2 text-foreground">Earn Points</h3>
          <p className="text-sm text-muted-foreground">
            Accumulate points by reading content, chatting with Sgt. Ken, taking
            practice tests, and more.
          </p>
        </div>
        <div className="bg-card p-4 rounded-lg shadow-sm border border-border">
          <div className="rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center mb-3">
            <Award className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold mb-2 text-foreground">Unlock Badges</h3>
          <p className="text-sm text-muted-foreground">
            Earn achievement badges that showcase your progress and dedication
            to becoming a Deputy Sheriff.
          </p>
        </div>
        <div className="bg-card p-4 rounded-lg shadow-sm border border-border">
          <div className="rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center mb-3">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold mb-2 text-foreground">
            Access Exclusive Content
          </h3>
          <p className="text-sm text-muted-foreground">
            Unlock special resources and information as you progress through
            your recruitment journey.
          </p>
        </div>
      </div>
      <div className="mt-8 text-center space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
          <Link href="/roadmap">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 w-full">
              <Trophy className="mr-2 h-4 w-4" /> View Roadmap
            </Button>
          </Link>
          <Link href="/deputy-launchpad">
            <Button variant="outline" className="border-primary text-primary w-full">
              <Rocket className="mr-2 h-4 w-4" /> Deputy Launchpad
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

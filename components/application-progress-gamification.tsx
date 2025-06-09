"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Award, Trophy, Share2, ArrowRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/context/user-context";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";

interface ApplicationStep {
  id: string;
  title: string;
  description: string;
  points: number;
  badgeAwarded?: string;
  completed: boolean;
}

export function ApplicationProgressGamification() {
  const { toast } = useToast();
  const {} = useUser();
  const [applicationSteps, setApplicationSteps] = useState<ApplicationStep[]>([
    {
      id: "profile",
      title: "Complete Your Profile",
      description: "Fill out your basic information and upload a photo",
      points: 50,
      completed: false,
    },
    {
      id: "documents",
      title: "Upload Required Documents",
      description: "Submit your ID, education certificates, and references",
      points: 100,
      badgeAwarded: "Documentation Pro",
      completed: false,
    },
    {
      id: "assessment",
      title: "Take Initial Assessment",
      description: "Complete the preliminary skills and aptitude assessment",
      points: 150,
      completed: false,
    },
    {
      id: "interview",
      title: "Schedule Interview",
      description: "Book your initial interview with a recruitment officer",
      points: 200,
      badgeAwarded: "Interview Ready",
      completed: false,
    },
    {
      id: "physical",
      title: "Physical Fitness Test",
      description: "Schedule and prepare for your physical fitness assessment",
      points: 250,
      completed: false,
    },
    {
      id: "background",
      title: "Background Check",
      description: "Submit information for your background check",
      points: 300,
      badgeAwarded: "Background Verified",
      completed: false,
    },
    {
      id: "final",
      title: "Final Application Review",
      description: "Your application is being reviewed by the recruitment team",
      points: 500,
      badgeAwarded: "Application Champion",
      completed: false,
    },
  ]);

  // Calculate progress percentage
  const totalSteps = applicationSteps.length;
  const completedSteps = applicationSteps.filter(
    (step) => step.completed,
  ).length;
  const progressPercentage = Math.round((completedSteps / totalSteps) * 100);

  // Calculate total points earned
  const totalPointsEarned = applicationSteps
    .filter((step) => step.completed)
    .reduce((sum, step) => sum + step.points, 0);

  // Simulate completing a step
  const completeStep = async (stepId: string) => {
    // Find the step
    const stepIndex = applicationSteps.findIndex((step) => step.id === stepId);
    if (stepIndex === -1 || applicationSteps[stepIndex].completed) return;

    // Update the step
    const updatedSteps = [...applicationSteps];
    updatedSteps[stepIndex].completed = true;
    setApplicationSteps(updatedSteps);

    // Show confetti for celebration
    triggerConfetti();

    // Show toast notification
    toast({
      title: `Step Completed: ${applicationSteps[stepIndex].title}`,
      description: `You earned ${applicationSteps[stepIndex].points} points!${
        applicationSteps[stepIndex].badgeAwarded
          ? ` And unlocked the "${applicationSteps[stepIndex].badgeAwarded}" badge!`
          : ""
      }`,
      duration: 5000,
    });
  };

  // For demo purposes, let's simulate some completed steps
  useEffect(() => {
    const simulateProgress = () => {
      const updatedSteps = [...applicationSteps];
      // Mark first two steps as completed for demonstration
      if (updatedSteps[0]) updatedSteps[0].completed = true;
      if (updatedSteps[1]) updatedSteps[1].completed = true;
      setApplicationSteps(updatedSteps);
    };

    simulateProgress();
  }, []);

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: 0.5, y: 0.6 },
      colors: ["#FFD700", "#0A3C1F", "#FFFFFF"],
    });
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="bg-primary text-primary-foreground">
        <CardTitle className="flex items-center">
          <Trophy className="mr-2 h-5 w-5 text-secondary" />
          Your Application Journey
        </CardTitle>
        <CardDescription className="text-primary-foreground/80">
          Complete each step to earn points and badges
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-foreground">
              Application Progress
            </span>
            <span className="text-sm font-medium text-foreground">
              {progressPercentage}%
            </span>
          </div>
          <Progress
            value={progressPercentage}
            className="h-2"
          />

          <div className="mt-4 flex justify-between items-center">
            <div>
              <span className="text-sm text-muted-foreground">Points Earned</span>
              <div className="text-2xl font-bold text-foreground">
                {totalPointsEarned}
              </div>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Badges Earned</span>
              <div className="text-2xl font-bold text-foreground">
                {
                  applicationSteps.filter(
                    (step) => step.completed && step.badgeAwarded,
                  ).length
                }
              </div>
            </div>
            <Button
              variant="outline"
              className="text-primary border-primary hover:bg-primary hover:text-primary-foreground"
              onClick={() => {
                const shareText = `🎯 I'm ${progressPercentage}% through my San Francisco Deputy Sheriff recruitment journey! ${totalPointsEarned} points earned and ${applicationSteps.filter((step) => step.completed && step.badgeAwarded).length} badges unlocked! 🏆 Join me at ${window.location.origin} #SFDSA #LawEnforcement #Career`;
                
                if (navigator.share) {
                  // Use native share API if available
                  navigator.share({
                    title: 'My SFDSA Recruitment Progress',
                    text: shareText,
                    url: window.location.origin
                  }).catch(console.error);
                } else {
                  // Fallback to copying to clipboard
                  navigator.clipboard.writeText(shareText).then(() => {
                    toast({
                      title: "Progress Shared!",
                      description: "Your progress has been copied to clipboard. Paste it on your favorite social media!",
                      duration: 3000,
                    });
                  }).catch(() => {
                    // If clipboard fails, show manual share options
                    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
                    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}&quote=${encodeURIComponent(shareText)}`;
                    
                    const shareWindow = window.open(twitterUrl, '_blank', 'width=600,height=400');
                    if (shareWindow) {
                      toast({
                        title: "Share Your Progress",
                        description: "Share window opened! You can also try Facebook or copy the text manually.",
                        duration: 5000,
                      });
                    }
                  });
                }
              }}
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share Progress
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {applicationSteps.map((step) => (
            <motion.div
              key={step.id}
              className={`p-4 border rounded-lg transition-all ${
                step.completed
                  ? "bg-primary/5 border-primary/20"
                  : "hover:border-primary/20"
              }`}
            >
              <div className="flex items-start">
                <div
                  className={`p-2 rounded-full ${
                    step.completed
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">
                      {step.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      {step.badgeAwarded && (
                        <Badge
                          variant="outline"
                          className={`${
                            step.completed
                              ? "border-primary text-primary bg-primary/10"
                              : "border-border text-muted-foreground"
                          }`}
                        >
                          <Award className="mr-1 h-3 w-3" />
                          {step.badgeAwarded}
                        </Badge>
                      )}
                      <span
                        className={`text-sm ${step.completed ? "text-foreground" : "text-muted-foreground"}`}
                      >
                        {step.points} pts
                      </span>
                    </div>
                  </div>
                  <p
                    className={`mt-1 text-sm ${step.completed ? "text-muted-foreground" : "text-muted-foreground"}`}
                  >
                    {step.description}
                  </p>
                  {!step.completed && (
                    <Button
                      variant="link"
                      className="mt-2 text-primary hover:text-primary/70 p-0"
                      onClick={() => completeStep(step.id)}
                    >
                      Complete Step <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

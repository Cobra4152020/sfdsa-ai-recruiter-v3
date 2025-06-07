"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  Trophy,
  MessageSquare,
  FileText,
  Users,
  Share2,
  Lock,
  CheckCircle,
  Star,
  Target,
  BookOpen,
  Zap,
  Award,
  Calendar,
  Clock,
  ArrowRight,
  Gamepad2,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@/context/user-context";
import { useUserPoints } from "@/hooks/use-user-points";
import { motion } from "framer-motion";

interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  points: number;
  requiredPoints: number;
  category: "foundation" | "engagement" | "preparation" | "application";
  icon: React.ReactNode;
  unlocked: boolean;
  completed: boolean;
  route?: string;
  comingSoon?: boolean;
  subSteps?: Array<{
    title: string;
    completed: boolean;
    points: number;
  }>;
}

interface RoadmapCategory {
  id: string;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  icon: React.ReactNode;
}

export function DeputySheriffRoadmap() {
  const { currentUser } = useUser();
  const { points } = useUserPoints(currentUser?.id);
  const [selectedCategory, setSelectedCategory] = useState<string>("foundation");

  const categories: RoadmapCategory[] = [
    {
      id: "foundation",
      title: "Foundation",
      description: "Build your knowledge base and start earning points",
      color: "text-blue-600",
      bgColor: "bg-blue-50 border-blue-200",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      id: "engagement",
      title: "Engagement",
      description: "Connect with community and build experience",
      color: "text-green-600",
      bgColor: "bg-green-50 border-green-200",
      icon: <Users className="h-5 w-5" />,
    },
    {
      id: "preparation",
      title: "Preparation",
      description: "Prepare for tests and assessments",
      color: "text-orange-600",
      bgColor: "bg-orange-50 border-orange-200",
      icon: <Target className="h-5 w-5" />,
    },
    {
      id: "application",
      title: "Application",
      description: "Complete application and final steps",
      color: "text-purple-600",
      bgColor: "bg-purple-50 border-purple-200",
      icon: <FileText className="h-5 w-5" />,
    },
  ];

  const roadmapSteps: RoadmapStep[] = [
    // Foundation Category
    {
      id: "profile-setup",
      title: "Complete Your Profile",
      description: "Set up your profile with basic information and photo",
      points: 50,
      requiredPoints: 0,
      category: "foundation",
      icon: <UserCheck className="h-5 w-5" />,
      unlocked: true,
      completed: false,
      route: "/profile/edit",
    },
    {
      id: "daily-briefing",
      title: "Attend Daily Briefing",
      description: "Join Sgt. Ken's daily briefing sessions (5 points each)",
      points: 5,
      requiredPoints: 0,
      category: "foundation",
      icon: <Calendar className="h-5 w-5" />,
      unlocked: true,
      completed: false,
      route: "/daily-briefing",
      subSteps: [
        { title: "Attend first briefing", completed: false, points: 5 },
        { title: "Attend 7 consecutive days", completed: false, points: 50 },
        { title: "Attend 30 days total", completed: false, points: 200 },
      ],
    },
    {
      id: "chat-sgt-ken",
      title: "Chat with Sgt. Ken",
      description: "Ask questions and learn from our AI assistant",
      points: 5,
      requiredPoints: 50,
      category: "foundation",
      icon: <MessageSquare className="h-5 w-5" />,
      unlocked: points >= 50,
      completed: false,
      route: "/chat-with-sgt-ken",
    },
    {
      id: "info-pages",
      title: "Read Information Pages",
      description: "Learn about deputy sheriff requirements and benefits",
      points: 10,
      requiredPoints: 100,
      category: "foundation",
      icon: <BookOpen className="h-5 w-5" />,
      unlocked: points >= 100,
      completed: false,
      route: "/requirements",
    },

    // Engagement Category
    {
      id: "trivia-games",
      title: "Play SF Trivia Games",
      description: "Test your knowledge about San Francisco (10 points per game)",
      points: 10,
      requiredPoints: 200,
      category: "engagement",
             icon: <Gamepad2 className="h-5 w-5" />,
      unlocked: points >= 200,
      completed: false,
      route: "/trivia",
      subSteps: [
        { title: "Complete first trivia", completed: false, points: 10 },
        { title: "Score 80% or higher", completed: false, points: 25 },
        { title: "Play 10 different topics", completed: false, points: 100 },
      ],
    },
    {
      id: "mini-games",
      title: "Play Deputy Games",
      description: "Engage with our interactive law enforcement games",
      points: 15,
      requiredPoints: 300,
      category: "engagement",
      icon: <Zap className="h-5 w-5" />,
      unlocked: points >= 300,
      completed: false,
      route: "/games",
    },
    {
      id: "social-sharing",
      title: "Share on Social Media",
      description: "Share your progress and help spread awareness",
      points: 10,
      requiredPoints: 200,
      category: "engagement",
      icon: <Share2 className="h-5 w-5" />,
      unlocked: points >= 200,
      completed: false,
      subSteps: [
        { title: "Share first achievement", completed: false, points: 10 },
        { title: "Share to 3 platforms", completed: false, points: 30 },
        { title: "Get 5+ likes/shares", completed: false, points: 50 },
      ],
    },
    {
      id: "referral-program",
      title: "Refer New Recruits",
      description: "Share your referral link and earn bonus points",
      points: 100,
      requiredPoints: 500,
      category: "engagement",
      icon: <Users className="h-5 w-5" />,
      unlocked: points >= 500,
      completed: false,
      subSteps: [
        { title: "Generate referral link", completed: false, points: 10 },
        { title: "First successful referral", completed: false, points: 100 },
        { title: "Refer 5+ people", completed: false, points: 500 },
      ],
    },

    // Preparation Category
    {
      id: "practice-tests",
      title: "Complete Practice Tests",
      description: "Take practice exams to prepare for assessments",
      points: 25,
      requiredPoints: 750,
      category: "preparation",
      icon: <FileText className="h-5 w-5" />,
      unlocked: points >= 750,
      completed: false,
      route: "/practice-tests",
      subSteps: [
        { title: "Complete first practice test", completed: false, points: 25 },
        { title: "Score 70% or higher", completed: false, points: 50 },
        { title: "Complete all test categories", completed: false, points: 200 },
      ],
    },
    {
      id: "study-materials",
      title: "Access Study Materials",
      description: "Download and review comprehensive study guides",
      points: 20,
      requiredPoints: 1000,
      category: "preparation",
      icon: <BookOpen className="h-5 w-5" />,
      unlocked: points >= 1000,
      completed: false,
      route: "/study-materials",
    },
    {
      id: "mock-interviews",
      title: "Practice Interviews",
      description: "Complete virtual interview simulations",
      points: 50,
      requiredPoints: 1500,
      category: "preparation",
      icon: <MessageSquare className="h-5 w-5" />,
      unlocked: points >= 1500,
      completed: false,
      comingSoon: true,
    },

    // Application Category
    {
      id: "application-prep",
      title: "Application Preparation",
      description: "Review and prepare all required documents",
      points: 75,
      requiredPoints: 2000,
      category: "application",
      icon: <FileText className="h-5 w-5" />,
      unlocked: points >= 2000,
      completed: false,
      route: "/application-process",
    },
    {
      id: "submit-application",
      title: "Submit Official Application",
      description: "Complete and submit your deputy sheriff application",
      points: 500,
      requiredPoints: 2500,
      category: "application",
      icon: <Trophy className="h-5 w-5" />,
      unlocked: points >= 2500,
      completed: false,
      route: "/application-process/submit",
    },
  ];

  const getCurrentCategorySteps = () => {
    return roadmapSteps.filter(step => step.category === selectedCategory);
  };

  const getProgressPercentage = () => {
    const totalSteps = roadmapSteps.length;
    const unlockedSteps = roadmapSteps.filter(step => step.unlocked).length;
    return Math.round((unlockedSteps / totalSteps) * 100);
  };

  const getTotalPossiblePoints = () => {
    return roadmapSteps.reduce((total, step) => total + step.points, 0);
  };

  const getCategoryProgress = (categoryId: string) => {
    const categorySteps = roadmapSteps.filter(step => step.category === categoryId);
    const unlockedSteps = categorySteps.filter(step => step.unlocked).length;
    return Math.round((unlockedSteps / categorySteps.length) * 100);
  };

  if (!currentUser) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-8 text-center">
          <Shield className="h-16 w-16 mx-auto mb-4 text-[#0A3C1F]" />
          <h2 className="text-2xl font-bold mb-4">Sign In to View Your Roadmap</h2>
          <p className="text-gray-600 mb-6">
            Track your progress and unlock new content on your journey to becoming a Deputy Sheriff.
          </p>
          <Link href="/login">
            <Button className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90">
              Sign In to Continue
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-[#0A3C1F] mb-2">
            Deputy Sheriff Roadmap
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your personalized journey to becoming a San Francisco Deputy Sheriff. 
            Complete activities, earn points, and unlock new content and opportunities.
          </p>
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gradient-to-r from-[#0A3C1F]/10 to-[#0A3C1F]/5 rounded-lg p-6 border border-[#0A3C1F]/20"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#0A3C1F] mb-1">{points}</div>
              <div className="text-sm text-gray-600">Total Points</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#0A3C1F] mb-1">{getProgressPercentage()}%</div>
              <div className="text-sm text-gray-600">Roadmap Progress</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#0A3C1F] mb-1">{getTotalPossiblePoints()}</div>
              <div className="text-sm text-gray-600">Possible Points</div>
            </div>
          </div>
          <div className="mt-4">
            <Progress value={getProgressPercentage()} className="h-2" />
          </div>
        </motion.div>
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          {categories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="flex items-center gap-2 text-sm"
            >
              {category.icon}
              <span className="hidden sm:inline">{category.title}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="space-y-6">
            {/* Category Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`${category.bgColor} rounded-lg p-6 border`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-white ${category.color}`}>
                    {category.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{category.title}</h2>
                    <p className="text-gray-600">{category.description}</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#0A3C1F]">
                    {getCategoryProgress(category.id)}%
                  </div>
                  <div className="text-sm text-gray-600">Complete</div>
                </div>
              </div>
              <Progress value={getCategoryProgress(category.id)} className="h-2" />
            </motion.div>

            {/* Category Steps */}
            <div className="grid gap-6">
              {getCurrentCategorySteps().map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className={`${step.unlocked ? 'border-green-200 bg-green-50/30' : 'border-gray-200 bg-gray-50/50'} transition-all duration-300 hover:shadow-lg`}>
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-lg ${step.unlocked ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                            {step.unlocked ? step.icon : <Lock className="h-5 w-5" />}
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg mb-2 flex items-center gap-2">
                              {step.title}
                              <div className="flex gap-2">
                                <Badge variant={step.unlocked ? "default" : "secondary"} className="text-xs">
                                  {step.points} pts
                                </Badge>
                                {step.comingSoon && (
                                  <Badge variant="outline" className="text-xs">
                                    Coming Soon
                                  </Badge>
                                )}
                              </div>
                            </CardTitle>
                            <p className="text-gray-600 text-sm mb-3">
                              {step.description}
                            </p>
                            {!step.unlocked && (
                              <p className="text-xs text-orange-600 font-medium">
                                Requires {step.requiredPoints} points to unlock
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {step.completed && (
                            <CheckCircle className="h-6 w-6 text-green-600" />
                          )}
                          {step.unlocked && step.route && !step.comingSoon && (
                            <Link href={step.route}>
                              <Button size="sm" className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90">
                                Start
                                <ArrowRight className="h-4 w-4 ml-1" />
                              </Button>
                            </Link>
                          )}
                          {step.comingSoon && (
                            <Button size="sm" disabled variant="outline">
                              Coming Soon
                              <Clock className="h-4 w-4 ml-1" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>

                    {step.subSteps && step.subSteps.length > 0 && step.unlocked && (
                      <CardContent className="pt-0">
                        <div className="border-t pt-4">
                          <h4 className="text-sm font-semibold mb-3 text-gray-700">Milestones:</h4>
                          <div className="space-y-2">
                            {step.subSteps.map((subStep, subIndex) => (
                              <div key={subIndex} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                  {subStep.completed ? (
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                  ) : (
                                    <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                                  )}
                                  <span className={subStep.completed ? 'text-green-600 line-through' : 'text-gray-600'}>
                                    {subStep.title}
                                  </span>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  +{subStep.points} pts
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-gradient-to-r from-[#0A3C1F] to-[#0A3C1F]/80 text-white rounded-lg p-8 text-center"
      >
        <Trophy className="h-12 w-12 mx-auto mb-4 text-[#FFD700]" />
        <h3 className="text-2xl font-bold mb-2">Ready to Serve San Francisco?</h3>
        <p className="text-white/90 mb-6 max-w-2xl mx-auto">
          Your journey to becoming a Deputy Sheriff starts here. Complete activities, earn points, 
          and unlock your path to a rewarding career in law enforcement.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/daily-briefing">
            <Button size="lg" variant="secondary" className="bg-white text-[#0A3C1F] hover:bg-white/90">
              Start with Daily Briefing
            </Button>
          </Link>
          <Link href="/profile">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#0A3C1F]">
              View Your Profile
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
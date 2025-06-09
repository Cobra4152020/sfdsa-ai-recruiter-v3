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
  TrendingUp,
  Map,
  Compass,
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@/context/user-context";
import { useUserPoints } from "@/hooks/use-user-points";
import { useAuthModal } from "@/context/auth-modal-context";
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
  gradientFrom: string;
  gradientTo: string;
  icon: React.ReactNode;
}

export function DeputySheriffRoadmap() {
  const { currentUser } = useUser();
  const { points } = useUserPoints(currentUser?.id);
  const { openModal } = useAuthModal();
  const [selectedCategory, setSelectedCategory] = useState<string>("foundation");

  const categories: RoadmapCategory[] = [
    {
      id: "foundation",
      title: "Foundation",
      description: "Build your knowledge base and start earning points",
      color: "text-blue-600",
      bgColor: "bg-blue-50 border-blue-200",
      gradientFrom: "from-blue-500",
      gradientTo: "to-blue-600",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      id: "engagement",
      title: "Engagement",
      description: "Connect with community and build experience",
      color: "text-green-600",
      bgColor: "bg-green-50 border-green-200",
      gradientFrom: "from-green-500",
      gradientTo: "to-green-600",
      icon: <Users className="h-5 w-5" />,
    },
    {
      id: "preparation",
      title: "Preparation",
      description: "Prepare for tests and assessments",
      color: "text-orange-600",
      bgColor: "bg-orange-50 border-orange-200",
      gradientFrom: "from-orange-500",
      gradientTo: "to-orange-600",
      icon: <Target className="h-5 w-5" />,
    },
    {
      id: "application",
      title: "Application",
      description: "Complete application and final steps",
      color: "text-purple-600",
      bgColor: "bg-purple-50 border-purple-200",
      gradientFrom: "from-purple-500",
      gradientTo: "to-purple-600",
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
      <div className="max-w-6xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6"
        >
          <div className="relative">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 relative z-10">
              Deputy Sheriff
            </h1>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-primary via-secondary to-primary rounded-full"></div>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Your personalized journey to becoming a San Francisco Deputy Sheriff. Track your progress and unlock new opportunities.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="bg-blue-50 border-blue-200 shadow-2xl">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 bg-white rounded-full shadow-sm">
                <Map className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-2xl text-[#0A3C1F]">
                Deputy Sheriff Roadmap
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Track your progress, unlock achievements, and follow your personalized journey to becoming a Deputy Sheriff.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-yellow-800">Account Required</h3>
                    <p className="text-sm text-yellow-700 mt-1">
                      Please sign up or sign in to access your personalized roadmap. It's free and takes less than a minute!
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="font-medium text-gray-800 mb-2">✨ Sign Up Benefits:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Get 50 points instantly</li>
                    <li>• Personalized roadmap tracking</li>
                    <li>• Achievement badges</li>
                    <li>• Progress milestones</li>
                    <li>• Access all features</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="font-medium text-gray-800 mb-2">🗺️ Roadmap Features:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Foundation building steps</li>
                    <li>• Community engagement tasks</li>
                    <li>• Exam preparation guide</li>
                    <li>• Application completion</li>
                    <li>• Progress visualization</li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  onClick={() => openModal("signup", "recruit", "")}
                  className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white px-8 py-3"
                  size="lg"
                >
                  <Trophy className="h-5 w-5 mr-2" />
                  Sign Up & Get 50 Points
                </Button>
                <Button 
                  onClick={() => openModal("signin", "recruit", "")}
                  variant="outline"
                  className="border-[#0A3C1F] text-[#0A3C1F] hover:bg-[#0A3C1F]/5 px-8 py-3"
                  size="lg"
                >
                  Already have an account? Sign In
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      {/* Enhanced Header */}
      <div className="text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative mb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 relative z-10">
              Deputy Sheriff
            </h1>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-primary via-secondary to-primary rounded-full"></div>
          </div>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Your personalized journey to becoming a San Francisco Deputy Sheriff. Complete activities, earn points, and unlock new content and opportunities.
          </p>
        </motion.div>

        {/* Enhanced Progress Overview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="bg-gradient-to-br from-primary to-primary/90 rounded-2xl p-8 shadow-2xl border border-primary/20 text-white">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="mb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary rounded-full mb-3 group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="h-8 w-8 text-secondary-foreground" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-secondary mb-2">{points}</div>
                <div className="text-white/80 font-medium">Total Points Earned</div>
              </div>
              <div className="text-center group">
                <div className="mb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary rounded-full mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Map className="h-8 w-8 text-secondary-foreground" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-secondary mb-2">{getProgressPercentage()}%</div>
                <div className="text-white/80 font-medium">Roadmap Progress</div>
              </div>
              <div className="text-center group">
                <div className="mb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary rounded-full mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Target className="h-8 w-8 text-secondary-foreground" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-secondary mb-2">{getTotalPossiblePoints()}</div>
                <div className="text-white/80 font-medium">Maximum Points</div>
              </div>
            </div>
            <div className="mt-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/80 font-medium">Overall Progress</span>
                <span className="text-secondary font-bold">{getProgressPercentage()}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-secondary to-secondary/80 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${getProgressPercentage()}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Enhanced Category Navigation */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <div className="mb-12">
          <TabsList className="grid w-full grid-cols-4 h-16 bg-gray-100 rounded-xl p-2">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="flex items-center gap-3 text-sm font-medium h-12 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-300"
              >
                <div className={`p-2 rounded-lg bg-gradient-to-br ${category.gradientFrom} ${category.gradientTo} text-white`}>
                  {category.icon}
                </div>
                <span className="hidden sm:inline font-semibold">{category.title}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="space-y-8">
            {/* Enhanced Category Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative overflow-hidden"
            >
              <div className={`bg-gradient-to-br ${category.gradientFrom} ${category.gradientTo} rounded-2xl p-8 shadow-xl text-white`}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="p-4 rounded-xl bg-white/20 backdrop-blur-sm">
                      {category.icon}
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold mb-2">{category.title}</h2>
                      <p className="text-white/90 text-lg">{category.description}</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white mb-1">
                      {getCategoryProgress(category.id)}%
                    </div>
                    <div className="text-white/80 font-medium">Complete</div>
                  </div>
                </div>
                <div className="relative">
                  <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                    <motion.div 
                      className="h-full bg-white rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${getCategoryProgress(category.id)}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Enhanced Category Steps */}
            <div className="grid gap-8">
              {getCurrentCategorySteps().map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className={`group relative overflow-hidden transition-all duration-300 hover:shadow-2xl border-2 ${
                    step.unlocked 
                      ? 'border-green-200 bg-gradient-to-br from-green-50/50 to-white hover:from-green-50 hover:to-green-50/30 shadow-lg' 
                      : 'border-gray-200 bg-gradient-to-br from-gray-50/50 to-white hover:from-gray-50 hover:to-gray-50/30'
                  }`}>
                    {/* Accent Bar */}
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
                      step.unlocked ? 'from-green-400 to-green-600' : 'from-gray-300 to-gray-400'
                    }`} />
                    
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-6">
                          <div className={`p-4 rounded-xl transition-all duration-300 group-hover:scale-110 ${
                            step.unlocked 
                              ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg' 
                              : 'bg-gray-100 text-gray-400'
                          }`}>
                            {step.unlocked ? step.icon : <Lock className="h-6 w-6" />}
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-xl mb-3 flex items-center gap-3">
                              <span className="text-primary">{step.title}</span>
                              <div className="flex gap-2">
                                <Badge 
                                  variant={step.unlocked ? "default" : "secondary"} 
                                  className={`px-3 py-1 font-semibold ${
                                    step.unlocked 
                                      ? 'bg-secondary text-secondary-foreground hover:bg-secondary/90' 
                                      : ''
                                  }`}
                                >
                                  +{step.points} pts
                                </Badge>
                                {step.comingSoon && (
                                  <Badge variant="outline" className="px-3 py-1 border-orange-300 text-orange-600">
                                    Coming Soon
                                  </Badge>
                                )}
                              </div>
                            </CardTitle>
                            <p className="text-gray-600 text-base mb-4 leading-relaxed">
                              {step.description}
                            </p>
                            {!step.unlocked && (
                              <div className="inline-flex items-center gap-2 px-3 py-2 bg-orange-50 border border-orange-200 rounded-lg">
                                <Lock className="h-4 w-4 text-orange-600" />
                                <span className="text-sm text-orange-700 font-medium">
                                  Requires {step.requiredPoints} points to unlock
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                          {step.completed && (
                            <div className="flex items-center gap-2 px-3 py-2 bg-green-100 rounded-lg">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              <span className="text-sm font-medium text-green-700">Completed</span>
                            </div>
                          )}
                          {step.unlocked && step.route && !step.comingSoon && (
                            <Link href={step.route}>
                              <Button 
                                size="lg" 
                                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105"
                              >
                                Start Journey
                                <ArrowRight className="h-5 w-5 ml-2" />
                              </Button>
                            </Link>
                          )}
                          {step.comingSoon && (
                            <Button size="lg" disabled variant="outline" className="px-6 py-3">
                              <Clock className="h-5 w-5 mr-2" />
                              Coming Soon
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>

                    {step.subSteps && step.subSteps.length > 0 && step.unlocked && (
                      <CardContent className="pt-0">
                        <div className="border-t border-gray-200 pt-6">
                          <h4 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                            <Star className="h-5 w-5 text-[#FFD700]" />
                            Achievement Milestones
                          </h4>
                          <div className="space-y-3">
                            {step.subSteps.map((subStep, subIndex) => (
                              <div key={subIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <div className="flex items-center gap-3">
                                  {subStep.completed ? (
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                  ) : (
                                    <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                                  )}
                                  <span className={`font-medium ${
                                    subStep.completed ? 'text-green-600 line-through' : 'text-gray-700'
                                  }`}>
                                    {subStep.title}
                                  </span>
                                </div>
                                <Badge 
                                  variant={subStep.completed ? "default" : "outline"} 
                                  className={`px-3 py-1 font-semibold ${
                                    subStep.completed 
                                      ? 'bg-green-100 text-green-700 border-green-200' 
                                      : 'border-[#FFD700] text-[#0A3C1F]'
                                  }`}
                                >
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

      {/* Enhanced Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="relative overflow-hidden"
      >
        <div className="bg-gradient-to-br from-primary to-primary/90 text-white rounded-2xl p-12 text-center shadow-2xl">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
              backgroundSize: "30px 30px"
            }} />
          </div>
          
          <div className="relative z-10">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-secondary rounded-full mb-4">
                <Trophy className="h-10 w-10 text-secondary-foreground" />
              </div>
            </div>
            <h3 className="text-4xl font-bold mb-4">Ready to Serve San Francisco?</h3>
            <p className="text-white/90 text-xl leading-relaxed mb-8 max-w-3xl mx-auto">
              Your journey to becoming a Deputy Sheriff starts here. Complete activities, earn points, 
              and unlock your path to a rewarding career in law enforcement.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/daily-briefing">
                <Button 
                  size="lg" 
                  variant="secondary" 
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-8 py-4 text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Calendar className="mr-3 h-6 w-6" />
                  Start with Daily Briefing
                </Button>
              </Link>
              <Link href="/profile">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Compass className="mr-3 h-6 w-6" />
                  View Your Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
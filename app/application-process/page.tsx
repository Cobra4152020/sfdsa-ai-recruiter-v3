"use client";

import { PageWrapper } from "@/components/page-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  Clock, 
  Users, 
  FileText, 
  Dumbbell, 
  MessageSquare, 
  Search, 
  Shield, 
  Brain, 
  Heart, 
  GraduationCap,
  AlertTriangle,
  Star,
  Target,
  Timer,
  UserCheck,
  Zap,
  Phone,
  MapPin,
  ArrowRight,
  Info
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import type { Route } from "next";

export default function ApplicationProcessPage() {
  const steps = [
    {
      step: 1,
      title: "Initial Application",
      icon: <FileText className="h-6 w-6" />,
      description:
        "Submit your comprehensive online application through the SF Sheriff's Department portal. Provide complete personal information, education history, employment background, and character references.",
      timeframe: "1-2 days",
      difficulty: "Easy",
      requirements: [
        "Valid California Driver's License",
        "High school diploma or GED",
        "Complete employment history (10 years)",
        "Character references (3-5 people)",
        "Personal statement essay"
      ],
      tips: [
        "Gather all documents before starting",
        "Double-check all information for accuracy",
        "Save copies of everything you submit",
        "Complete application in one session if possible"
      ],
      color: "blue"
    },
    {
      step: 2,
      title: "Written Examination",
      icon: <Brain className="h-6 w-6" />,
      description:
        "Complete a comprehensive written test evaluating reading comprehension, writing skills, mathematical reasoning, and basic law enforcement knowledge. Passing score is 70%.",
      timeframe: "2-3 hours",
      difficulty: "Moderate",
      requirements: [
        "Valid photo ID required",
        "Arrive 30 minutes early",
        "No electronic devices permitted",
        "Pencils and materials provided"
      ],
      tips: [
        "Study provided preparation materials",
        "Get adequate rest the night before",
        "Eat a healthy breakfast",
        "Read all questions carefully"
      ],
      color: "green"
    },
    {
      step: 3,
      title: "Physical Agility Test (PAT)",
      icon: <Dumbbell className="h-6 w-6" />,
      description:
        "Demonstrate physical fitness through standardized exercises including push-ups, sit-ups, 1.5-mile run, and job-specific agility tasks. Must meet minimum standards in all categories.",
      timeframe: "Half day",
      difficulty: "Challenging",
      requirements: [
        "Athletic clothing and shoes",
        "Medical clearance if needed",
        "Hydration and light snack",
        "Valid photo ID"
      ],
      tips: [
        "Train consistently for 2-3 months",
        "Practice specific test components",
        "Warm up properly before testing",
        "Follow all safety instructions"
      ],
      color: "orange"
    },
    {
      step: 4,
      title: "Oral Board Interview",
      icon: <MessageSquare className="h-6 w-6" />,
      description:
        "Face a panel of experienced law enforcement professionals in a structured interview. Panel evaluates communication skills, decision-making, ethics, and job knowledge. Passing score is 70%.",
      timeframe: "45-60 minutes",
      difficulty: "Moderate",
      requirements: [
        "Professional business attire",
        "Valid photo ID",
        "Arrive 15 minutes early",
        "Bring copies of all documents"
      ],
      tips: [
        "Practice common law enforcement scenarios",
        "Research current events and department policies",
        "Prepare examples demonstrating your values",
        "Maintain eye contact and speak clearly"
      ],
      color: "purple"
    },
    {
      step: 5,
      title: "Background Investigation",
      icon: <Search className="h-6 w-6" />,
      description:
        "Undergo extensive background check including criminal history, employment verification, financial review, reference interviews, and social media screening. Complete honesty is essential.",
      timeframe: "3-6 months",
      difficulty: "Intensive",
      requirements: [
        "Complete background packet",
        "Financial documents (5 years)",
        "All addresses lived (10 years)",
        "Complete reference information",
        "Military records if applicable"
      ],
      tips: [
        "Be completely honest about everything",
        "Respond promptly to investigator requests",
        "Prepare references in advance",
        "Organize all required documents"
      ],
      color: "amber"
    },
    {
      step: 6,
      title: "Polygraph Examination",
      icon: <Target className="h-6 w-6" />,
      description:
        "Complete a polygraph (lie detector) test to verify integrity and truthfulness regarding your background information, criminal history, drug use, and other relevant matters.",
      timeframe: "3-4 hours",
      difficulty: "Moderate",
      requirements: [
        "Well-rested and relaxed state",
        "Valid photo ID",
        "Comfortable clothing",
        "No caffeine 4 hours prior"
      ],
      tips: [
        "Review your background packet thoroughly",
        "Be completely truthful about everything",
        "Stay calm and follow instructions",
        "Avoid caffeine and stimulants beforehand"
      ],
      color: "red"
    },
    {
      step: 7,
      title: "Medical Examination",
      icon: <Heart className="h-6 w-6" />,
      description:
        "Complete comprehensive medical examination by department-approved physician including vision, hearing, cardiovascular, and general health assessment. Drug screening included.",
      timeframe: "1-2 days",
      difficulty: "Easy",
      requirements: [
        "Medical history records",
        "Current medications list",
        "Valid photo ID",
        "Fasting if blood work required"
      ],
      tips: [
        "Bring complete medical history",
        "List all current medications",
        "Fast if required for blood tests",
        "Wear comfortable, accessible clothing"
      ],
      color: "teal"
    },
    {
      step: 8,
      title: "Psychological Evaluation",
      icon: <Brain className="h-6 w-6" />,
      description:
        "Undergo psychological testing and clinical interview with licensed psychologist to assess mental health, personality traits, and suitability for law enforcement work.",
      timeframe: "4-6 hours",
      difficulty: "Moderate",
      requirements: [
        "Valid photo ID",
        "Comfortable clothing",
        "Well-rested state",
        "Honest mindset"
      ],
      tips: [
        "Answer all questions honestly",
        "Get adequate rest beforehand",
        "Don't try to game the system",
        "Be yourself during the interview"
      ],
      color: "indigo"
    },
    {
      step: 9,
      title: "Final Interview & Appointment",
      icon: <UserCheck className="h-6 w-6" />,
      description:
        "Meet with department leadership for final interview and conditional job offer. Discuss salary, benefits, academy start date, and complete pre-employment paperwork.",
      timeframe: "1 day",
      difficulty: "Easy",
      requirements: [
        "Professional attire",
        "Valid photo ID",
        "Social Security card",
        "Bank information for direct deposit"
      ],
      tips: [
        "Prepare questions about the position",
        "Bring required documentation",
        "Negotiate start date if needed",
        "Review benefit options carefully"
      ],
      color: "green"
    },
    {
      step: 10,
      title: "Sheriff's Academy Training",
      icon: <GraduationCap className="h-6 w-6" />,
      description:
        "Complete intensive 16-20 week training program covering law enforcement, corrections, firearms, defensive tactics, emergency response, and department policies. Paid training position.",
      timeframe: "4-5 months",
      difficulty: "Intensive",
      requirements: [
        "Physical fitness maintenance",
        "Study materials and textbooks",
        "Professional uniforms",
        "Daily attendance required"
      ],
      tips: [
        "Maintain excellent physical condition",
        "Study consistently every day",
        "Build relationships with classmates",
        "Follow all academy rules strictly"
      ],
      color: "navy"
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      "Easy": "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      "Moderate": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      "Challenging": "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
      "Intensive": "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
    };
    return colors[difficulty as keyof typeof colors] || colors.Moderate;
  };

  const getStepColor = (color: string) => {
    const colors = {
      blue: "bg-blue-600 dark:bg-blue-500",
      green: "bg-green-600 dark:bg-green-500", 
      orange: "bg-orange-600 dark:bg-orange-500",
      purple: "bg-purple-600 dark:bg-purple-500",
      amber: "bg-amber-600 dark:bg-amber-500",
      red: "bg-red-600 dark:bg-red-500",
      teal: "bg-teal-600 dark:bg-teal-500",
      indigo: "bg-indigo-600 dark:bg-indigo-500",
      navy: "bg-blue-800 dark:bg-blue-700"
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center mb-6">
              <Shield className="h-12 w-12 text-[#0A3C1F] dark:text-[#FFD700] mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-[#0A3C1F] dark:text-[#FFD700]">
                Application Process
              </h1>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Your complete guide to becoming a San Francisco Deputy Sheriff. Follow these 10 comprehensive steps 
              to join our team and serve your community with pride and distinction.
            </p>
            <div className="flex items-center justify-center mt-6 space-x-6">
              <Badge variant="outline" className="bg-[#0A3C1F]/5 dark:bg-[#FFD700]/20 text-[#0A3C1F] dark:text-[#FFD700] border-[#0A3C1F]/20 dark:border-[#FFD700]/50">
                <Clock className="h-3 w-3 mr-1" />
                Total Process: 6-12 months
              </Badge>
              <Badge variant="outline" className="bg-[#0A3C1F]/5 dark:bg-[#FFD700]/20 text-[#0A3C1F] dark:text-[#FFD700] border-[#0A3C1F]/20 dark:border-[#FFD700]/50">
                <Star className="h-3 w-3 mr-1" />
                Competitive Selection
              </Badge>
              <Badge variant="outline" className="bg-[#0A3C1F]/5 dark:bg-[#FFD700]/20 text-[#0A3C1F] dark:text-[#FFD700] border-[#0A3C1F]/20 dark:border-[#FFD700]/50">
                <Zap className="h-3 w-3 mr-1" />
                Paid Academy Training
              </Badge>
            </div>
          </motion.div>

          {/* Process Timeline */}
          <div className="space-y-8 mb-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                <Card className="bg-white dark:bg-black border-gray-200 dark:border-[#FFD700]/30 hover:shadow-xl transition-all duration-300">
                  <CardHeader className="bg-white dark:bg-black">
                    <div className="flex items-start gap-6">
                      <div className={`flex-shrink-0 w-16 h-16 ${getStepColor(step.color)} rounded-full flex items-center justify-center text-white shadow-lg`}>
                        <div className="text-center">
                          <div className="font-bold text-lg">{step.step}</div>
                        </div>
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center gap-4 mb-2">
                          <CardTitle className="text-2xl text-[#0A3C1F] dark:text-[#FFD700] flex items-center">
                            <div className="mr-3 text-[#0A3C1F] dark:text-[#FFD700]">
                              {step.icon}
                            </div>
                            {step.title}
                          </CardTitle>
                          <Badge className={getDifficultyColor(step.difficulty)}>
                            {step.difficulty}
                          </Badge>
                          <Badge variant="outline" className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                            <Timer className="h-3 w-3 mr-1" />
                            {step.timeframe}
                          </Badge>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="bg-white dark:bg-black">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div>
                        <h4 className="font-semibold text-[#0A3C1F] dark:text-[#FFD700] mb-3 flex items-center">
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Requirements
                        </h4>
                        <ul className="space-y-2">
                          {step.requirements.map((req, reqIndex) => (
                            <li key={reqIndex} className="flex items-start text-gray-600 dark:text-gray-300">
                              <div className="w-2 h-2 bg-[#0A3C1F] dark:bg-[#FFD700] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              <span className="text-sm">{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#0A3C1F] dark:text-[#FFD700] mb-3 flex items-center">
                          <Star className="h-4 w-4 mr-2" />
                          Success Tips
                        </h4>
                        <ul className="space-y-2">
                          {step.tips.map((tip, tipIndex) => (
                            <li key={tipIndex} className="flex items-start text-gray-600 dark:text-gray-300">
                              <div className="w-2 h-2 bg-green-500 dark:bg-[#FFD700] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              <span className="text-sm">{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Connecting Arrow */}
                {index < steps.length - 1 && (
                  <div className="flex justify-center mt-6 mb-2">
                    <ArrowRight className="h-8 w-8 text-[#0A3C1F] dark:text-[#FFD700]" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Important Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mb-12"
          >
            <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/30 border-2">
              <CardContent className="p-6">
                <div className="flex items-start">
                  <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400 mr-4 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-3">Important Process Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <ul className="space-y-2 text-amber-700 dark:text-amber-200 text-sm">
                        <li>• Each step must be completed successfully to advance</li>
                        <li>• Background investigation continues throughout the process</li>
                        <li>• Honesty and integrity are essential at every stage</li>
                        <li>• Medical and psychological evaluations are confidential</li>
                      </ul>
                      <ul className="space-y-2 text-amber-700 dark:text-amber-200 text-sm">
                        <li>• Process timelines may vary based on application volume</li>
                        <li>• Candidates may be disqualified at any stage</li>
                        <li>• Academy training is mandatory and unpaid leave is not permitted</li>
                        <li>• Questions? Contact recruitment team immediately</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <Card className="bg-gradient-to-r from-[#0A3C1F] to-[#0A3C1F]/80 dark:from-black dark:to-gray-900 text-white dark:text-[#FFD700] border-[#0A3C1F] dark:border-[#FFD700]/30">
              <CardContent className="p-8">
                <div className="text-center">
                  <Shield className="h-16 w-16 mx-auto mb-6 text-white dark:text-[#FFD700]" />
                  <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
                  <p className="text-white/90 dark:text-gray-300 mb-8 max-w-3xl mx-auto text-lg">
                    Make sure you meet all requirements before beginning your application. 
                    Our recruitment team is here to guide you through every step of the process.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
                    <Link href={"/requirements" as Route}>
                      <Button 
                        size="lg" 
                        className="bg-white dark:bg-[#FFD700] text-[#0A3C1F] dark:text-black hover:bg-gray-100 dark:hover:bg-[#FFD700]/90 font-semibold px-8"
                      >
                        <CheckCircle2 className="h-5 w-5 mr-2" />
                        Review Requirements
                      </Button>
                    </Link>
                    <Link href={"/apply" as Route}>
                      <Button 
                        variant="outline" 
                        size="lg" 
                        className="border-white dark:border-[#FFD700] text-white dark:text-[#FFD700] hover:bg-white/10 dark:hover:bg-[#FFD700]/10 px-8"
                      >
                        <Zap className="h-5 w-5 mr-2" />
                        Start Application
                      </Button>
                    </Link>
                    <Link href={"/mission-briefing" as Route}>
                      <Button 
                        variant="outline" 
                        size="lg" 
                        className="border-white dark:border-[#FFD700] text-white dark:text-[#FFD700] hover:bg-white/10 dark:hover:bg-[#FFD700]/10 px-8"
                      >
                        <Info className="h-5 w-5 mr-2" />
                        Learn More
                      </Button>
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                    <div className="flex items-center justify-center text-white/80 dark:text-gray-400">
                      <Phone className="h-4 w-4 mr-2" />
                      Recruitment: (415) 554-7225
                    </div>
                    <div className="flex items-center justify-center text-white/80 dark:text-gray-400">
                      <MapPin className="h-4 w-4 mr-2" />
                      1 Dr. Carlton B. Goodlett Place
                    </div>
                    <div className="flex items-center justify-center text-white/80 dark:text-gray-400">
                      <Clock className="h-4 w-4 mr-2" />
                      Mon-Fri: 8:00 AM - 5:00 PM
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
}

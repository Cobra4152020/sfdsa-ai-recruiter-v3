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
  const phases = [
    {
      phase: 1,
      title: "Initial Application",
      icon: <FileText className="h-8 w-8 text-white" />,
      color: "blue",
      description: "The first step is to submit a complete and accurate online application.",
      steps: [
        {
          title: "Online Application",
          description: "Fill out the official SFSO application. Ensure all information about your work history, education, and personal details is correct.",
          link: "/apply",
          linkText: "Start Your Application",
        }
      ]
    },
    {
      phase: 2,
      title: "Written Exam & Physical Tests",
      icon: <Zap className="h-8 w-8 text-white" />,
      color: "green",
      description: "This phase includes the NTN Corrections Test, the Physical Agility Test (PAT), a video scenario test, and an oral interview.",
      steps: [
        {
          title: "NTN Corrections Written Exam",
          description: "This exam consists of four parts: a video-based human relations test (REACT), a reading test, a count test, and an incident observation/report writing test. We offer practice modules for each.",
          substeps: [
              { title: "REACT Video Practice", link: "/practice-tests/react-exam" },
              { title: "Count Test Practice", link: "/practice-tests/count-test" },
              { title: "Incident Observation Practice", link: "/practice-tests/incident-observation" }
          ]
        },
        {
          title: "Physical Agility Test (PAT)",
          description: "You must pass three timed events in sequence: a 500-yard run (< 2 min), a 99-yard obstacle course (< 35 sec), and a 165lb body drag (< 20 sec).",
          link: "/practice-tests/physical-ability",
          linkText: "View PAT Prep Guide",
        },
        {
          title: "Video Scenario Test",
          description: "After the PAT, you will watch a 53-second video and answer 10 questions. A minimum score of 80 out of 100 is required to pass.",
        },
        {
          title: "Oral Interview",
          description: "A panel interview with two sworn deputies. You will be asked 4 questions and must score at least 12 out of 20 points to pass.",
        }
      ]
    },
    {
      phase: 3,
      title: "Background & Final Evaluation",
      icon: <UserCheck className="h-8 w-8 text-white" />,
      color: "amber",
      description: "The final phase involves a thorough background investigation and final medical and psychological screenings.",
      steps: [
        {
          title: "Personal History & Background",
          description: "You will submit a comprehensive personal history statement. Our investigators will conduct a thorough background check.",
          link: "/background-preparation",
          linkText: "View Document Checklist",
        },
        {
          title: "Psychological & Polygraph Exam",
          description: "Assess your suitability for a career in law enforcement through a psychological evaluation and a polygraph test.",
        },
        {
          title: "Medical Examination",
          description: "A comprehensive medical exam to ensure you meet the physical health standards required for the job.",
        }
      ]
    }
  ];

  const getPhaseColor = (color: string) => {
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
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <Shield className="h-12 w-12 text-primary dark:text-[#FFD700] mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-primary dark:text-[#FFD700]">
              Application Process
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Your complete guide to becoming a San Francisco Deputy Sheriff. Follow these 10 comprehensive steps 
            to join our team and serve your community with pride and distinction.
          </p>
          <div className="flex flex-wrap items-center justify-center mt-6 gap-3 md:gap-6">
            <Badge variant="outline" className="bg-primary/5 dark:bg-[#FFD700]/20 text-primary dark:text-[#FFD700] border-primary/20 dark:border-[#FFD700]/50 text-xs md:text-sm">
              <Clock className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">Total Process: </span>6-12 months
            </Badge>
            <Badge variant="outline" className="bg-primary/5 dark:bg-[#FFD700]/20 text-primary dark:text-[#FFD700] border-primary/20 dark:border-[#FFD700]/50 text-xs md:text-sm">
              <Star className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">Competitive </span>Selection
            </Badge>
            <Badge variant="outline" className="bg-primary/5 dark:bg-[#FFD700]/20 text-primary dark:text-[#FFD700] border-primary/20 dark:border-[#FFD700]/50 text-xs md:text-sm">
              <Zap className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">Paid </span>Academy Training
            </Badge>
          </div>
        </motion.div>

        {/* Process Timeline */}
        <div className="space-y-12">
          {phases.map((phase) => (
            <div key={phase.phase}>
              <div className={`mb-8 p-6 rounded-3xl bg-gradient-to-r from-${phase.color}-500 to-${phase.color}-600 text-white shadow-lg`}>
                <div className="flex items-center space-x-4">
                    <div className={`bg-${phase.color}-400/50 p-3 rounded-full`}>
                        {phase.icon}
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Phase {phase.phase}: {phase.title}</h2>
                        <p className="text-white/90 mt-1">{phase.description}</p>
                    </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {phase.steps.map((step, stepIndex) => (
                  <motion.div
                    key={stepIndex}
                    className="h-full"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: stepIndex * 0.1 }}
                  >
                    <Card className="h-full flex flex-col shadow-md hover:shadow-xl transition-shadow duration-300">
                      <CardHeader>
                        <CardTitle className="text-xl">{step.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
                        {step.substeps && (
                            <div className="mt-4 space-y-2">
                                {step.substeps.map((substep, i) => (
                                     <Link href={substep.link as Route<string>} passHref key={i}>
                                        <Button variant="outline" className="w-full justify-start">
                                            <Zap className="mr-2 h-4 w-4 text-yellow-500" />
                                            {substep.title}
                                        </Button>
                                    </Link>
                                ))}
                            </div>
                        )}
                      </CardContent>
                      {step.link && (
                        <div className="p-6 pt-0">
                            <Link href={step.link as Route<string>} passHref>
                                <Button className="w-full">
                                    <ArrowRight className="mr-2 h-4 w-4" />
                                    {step.linkText}
                                </Button>
                            </Link>
                        </div>
                      )}
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
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
                      <li className="leading-relaxed">• Each step must be completed successfully to advance</li>
                      <li className="leading-relaxed">• Background investigation continues throughout the process</li>
                      <li className="leading-relaxed">• Honesty and integrity are essential at every stage</li>
                      <li className="leading-relaxed">• Medical and psychological evaluations are confidential</li>
                    </ul>
                    <ul className="space-y-2 text-amber-700 dark:text-amber-200 text-sm">
                      <li className="leading-relaxed">• Process timelines may vary based on application volume</li>
                      <li className="leading-relaxed">• Candidates may be disqualified at any stage</li>
                      <li className="leading-relaxed">• Academy training is mandatory and unpaid leave is not permitted</li>
                      <li className="leading-relaxed">• Questions? Contact recruitment team immediately</li>
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
          <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-primary">
            <CardContent className="p-8">
              <div className="text-center">
                <Shield className="h-16 w-16 mx-auto mb-6 text-primary-foreground" />
                <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
                <p className="text-primary-foreground/90 mb-8 max-w-3xl mx-auto text-lg">
                  Make sure you meet all requirements before beginning your application. 
                  Our recruitment team is here to guide you through every step of the process.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
                  <Link href={"/requirements" as Route}>
                    <Button 
                      size="lg" 
                      className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold px-8"
                    >
                      <CheckCircle2 className="h-5 w-5 mr-2" />
                      Review Requirements
                    </Button>
                  </Link>
                  <Link href={"/apply" as Route}>
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 px-8"
                    >
                      <Zap className="h-5 w-5 mr-2" />
                      Start Application
                    </Button>
                  </Link>
                  <Link href={"/mission-briefing" as Route}>
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 px-8"
                    >
                      <Info className="h-5 w-5 mr-2" />
                      Learn More
                    </Button>
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center justify-center text-primary-foreground/80">
                    <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-center sm:text-left">Recruitment: (415) 554-7225</span>
                  </div>
                  <div className="flex items-center justify-center text-primary-foreground/80">
                    <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-center sm:text-left">1 Dr. Carlton B. Goodlett Place</span>
                  </div>
                  <div className="flex items-center justify-center text-primary-foreground/80 sm:col-span-2 lg:col-span-1">
                    <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-center sm:text-left">Mon-Fri: 8:00 AM - 5:00 PM</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageWrapper>
  );
}

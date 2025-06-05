"use client";

import { PageWrapper } from "@/components/page-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  AlertTriangle, 
  GraduationCap, 
  Shield, 
  Heart, 
  User, 
  FileText,
  Clock,
  Phone,
  MapPin,
  Star,
  Target,
  Trophy,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import type { Route } from "next";

export default function RequirementsPage() {
  const requirements = [
    {
      category: "Basic Eligibility",
      icon: <User className="h-6 w-6" />,
      color: "blue",
      items: [
        "Must be at least 21 years of age at time of appointment",
        "Must be a U.S. citizen or permanent resident alien who is eligible for and has applied for citizenship",
        "Must possess a valid California Driver's License with a satisfactory driving record",
        "Must possess a high school diploma or equivalent (GED)",
        "Must have no felony convictions or disqualifying misdemeanor convictions",
        "Must be of good moral character with integrity and ethical standards",
      ],
    },
    {
      category: "Physical & Medical Standards",
      icon: <Heart className="h-6 w-6" />,
      color: "green",
      items: [
        "Must pass a comprehensive physical agility test (PAT)",
        "Must pass a thorough medical examination by a department physician",
        "Must maintain physical fitness standards throughout career",
        "Vision requirements: 20/30 uncorrected or correctable to 20/20",
        "Must pass drug and alcohol screening tests",
        "Must be free from any physical condition that would prevent job performance",
      ],
    },
    {
      category: "Background Investigation",
      icon: <FileText className="h-6 w-6" />,
      color: "amber",
      items: [
        "Must pass an extensive background investigation",
        "Must pass psychological evaluation and assessment",
        "No domestic violence convictions or restraining orders",
        "No pattern of financial irresponsibility or bankruptcy within 5 years",
        "Must provide complete employment history for past 10 years",
        "Character references from employers, neighbors, and associates",
        "Social media and digital footprint review",
      ],
    },
    {
      category: "Professional Requirements",
      icon: <Shield className="h-6 w-6" />,
      color: "purple",
      items: [
        "Must be willing to work various shifts (days, nights, weekends, holidays)",
        "Must be able to effectively communicate in English (written and verbal)",
        "Must be willing and able to carry a firearm and other law enforcement equipment",
        "Must complete required training at the San Francisco Sheriff's Academy",
        "Must be willing to work in jail, courthouse, and patrol environments",
        "Must maintain professional demeanor and composure under stress",
      ],
    },
  ];

  const testingProcess = [
    {
      step: 1,
      title: "Written Examination",
      description: "Basic skills assessment covering reading comprehension, writing, and reasoning",
      duration: "2-3 hours",
      passing: "70%",
    },
    {
      step: 2,
      title: "Physical Ability Test",
      description: "Standardized fitness test including push-ups, sit-ups, and 1.5-mile run",
      duration: "1 hour",
      passing: "Meet standards",
    },
    {
      step: 3,
      title: "Oral Interview",
      description: "Panel interview assessing communication skills and job knowledge",
      duration: "45 minutes",
      passing: "70%",
    },
    {
      step: 4,
      title: "Background Investigation",
      description: "Comprehensive review of personal, financial, and employment history",
      duration: "3-6 months",
      passing: "No disqualifiers",
    },
  ];

  const preferredQualifications = [
    { text: "Associate or Bachelor's degree in Criminal Justice or related field", points: "10 pts" },
    { text: "Prior law enforcement, military, or corrections experience", points: "15 pts" },
    { text: "Bilingual abilities (Spanish, Chinese, Filipino, Russian)", points: "5 pts" },
    { text: "Community service or volunteer experience", points: "5 pts" },
    { text: "Emergency Medical Technician (EMT) certification", points: "5 pts" },
    { text: "POST (Peace Officer Standards and Training) certification", points: "20 pts" },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: "bg-blue-50 dark:bg-blue-950/20",
        border: "border-blue-200 dark:border-blue-800/30",
        text: "text-blue-900 dark:text-blue-300",
        icon: "text-blue-600 dark:text-blue-400",
      },
      green: {
        bg: "bg-green-50 dark:bg-green-950/20",
        border: "border-green-200 dark:border-green-800/30",
        text: "text-green-900 dark:text-green-300",
        icon: "text-green-600 dark:text-green-400",
      },
      amber: {
        bg: "bg-amber-50 dark:bg-amber-950/20",
        border: "border-amber-200 dark:border-amber-800/30",
        text: "text-amber-900 dark:text-amber-300",
        icon: "text-amber-600 dark:text-amber-400",
      },
      purple: {
        bg: "bg-purple-50 dark:bg-purple-950/20",
        border: "border-purple-200 dark:border-purple-800/30",
        text: "text-purple-900 dark:text-purple-300",
        icon: "text-purple-600 dark:text-purple-400",
      },
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
                Deputy Sheriff Requirements
              </h1>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Your comprehensive guide to the qualifications, standards, and requirements 
              needed to join the San Francisco Sheriff's Department and serve your community.
            </p>
            <div className="flex items-center justify-center mt-6 space-x-4">
              <Badge variant="outline" className="bg-[#0A3C1F]/5 dark:bg-[#FFD700]/20 text-[#0A3C1F] dark:text-[#FFD700] border-[#0A3C1F]/20 dark:border-[#FFD700]/50">
                <Clock className="h-3 w-3 mr-1" />
                Application Process: 4-8 months
              </Badge>
              <Badge variant="outline" className="bg-[#0A3C1F]/5 dark:bg-[#FFD700]/20 text-[#0A3C1F] dark:text-[#FFD700] border-[#0A3C1F]/20 dark:border-[#FFD700]/50">
                <Target className="h-3 w-3 mr-1" />
                Starting Salary: $116K+
              </Badge>
            </div>
          </motion.div>

          {/* Requirements Grid */}
          <div className="space-y-8 mb-12">
            {requirements.map((section, index) => {
              const colorClasses = getColorClasses(section.color);
              return (
                <motion.div
                  key={section.category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className={`${colorClasses.bg} ${colorClasses.border} border-2 bg-white dark:bg-black`}>
                    <CardHeader className="bg-white dark:bg-black">
                      <CardTitle className={`flex items-center ${colorClasses.text}`}>
                        <div className={`${colorClasses.icon} mr-3`}>
                          {section.icon}
                        </div>
                        {section.category}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 bg-white dark:bg-black">
                      <ul className="space-y-4">
                        {section.items.map((item, itemIndex) => (
                          <motion.li 
                            key={item}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: (index * 0.1) + (itemIndex * 0.05) }}
                            className="flex items-start"
                          >
                            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-[#FFD700] mr-3 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700 dark:text-gray-300 leading-relaxed">{item}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Testing Process Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-12"
          >
            <Card className="bg-white dark:bg-black border-gray-200 dark:border-[#FFD700]/30">
              <CardHeader className="bg-gradient-to-r from-[#0A3C1F] to-[#0A3C1F]/80 dark:from-black dark:to-gray-900 text-white dark:text-[#FFD700]">
                <CardTitle className="flex items-center text-xl">
                  <GraduationCap className="h-6 w-6 mr-3" />
                  Testing & Selection Process
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-white dark:bg-black">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {testingProcess.map((test, index) => (
                    <div key={test.step} className="relative">
                      <div className="bg-[#0A3C1F]/5 dark:bg-[#FFD700]/10 border border-[#0A3C1F]/10 dark:border-[#FFD700]/30 rounded-lg p-4 h-full hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center mb-3">
                          <div className="bg-[#0A3C1F] dark:bg-[#FFD700] text-white dark:text-black w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mr-3">
                            {test.step}
                          </div>
                          <h3 className="font-semibold text-[#0A3C1F] dark:text-[#FFD700] text-sm">{test.title}</h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 leading-relaxed">{test.description}</p>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500 dark:text-gray-400">Duration:</span>
                            <span className="text-gray-700 dark:text-gray-300 font-medium">{test.duration}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500 dark:text-gray-400">Passing:</span>
                            <span className="text-green-600 dark:text-[#FFD700] font-medium">{test.passing}</span>
                          </div>
                        </div>
                      </div>
                      {index < testingProcess.length - 1 && (
                        <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-[#0A3C1F] dark:text-[#FFD700]">
                          →
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Preferred Qualifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mb-12"
          >
            <Card className="bg-white dark:bg-black border-gray-200 dark:border-[#FFD700]/30">
              <CardHeader className="bg-white dark:bg-black">
                <CardTitle className="flex items-center text-[#0A3C1F] dark:text-[#FFD700]">
                  <Star className="h-6 w-6 mr-3" />
                  Preferred Qualifications (Bonus Points)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-white dark:bg-black">
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  While not required, these qualifications can strengthen your application and may provide additional points in the selection process:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {preferredQualifications.map((qual, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-[#0A3C1F]/5 dark:bg-[#FFD700]/10 border border-[#0A3C1F]/10 dark:border-[#FFD700]/30 rounded-lg hover:shadow-md transition-all duration-200">
                      <span className="text-gray-700 dark:text-gray-300 flex-1">{qual.text}</span>
                      <Badge variant="secondary" className="ml-3 bg-[#0A3C1F] dark:bg-[#FFD700] text-white dark:text-black">
                        {qual.points}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Important Notes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mb-12"
          >
            <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/30 border-2">
              <CardContent className="p-6">
                <div className="flex items-start">
                  <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-2">Important Information</h3>
                    <ul className="space-y-2 text-amber-700 dark:text-amber-200 text-sm">
                      <li>• All requirements must be met at the time of appointment, not just application</li>
                      <li>• The selection process is competitive - meeting minimum requirements does not guarantee employment</li>
                      <li>• Background investigation may take 3-6 months to complete</li>
                      <li>• Medical and psychological evaluations are conducted by department-approved professionals</li>
                      <li>• Conditional offers of employment may be rescinded if requirements are not maintained</li>
                      <li>• The department reserves the right to verify all information provided throughout the process</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Card className="bg-gradient-to-r from-[#0A3C1F] to-[#0A3C1F]/80 dark:from-black dark:to-gray-900 text-white dark:text-[#FFD700] border-[#0A3C1F] dark:border-[#FFD700]/30">
              <CardContent className="p-8">
                <div className="text-center">
                  <Trophy className="h-12 w-12 mx-auto mb-4 text-white dark:text-[#FFD700]" />
                  <h2 className="text-2xl font-bold mb-4">Ready to Begin Your Journey?</h2>
                  <p className="text-white/90 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                    If you meet these requirements and are ready to serve the San Francisco community, 
                    take the first step toward an exciting and rewarding career in law enforcement.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href={"/apply" as Route}>
                      <Button 
                        size="lg" 
                        className="bg-white dark:bg-[#FFD700] text-[#0A3C1F] dark:text-black hover:bg-gray-100 dark:hover:bg-[#FFD700]/90 font-semibold px-8"
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
                        <GraduationCap className="h-5 w-5 mr-2" />
                        Learn More
                      </Button>
                    </Link>
                  </div>
                  <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center text-sm">
                    <div className="flex items-center text-white/80 dark:text-gray-400">
                      <Phone className="h-4 w-4 mr-2" />
                      Questions? Call (415) 554-7225
                    </div>
                    <div className="flex items-center text-white/80 dark:text-gray-400">
                      <MapPin className="h-4 w-4 mr-2" />
                      1 Dr. Carlton B. Goodlett Place, San Francisco
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

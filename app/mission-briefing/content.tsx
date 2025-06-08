"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Briefcase,
  GraduationCap,
  DollarSign,
  Clock,
  Shield,
  Users,
  Clipboard,
  Rocket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import type { Route } from "next";

export default function MissionBriefingContent() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Mission Briefing
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Your comprehensive guide to becoming a San Francisco Deputy Sheriff.
            Learn about the role, requirements, and application process.
          </p>
        </div>

        <Tabs defaultValue="role" className="w-full">
          <TabsList className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 mb-8 h-auto">
            <TabsTrigger value="role" className="text-xs sm:text-sm lg:text-base p-2 sm:p-3">
              <Shield className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" /> 
              <span className="hidden xs:inline">The </span>Role
            </TabsTrigger>
            <TabsTrigger value="requirements" className="text-xs sm:text-sm lg:text-base p-2 sm:p-3">
              <Clipboard className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">Requirements</span>
              <span className="xs:hidden">Req.</span>
            </TabsTrigger>
            <TabsTrigger value="benefits" className="text-xs sm:text-sm lg:text-base p-2 sm:p-3">
              <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" /> Benefits
            </TabsTrigger>
            <TabsTrigger value="process" className="text-xs sm:text-sm lg:text-base p-2 sm:p-3">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" /> Process
            </TabsTrigger>
            <TabsTrigger value="training" className="text-xs sm:text-sm lg:text-base p-2 sm:p-3">
              <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">Training</span>
              <span className="xs:hidden">Train</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="role" className="space-y-6">
            <RoleExplainer />
          </TabsContent>

          <TabsContent value="requirements" className="space-y-6">
            <RequirementsExplainer />
          </TabsContent>

          <TabsContent value="benefits" className="space-y-6">
            <BenefitsExplainer />
          </TabsContent>

          <TabsContent value="process" className="space-y-6">
            <ProcessExplainer />
          </TabsContent>

          <TabsContent value="training" className="space-y-6">
            <TrainingExplainer />
          </TabsContent>
        </Tabs>

        <Card className="mt-12 border-primary/20">
          <CardHeader className="bg-primary text-primary-foreground">
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" /> Ready to Begin Your Journey?
            </CardTitle>
            <CardDescription className="text-gray-200">
              Take the first step toward becoming a San Francisco Deputy Sheriff
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Apply Now</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Start your application process today and begin your career in
                  law enforcement with the San Francisco Sheriff&apos;s
                  Department.
                </p>
                <Link href={"/apply" as Route}>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Apply Now
                  </Button>
                </Link>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Explore the Deputy Launchpad
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Learn about our points system, badges, and rewards as you
                  progress through the recruitment process.
                </p>
                <Link href={"/deputy-launchpad" as Route}>
                  <Button
                    variant="outline"
                    className="border-primary text-primary"
                  >
                    <Rocket className="h-4 w-4 mr-2" />
                    Visit Deputy Launchpad
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function RoleExplainer() {
  const responsibilities = [
    {
      title: "Jail Operations",
      description:
        "Supervise inmates in county jails, ensuring safety and security for staff, inmates, and visitors",
      icon: <Shield className="h-6 w-6 text-primary" />,
    },
    {
      title: "Court Security",
      description: "Maintain order in courtrooms and protect judicial officers, staff, and the public",
      icon: <Briefcase className="h-6 w-6 text-primary" />,
    },
    {
      title: "Patrol Division",
      description:
        "Conduct patrols in assigned areas, respond to emergency calls, and provide community policing services",
      icon: <Shield className="h-6 w-6 text-primary" />,
    },
    {
      title: "Inmate Transportation",
      description:
        "Safely transport inmates to and from court appearances, medical appointments, and other facilities",
      icon: <Users className="h-6 w-6 text-primary" />,
    },
    {
      title: "Civil Process",
      description: "Serve legal documents, enforce civil judgments, and conduct evictions",
      icon: <FileText className="h-6 w-6 text-primary" />,
    },
    {
      title: "Field Training Unit",
      description: "Train new deputies and provide ongoing education to department personnel",
      icon: <GraduationCap className="h-6 w-6 text-primary" />,
    },
  ];

  return (
    <Card>
      <CardHeader className="bg-primary text-primary-foreground">
        <CardTitle className="flex items-center">
          <Shield className="h-5 w-5 text-accent mr-2" />
          The Deputy Sheriff Role
        </CardTitle>
        <CardDescription className="text-primary-foreground/80">
          Learn about the duties and responsibilities of a San Francisco Deputy
          Sheriff
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-2/3">
              <h3 className="text-xl font-semibold mb-4">Overview</h3>
              <p className="mb-4 text-gray-600 dark:text-gray-300">
                San Francisco Deputy Sheriffs play a vital role in maintaining
                public safety and upholding the law within the city and county.
                As a Deputy Sheriff, you&apos;ll be responsible for a variety of
                duties related to law enforcement, corrections, court services, and community patrol.
              </p>
              <p className="mb-4 text-gray-600 dark:text-gray-300">
                The San Francisco Sheriff&apos;s Department is committed to
                progressive law enforcement practices, community engagement, and
                rehabilitation programs that help reduce recidivism and promote
                public safety. Our deputies serve in multiple capacities, from jail operations
                to street patrol, making this one of the most diverse law enforcement careers available.
              </p>
            </div>
            <div className="md:w-1/3 relative h-48 md:h-auto rounded-lg overflow-hidden">
              <Image
                src="/san-francisco-deputy-sheriff.png"
                alt="San Francisco Deputy Sheriff"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Key Responsibilities</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {responsibilities.map((item, index) => (
                <div key={index} className="border rounded-lg p-4 bg-white dark:bg-black border-gray-200 dark:border-[#FFD700]/30 hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-2">
                    {item.icon}
                    <h4 className="font-semibold ml-2 text-gray-900 dark:text-[#FFD700] text-sm sm:text-base">{item.title}</h4>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-primary/5 dark:bg-[#FFD700]/10 p-4 rounded-lg border border-primary/20 dark:border-[#FFD700]/30">
            <h3 className="font-semibold text-lg mb-2 text-primary dark:text-[#FFD700]">
              Career Growth & Specializations
            </h3>
            <p className="mb-2 text-gray-600 dark:text-gray-300">
              The San Francisco Sheriff&apos;s Department offers excellent
              opportunities for career advancement. Deputies can specialize in
              various areas, including:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                <li>Criminal Investigations Unit</li>
                <li>Field Training Unit (FTU)</li>
                <li>K-9 Units</li>
                <li>Emergency Response Team</li>
                <li>Community Policing Division</li>
                <li>Court Security Unit</li>
              </ul>
              <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                <li>Patrol Division</li>
                <li>Transportation Unit</li>
                <li>Civil Division</li>
                <li>Training & Professional Standards</li>
                <li>Administrative Operations</li>
                <li>Special Operations Group</li>
              </ul>
            </div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              With experience and additional training, deputies can advance to
              supervisory and management positions, including Senior Deputy,
              Sergeant, Lieutenant, Captain, and beyond. Our Field Training Unit provides
              ongoing education and mentorship opportunities for career development.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function RequirementsExplainer() {
  const basicRequirements = [
    "Must be at least 21 years old",
    "U.S. citizenship or permanent resident alien status",
    "High school diploma or equivalent (GED)",
    "Valid California driver&apos;s license",
    "No felony convictions",
    "Pass background investigation",
    "Pass medical and psychological examinations",
    "Physical fitness meeting department standards",
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-primary text-primary-foreground">
          <CardTitle>Requirements</CardTitle>
          <CardDescription className="text-primary-foreground/80">
            These are the basic requirements to become a San Francisco Deputy
            Sheriff
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {basicRequirements.map((req, index) => (
              <li key={index} className="flex items-start">
                <div className="rounded-full bg-primary/10 dark:bg-[#FFD700]/20 p-1 mr-3 mt-0.5">
                  <Shield className="h-4 w-4 text-primary dark:text-[#FFD700]" />
                </div>
                <span className="text-gray-700 dark:text-gray-300">{req}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Testing Requirements</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            These tests are required to become a San Francisco Deputy Sheriff
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4 bg-white dark:bg-black border-gray-200 dark:border-[#FFD700]/30">
              <h4 className="font-semibold mb-2 text-gray-900 dark:text-[#FFD700]">Written Exam</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Tests basic reading comprehension, writing skills, and
                problem-solving abilities. Preparation materials are available
                through our platform.
              </p>
            </div>
            <div className="border rounded-lg p-4 bg-white dark:bg-black border-gray-200 dark:border-[#FFD700]/30">
              <h4 className="font-semibold mb-2 text-gray-900 dark:text-[#FFD700]">Physical Ability Test</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Includes push-ups, sit-ups, and a 1.5-mile run to assess
                physical fitness and endurance.
              </p>
            </div>
            <div className="border rounded-lg p-4 bg-white dark:bg-black border-gray-200 dark:border-[#FFD700]/30">
              <h4 className="font-semibold mb-2 text-gray-900 dark:text-[#FFD700]">Oral Interview</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Evaluates communication skills, judgment, and suitability for
                law enforcement work.
              </p>
            </div>
            <div className="border rounded-lg p-4 bg-white dark:bg-black border-gray-200 dark:border-[#FFD700]/30">
              <h4 className="font-semibold mb-2 text-gray-900 dark:text-[#FFD700]">Background Check</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Thorough investigation of personal history, employment,
                education, and criminal record.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferred Qualifications</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            These qualities will strengthen your application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-start">
              <div className="rounded-full bg-primary/10 dark:bg-[#FFD700]/20 p-1 mr-3 mt-0.5">
                <GraduationCap className="h-4 w-4 text-primary dark:text-[#FFD700]" />
              </div>
              <span className="text-gray-700 dark:text-gray-300">College degree in Criminal Justice or related field</span>
            </li>
            <li className="flex items-start">
              <div className="rounded-full bg-primary/10 dark:bg-[#FFD700]/20 p-1 mr-3 mt-0.5">
                <Briefcase className="h-4 w-4 text-primary dark:text-[#FFD700]" />
              </div>
              <span className="text-gray-700 dark:text-gray-300">Prior law enforcement or military experience</span>
            </li>
            <li className="flex items-start">
              <div className="rounded-full bg-primary/10 dark:bg-[#FFD700]/20 p-1 mr-3 mt-0.5">
                <Users className="h-4 w-4 text-primary dark:text-[#FFD700]" />
              </div>
              <span className="text-gray-700 dark:text-gray-300">Community service or volunteer experience</span>
            </li>
            <li className="flex items-start">
              <div className="rounded-full bg-primary/10 dark:bg-[#FFD700]/20 p-1 mr-3 mt-0.5">
                <FileText className="h-4 w-4 text-primary dark:text-[#FFD700]" />
              </div>
              <span className="text-gray-700 dark:text-gray-300">Bilingual abilities (especially Spanish, Chinese, or other languages common in San Francisco)</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function BenefitsExplainer() {
  return (
    <Card>
      <CardHeader className="bg-primary text-primary-foreground">
        <CardTitle className="flex items-center">
          <DollarSign className="h-5 w-5 text-accent mr-2" />
          Benefits & Compensation
        </CardTitle>
        <CardDescription className="text-primary-foreground/80">
          Learn about the competitive salary and benefits package for San
          Francisco Deputy Sheriffs
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">Salary</h3>
            <div className="bg-primary/5 dark:bg-[#FFD700]/10 p-4 rounded-lg border border-primary/20 dark:border-[#FFD700]/30">
              <h4 className="font-semibold mb-2 text-gray-900 dark:text-[#FFD700]">Competitive Compensation</h4>
              <p className="mb-2 text-gray-600 dark:text-gray-300">
                San Francisco Deputy Sheriffs enjoy one of the most competitive
                salary packages in law enforcement:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                                  <li>Starting salary range: $118,768 to $184,362 annually (with incentives)</li>
                <li>Regular step increases based on years of service</li>
                <li>Additional pay for specialized assignments and patrol duty</li>
                <li>Overtime opportunities with premium pay rates</li>
                <li>Night shift differential pay</li>
                <li>Bilingual pay for qualified deputies (up to $200/month)</li>
                <li>Court appearance compensation</li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">
              Health & Retirement Benefits
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4 bg-white dark:bg-black border-gray-200 dark:border-[#FFD700]/30">
                <h4 className="font-semibold mb-2 text-gray-900 dark:text-[#FFD700]">Health Benefits</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300">
                  <li>Comprehensive medical coverage (SFERS)</li>
                  <li>Dental and vision plans</li>
                  <li>Mental health services and EAP</li>
                  <li>Life insurance coverage</li>
                  <li>Short and long-term disability coverage</li>
                  <li>Workers' compensation</li>
                </ul>
              </div>
              <div className="border rounded-lg p-4 bg-white dark:bg-black border-gray-200 dark:border-[#FFD700]/30">
                <h4 className="font-semibold mb-2 text-gray-900 dark:text-[#FFD700]">Retirement Benefits</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300">
                  <li>SFERS defined benefit pension plan</li>
                  <li>3% at 58 retirement formula</li>
                  <li>457 deferred compensation options</li>
                  <li>Retiree health benefits</li>
                  <li>Social Security benefits</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Additional Benefits</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4 bg-white dark:bg-black border-gray-200 dark:border-[#FFD700]/30">
                <h4 className="font-semibold mb-2 text-gray-900 dark:text-[#FFD700]">Time Off</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300">
                  <li>Paid vacation (starts at 2 weeks)</li>
                  <li>Sick leave accrual</li>
                  <li>13 paid holidays annually</li>
                  <li>Personal days</li>
                  <li>Family and medical leave</li>
                </ul>
              </div>
              <div className="border rounded-lg p-4 bg-white dark:bg-black border-gray-200 dark:border-[#FFD700]/30">
                <h4 className="font-semibold mb-2 text-gray-900 dark:text-[#FFD700]">Education & Training</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300">
                  <li>Tuition reimbursement programs</li>
                  <li>Continuing education opportunities</li>
                  <li>Professional development training</li>
                  <li>Conference and seminar attendance</li>
                </ul>
              </div>
              <div className="border rounded-lg p-4 bg-white dark:bg-black border-gray-200 dark:border-[#FFD700]/30">
                <h4 className="font-semibold mb-2 text-gray-900 dark:text-[#FFD700]">Special Programs</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300">
                  <li>City employee housing assistance</li>
                  <li>Transit subsidies and parking</li>
                  <li>Wellness and fitness programs</li>
                  <li>Employee assistance programs</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-accent/10 dark:bg-[#FFD700]/10 p-4 rounded-lg border border-accent/20 dark:border-[#FFD700]/30">
            <h3 className="font-semibold text-lg mb-2 text-primary dark:text-[#FFD700]">
              Special Opportunities
            </h3>
            <p className="mb-2 text-gray-600 dark:text-gray-300">
              San Francisco Deputy Sheriffs may qualify for special programs and benefits:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
              <li>G.I. Bill benefits for veterans</li>
              <li>Below-market rate housing programs for law enforcement</li>
              <li>Student loan forgiveness programs</li>
              <li>Professional development stipends</li>
              <li>Career advancement opportunities in patrol, investigations, and training</li>
            </ul>
            <div className="mt-4">
              <Link href="/deputy-launchpad">
                <Button
                  variant="outline"
                  className="border-primary text-primary dark:border-[#FFD700] dark:text-[#FFD700] dark:hover:bg-[#FFD700]/10"
                >
                  Learn More in Deputy Launchpad
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ProcessExplainer() {
  const applicationSteps = [
    {
      step: 1,
      title: "Initial Application",
      description:
        "Submit your comprehensive online application through the SF Sheriff's Department portal with complete personal information, education history, employment background, and character references.",
    },
    {
      step: 2,
      title: "Written Examination",
      description:
        "Complete a comprehensive written test evaluating reading comprehension, writing skills, mathematical reasoning, and basic law enforcement knowledge. Passing score is 70%.",
    },
    {
      step: 3,
      title: "Physical Agility Test (PAT)",
      description:
        "Demonstrate physical fitness through standardized exercises including push-ups, sit-ups, 1.5-mile run, and job-specific agility tasks. Must meet minimum standards in all categories.",
    },
    {
      step: 4,
      title: "Oral Board Interview",
      description:
        "Face a panel of experienced law enforcement professionals in a structured interview. Panel evaluates communication skills, decision-making, ethics, and job knowledge. Passing score is 70%.",
    },
    {
      step: 5,
      title: "Background Investigation",
      description:
        "Undergo extensive background check including criminal history, employment verification, financial review, reference interviews, and social media screening. Complete honesty is essential.",
    },
    {
      step: 6,
      title: "Polygraph Examination",
      description:
        "Complete a polygraph (lie detector) test to verify integrity and truthfulness regarding your background information, criminal history, drug use, and other relevant matters.",
    },
    {
      step: 7,
      title: "Medical Examination",
      description:
        "Complete comprehensive medical examination by department-approved physician including vision, hearing, cardiovascular, and general health assessment. Drug screening included.",
    },
    {
      step: 8,
      title: "Psychological Evaluation",
      description:
        "Undergo psychological testing and clinical interview with licensed psychologist to assess mental health, personality traits, and suitability for law enforcement work.",
    },
    {
      step: 9,
      title: "Final Interview & Appointment",
      description:
        "Meet with department leadership for final interview and conditional job offer. Discuss salary, benefits, academy start date, and complete pre-employment paperwork.",
    },
    {
      step: 10,
      title: "Sheriff's Academy Training",
      description:
        "Complete intensive 16-20 week training program covering law enforcement, corrections, firearms, defensive tactics, emergency response, and department policies. Paid training position.",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {applicationSteps.map((step) => (
          <Card key={step.step} className="overflow-hidden bg-white dark:bg-black border-gray-200 dark:border-[#FFD700]/30">
            <CardHeader className="bg-primary/5 dark:bg-[#FFD700]/10 pb-4">
              <div className="flex items-center">
                <div className="bg-primary dark:bg-[#FFD700] text-primary-foreground dark:text-black w-8 h-8 rounded-full flex items-center justify-center mr-3 font-bold">
                  {step.step}
                </div>
                <CardTitle className="text-gray-900 dark:text-[#FFD700]">{step.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-4 bg-white dark:bg-black">
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{step.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-primary/5 dark:bg-[#FFD700]/10 p-4 rounded-lg border border-primary/20 dark:border-[#FFD700]/30">
        <h3 className="font-semibold text-lg mb-2 text-primary dark:text-[#FFD700]">
          Tips for Success
        </h3>
        <ul className="space-y-2">
          <li className="flex items-start">
            <div className="rounded-full bg-primary/10 dark:bg-[#FFD700]/20 p-1 mr-3 mt-0.5">
              <Shield className="h-4 w-4 text-primary dark:text-[#FFD700]" />
            </div>
            <span className="text-gray-700 dark:text-gray-300">
              <strong>Prepare thoroughly</strong> for each step of the process,
              especially the written examination, physical agility test, and oral board interview.
            </span>
          </li>
          <li className="flex items-start">
            <div className="rounded-full bg-primary/10 dark:bg-[#FFD700]/20 p-1 mr-3 mt-0.5">
              <Shield className="h-4 w-4 text-primary dark:text-[#FFD700]" />
            </div>
            <span className="text-gray-700 dark:text-gray-300">
              <strong>Be completely honest</strong> throughout the entire process,
              particularly during the background investigation and polygraph examination.
            </span>
          </li>
          <li className="flex items-start">
            <div className="rounded-full bg-primary/10 dark:bg-[#FFD700]/20 p-1 mr-3 mt-0.5">
              <Shield className="h-4 w-4 text-primary dark:text-[#FFD700]" />
            </div>
            <span className="text-gray-700 dark:text-gray-300">
              <strong>Stay in touch</strong> with your background investigator
              and respond promptly to all requests for information and documentation.
            </span>
          </li>
          <li className="flex items-start">
            <div className="rounded-full bg-primary/10 dark:bg-[#FFD700]/20 p-1 mr-3 mt-0.5">
              <Shield className="h-4 w-4 text-primary dark:text-[#FFD700]" />
            </div>
            <span className="text-gray-700 dark:text-gray-300">
              <strong>Maintain physical fitness</strong> throughout the entire process
              to ensure you&apos;re ready for both the agility test and academy training.
            </span>
          </li>
          <li className="flex items-start">
            <div className="rounded-full bg-primary/10 dark:bg-[#FFD700]/20 p-1 mr-3 mt-0.5">
              <Shield className="h-4 w-4 text-primary dark:text-[#FFD700]" />
            </div>
            <span className="text-gray-700 dark:text-gray-300">
              <strong>Practice interview skills</strong> and research law enforcement scenarios
              to prepare for the oral board interview with experienced professionals.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}

function TrainingExplainer() {
  return (
    <Card>
      <CardHeader className="bg-primary text-primary-foreground">
        <CardTitle className="flex items-center">
          <GraduationCap className="h-5 w-5 text-accent mr-2" />
          Academy & Training
        </CardTitle>
        <CardDescription className="text-primary-foreground/80">
          Learn about the comprehensive training you&apos;ll receive as a San Francisco Deputy
          Sheriff
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-2/3">
              <h3 className="text-xl font-semibold mb-4">Academy Overview</h3>
              <p className="mb-4 text-gray-600 dark:text-gray-300">
                After receiving a conditional offer of employment, you&apos;ll
                attend the San Francisco Sheriff&apos;s Department Academy, a
                comprehensive training program designed to prepare you for the
                challenges of law enforcement and corrections.
              </p>
              <p className="mb-4 text-gray-600 dark:text-gray-300">
                The academy is a full-time, paid position. During this time,
                you&apos;ll be a Deputy Sheriff Trainee, receiving instruction
                in all aspects of law enforcement, corrections, patrol operations, and court security.
              </p>
            </div>
            <div className="md:w-1/3 relative h-48 md:h-auto rounded-lg overflow-hidden">
              <Image
                src="/law-enforcement-training.png"
                alt="Law Enforcement Training"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Academy Curriculum</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4 bg-white dark:bg-black border-gray-200 dark:border-[#FFD700]/30">
                <h4 className="font-semibold mb-2 text-gray-900 dark:text-[#FFD700]">Law & Legal Procedures</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300">
                  <li>Criminal law and procedures</li>
                  <li>Constitutional law</li>
                  <li>Search and seizure protocols</li>
                  <li>Evidence handling and preservation</li>
                  <li>Court procedures and testimony</li>
                </ul>
              </div>
              <div className="border rounded-lg p-4 bg-white dark:bg-black border-gray-200 dark:border-[#FFD700]/30">
                <h4 className="font-semibold mb-2 text-gray-900 dark:text-[#FFD700]">Tactical Training</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300">
                  <li>Defensive tactics and self-defense</li>
                  <li>Firearms training and safety</li>
                  <li>Use of force continuum</li>
                  <li>Officer safety protocols</li>
                  <li>Emergency response procedures</li>
                </ul>
              </div>
              <div className="border rounded-lg p-4 bg-white dark:bg-black border-gray-200 dark:border-[#FFD700]/30">
                <h4 className="font-semibold mb-2 text-gray-900 dark:text-[#FFD700]">Corrections Operations</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300">
                  <li>Inmate supervision techniques</li>
                  <li>Jail security procedures</li>
                  <li>Classification and housing</li>
                  <li>Contraband detection and control</li>
                  <li>Crisis intervention and de-escalation</li>
                </ul>
              </div>
              <div className="border rounded-lg p-4 bg-white dark:bg-black border-gray-200 dark:border-[#FFD700]/30">
                <h4 className="font-semibold mb-2 text-gray-900 dark:text-[#FFD700]">Patrol Operations</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300">
                  <li>Community policing strategies</li>
                  <li>Traffic enforcement and control</li>
                  <li>Emergency response protocols</li>
                  <li>Report writing and documentation</li>
                  <li>Public interaction and service</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Academy Structure</h3>
            <div className="bg-primary/5 dark:bg-[#FFD700]/10 p-4 rounded-lg border border-primary/20 dark:border-[#FFD700]/30">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-[#FFD700]">Duration</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    The academy typically lasts 16-20 weeks, with full-time
                    training Monday through Friday, including both classroom and practical exercises.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-[#FFD700]">Physical Training</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Regular physical training sessions to build strength,
                    endurance, and fitness required for law enforcement duties.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-[#FFD700]">Testing & Evaluation</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Regular written and practical exams to assess knowledge and
                    skills, with continuous performance evaluation.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Field Training Unit (FTU)</h3>
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              Upon successful completion of the academy, you&apos;ll be assigned to our
              Field Training Unit, where experienced Field Training Officers (FTOs)
              will mentor you as you apply your training in real-world situations.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4 bg-white dark:bg-black border-gray-200 dark:border-[#FFD700]/30">
                <h4 className="font-semibold mb-2 text-gray-900 dark:text-[#FFD700]">Field Training Program</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300">
                  <li>Duration: 12-16 weeks of supervised field experience</li>
                  <li>One-on-one mentorship with certified FTOs</li>
                  <li>Rotation through different assignments and shifts</li>
                  <li>Weekly evaluations and skill assessments</li>
                  <li>Gradual increase in independence and responsibility</li>
                </ul>
              </div>
              <div className="border rounded-lg p-4 bg-white dark:bg-black border-gray-200 dark:border-[#FFD700]/30">
                <h4 className="font-semibold mb-2 text-gray-900 dark:text-[#FFD700]">Training Assignments</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300">
                  <li>Jail operations and inmate supervision</li>
                  <li>Court security and courthouse operations</li>
                  <li>Patrol division community policing</li>
                  <li>Civil process service and enforcement</li>
                  <li>Transportation unit operations</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-accent/10 dark:bg-[#FFD700]/10 p-4 rounded-lg border border-accent/20 dark:border-[#FFD700]/30">
            <h3 className="font-semibold text-lg mb-2 text-primary dark:text-[#FFD700]">
              Continuing Education & Career Development
            </h3>
            <p className="mb-2 text-gray-600 dark:text-gray-300">
              Your training doesn&apos;t end with the Field Training Unit. The San Francisco
              Sheriff&apos;s Department offers ongoing professional development
              opportunities:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                <li>Advanced specialized training courses</li>
                <li>Leadership development programs</li>
                <li>Professional certifications</li>
                <li>Cross-training in different divisions</li>
              </ul>
              <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                <li>Tuition assistance for higher education</li>
                <li>Conference and seminar attendance</li>
                <li>Field Training Officer certification</li>
                <li>Promotional exam preparation</li>
              </ul>
            </div>
            <div className="mt-4">
              <Link href="/deputy-launchpad">
                <Button
                  variant="outline"
                  className="border-primary text-primary dark:border-[#FFD700] dark:text-[#FFD700] dark:hover:bg-[#FFD700]/10"
                >
                  Learn More in Deputy Launchpad
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

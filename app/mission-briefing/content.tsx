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
    <div className="container mx-auto px-4 py-4">
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
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger value="role" className="text-sm sm:text-base">
              <Shield className="h-4 w-4 mr-2 hidden sm:inline" /> The Role
            </TabsTrigger>
            <TabsTrigger value="requirements" className="text-sm sm:text-base">
              <Clipboard className="h-4 w-4 mr-2 hidden sm:inline" />{" "}
              Requirements
            </TabsTrigger>
            <TabsTrigger value="benefits" className="text-sm sm:text-base">
              <DollarSign className="h-4 w-4 mr-2 hidden sm:inline" /> Benefits
            </TabsTrigger>
            <TabsTrigger value="process" className="text-sm sm:text-base">
              <Clock className="h-4 w-4 mr-2 hidden sm:inline" /> Process
            </TabsTrigger>
            <TabsTrigger value="training" className="text-sm sm:text-base">
              <GraduationCap className="h-4 w-4 mr-2 hidden sm:inline" />{" "}
              Training
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
        "Supervise inmates in county jails, ensuring safety and security",
      icon: <Shield className="h-6 w-6 text-primary" />,
    },
    {
      title: "Court Security",
      description: "Maintain order in courtrooms and protect judicial officers",
      icon: <Briefcase className="h-6 w-6 text-primary" />,
    },
    {
      title: "Inmate Transportation",
      description:
        "Safely transport inmates to and from court appearances and medical appointments",
      icon: <Users className="h-6 w-6 text-primary" />,
    },
    {
      title: "Civil Process",
      description: "Serve legal documents and enforce civil judgments",
      icon: <FileText className="h-6 w-6 text-primary" />,
    },
  ];

  return (
    <Card>
      <CardHeader className="bg-primary text-primary-foreground">
        <CardTitle className="flex items-center">
          <Shield className="h-5 w-5 text-accent mr-2" />
          The Deputy Sheriff Role
        </CardTitle>
        <CardDescription className="text-gray-200">
          Learn about the duties and responsibilities of a San Francisco Deputy
          Sheriff
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-2/3">
              <h3 className="text-xl font-semibold mb-4">Overview</h3>
              <p className="mb-4">
                San Francisco Deputy Sheriffs play a vital role in maintaining
                public safety and upholding the law within the city and county.
                As a Deputy Sheriff, you&apos;ll be responsible for a variety of
                duties related to law enforcement, corrections, and court
                services.
              </p>
              <p className="mb-4">
                The San Francisco Sheriff&apos;s Department is committed to
                progressive law enforcement practices, community engagement, and
                rehabilitation programs that help reduce recidivism and promote
                public safety.
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {responsibilities.map((item, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    {item.icon}
                    <h4 className="font-semibold ml-2">{item.title}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
            <h3 className="font-semibold text-lg mb-2 text-primary">
              Career Growth
            </h3>
            <p className="mb-2">
              The San Francisco Sheriff&apos;s Department offers excellent
              opportunities for career advancement. Deputies can specialize in
              various areas, including:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>Investigations</li>
              <li>Training</li>
              <li>K-9 Units</li>
              <li>Emergency Response Team</li>
              <li>Community Engagement</li>
              <li>Administration</li>
            </ul>
            <p className="mt-2">
              With experience and additional training, deputies can advance to
              supervisory and management positions, including Sergeant,
              Lieutenant, Captain, and beyond.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function RequirementsExplainer() {
  const basicRequirements = [
    "Must be at least 18 years old",
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
          <CardDescription>
            These are the basic requirements to become a San Francisco Deputy
            Sheriff
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {basicRequirements.map((req, index) => (
              <li key={index} className="flex items-start">
                <div className="rounded-full bg-primary/10 p-1 mr-3 mt-0.5">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Testing Requirements</CardTitle>
          <CardDescription>
            These tests are required to become a San Francisco Deputy Sheriff
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Written Exam</h4>
              <p className="text-sm text-gray-600">
                Tests basic reading comprehension, writing skills, and
                problem-solving abilities. Preparation materials are available
                through our platform.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Physical Ability Test</h4>
              <p className="text-sm text-gray-600">
                Includes push-ups, sit-ups, and a 1.5-mile run to assess
                physical fitness and endurance.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Oral Interview</h4>
              <p className="text-sm text-gray-600">
                Evaluates communication skills, judgment, and suitability for
                law enforcement work.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Background Check</h4>
              <p className="text-sm text-gray-600">
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
          <CardDescription>
            These qualities will strengthen your application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-start">
              <div className="rounded-full bg-primary/10 p-1 mr-3 mt-0.5">
                <GraduationCap className="h-4 w-4 text-primary" />
              </div>
              <span>College degree in Criminal Justice or related field</span>
            </li>
            <li className="flex items-start">
              <div className="rounded-full bg-primary/10 p-1 mr-3 mt-0.5">
                <Briefcase className="h-4 w-4 text-primary" />
              </div>
              <span>Prior law enforcement or military experience</span>
            </li>
            <li className="flex items-start">
              <div className="rounded-full bg-primary/10 p-1 mr-3 mt-0.5">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <span>Community service or volunteer experience</span>
            </li>
            <li className="flex items-start">
              <div className="rounded-full bg-primary/10 p-1 mr-3 mt-0.5">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <span>Bilingual abilities</span>
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
        <CardDescription className="text-gray-200">
          Learn about the competitive salary and benefits package for San
          Francisco Deputy Sheriffs
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">Salary</h3>
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
              <h4 className="font-semibold mb-2">Competitive Compensation</h4>
              <p className="mb-2">
                San Francisco Deputy Sheriffs enjoy one of the most competitive
                salary packages in law enforcement:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Starting salary range: $116,428 to $184,362</li>
                <li>Regular step increases based on years of service</li>
                <li>Additional pay for specialized assignments</li>
                <li>Overtime opportunities</li>
                <li>Night shift differential pay</li>
                <li>Bilingual pay for qualified deputies</li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">
              Health & Retirement Benefits
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Health Benefits</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>Comprehensive medical coverage</li>
                  <li>Dental and vision plans</li>
                  <li>Mental health services</li>
                  <li>Life insurance</li>
                  <li>Disability coverage</li>
                </ul>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Retirement Benefits</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>Defined benefit pension plan</li>
                  <li>Deferred compensation options</li>
                  <li>Retiree health benefits</li>
                  <li>Safety retirement formula</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Additional Benefits</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Time Off</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>Paid vacation</li>
                  <li>Sick leave</li>
                  <li>Holidays</li>
                  <li>Personal days</li>
                </ul>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Education</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>Tuition reimbursement</li>
                  <li>Continuing education</li>
                  <li>Training opportunities</li>
                </ul>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Special Programs</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>Housing assistance</li>
                  <li>Commuter benefits</li>
                  <li>Wellness programs</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
            <h3 className="font-semibold text-lg mb-2 text-primary">
              Special Opportunities
            </h3>
            <p className="mb-2">
              San Francisco Deputy Sheriffs may qualify for special programs:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>G.I. Bill benefits for veterans</li>
              <li>Discounted housing programs for law enforcement</li>
              <li>Special loan forgiveness programs</li>
            </ul>
            <div className="mt-4">
              <Link href="/deputy-launchpad">
                <Button
                  variant="outline"
                  className="border-primary text-primary"
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
      title: "Online Application",
      description:
        "Complete the initial application form with your personal information and qualifications.",
    },
    {
      step: 2,
      title: "Written Examination",
      description:
        "Take the written test to assess your basic skills and aptitude for law enforcement work.",
    },
    {
      step: 3,
      title: "Physical Ability Test",
      description:
        "Complete the physical fitness assessment to ensure you meet the physical requirements.",
    },
    {
      step: 4,
      title: "Oral Interview",
      description:
        "Participate in an interview with department representatives to assess your suitability.",
    },
    {
      step: 5,
      title: "Background Investigation",
      description:
        "Undergo a thorough background check of your personal and professional history.",
    },
    {
      step: 6,
      title: "Medical & Psychological Exams",
      description:
        "Complete medical and psychological evaluations to ensure fitness for duty.",
    },
    {
      step: 7,
      title: "Final Selection",
      description:
        "Receive a conditional offer of employment if you successfully complete all steps.",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {applicationSteps.map((step) => (
          <Card key={step.step} className="overflow-hidden">
            <CardHeader className="bg-primary/5 pb-4">
              <div className="flex items-center">
                <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center mr-3">
                  {step.step}
                </div>
                <CardTitle>{step.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-gray-600">{step.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
        <h3 className="font-semibold text-lg mb-2 text-primary">
          Tips for Success
        </h3>
        <ul className="space-y-2">
          <li className="flex items-start">
            <div className="rounded-full bg-primary/10 p-1 mr-3 mt-0.5">
              <Shield className="h-4 w-4 text-primary" />
            </div>
            <span>
              <strong>Prepare thoroughly</strong> for each step of the process,
              especially the written and physical tests.
            </span>
          </li>
          <li className="flex items-start">
            <div className="rounded-full bg-primary/10 p-1 mr-3 mt-0.5">
              <Shield className="h-4 w-4 text-primary" />
            </div>
            <span>
              <strong>Be honest</strong> throughout the entire process,
              particularly during the background investigation.
            </span>
          </li>
          <li className="flex items-start">
            <div className="rounded-full bg-primary/10 p-1 mr-3 mt-0.5">
              <Shield className="h-4 w-4 text-primary" />
            </div>
            <span>
              <strong>Stay in touch</strong> with your background investigator
              and respond promptly to requests for information.
            </span>
          </li>
          <li className="flex items-start">
            <div className="rounded-full bg-primary/10 p-1 mr-3 mt-0.5">
              <Shield className="h-4 w-4 text-primary" />
            </div>
            <span>
              <strong>Maintain physical fitness</strong> throughout the process
              to ensure you&apos;re ready for the academy.
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
        <CardDescription className="text-gray-200">
          Learn about the training you&apos;ll receive as a San Francisco Deputy
          Sheriff
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-2/3">
              <h3 className="text-xl font-semibold mb-4">Academy Overview</h3>
              <p className="mb-4">
                After receiving a conditional offer of employment, you&apos;ll
                attend the San Francisco Sheriff&apos;s Department Academy, a
                comprehensive training program designed to prepare you for the
                challenges of law enforcement.
              </p>
              <p className="mb-4">
                The academy is a full-time, paid position. During this time,
                you&apos;ll be a Deputy Sheriff Trainee, receiving instruction
                in all aspects of law enforcement and corrections.
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
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Law & Legal Procedures</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>Criminal law</li>
                  <li>Constitutional law</li>
                  <li>Search and seizure</li>
                  <li>Evidence handling</li>
                  <li>Court procedures</li>
                </ul>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Tactical Training</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>Defensive tactics</li>
                  <li>Firearms training</li>
                  <li>Use of force</li>
                  <li>Officer safety</li>
                  <li>Emergency response</li>
                </ul>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Corrections Operations</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>Inmate supervision</li>
                  <li>Jail security</li>
                  <li>Classification procedures</li>
                  <li>Contraband control</li>
                  <li>Crisis intervention</li>
                </ul>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Professional Development</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>Ethics and professionalism</li>
                  <li>Cultural diversity</li>
                  <li>Communication skills</li>
                  <li>Report writing</li>
                  <li>Stress management</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Academy Structure</h3>
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Duration</h4>
                  <p className="text-sm text-gray-600">
                    The academy typically lasts 16 weeks, with full-time
                    training Monday through Friday.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Physical Training</h4>
                  <p className="text-sm text-gray-600">
                    Regular physical training sessions to build strength,
                    endurance, and fitness.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Testing</h4>
                  <p className="text-sm text-gray-600">
                    Regular written and practical exams to assess knowledge and
                    skills.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">After the Academy</h3>
            <p className="mb-4">
              Upon successful completion of the academy, you&apos;ll begin a
              field training program where you&apos;ll work alongside
              experienced deputies to apply your training in real-world
              situations.
            </p>
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Field Training Program</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                <li>Typically lasts 12-16 weeks</li>
                <li>Hands-on experience in various assignments</li>
                <li>Regular evaluation and feedback</li>
                <li>Gradual increase in responsibilities</li>
                <li>Mentorship from experienced deputies</li>
              </ul>
            </div>
          </div>

          <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
            <h3 className="font-semibold text-lg mb-2 text-primary">
              Continuing Education
            </h3>
            <p className="mb-2">
              Your training doesn&apos;t end with the academy. The San Francisco
              Sheriff&apos;s Department offers ongoing professional development
              opportunities:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>Specialized training courses</li>
              <li>Advanced certifications</li>
              <li>Leadership development programs</li>
              <li>Tuition assistance for higher education</li>
            </ul>
            <div className="mt-4">
              <Link href="/deputy-launchpad">
                <Button
                  variant="outline"
                  className="border-primary text-primary"
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

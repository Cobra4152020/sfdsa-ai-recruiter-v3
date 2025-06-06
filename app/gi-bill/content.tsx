import Image from "next/image";
import { CheckCircle, FileText, DollarSign, HelpCircle, Phone, Mail, Shield, Star, ExternalLink, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageWrapper } from "@/components/page-wrapper";
import Link from "next/link";

export default function GIBillContent() {
  const benefitTypes = [
    {
      icon: DollarSign,
      title: "Training Costs",
      description: "Full or partial coverage of the Sheriff's Academy training program costs",
      coverage: "Up to 100%"
    },
    {
      icon: Shield,
      title: "Housing Allowance", 
      description: "Monthly housing allowance based on the ZIP code of the training facility",
      coverage: "E-5 Rate + Dependents"
    },
    {
      icon: FileText,
      title: "Books & Supplies",
      description: "Annual stipend for books and supplies required for training",
      coverage: "Up to $1,000/year"
    },
    {
      icon: Star,
      title: "Continuing Education",
      description: "Support for additional law enforcement certifications and education",
      coverage: "Ongoing Support"
    }
  ];

  const eligibilityRequirements = [
    "Served at least 90 days of active duty service after September 10, 2001",
    "Received an honorable discharge",
    "Have remaining G.I. Bill benefits available to use",
    "Be accepted into the San Francisco Sheriff's Office training program",
    "Maintain satisfactory academic progress during training"
  ];

  const applicationSteps = [
    {
      step: 1,
      title: "Verify Your Eligibility",
      description: "Check your eligibility and remaining benefits through the VA's eBenefits portal or by calling 1-888-GI-BILL-1.",
      icon: CheckCircle
    },
    {
      step: 2, 
      title: "Apply to the Sheriff's Office",
      description: "Complete your application to the San Francisco Sheriff's Office and mention your veteran status.",
      icon: Shield
    },
    {
      step: 3,
      title: "Submit VA Form 22-1990",
      description: "If you haven't used your G.I. Bill benefits before, submit VA Form 22-1990 (Application for VA Education Benefits).",
      icon: FileText
    },
    {
      step: 4,
      title: "Receive Certificate of Eligibility", 
      description: "After your application is processed, you'll receive a Certificate of Eligibility (COE) from the VA.",
      icon: Mail
    },
    {
      step: 5,
      title: "Submit COE to Veterans Liaison",
      description: "Provide your COE to our Veterans Liaison who will help coordinate your benefits with the training program.",
      icon: Users
    }
  ];

  const faqs = [
    {
      question: "Can I use my G.I. Bill benefits for the Sheriff's Academy?",
      answer: "Yes, the San Francisco Sheriff's Academy is an approved program for G.I. Bill benefits. The specific amount covered depends on your eligibility and benefit type."
    },
    {
      question: "Will my benefits cover the entire cost of training?",
      answer: "Post-9/11 G.I. Bill benefits may cover up to 100% of your training costs, depending on your length of service and eligibility percentage."
    },
    {
      question: "Can I receive a housing allowance while in training?",
      answer: "Yes, eligible veterans can receive a monthly housing allowance based on the E-5 with dependents rate for the ZIP code of the training facility."
    },
    {
      question: "What if I've already used some of my G.I. Bill benefits?",
      answer: "You can use your remaining benefits for Sheriff's training. Our Veterans Liaison can help you determine how many months of benefits you have left."
    },
    {
      question: "Is there a time limit for using my G.I. Bill benefits?",
      answer: "For Post-9/11 G.I. Bill, benefits must generally be used within 15 years of your last discharge date if you were discharged before January 1, 2013. There is no time limit for those discharged after that date."
    },
    {
      question: "Can I work while using my G.I. Bill benefits?",
      answer: "Yes, you can work while attending the Sheriff's Academy and using your G.I. Bill benefits. However, the training schedule is intensive and may limit your availability for other employment."
    }
  ];

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#0A3C1F] to-[#0A3C1F]/80 bg-clip-text text-transparent mb-6">
              🇺🇸 G.I. Bill Benefits
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              As a veteran, you can use your G.I. Bill benefits to help fund your training and education 
              as you transition to a career with the San Francisco Sheriff's Office.
            </p>

            {/* Quick Stats */}
            <div className="bg-gradient-to-r from-[#0A3C1F]/10 to-transparent border border-[#0A3C1F]/20 rounded-lg p-6 mb-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-[#0A3C1F]">100%</div>
                  <div className="text-sm text-gray-600 font-medium">Tuition Coverage</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#0A3C1F]">$2,000+</div>
                  <div className="text-sm text-gray-600 font-medium">Monthly Housing</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#0A3C1F]">$1,000</div>
                  <div className="text-sm text-gray-600 font-medium">Books & Supplies</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#0A3C1F]">24/7</div>
                  <div className="text-sm text-gray-600 font-medium">Veteran Support</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Hero Image */}
              <Card className="mb-8 overflow-hidden">
                <div className="relative w-full h-[300px]">
                  <Image
                    src="/veterans-law-enforcement-training.png"
                    alt="Veterans in law enforcement training"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                    <div className="p-6">
                      <h2 className="text-2xl font-bold text-white mb-2">
                        From Service to Sheriff
                      </h2>
                      <p className="text-white/80">
                        Continue your service to the community in a new role
                      </p>
                      <Badge className="mt-2 bg-[#FFD700] text-[#0A3C1F]">
                        Veteran Preferred
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Tabs Content */}
              <Tabs defaultValue="eligibility" className="mb-8">
                <TabsList className="grid grid-cols-4 mb-6 w-full">
                  <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
                  <TabsTrigger value="benefits">Benefits</TabsTrigger>
                  <TabsTrigger value="application">Application</TabsTrigger>
                  <TabsTrigger value="faq">FAQ</TabsTrigger>
                </TabsList>

                <TabsContent value="eligibility">
                  <Card className="shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                      <CardTitle className="flex items-center text-xl">
                        <CheckCircle className="h-6 w-6 mr-3" />
                        Eligibility Requirements
                      </CardTitle>
                      <CardDescription className="text-green-100">
                        Find out if you qualify for G.I. Bill benefits
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <p className="text-gray-700 mb-6">
                        To be eligible for G.I. Bill benefits as a San Francisco Deputy Sheriff recruit, 
                        you must meet the following criteria:
                      </p>
                      <div className="space-y-3">
                        {eligibilityRequirements.map((requirement, index) => (
                          <div key={index} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{requirement}</span>
                          </div>
                        ))}
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                        <p className="text-blue-800 text-sm">
                          <strong>Note:</strong> Different types of G.I. Bill programs have different eligibility requirements. 
                          Contact our veteran liaison for specific details about your situation.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="benefits">
                  <Card className="shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                      <CardTitle className="flex items-center text-xl">
                        <DollarSign className="h-6 w-6 mr-3" />
                        Available Benefits
                      </CardTitle>
                      <CardDescription className="text-blue-100">
                        What the G.I. Bill covers for Deputy Sheriff training
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <p className="text-gray-700 mb-6">
                        As a qualified veteran, your G.I. Bill benefits may cover:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {benefitTypes.map((benefit, index) => {
                          const Icon = benefit.icon;
                          return (
                            <div key={index} className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 p-4 rounded-lg">
                              <div className="flex items-center mb-3">
                                <div className="bg-blue-600 p-2 rounded-full mr-3">
                                  <Icon className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-blue-900">{benefit.title}</h3>
                                  <Badge variant="outline" className="text-xs bg-blue-200 text-blue-800">
                                    {benefit.coverage}
                                  </Badge>
                                </div>
                              </div>
                              <p className="text-blue-800 text-sm">{benefit.description}</p>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="application">
                  <Card className="shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
                      <CardTitle className="flex items-center text-xl">
                        <FileText className="h-6 w-6 mr-3" />
                        Application Process
                      </CardTitle>
                      <CardDescription className="text-purple-100">
                        Steps to apply your G.I. Bill benefits
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-6">
                        {applicationSteps.map((step, index) => {
                          const Icon = step.icon;
                          return (
                            <div key={index} className="flex items-start">
                              <div className="flex-shrink-0 mr-4">
                                <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                                  {step.step}
                                </div>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center mb-2">
                                  <Icon className="h-5 w-5 text-purple-600 mr-2" />
                                  <h3 className="font-semibold text-gray-900">{step.title}</h3>
                                </div>
                                <p className="text-gray-700 text-sm">{step.description}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4 mt-6">
                        <div className="flex items-center mb-2">
                          <Users className="h-5 w-5 text-purple-600 mr-2" />
                          <h3 className="font-semibold text-purple-900">Need Assistance?</h3>
                        </div>
                        <p className="text-purple-800 text-sm">
                          Our dedicated Veterans Liaison is available to help you navigate the G.I. Bill application process. 
                          Contact us at veterans@sfdeputysheriff.com or call (415) 554-7225.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="faq">
                  <Card className="shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-700 text-white">
                      <CardTitle className="flex items-center text-xl">
                        <HelpCircle className="h-6 w-6 mr-3" />
                        Frequently Asked Questions
                      </CardTitle>
                      <CardDescription className="text-orange-100">
                        Common questions about using G.I. Bill benefits
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-6">
                        {faqs.map((faq, index) => (
                          <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
                            <h3 className="font-semibold text-orange-900 mb-2">
                              {faq.question}
                            </h3>
                            <p className="text-gray-700 text-sm">{faq.answer}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Call to Action */}
              <Card className="bg-gradient-to-r from-[#0A3C1F] to-[#0A3C1F]/90 text-white shadow-lg">
                <CardContent className="p-8 text-center">
                  <h2 className="text-3xl font-bold mb-3">
                    Ready to Serve Again?
                  </h2>
                  <p className="text-white/90 mb-6 text-lg">
                    Let us help you transition your military experience into a rewarding 
                    career with the San Francisco Sheriff's Office.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link href="/apply">
                      <Button size="lg" className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#0A3C1F] font-semibold">
                        Apply Now
                      </Button>
                    </Link>
                    <Link href="/contact">
                      <Button
                        size="lg"
                        variant="outline"
                        className="border-white text-white hover:bg-white/10"
                      >
                        Contact Veterans Liaison
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Veterans Contact */}
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Veterans Liaison
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Mail className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium text-green-900">Email</p>
                        <a 
                          href="mailto:veterans@sfdeputysheriff.com" 
                          className="text-sm text-green-700 hover:text-green-900 transition-colors"
                        >
                          veterans@sfdeputysheriff.com
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Phone className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium text-green-900">Phone</p>
                        <a 
                          href="tel:+14155547225" 
                          className="text-sm text-green-700 hover:text-green-900 transition-colors"
                        >
                          (415) 554-7225
                        </a>
                      </div>
                    </div>
                    <div className="bg-white border border-green-200 rounded p-3 mt-4">
                      <p className="text-xs text-green-700">
                        <strong>Office Hours:</strong> Monday-Friday, 8:00 AM - 5:00 PM
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Veteran Resources
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-3">
                  <a 
                    href="https://www.va.gov/education/eligibility/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button variant="outline" className="w-full justify-start border-blue-300 text-blue-800 hover:bg-blue-200">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      VA Education Benefits
                    </Button>
                  </a>
                  <a 
                    href="https://www.ebenefits.va.gov/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button variant="outline" className="w-full justify-start border-blue-300 text-blue-800 hover:bg-blue-200">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      eBenefits Portal
                    </Button>
                  </a>
                  <Link href="/contact">
                    <Button variant="outline" className="w-full justify-start border-blue-300 text-blue-800 hover:bg-blue-200">
                      <Mail className="h-4 w-4 mr-2" />
                      Contact Support
                    </Button>
                  </Link>
                  <Link href="/chat-with-sgt-ken">
                    <Button variant="outline" className="w-full justify-start border-blue-300 text-blue-800 hover:bg-blue-200">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Ask Sgt. Ken AI
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Benefits Calculator */}
              <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
                <CardHeader className="bg-gradient-to-r from-yellow-600 to-yellow-700 text-white">
                  <CardTitle className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Benefits Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <p className="text-yellow-800 text-sm">
                      Use the VA's benefit calculator to estimate your monthly payments:
                    </p>
                    <a 
                      href="https://www.va.gov/gi-bill-comparison-tool/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        VA Benefits Calculator
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

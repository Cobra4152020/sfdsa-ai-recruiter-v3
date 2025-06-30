"use client";

import { useState } from "react";
import { PageWrapper } from "@/components/page-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronDown, 
  ChevronUp, 
  Search, 
  MessageSquare, 
  Clock, 
  DollarSign, 
  BookOpen, 
  Shield, 
  Users, 
  GraduationCap,
  MapPin,
  FileText,
  AlertCircle,
  CheckCircle,
  ExternalLink
} from "lucide-react";
import AskSgtKenButton from "@/components/ask-sgt-ken-button";
import Link from "next/link";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  icon: any;
  keywords: string[];
}

const faqData: FAQItem[] = [
  {
    id: "qualifications",
    question: "What are the minimum qualifications to become a Deputy Sheriff?",
    answer: "Applicants must be at least 20 years old at the time of application and 21 years old at the time of appointment. A high school diploma or equivalent is required. Applicants must have a legal right to work in the United States. Citizenship is not required.",
    category: "Qualifications",
    icon: Shield,
    keywords: ["age", "education", "requirements", "citizenship", "qualifications"]
  },
  {
    id: "experience",
    question: "Do I need prior law enforcement experience to apply?",
    answer: "No prior experience is necessary. The Sheriff's Office provides comprehensive training at the academy for all new recruits. We welcome candidates from all backgrounds who are committed to public service.",
    category: "Experience",
    icon: Users,
    keywords: ["experience", "training", "academy", "background", "new recruits"]
  },
  {
    id: "residency",
    question: "Do I need to live in San Francisco to apply?",
    answer: "No, residency in San Francisco is not required. You can live anywhere and still apply to become a Deputy Sheriff with the San Francisco Sheriff's Office.",
    category: "Requirements",
    icon: MapPin,
    keywords: ["residency", "location", "live", "requirements", "san francisco"]
  },
  {
    id: "hiring-process",
    question: "What does the hiring process involve?",
    answer: "The process includes an online application, written examination, physical ability test, oral interview, background investigation, medical examination, psychological evaluation, and a polygraph test. We do not offer or accept the POST Entry-level Law Enforcement Test Battery (PELLETB). We accept and test for REACT.",
    category: "Application Process",
    icon: FileText,
    keywords: ["hiring", "process", "steps", "examination", "interview", "background", "REACT"]
  },
  {
    id: "hiring-timeline",
    question: "How long is the hiring process?",
    answer: "The process varies but typically takes 6 to 12 months from initial application to final appointment. We work to move qualified candidates through as efficiently as possible.",
    category: "Application Process",
    icon: Clock,
    keywords: ["timeline", "duration", "months", "how long", "time"]
  },
  {
    id: "salary",
    question: "What is the starting salary for a Deputy Sheriff?",
    answer: "As of January 4, 2025, the starting annual salary for an entry level Deputy Sheriff is $91,177.45. This includes excellent benefits, overtime opportunities, and regular pay increases. Current salary ranges go up to $184,362 with incentives and experience.",
    category: "Compensation",
    icon: DollarSign,
    keywords: ["salary", "pay", "compensation", "benefits", "money", "income"]
  },
  {
    id: "training",
    question: "What training will I receive?",
    answer: "New recruits attend a 26-week P.O.S.T. (Peace Officer Standards and Training) certified Academy covering criminal law, community policing, defensive tactics, firearms training, physical fitness, and Emergency Vehicle Operations Course (E.V.O.C.). The training is comprehensive and prepares you for all aspects of the job.",
    category: "Training",
    icon: GraduationCap,
    keywords: ["training", "academy", "POST", "education", "weeks", "preparation"]
  },
  {
    id: "drivers-license",
    question: "Do I need a California Driver's License to apply?",
    answer: "Yes, you must possess a valid California Driver's License at the time of appointment. This is required for all Deputy Sheriff positions.",
    category: "Requirements",
    icon: Shield,
    keywords: ["license", "california", "driving", "appointment", "required"]
  },
  {
    id: "criminal-background",
    question: "Can I apply if I have prior criminal convictions?",
    answer: "Felony convictions disqualify applicants, but certain misdemeanor offenses may not automatically disqualify you. Each case is reviewed individually during the background investigation process.",
    category: "Background",
    icon: AlertCircle,
    keywords: ["criminal", "convictions", "background", "felony", "misdemeanor", "disqualify"]
  },
  {
    id: "background-documents",
    question: "What documents do I need for the background investigation?",
    answer: "You need 20+ key documents including: certified birth certificate, Social Security card, driver's license, sealed educational transcripts, DD214 (veterans), Selective Service registration (males), marriage/divorce certificates, vehicle insurance declaration page, passport-size photo, proof of right to work, criminal records from all jurisdictions, driving records (MVR), and more. Use our comprehensive Background Preparation Checklist with detailed instructions and progress tracking.",
    category: "Background",
    icon: FileText,
    keywords: ["documents", "background", "checklist", "requirements", "preparation", "birth certificate", "transcripts"]
  },
  {
    id: "background-preparation",
    question: "How can I prepare for the background investigation?",
    answer: "Start gathering documents early! The most time-consuming items are sealed educational transcripts (2-4 weeks), certified birth certificates (1-3 weeks), and military records (2-8 weeks). Order these immediately after passing your oral exam. Being prepared prevents delays that could extend your process by months.",
    category: "Background",
    icon: Clock,
    keywords: ["prepare", "background", "early", "documents", "timeline", "delays", "transcripts", "military"]
  },
  {
    id: "background-cooperation",
    question: "What should I expect during the background investigation?",
    answer: "You must keep your investigator updated on ANY changes: address, employment, citations, court matters, or law enforcement contact. Make yourself available for appointments and respond promptly to requests. The investigation is confidential - don't have friends inquire about your status. Cooperation and honesty are essential for timely completion.",
    category: "Background",
    icon: Shield,
    keywords: ["background", "investigator", "cooperation", "updates", "confidential", "honesty", "appointments"]
  },
  {
    id: "criminal-driving-records",
    question: "Do I need to disclose minor traffic tickets and old arrests?",
    answer: "YES! You must disclose EVERYTHING - all arrests (even if charges dropped), traffic tickets, DUI/DWI, license suspensions, court cases, and any law enforcement contact. Get certified records from all jurisdictions. Being honest about minor issues is far better than trying to hide them. Most minor infractions won't disqualify you, but dishonesty will.",
    category: "Background",
    icon: AlertCircle,
    keywords: ["criminal", "driving", "records", "tickets", "DUI", "arrests", "honesty", "disclose", "traffic"]
  },
  {
    id: "assignments",
    question: "What assignments are available within the Sheriff's Office?",
    answer: "Available assignments include Custody Operations Divisions, Community Programs, Backgrounds, Community Assessment and Referral Center (CARC), City Hall Patrol Unit (CHPU), Civil Section, Classification Unit, Court Services, Emergency Communication Dispatch, Public Utilities Commission Building Security, San Francisco General Hospital, Sheriff's Patrol Unit, Transportation Unit, and Warrant Services Unit. Deputies can pursue specialized units such as Emergency Services, Special Response Team, and Criminal Investigations Unit.",
    category: "Career Paths",
    icon: Users,
    keywords: ["assignments", "divisions", "specialization", "units", "career", "opportunities"]
  },
  {
    id: "education-support",
    question: "Does the Sheriff's Office support continuing education?",
    answer: "Yes, the Sheriff's Office encourages ongoing professional development and offers tuition reimbursement for eligible courses. We support our deputies' growth throughout their careers.",
    category: "Benefits",
    icon: BookOpen,
    keywords: ["education", "tuition", "reimbursement", "development", "courses", "growth"]
  },
  {
    id: "lateral-transfers",
    question: "Are there lateral transfer opportunities for experienced law enforcement officers?",
    answer: "Yes, lateral transfers are welcome and qualify for higher initial salaries based on experience. Contact our recruitment team for more information about lateral transfer opportunities and salary placement.",
    category: "Experience",
    icon: Users,
    keywords: ["lateral", "transfer", "experienced", "higher salary", "officers"]
  },
  {
    id: "physical-test",
    question: "What does the physical ability test include?",
    answer: "The physical ability test consists of three components: 1) Run 500 yards, 2) Lift and drag a 165-pound dummy 32 feet, and 3) Complete a 99-yard obstacle course. This ensures you're physically prepared for the demands of the job.",
    category: "Testing",
    icon: Shield,
    keywords: ["physical", "test", "fitness", "run", "obstacle", "dummy", "yards"]
  },
  {
    id: "application-steps",
    question: "What are the complete application process steps?",
    answer: "The complete process includes: 1) Fill out online application, 2) Take REACT practice test, 3) Pass physical ability test, 4) Complete oral interview, 5) Watch video scenarios and answer questions, 6) Submit personal history statement, 7) Pass background investigation, 8) Pass psychological evaluation and polygraph test, 9) Pass medical examination.",
    category: "Application Process",
    icon: CheckCircle,
    keywords: ["application", "steps", "process", "complete", "requirements"]
  }
];

const categories = Array.from(new Set(faqData.map(faq => faq.category)));

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = searchTerm === "" || 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-8">
        {/* Place all main content here, no inner max-w-6xl wrapper */}
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Get instant answers to the most common questions about joining the San Francisco Sheriff's Office. 
              Can't find what you're looking for? Chat with Sgt. Ken for personalized assistance!
            </p>
            
            {/* Quick Chat Button */}
            <div className="flex justify-center mb-8">
              <AskSgtKenButton 
                variant="default"
                className="bg-[#FFD700] text-primary hover:bg-[#FFD700]/90 px-8 py-3 text-lg font-semibold shadow-lg"
              />
            </div>
          </div>

          {/* Search and Filter Section */}
          <Card className="mb-8 bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search FAQs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 py-3"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedCategory === "All" ? "default" : "outline"}
                    onClick={() => setSelectedCategory("All")}
                    className={selectedCategory === "All" ? "bg-primary text-white" : ""}
                  >
                    All
                  </Button>
                  {categories.map(category => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      onClick={() => setSelectedCategory(category)}
                      className={selectedCategory === category ? "bg-primary text-white" : ""}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Summary */}
          {searchTerm && (
            <div className="mb-6">
              <Badge variant="secondary" className="text-sm">
                {filteredFAQs.length} result{filteredFAQs.length !== 1 ? 's' : ''} found for "{searchTerm}"
              </Badge>
            </div>
          )}

          {/* FAQ Items */}
          <div className="space-y-4">
            {filteredFAQs.map((faq) => {
              const isOpen = openItems.has(faq.id);
              const IconComponent = faq.icon;
              
              return (
                <Card key={faq.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                  <CardHeader 
                    className="cursor-pointer bg-gradient-to-r from-white to-gray-50 hover:from-gray-50 hover:to-gray-100 transition-colors duration-200"
                    onClick={() => toggleItem(faq.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <IconComponent className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-left text-lg text-primary">{faq.question}</CardTitle>
                          <Badge variant="outline" className="mt-1 text-xs">
                            {faq.category}
                          </Badge>
                        </div>
                      </div>
                      {isOpen ? (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                  </CardHeader>
                  {isOpen && (
                    <CardContent className="pt-0 pb-6">
                      <div className="pl-11">
                        <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>

          {/* No Results */}
          {filteredFAQs.length === 0 && (
            <Card className="p-8 text-center">
              <div className="text-gray-500 mb-4">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No FAQs found</h3>
                <p>Try adjusting your search terms or browse all categories.</p>
              </div>
              <div className="mt-6">
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All");
                  }}
                  variant="outline"
                  className="mr-4"
                >
                  Clear Filters
                </Button>
                <AskSgtKenButton 
                  variant="default"
                  className="bg-primary text-white hover:bg-primary/90"
                />
              </div>
            </Card>
          )}

          {/* Additional Resources Section */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardHeader className="text-center">
                <MessageSquare className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <CardTitle className="text-blue-900">Still Have Questions?</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-blue-800 mb-4">Chat with Sgt. Ken for personalized answers to your specific questions.</p>
                <AskSgtKenButton 
                  variant="secondary"
                  className="w-full bg-blue-600 text-white hover:bg-blue-700"
                />
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardHeader className="text-center">
                <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <CardTitle className="text-green-900">Background Prep Checklist</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-green-800 mb-4">Interactive checklist with all 17 required documents and detailed instructions.</p>
                <Button 
                  variant="outline" 
                  className="w-full border-green-300 text-green-800 hover:bg-green-200 mb-2"
                  asChild
                >
                  <Link href="/background-preparation">
                    Background Checklist
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full border-green-300 text-green-800 hover:bg-green-200"
                  asChild
                >
                  <Link href="/application-process">
                    Application Process
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
              <CardHeader className="text-center">
                <Shield className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <CardTitle className="text-yellow-900">Ready to Apply?</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-yellow-800 mb-4">Start your journey to becoming a Deputy Sheriff today!</p>
                <Button 
                  className="w-full bg-yellow-600 text-white hover:bg-yellow-700"
                  asChild
                >
                  <Link href="/apply">
                    Apply Now
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Source Attribution */}
          <div className="mt-12 text-center text-sm text-gray-500">
            <p>Comprehensive recruitment information for San Francisco Deputy Sheriff positions.</p>
            <p className="mt-1">Last updated: January 2025</p>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
} 
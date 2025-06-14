"use client";

import { useState, useEffect } from "react";
import { PageWrapper } from "@/components/page-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  Circle, 
  Clock, 
  AlertTriangle, 
  ExternalLink, 
  Phone, 
  Globe, 
  FileText, 
  Shield, 
  GraduationCap,
  Heart,
  Car,
  Camera,
  Award,
  BookOpen,
  CreditCard,
  MapPin,
  MessageSquare,
  Lock,
  Trophy,
  Star,
  Zap
} from "lucide-react";
import { useAuthModal } from "@/context/auth-modal-context";
import { useUser } from "@/context/user-context";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

const REQUIRED_POINTS = 75;

interface Document {
  id: string;
  title: string;
  description: string;
  category: string;
  required: boolean;
  timeToObtain: string;
  difficulty: "Easy" | "Moderate" | "Complex";
  instructions: string[];
  tips: string[];
  icon: any;
  websites?: string[];
  phone?: string;
  cost?: string;
}

const documents: Document[] = [
  {
    id: "birth-certificate",
    title: "Certified Birth Certificate",
    description: "Official certified copy of your birth certificate",
    category: "Identity",
    required: true,
    timeToObtain: "1-3 weeks",
    difficulty: "Moderate",
    icon: FileText,
    cost: "$15-30",
    instructions: [
      "Contact vital records office in your birth state",
      "Request certified copy (not photocopy)",
      "Provide identification and birth details",
      "Pay required fees (usually $15-30)",
      "Allow 1-3 weeks for processing"
    ],
    tips: [
      "Order multiple copies - you may need them for other purposes",
      "If born outside the US, you need Certificate of Naturalization or Citizenship",
      "Adoption may require additional documentation"
    ],
    websites: ["www.cdc.gov/nchs/w2w/index.htm"]
  },
  {
    id: "social-security-card",
    title: "Social Security Card",
    description: "Copy of your Social Security card",
    category: "Identity",
    required: true,
    timeToObtain: "1-2 weeks",
    difficulty: "Easy",
    icon: CreditCard,
    cost: "Free",
    instructions: [
      "Visit local Social Security office or apply online",
      "Complete Form SS-5",
      "Provide proof of identity and citizenship",
      "Submit in person or by mail"
    ],
    tips: [
      "Replacement cards are free",
      "You can get up to 3 replacement cards per year",
      "Keep original in safe place after getting copy"
    ],
    websites: ["www.ssa.gov"],
    phone: "1-800-772-1213"
  },
  {
    id: "drivers-license",
    title: "California Driver's License",
    description: "Copy of current California driver's license",
    category: "Identity",
    required: true,
    timeToObtain: "Same day",
    difficulty: "Easy",
    icon: Car,
    cost: "None for copy",
    instructions: [
      "Make clear photocopy of both sides",
      "Ensure all information is legible",
      "License must be valid and current"
    ],
    tips: [
      "Must be California license (out-of-state not accepted)",
      "Renew if expiring soon",
      "Report any address changes to DMV immediately"
    ]
  },
  {
    id: "passport",
    title: "U.S. Passport",
    description: "Copy of current U.S. passport",
    category: "Identity",
    required: true,
    timeToObtain: "Same day (if you have one)",
    difficulty: "Easy",
    icon: BookOpen,
    cost: "None for copy",
    instructions: [
      "Make clear photocopy of photo page",
      "Include any visa pages if applicable",
      "Ensure expiration date is visible"
    ],
    tips: [
      "If you don't have a passport, apply for one early",
      "Passport applications take 6-8 weeks",
      "Expedited service available for additional fee"
    ],
    websites: ["travel.state.gov"]
  },
  {
    id: "selective-service",
    title: "Selective Service Registration",
    description: "Proof of registration with Selective Service (males only)",
    category: "Military",
    required: true,
    timeToObtain: "Instant online",
    difficulty: "Easy",
    icon: Shield,
    cost: "Free",
    instructions: [
      "Visit Selective Service website",
      "Enter personal information to verify registration",
      "Print verification letter",
      "If not registered, register immediately"
    ],
    tips: [
      "Required for males born after 1959",
      "Must register between ages 18-25",
      "Can still register after 25 but may affect eligibility"
    ],
    websites: ["www.sss.gov"],
    phone: "1-847-688-6888"
  },
  {
    id: "high-school-transcript",
    title: "High School Transcript (Sealed)",
    description: "Official sealed transcript from high school",
    category: "Education",
    required: true,
    timeToObtain: "2-4 weeks",
    difficulty: "Moderate",
    icon: GraduationCap,
    cost: "$5-15",
    instructions: [
      "Contact your high school registrar's office",
      "Request official sealed transcript",
      "Specify it's for employment background check",
      "Pay required fees",
      "DO NOT OPEN the sealed envelope"
    ],
    tips: [
      "Order multiple copies for future use",
      "If school closed, contact district office",
      "GED certificate accepted if no high school diploma"
    ]
  },
  {
    id: "college-transcript",
    title: "College Transcripts (Sealed)",
    description: "Official sealed transcripts from all colleges attended",
    category: "Education",
    required: true,
    timeToObtain: "2-4 weeks",
    difficulty: "Moderate",
    icon: GraduationCap,
    cost: "$5-20 per school",
    instructions: [
      "Contact registrar at each college/university attended",
      "Request official sealed transcripts",
      "Order from ALL schools, even if you didn't graduate",
      "DO NOT OPEN sealed envelopes"
    ],
    tips: [
      "Include community colleges and online schools",
      "Even one class counts - you need that transcript",
      "Some schools offer electronic delivery to employers"
    ]
  },
  {
    id: "dd214",
    title: "Military Discharge (DD214)",
    description: "Copy of DD214 showing character of service (Veterans only)",
    category: "Military",
    required: true,
    timeToObtain: "2-8 weeks",
    difficulty: "Complex",
    icon: Award,
    cost: "Free",
    instructions: [
      "Contact National Personnel Records Center",
      "Complete SF-180 form",
      "Provide service details and identification",
      "Submit by mail or online (eVetRecs)"
    ],
    tips: [
      "Member-4 copy shows character of service and re-entry code",
      "Fire damaged records (1973) may take longer",
      "Keep multiple copies for future use"
    ],
    websites: ["www.archives.gov/veterans"],
    phone: "1-314-801-0800"
  },
  {
    id: "marriage-certificate",
    title: "Marriage Certificate",
    description: "Certified copy of marriage certificate (if applicable)",
    category: "Personal",
    required: false,
    timeToObtain: "1-3 weeks",
    difficulty: "Moderate",
    icon: Heart,
    cost: "$10-25",
    instructions: [
      "Contact vital records office where marriage occurred",
      "Request certified copy",
      "Provide marriage details and identification",
      "Pay required fees"
    ],
    tips: [
      "Need certificate from each marriage",
      "Domestic partnership registration also accepted",
      "Keep original in safe place"
    ]
  },
  {
    id: "divorce-decree",
    title: "Divorce Decree",
    description: "Copy of final divorce decree (if applicable)",
    category: "Personal",
    required: false,
    timeToObtain: "1-2 weeks", 
    difficulty: "Moderate",
    icon: FileText,
    cost: "$10-25",
    instructions: [
      "Contact court clerk where divorce was finalized",
      "Request certified copy of final decree",
      "Provide case number if available",
      "Pay required fees"
    ],
    tips: [
      "Need decree from each divorce",
      "Dissolution decree for domestic partnerships",
      "Include any restraining orders from proceedings"
    ]
  },
  {
    id: "vehicle-insurance",
    title: "Vehicle Insurance Declaration",
    description: "Declaration page from current auto insurance policy",
    category: "Financial",
    required: false,
    timeToObtain: "Same day",
    difficulty: "Easy",
    icon: Car,
    cost: "Free",
    instructions: [
      "Contact your insurance agent or company",
      "Request current declaration page",
      "Print from online account if available",
      "Ensure it shows current coverage"
    ],
    tips: [
      "Not the card you carry in your wallet",
      "Must show current policy period",
      "Include all vehicles you own"
    ]
  },
  {
    id: "vehicle-registration",
    title: "Vehicle Registration",
    description: "Copy of current vehicle registration (if applicable)",
    category: "Financial",
    required: false,
    timeToObtain: "Same day",
    difficulty: "Easy",
    icon: Car,
    cost: "Free",
    instructions: [
      "Make copy of current registration",
      "Include all vehicles you own",
      "Ensure registration is current"
    ],
    tips: [
      "Renew if expiring soon",
      "Include motorcycles, RVs, trailers",
      "Address must match current address"
    ]
  },
  {
    id: "restraining-orders",
    title: "Restraining Orders",
    description: "Copies of any restraining orders issued or filed (if applicable)",
    category: "Legal",
    required: false,
    timeToObtain: "1-2 weeks",
    difficulty: "Moderate",
    icon: Shield,
    cost: "$10-20",
    instructions: [
      "Contact court clerk where order was issued",
      "Request certified copies",
      "Include both temporary and permanent orders",
      "Include orders you filed or filed against you"
    ],
    tips: [
      "Include expired orders",
      "Include stay-away orders",
      "Be honest about all orders"
    ]
  },
  {
    id: "bankruptcy-records",
    title: "Bankruptcy Records",
    description: "Copies of bankruptcy proceedings (if applicable)",
    category: "Financial",
    required: false,
    timeToObtain: "1-3 weeks",
    difficulty: "Complex",
    icon: FileText,
    cost: "$15-30",
    instructions: [
      "Contact bankruptcy court clerk",
      "Request complete case file copies",
      "Include discharge papers",
      "Include all bankruptcy filings"
    ],
    tips: [
      "Include Chapter 7, 11, and 13 filings",
      "Include dismissed cases",
      "Gather all related documentation"
    ]
  },
  {
    id: "covid-vaccination",
    title: "COVID-19 Vaccination Record",
    description: "Copy of current COVID-19 vaccination record",
    category: "Medical",
    required: true,
    timeToObtain: "Same day",
    difficulty: "Easy",
    icon: Shield,
    cost: "Free",
    instructions: [
      "Retrieve vaccination card or digital record",
      "Make clear photocopy",
      "Include all doses and boosters",
      "Contact provider if card is lost"
    ],
    tips: [
      "Digital records available through health providers",
      "Some states have digital vaccine passports",
      "Keep original card safe"
    ]
  },
  {
    id: "passport-photo",
    title: "Passport-Style Photo",
    description: "Recent 2x2 color photograph (passport size)",
    category: "Identity",
    required: true,
    timeToObtain: "Same day",
    difficulty: "Easy",
    icon: Camera,
    cost: "$10-15",
    instructions: [
      "Get professional passport photo taken",
      "Must be 2x2 inches in size",
      "Color photograph required",
      "Write your name on the back"
    ],
    tips: [
      "Available at most pharmacies and UPS stores",
      "Professional appearance required",
      "Recent photo (within 6 months)"
    ]
  },
  {
    id: "employment-authorization",
    title: "Employment Authorization",
    description: "Proof of right to work in the United States",
    category: "Identity",
    required: true,
    timeToObtain: "Varies",
    difficulty: "Moderate",
    icon: FileText,
    cost: "Varies",
    instructions: [
      "Provide Employment Authorization Document (EAD)",
      "OR combination of documents establishing identity and work authorization",
      "Check I-9 form for acceptable documents",
      "Ensure documents are current and valid"
    ],
    tips: [
      "Green card, driver's license + Social Security card combination works",
      "Passport alone establishes both identity and work authorization",
      "Documents must be original or certified copies"
    ]
  },
  {
    id: "criminal-records",
    title: "Criminal Records",
    description: "Complete records of any arrests, charges, or convictions",
    category: "Legal",
    required: true,
    timeToObtain: "1-4 weeks",
    difficulty: "Complex",
    icon: Shield,
    cost: "$10-50",
    instructions: [
      "Contact court clerk in each jurisdiction where you lived/worked",
      "Request certified copies of ALL criminal records",
      "Include arrests even if charges were dropped",
      "Include juvenile records if applicable",
      "Get records from federal, state, and local courts"
    ],
    tips: [
      "Be 100% honest - they WILL find everything anyway",
      "Include traffic citations that went to court",
      "Include expunged or sealed records",
      "Get records from ALL states you've lived in",
      "Minor infractions are usually not disqualifying"
    ]
  },
  {
    id: "driving-records",
    title: "Driving Records (MVR)",
    description: "Complete motor vehicle records including tickets, suspensions, DUI",
    category: "Legal", 
    required: true,
    timeToObtain: "1-2 weeks",
    difficulty: "Moderate",
    icon: Car,
    cost: "$5-25",
    instructions: [
      "Request certified driving record from each state where you held a license",
      "Contact DMV or equivalent agency",
      "Request complete 10-year history minimum",
      "Include motorcycle licenses if applicable",
      "Get records even if license was suspended/revoked"
    ],
    tips: [
      "Include ALL states you've ever had a license",
      "DUI/DWI records are critical - be honest",
      "Minor traffic violations usually aren't disqualifying",
      "Commercial licenses require separate records",
      "Some states allow online ordering"
    ],
    websites: ["www.dmv.org/driving-records.php"],
    phone: "Contact your state DMV"
  },
  {
    id: "court-documents",
    title: "Court Documents",
    description: "Any civil lawsuits, judgments, or court proceedings",
    category: "Legal",
    required: false,
    timeToObtain: "1-3 weeks",
    difficulty: "Moderate", 
    icon: FileText,
    cost: "$10-30",
    instructions: [
      "Contact court clerk where proceedings occurred",
      "Request certified copies of complete case files",
      "Include civil lawsuits as plaintiff or defendant", 
      "Include small claims court cases",
      "Include restraining order violations"
    ],
    tips: [
      "Include cases you won or lost",
      "Include settled cases",
      "Traffic court cases may be on driving record instead",
      "Bankruptcy is separate but also important"
    ]
  }
];

export default function BackgroundPreparationPage() {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [userPoints, setUserPoints] = useState<number>(0);
  const { openModal } = useAuthModal();
  const { currentUser } = useUser();
  const { toast } = useToast();

  // Load user points and saved progress
  useEffect(() => {
    const fetchUserPoints = async () => {
      if (currentUser) {
        try {
          const response = await fetch(`/api/user/points?userId=${currentUser.id}`);
          const data = await response.json();
          setUserPoints(data.totalPoints || 0);
        } catch (error) {
          console.error('Error fetching points:', error);
        }
      }
    };

    const loadProgress = () => {
      const saved = localStorage.getItem('background-checklist-progress');
      if (saved) {
        setCheckedItems(new Set(JSON.parse(saved)));
      }
    };

    fetchUserPoints();
    loadProgress();
  }, [currentUser]);

  // Save progress to localStorage
  const saveProgress = (newCheckedItems: Set<string>) => {
    localStorage.setItem('background-checklist-progress', JSON.stringify(Array.from(newCheckedItems)));
  };

  const toggleItem = (id: string) => {
    const newCheckedItems = new Set(checkedItems);
    if (newCheckedItems.has(id)) {
      newCheckedItems.delete(id);
    } else {
      newCheckedItems.add(id);
      // Award points for checking off items
      if (typeof window !== 'undefined' && currentUser) {
        fetch('/api/points/award', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: currentUser.id,
            action: 'background_prep',
            points: 2,
            description: `Checked off background document: ${documents.find(d => d.id === id)?.title}`
          })
        }).then(() => {
          toast({
            title: "Document Checked! +2 Points",
            description: "Great job staying organized with your background preparation!",
          });
          setUserPoints(prev => prev + 2);
        });
      }
    }
    
    setCheckedItems(newCheckedItems);
    saveProgress(newCheckedItems);
    
    // Check for completion achievements
    if (currentUser && typeof window !== 'undefined') {
      const newCompletedRequired = requiredDocs.filter(doc => newCheckedItems.has(doc.id)).length;
      const newCompletedTotal = documents.filter(doc => newCheckedItems.has(doc.id)).length;
      
      // Award "Background Prepared" badge for completing all required documents
      if (newCompletedRequired === requiredDocs.length && completedRequired < requiredDocs.length) {
        fetch('/api/award-badge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: currentUser.id,
            badgeType: "background-prepared",
            badgeName: "Background Prepared",
            badgeDescription: "Completed all required background investigation documents - ahead of 95% of candidates!",
            participationPoints: 25,
            shareMessage: "I'm fully prepared for my background investigation with all required documents ready!"
          })
        }).then(() => {
          toast({
            title: "🏆 Badge Earned: Background Prepared! +25 Bonus Points",
            description: "You're ahead of 95% of candidates! All required documents ready.",
          });
          setUserPoints(prev => prev + 25);
        });
      }
      
      // Award "Document Master" badge for completing ALL documents (required + optional)
      if (newCompletedTotal === documents.length && checkedItems.size < documents.length) {
        fetch('/api/award-badge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: currentUser.id,
            badgeType: "document-master",
            badgeName: "Document Master",
            badgeDescription: "Completed ALL background investigation documents (required + optional) - ultimate preparation achieved!",
            participationPoints: 50,
            shareMessage: "I've achieved Document Master status with every single background document completed!"
          })
        }).then(() => {
          toast({
            title: "🏆 Badge Earned: Document Master! +50 Bonus Points",
            description: "Ultimate preparation! You've completed every single document.",
          });
          setUserPoints(prev => prev + 50);
        });
      }
    }
  };

  const hasAccess = currentUser && userPoints >= REQUIRED_POINTS;
  const pointsNeeded = REQUIRED_POINTS - userPoints;

  const requiredDocs = documents.filter(doc => doc.required);
  const optionalDocs = documents.filter(doc => !doc.required);
  const completedRequired = requiredDocs.filter(doc => checkedItems.has(doc.id)).length;
  const completedOptional = optionalDocs.filter(doc => checkedItems.has(doc.id)).length;
  const totalRequired = requiredDocs.length;
  const progressPercentage = (completedRequired / totalRequired) * 100;

  const categories = Array.from(new Set(documents.map(doc => doc.category)));

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-800";
      case "Moderate": return "bg-yellow-100 text-yellow-800";
      case "Complex": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Premium Content Access Gate
  if (!currentUser || !hasAccess) {
    return (
      <PageWrapper>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <Lock className="h-12 w-12 text-amber-500 mr-3" />
                <Trophy className="h-12 w-12 text-amber-500" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#0A3C1F] to-amber-600 bg-clip-text text-transparent mb-4">
                Premium Background Preparation
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
                Unlock the complete background investigation checklist that could save you <strong>months of delays</strong>. 
                Get detailed instructions for all 20+ required documents with pro tips from successful candidates.
              </p>
            </div>

            {/* Points Status */}
            <Card className="mb-8 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
              <CardContent className="p-6">
                {!currentUser ? (
                  <div className="text-center">
                    <Shield className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-amber-900 mb-2">Sign Up to Start Your Journey</h3>
                    <p className="text-amber-800 mb-4">Get 50 points instantly when you register, then earn 25 more to unlock this premium content.</p>
                    <Button 
                      onClick={() => openModal("signup", "recruit")}
                      className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white px-8 py-3"
                    >
                      <Star className="h-4 w-4 mr-2" />
                      Sign Up & Get 50 Points
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-4">
                      <Trophy className="h-8 w-8 text-amber-600 mr-2" />
                      <span className="text-2xl font-bold text-amber-900">{userPoints} / {REQUIRED_POINTS} Points</span>
                    </div>
                    <Progress value={(userPoints / REQUIRED_POINTS) * 100} className="h-3 mb-4" />
                    <p className="text-amber-800 mb-4">
                      You need <strong>{pointsNeeded} more points</strong> to unlock this premium background preparation guide.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Preview Content */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-600" />
                  What You'll Get Access To
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">📋 Complete Document Checklist</h4>
                    <ul className="space-y-1 text-gray-600 text-sm">
                      <li>• Identity Documents (5 required)</li>
                      <li>• Educational Records (sealed transcripts)</li>
                      <li>• Military Records (veterans)</li>
                      <li>• Criminal Records (ALL jurisdictions)</li>
                      <li>• Driving Records (MVR from all states)</li>
                      <li>• Personal & Financial Documents</li>
                      <li>• Medical & Legal Records</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">🎯 Pro Success Tips</h4>
                    <ul className="space-y-1 text-gray-600 text-sm">
                      <li>• Exact processing times for each document</li>
                      <li>• Cost estimates and payment methods</li>
                      <li>• Website links and phone numbers</li>
                      <li>• Common mistakes to avoid</li>
                      <li>• Timeline optimization strategies</li>
                      <li>• Interactive progress tracking</li>
                      <li>• Points rewards for completion</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <h4 className="font-semibold text-amber-900 mb-2">⚡ Why This Matters</h4>
                  <p className="text-amber-800 text-sm">
                    <strong>Unprepared candidates face 3-6 month delays</strong> waiting for documents like sealed educational transcripts (2-4 weeks), 
                    military records (2-8 weeks), and criminal records from multiple jurisdictions (1-4 weeks each). 
                    Our checklist helps you start early and avoid these costly delays.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Earn Points Section */}
            {currentUser && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-green-600" />
                    Earn {pointsNeeded} More Points
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Quick Point Opportunities:</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm">Complete application interest</span>
                          <Badge>+500 points</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm">Social media share</span>
                          <Badge>+25 points</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm">Chat with Sgt. Ken</span>
                          <Badge>+5-7 points</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm">Practice tests</span>
                          <Badge>+20 points</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Get Started:</h4>
                      <div className="space-y-2">
                        <Button asChild className="w-full" variant="outline">
                          <Link href="/apply">
                            <FileText className="h-4 w-4 mr-2" />
                            Apply Now (+500 points)
                          </Link>
                        </Button>
                        <Button asChild className="w-full" variant="outline">
                          <Link href="/awards">
                            <Trophy className="h-4 w-4 mr-2" />
                            Share & Earn Points
                          </Link>
                        </Button>
                        <Button 
                          onClick={() => openModal("signup", "recruit")}
                          className="w-full" 
                          variant="outline"
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Chat with Sgt. Ken
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* FAQ Link */}
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardHeader className="text-center">
                <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <CardTitle className="text-blue-900">Questions About Background Investigation?</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-blue-800 mb-4">Get answers to common background investigation questions in our FAQ.</p>
                <Button 
                  variant="outline" 
                  className="border-blue-300 text-blue-800 hover:bg-blue-200"
                  asChild
                >
                  <Link href="/faq">
                    View Background FAQs
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageWrapper>
    );
  }

  // Full Access Content (existing content remains the same)
  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Trophy className="h-8 w-8 text-green-600 mr-2" />
              <span className="text-green-600 font-semibold">Premium Access Unlocked</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#0A3C1F] to-[#0A3C1F]/80 bg-clip-text text-transparent mb-4">
              Background Investigation Preparation
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-6">
              Get ahead of the process! Being prepared with all required documents can save you months of delays. 
              Use this comprehensive checklist to gather everything you need before your background investigator contacts you.
            </p>
            
            {/* Progress Overview */}
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="text-center md:text-left">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Your Progress</h3>
                    <p className="text-blue-700">
                      {completedRequired} of {totalRequired} required documents • {completedOptional} optional completed
                    </p>
                  </div>
                  <div className="w-full md:w-64">
                    <Progress value={progressPercentage} className="h-3 mb-2" />
                    <p className="text-sm text-blue-600 text-center">{Math.round(progressPercentage)}% Complete</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Key Tips */}
          <Card className="mb-8 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-900">
                <AlertTriangle className="h-5 w-5" />
                Critical Success Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-amber-800 mb-2">Start Early - Time-Consuming Items:</h4>
                  <ul className="space-y-1 text-amber-700">
                    <li>• Sealed educational transcripts: 2-4 weeks</li>
                    <li>• Military records (DD214): 2-8 weeks</li>
                    <li>• Criminal records (all jurisdictions): 1-4 weeks</li>
                    <li>• Certified birth certificates: 1-3 weeks</li>
                    <li>• Out-of-state documents: Add extra time</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-amber-800 mb-2">Pro Tips for Success:</h4>
                  <ul className="space-y-1 text-amber-700">
                    <li>• Order multiple copies of everything</li>
                    <li>• Keep originals in a safe place</li>
                    <li>• Update your investigator on ANY changes</li>
                    <li>• Be completely honest about everything</li>
                    <li>• Include ALL jurisdictions for criminal/driving records</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Document Categories */}
          {categories.map(category => {
            const categoryDocs = documents.filter(doc => doc.category === category);
            const completedInCategory = categoryDocs.filter(doc => checkedItems.has(doc.id));
            
            return (
              <Card key={category} className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      {category === "Identity" && <Shield className="h-5 w-5" />}
                      {category === "Education" && <GraduationCap className="h-5 w-5" />}
                      {category === "Military" && <Award className="h-5 w-5" />}
                      {category === "Personal" && <Heart className="h-5 w-5" />}
                      {category === "Financial" && <CreditCard className="h-5 w-5" />}
                      {category === "Legal" && <FileText className="h-5 w-5" />}
                      {category === "Medical" && <Shield className="h-5 w-5" />}
                      {category} Documents
                    </span>
                    <Badge variant="outline">
                      {completedInCategory.length}/{categoryDocs.length} Complete
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categoryDocs.map(doc => (
                      <Card key={doc.id} className={`${checkedItems.has(doc.id) ? 'bg-green-50 border-green-200' : ''}`}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <button
                              onClick={() => toggleItem(doc.id)}
                              className="mt-1 flex-shrink-0"
                            >
                              {checkedItems.has(doc.id) ? (
                                <CheckCircle className="h-6 w-6 text-green-600" />
                              ) : (
                                <Circle className="h-6 w-6 text-gray-400 hover:text-gray-600" />
                              )}
                            </button>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <doc.icon className="h-4 w-4 text-gray-600" />
                                <h3 className="font-semibold">{doc.title}</h3>
                                {doc.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
                                <Badge className={`text-xs ${getDifficultyColor(doc.difficulty)}`}>
                                  {doc.difficulty}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {doc.timeToObtain}
                                </Badge>
                                {doc.cost && (
                                  <Badge variant="outline" className="text-xs">
                                    {doc.cost}
                                  </Badge>
                                )}
                              </div>
                              
                              <p className="text-gray-600 mb-3">{doc.description}</p>
                              
                              <div className="space-y-2">
                                <div>
                                  <h4 className="font-medium text-sm mb-1">How to Obtain:</h4>
                                  <ul className="text-sm text-gray-600 space-y-1">
                                    {doc.instructions.map((instruction, index) => (
                                      <li key={index}>• {instruction}</li>
                                    ))}
                                  </ul>
                                </div>
                                
                                {doc.tips.length > 0 && (
                                  <div>
                                    <h4 className="font-medium text-sm mb-1">Pro Tips:</h4>
                                    <ul className="text-sm text-blue-600 space-y-1">
                                      {doc.tips.map((tip, index) => (
                                        <li key={index}>• {tip}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                
                                <div className="flex flex-wrap gap-2 pt-2">
                                  {doc.websites?.map((website, index) => (
                                    <Button key={index} variant="outline" size="sm" asChild>
                                      <a href={`https://${website}`} target="_blank" rel="noopener noreferrer">
                                        <Globe className="h-3 w-3 mr-1" />
                                        Website
                                      </a>
                                    </Button>
                                  ))}
                                  {doc.phone && (
                                    <Button variant="outline" size="sm" asChild>
                                      <a href={`tel:${doc.phone}`}>
                                        <Phone className="h-3 w-3 mr-1" />
                                        {doc.phone}
                                      </a>
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Action Cards */}
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardHeader className="text-center">
                <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <CardTitle className="text-green-900">Questions About Documents?</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-green-800 mb-4">Get personalized help with your background preparation from Sgt. Ken.</p>
                <Button 
                  onClick={() => openModal("signup", "recruit")}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Ask Sgt. Ken
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardHeader className="text-center">
                <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <CardTitle className="text-blue-900">Ready to Apply?</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-blue-800 mb-4">Once you have most documents ready, start your application process.</p>
                <Button 
                  variant="outline" 
                  className="w-full border-blue-300 text-blue-800 hover:bg-blue-200"
                  asChild
                >
                  <Link href="/application-process">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Application Process
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-500 border-t pt-4">
            <p>Keep this checklist handy throughout your application process. Being prepared prevents delays!</p>
            <p className="mt-1">Your progress is automatically saved as you check off items.</p>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
} 
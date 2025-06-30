import Image from "next/image";
import { Home, MapPin, FileText, HelpCircle, Phone, Mail, Shield, Star, ExternalLink, Users, DollarSign, Calculator, Building } from "lucide-react";
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

export default function DiscountedHousingContent() {
  const housingPrograms = [
    {
      icon: Home,
      title: "First Responder Housing Program",
      description: "Reduced rent at participating apartment complexes throughout San Francisco and surrounding communities",
      savings: "10-20% Off Rent"
    },
    {
      icon: DollarSign,
      title: "Down Payment Assistance",
      description: "Low-interest loans and grants to help with down payments for first-time home buyers in the department",
      savings: "Up to $100,000"
    },
    {
      icon: Building,
      title: "Below Market Rate Units",
      description: "Access to BMR units set aside specifically for law enforcement personnel in new developments",
      savings: "30-50% Below Market"
    },
    {
      icon: MapPin,
      title: "Commuter Assistance",
      description: "Subsidies for deputies who live outside the city but commute to work in San Francisco",
      savings: "Transit & Parking Benefits"
    }
  ];

  const eligibilityRequirements = [
    "Be a current, full-time employee of the San Francisco Sheriff's Office",
    "Have completed your probationary period (for certain programs)",
    "Meet income requirements specific to each program",
    "Commit to a minimum service period (typically 3-5 years)",
    "Use the property as your primary residence",
    "Maintain good standing with the department"
  ];

  const priorityFactors = [
    "Currently live outside San Francisco",
    "Have longer commute times", 
    "Have families or dependents",
    "Are first-time home buyers (for purchase assistance programs)",
    "Have been with the department for 2+ years",
    "Demonstrate financial need"
  ];

  const neighborhoods = {
    sanFrancisco: [
      "Mission District",
      "Sunset District", 
      "Bayview",
      "Excelsior",
      "Visitacion Valley",
      "Outer Richmond"
    ],
    eastBay: [
      "Oakland",
      "Berkeley",
      "Alameda", 
      "San Leandro",
      "Hayward",
      "Fremont"
    ],
    southBay: [
      "Daly City",
      "South San Francisco",
      "San Bruno",
      "Millbrae", 
      "San Mateo",
      "Burlingame"
    ]
  };

  const faqs = [
    {
      question: "How much can I save with these programs?",
      answer: "Savings vary by program, but deputies typically save 10-20% on rent through the First Responder Housing Program and can receive up to $100,000 in down payment assistance for home purchases."
    },
    {
      question: "Do I have to live in San Francisco to qualify?",
      answer: "No, but some programs are designed to encourage deputies to live within the city. Commuter assistance is available for those who live outside San Francisco."
    },
    {
      question: "What happens if I leave the department?",
      answer: "If you leave before fulfilling your service commitment, you may need to repay a portion of the benefits received. Each program has specific terms regarding early departure."
    },
    {
      question: "Can family members be included in my application?",
      answer: "Yes, your housing needs assessment will take into account your entire household, including spouse, children, and other dependents."
    },
    {
      question: "How long does the application process take?",
      answer: "The application process typically takes 2-4 weeks for approval, though finding available properties may take additional time depending on your preferences and availability."
    },
    {
      question: "Are there any upfront costs or fees?",
      answer: "Most programs have minimal or no application fees. However, you'll still be responsible for security deposits, first month's rent, and other standard moving costs."
    }
  ];

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mb-6">
              🏠 Discounted Housing Programs
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              As a San Francisco Deputy Sheriff, you have access to special housing programs designed 
              to make living in and around San Francisco more affordable for you and your family.
            </p>

            {/* Quick Stats */}
            <div className="bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 rounded-lg p-6 mb-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary">$100K</div>
                  <div className="text-sm text-gray-600 font-medium">Max Down Payment Assistance</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">20%</div>
                  <div className="text-sm text-gray-600 font-medium">Average Rent Savings</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">50+</div>
                  <div className="text-sm text-gray-600 font-medium">Participating Properties</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">24/7</div>
                  <div className="text-sm text-gray-600 font-medium">Housing Support</div>
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
                    src="/san-francisco-apartments.png"
                    alt="San Francisco housing for law enforcement"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                    <div className="p-6">
                      <h2 className="text-2xl font-bold text-white mb-2">
                        Live Where You Serve
                      </h2>
                      <p className="text-white/80">
                        Special housing options for San Francisco's finest
                      </p>
                      <Badge className="mt-2 bg-[#FFD700] text-primary">
                        Law Enforcement Priority
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Tabs Content */}
              <Tabs defaultValue="programs" className="mb-8">
                <TabsList className="grid grid-cols-4 mb-6 w-full">
                  <TabsTrigger value="programs">Programs</TabsTrigger>
                  <TabsTrigger value="locations">Locations</TabsTrigger>
                  <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
                  <TabsTrigger value="faq">FAQ</TabsTrigger>
                </TabsList>

                <TabsContent value="programs">
                  <Card className="shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                      <CardTitle className="flex items-center text-xl">
                        <Home className="h-6 w-6 mr-3" />
                        Housing Programs
                      </CardTitle>
                      <CardDescription className="text-blue-100">
                        Available housing assistance for Deputy Sheriffs
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <p className="text-gray-700 mb-6">
                        The San Francisco Sheriff's Office partners with various organizations to provide 
                        housing assistance to our deputies. These programs include:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {housingPrograms.map((program, index) => {
                          const Icon = program.icon;
                          return (
                            <div key={index} className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 p-4 rounded-lg">
                              <div className="flex items-center mb-3">
                                <div className="bg-blue-600 p-2 rounded-full mr-3">
                                  <Icon className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-blue-900">{program.title}</h3>
                                  <Badge variant="outline" className="text-xs bg-blue-200 text-blue-800">
                                    {program.savings}
                                  </Badge>
                                </div>
                              </div>
                              <p className="text-blue-800 text-sm">{program.description}</p>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="locations">
                  <Card className="shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                      <CardTitle className="flex items-center text-xl">
                        <MapPin className="h-6 w-6 mr-3" />
                        Available Locations
                      </CardTitle>
                      <CardDescription className="text-green-100">
                        Where you can find discounted housing
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <p className="text-gray-700 mb-6">
                        Discounted housing options for San Francisco Deputy Sheriffs are available 
                        in various neighborhoods and surrounding communities:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 p-4 rounded-lg">
                          <div className="flex items-center mb-3">
                            <div className="bg-green-600 p-2 rounded-full mr-3">
                              <Building className="h-4 w-4 text-white" />
                            </div>
                            <h3 className="font-semibold text-green-900">San Francisco</h3>
                          </div>
                          <ul className="space-y-1 text-sm">
                            {neighborhoods.sanFrancisco.map((neighborhood, index) => (
                              <li key={index} className="flex items-center text-green-800">
                                <Star className="h-3 w-3 mr-2 text-green-600" />
                                {neighborhood}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 p-4 rounded-lg">
                          <div className="flex items-center mb-3">
                            <div className="bg-green-600 p-2 rounded-full mr-3">
                              <Building className="h-4 w-4 text-white" />
                            </div>
                            <h3 className="font-semibold text-green-900">East Bay</h3>
                          </div>
                          <ul className="space-y-1 text-sm">
                            {neighborhoods.eastBay.map((neighborhood, index) => (
                              <li key={index} className="flex items-center text-green-800">
                                <Star className="h-3 w-3 mr-2 text-green-600" />
                                {neighborhood}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 p-4 rounded-lg">
                          <div className="flex items-center mb-3">
                            <div className="bg-green-600 p-2 rounded-full mr-3">
                              <Building className="h-4 w-4 text-white" />
                            </div>
                            <h3 className="font-semibold text-green-900">South Bay</h3>
                          </div>
                          <ul className="space-y-1 text-sm">
                            {neighborhoods.southBay.map((neighborhood, index) => (
                              <li key={index} className="flex items-center text-green-800">
                                <Star className="h-3 w-3 mr-2 text-green-600" />
                                {neighborhood}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-6">
                        <p className="text-amber-800 text-sm">
                          <strong>Note:</strong> Available properties change regularly. Contact our housing coordinator 
                          for the most up-to-date listings and availability in your preferred areas.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="eligibility">
                  <Card className="shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
                      <CardTitle className="flex items-center text-xl">
                        <FileText className="h-6 w-6 mr-3" />
                        Eligibility Requirements
                      </CardTitle>
                      <CardDescription className="text-purple-100">
                        Who qualifies for housing assistance
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <p className="text-gray-700 mb-6">
                        To qualify for the Deputy Sheriff housing assistance programs, you must meet the following criteria:
                      </p>
                      <div className="space-y-3 mb-6">
                        {eligibilityRequirements.map((requirement, index) => (
                          <div key={index} className="flex items-start">
                            <Shield className="h-5 w-5 text-purple-600 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{requirement}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
                        <div className="flex items-center mb-3">
                          <Star className="h-5 w-5 text-purple-600 mr-2" />
                          <h3 className="font-semibold text-purple-900">Priority Status</h3>
                        </div>
                        <p className="text-purple-800 text-sm mb-3">Priority is given to deputies who:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {priorityFactors.map((factor, index) => (
                            <div key={index} className="flex items-center text-sm">
                              <Star className="h-3 w-3 mr-2 text-purple-600" />
                              <span className="text-purple-800">{factor}</span>
                            </div>
                          ))}
                        </div>
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
                        Common questions about housing programs
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
              <Card className="bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg">
                <CardContent className="p-8 text-center">
                  <h2 className="text-3xl font-bold mb-3">
                    Ready to Find Your New Home?
                  </h2>
                  <p className="text-white/90 mb-6 text-lg">
                    Let us help you find affordable housing options as you begin or continue 
                    your career with the San Francisco Sheriff's Office.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link href="/contact">
                      <Button size="lg" className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-primary font-semibold">
                        View Available Properties
                      </Button>
                    </Link>
                    <Link href="/contact">
                      <Button
                        size="lg"
                        variant="outline"
                        className="border-white text-white hover:bg-white/10"
                      >
                        Schedule Consultation
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Housing Coordinator Contact */}
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <CardTitle className="flex items-center">
                    <Home className="h-5 w-5 mr-2" />
                    Housing Coordinator
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Mail className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-900">Email</p>
                        <a 
                          href="mailto:housing@sfdeputysheriff.com" 
                          className="text-sm text-blue-700 hover:text-blue-900 transition-colors"
                        >
                          housing@sfdeputysheriff.com
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Phone className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-900">Phone</p>
                        <a 
                          href="tel:+14155547230" 
                          className="text-sm text-blue-700 hover:text-blue-900 transition-colors"
                        >
                          (415) 554-7230
                        </a>
                      </div>
                    </div>
                    <div className="bg-white border border-blue-200 rounded p-3 mt-4">
                      <p className="text-xs text-blue-700">
                        <strong>Office Hours:</strong> Monday-Friday, 9:00 AM - 5:00 PM
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Housing Resources */}
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                  <CardTitle className="flex items-center">
                    <Building className="h-5 w-5 mr-2" />
                    Housing Resources
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-3">
                  <a 
                    href="https://sfmohcd.org/first-responder-housing" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button variant="outline" className="w-full justify-start border-green-300 text-green-800 hover:bg-green-200">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      SF First Responder Housing
                    </Button>
                  </a>
                  <a 
                    href="https://www.sfmohcd.org/bmr-rentals" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button variant="outline" className="w-full justify-start border-green-300 text-green-800 hover:bg-green-200">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      BMR Rental Listings
                    </Button>
                  </a>
                  <Link href="/contact">
                    <Button variant="outline" className="w-full justify-start border-green-300 text-green-800 hover:bg-green-200">
                      <Mail className="h-4 w-4 mr-2" />
                      Contact Support
                    </Button>
                  </Link>
                  <Link href="/chat-with-sgt-ken">
                    <Button variant="outline" className="w-full justify-start border-green-300 text-green-800 hover:bg-green-200">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Ask Sgt. Ken AI
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Housing Calculator */}
              <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
                <CardHeader className="bg-gradient-to-r from-yellow-600 to-yellow-700 text-white">
                  <CardTitle className="flex items-center">
                    <Calculator className="h-5 w-5 mr-2" />
                    Housing Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <p className="text-yellow-800 text-sm">
                      Calculate potential savings and housing costs in the San Francisco Bay Area:
                    </p>
                    <a 
                      href="https://sfmohcd.org/housing-calculator" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white">
                        <Calculator className="h-4 w-4 mr-2" />
                        Housing Affordability Tool
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Housing */}
              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white">
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Emergency Housing
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <p className="text-red-800 text-sm">
                      Need immediate housing assistance or facing an emergency situation?
                    </p>
                    <Link href="/contact">
                      <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                        <Phone className="h-4 w-4 mr-2" />
                        Emergency Housing Line
                      </Button>
                    </Link>
                    <p className="text-xs text-red-700">
                      Available 24/7 for critical housing emergencies
                    </p>
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

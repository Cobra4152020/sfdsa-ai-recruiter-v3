import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  Ear, 
  Hand, 
  Brain, 
  Shield, 
  Mail, 
  Phone, 
  CheckCircle, 
  AlertTriangle, 
  Users, 
  Settings, 
  Heart,
  ExternalLink,
  MessageSquare,
  FileText,
  Volume2,
  MousePointer,
  Keyboard,
  Smartphone
} from "lucide-react";
import { PageWrapper } from "@/components/page-wrapper";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Accessibility Statement | SF Deputy Sheriff Recruitment",
  description:
    "Our commitment to digital accessibility and inclusive design for all users of the San Francisco Deputy Sheriff recruitment platform.",
  openGraph: {
    title: "Accessibility Statement | SF Deputy Sheriff Recruitment",
    description:
      "Our commitment to digital accessibility and inclusive design for all users of the San Francisco Deputy Sheriff recruitment platform.",
    url: "/accessibility",
    type: "website",
  },
};

export default function AccessibilityStatement() {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const accessibilityFeatures = [
    {
      icon: Eye,
      title: "Visual Accessibility",
      features: [
        "High contrast color ratios (4.5:1 minimum)",
        "Large, readable fonts with clear hierarchy",
        "Alternative text for all images and graphics",
        "Scalable interface that works at 200% zoom",
        "Color is not the only way information is conveyed"
      ]
    },
    {
      icon: Ear,
      title: "Auditory Accessibility", 
      features: [
        "Captions and transcripts for video content",
        "Visual indicators for audio alerts",
        "No auto-playing audio content",
        "Compatible with hearing aids and assistive devices"
      ]
    },
    {
      icon: Hand,
      title: "Motor Accessibility",
      features: [
        "Full keyboard navigation support",
        "Large click targets (44px minimum)",
        "No time-sensitive actions required",
        "Sticky session to prevent timeout issues",
        "Alternative input method support"
      ]
    },
    {
      icon: Brain,
      title: "Cognitive Accessibility",
      features: [
        "Clear, simple language and instructions",
        "Consistent navigation and layout",
        "Error messages that explain how to fix issues",
        "Progress indicators for multi-step processes",
        "Help context available throughout the site"
      ]
    }
  ];

  const contactMethods = [
    {
      icon: Mail,
      method: "Email",
      contact: "accessibility@sfdeputysheriff.com",
      description: "For general accessibility feedback and requests"
    },
    {
      icon: Phone,
      method: "Phone",
      contact: "(415) 554-7225",
      description: "Speak directly with our accessibility coordinator"
    },
    {
      icon: MessageSquare,
      method: "Live Chat",
      contact: "Chat with Sgt. Ken AI",
      description: "24/7 accessible AI assistant for immediate help",
      link: "/chat-with-sgt-ken"
    }
  ];

  const complianceStandards = [
    {
      standard: "WCAG 2.1 Level AA",
      status: "Partially Compliant",
      description: "We strive to meet Level AA standards across all content"
    },
    {
      standard: "Section 508",
      status: "Compliant",
      description: "Federal accessibility requirements for government content"
    },
    {
      standard: "ADA Title II",
      status: "Compliant",
      description: "Americans with Disabilities Act requirements"
    }
  ];

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#0A3C1F] to-[#0A3C1F]/80 bg-clip-text text-transparent mb-6">
            ♿ Accessibility Statement
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Our commitment to creating an inclusive digital experience for all users, 
            regardless of their abilities or the assistive technologies they use.
          </p>

          {/* Quick Stats */}
          <div className="bg-gradient-to-r from-[#0A3C1F]/10 to-transparent border border-[#0A3C1F]/20 rounded-lg p-6 mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-[#0A3C1F]">WCAG 2.1</div>
                <div className="text-sm text-gray-600 font-medium">Level AA Standard</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#0A3C1F]">24/7</div>
                <div className="text-sm text-gray-600 font-medium">Accessibility Support</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#0A3C1F]">100%</div>
                <div className="text-sm text-gray-600 font-medium">Keyboard Navigable</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#0A3C1F]">4.5:1</div>
                <div className="text-sm text-gray-600 font-medium">Color Contrast Ratio</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Our Commitment */}
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-[#0A3C1F] to-[#0A3C1F]/90 text-white">
                <CardTitle className="flex items-center text-xl">
                  <Heart className="h-6 w-6 mr-3" />
                  Our Commitment to Accessibility
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <p className="text-gray-700">
                    The San Francisco Deputy Sheriff's Association (SFDSA) is dedicated to ensuring 
                    that our recruitment platform is accessible to all individuals, including those 
                    with disabilities. We believe that everyone deserves equal access to employment 
                    opportunities in law enforcement.
                  </p>
                  <p className="text-gray-700">
                    We are continuously working to improve the accessibility of our digital content 
                    and services, implementing best practices and staying current with evolving 
                    accessibility standards and technologies.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 text-blue-600 mr-2" />
                      <strong className="text-blue-900">Equal Opportunity Employer</strong>
                    </div>
                    <p className="text-blue-800 text-sm mt-2">
                      SFDSA is committed to providing equal employment opportunities and reasonable 
                      accommodations throughout the recruitment and employment process.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Accessibility Features */}
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <CardTitle className="flex items-center text-xl">
                  <CheckCircle className="h-6 w-6 mr-3" />
                  Accessibility Features
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {accessibilityFeatures.map((category, index) => {
                    const Icon = category.icon;
                    return (
                      <div key={index} className="space-y-3">
                        <div className="flex items-center">
                          <div className="bg-blue-100 p-2 rounded-full mr-3">
                            <Icon className="h-5 w-5 text-blue-600" />
                          </div>
                          <h3 className="font-semibold text-gray-900">{category.title}</h3>
                        </div>
                        <ul className="space-y-1">
                          {category.features.map((feature, idx) => (
                            <li key={idx} className="text-sm text-gray-700 flex items-start">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Technical Specifications */}
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                <CardTitle className="flex items-center text-xl">
                  <Settings className="h-6 w-6 mr-3" />
                  Technical Specifications
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Supported Technologies</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="flex items-center">
                        <Keyboard className="h-4 w-4 text-gray-600 mr-2" />
                        <span className="text-sm">Screen Readers</span>
                      </div>
                      <div className="flex items-center">
                        <MousePointer className="h-4 w-4 text-gray-600 mr-2" />
                        <span className="text-sm">Voice Control</span>
                      </div>
                      <div className="flex items-center">
                        <Smartphone className="h-4 w-4 text-gray-600 mr-2" />
                        <span className="text-sm">Switch Navigation</span>
                      </div>
                      <div className="flex items-center">
                        <Volume2 className="h-4 w-4 text-gray-600 mr-2" />
                        <span className="text-sm">Screen Magnifiers</span>
                      </div>
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 text-gray-600 mr-2" />
                        <span className="text-sm">High Contrast Mode</span>
                      </div>
                      <div className="flex items-center">
                        <Hand className="h-4 w-4 text-gray-600 mr-2" />
                        <span className="text-sm">Alternative Keyboards</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Compliance Standards</h3>
                    <div className="space-y-3">
                      {complianceStandards.map((standard, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium">{standard.standard}</div>
                            <div className="text-sm text-gray-600">{standard.description}</div>
                          </div>
                          <Badge 
                            variant={standard.status === "Compliant" ? "default" : "secondary"}
                            className={standard.status === "Compliant" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
                          >
                            {standard.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Known Limitations */}
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-700 text-white">
                <CardTitle className="flex items-center text-xl">
                  <AlertTriangle className="h-6 w-6 mr-3" />
                  Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-700 mb-4">
                  We are transparent about areas where our platform may not fully meet 
                  accessibility standards. We are actively working to address these limitations:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start text-gray-700">
                    <AlertTriangle className="h-4 w-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                    Some interactive game elements may have limited screen reader support
                  </li>
                  <li className="flex items-start text-gray-700">
                    <AlertTriangle className="h-4 w-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                    Dynamic content updates may not always be announced to assistive technologies
                  </li>
                  <li className="flex items-start text-gray-700">
                    <AlertTriangle className="h-4 w-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                    Some third-party embedded content may not meet our accessibility standards
                  </li>
                  <li className="flex items-start text-gray-700">
                    <AlertTriangle className="h-4 w-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                    Complex data visualizations may need alternative text descriptions
                  </li>
                </ul>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-4">
                  <p className="text-orange-800 text-sm">
                    <strong>Our Promise:</strong> We are committed to addressing these limitations 
                    and improving accessibility with each platform update.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact & Support */}
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Accessibility Support
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <p className="text-purple-800 text-sm mb-4">
                  Need help or have feedback? Contact our accessibility team:
                </p>
                {contactMethods.map((method, index) => {
                  const Icon = method.icon;
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center">
                        <Icon className="h-4 w-4 text-purple-600 mr-2" />
                        <span className="font-medium text-purple-900">{method.method}</span>
                      </div>
                      {method.link ? (
                        <Link href={method.link}>
                          <Button variant="outline" size="sm" className="w-full justify-start text-xs border-purple-300 text-purple-800 hover:bg-purple-200">
                            {method.contact}
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </Button>
                        </Link>
                      ) : (
                        <div className="text-sm text-purple-700 font-mono bg-white rounded px-2 py-1">
                          {method.contact}
                        </div>
                      )}
                      <p className="text-xs text-purple-600">{method.description}</p>
                    </div>
                  );
                })}
                <div className="bg-white border border-purple-200 rounded p-3 mt-4">
                  <p className="text-xs text-purple-700">
                    <strong>Response Time:</strong> We aim to respond to accessibility 
                    requests within 2 business days.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Accessibility Resources
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                <Link href="/contact">
                  <Button variant="outline" className="w-full justify-start border-blue-300 text-blue-800 hover:bg-blue-200">
                    <Mail className="h-4 w-4 mr-2" />
                    Report Accessibility Issue
                  </Button>
                </Link>
                <Link href="/chat-with-sgt-ken">
                  <Button variant="outline" className="w-full justify-start border-blue-300 text-blue-800 hover:bg-blue-200">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Get Instant Help
                  </Button>
                </Link>
                <a 
                  href="https://www.w3.org/WAI/WCAG21/quickref/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button variant="outline" className="w-full justify-start border-blue-300 text-blue-800 hover:bg-blue-200">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    WCAG Guidelines
                  </Button>
                </a>
                <a 
                  href="https://webaim.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button variant="outline" className="w-full justify-start border-blue-300 text-blue-800 hover:bg-blue-200">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    WebAIM Resources
                  </Button>
                </a>
              </CardContent>
            </Card>

            {/* Employment Accommodations */}
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Employment Accommodations
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <p className="text-green-800 text-sm">
                    We provide reasonable accommodations throughout the entire recruitment process:
                  </p>
                  <ul className="text-xs text-green-700 space-y-1">
                    <li>• Alternative application formats</li>
                    <li>• Extended time for assessments</li>
                    <li>• Sign language interpreters</li>
                    <li>• Large print materials</li>
                    <li>• Accessible interview locations</li>
                    <li>• Assistive technology support</li>
                  </ul>
                  <div className="bg-white border border-green-200 rounded p-3 mt-4">
                    <p className="text-xs text-green-700">
                      <strong>To request accommodations:</strong> Contact our recruitment team 
                      at least 5 business days before your scheduled activity.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer Information */}
        <div className="mt-12">
          <Card className="bg-gray-50 border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">
                    This accessibility statement was last reviewed and updated on{' '}
                    <strong>{currentDate}</strong>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    We review and update this statement quarterly to ensure accuracy and completeness.
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="bg-[#0A3C1F]/10 text-[#0A3C1F] border-[#0A3C1F]/20">
                    Accessibility First
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}

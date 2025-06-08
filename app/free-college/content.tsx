"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  GraduationCap, 
  BookOpen, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  Star,
  Award,
  TrendingUp,
  Users,
  Target,
  Calendar,
  MapPin
} from "lucide-react";
import Link from "next/link";

export default function FreeCollegeContent() {
  const educationPrograms = [
    {
      title: "Academy Training Program",
      description: "Comprehensive 6-month training academy with full salary",
      coverage: "100% Paid",
      duration: "6 months",
      icon: <Award className="h-6 w-6 text-blue-600" />,
      benefits: [
        "Full salary during training",
        "All materials provided",
        "Professional certification",
        "POST certification included"
      ]
    },
    {
      title: "College Tuition Reimbursement",
      description: "Annual reimbursement for college courses and degrees",
      coverage: "Up to $5,250/year",
      duration: "Ongoing",
      icon: <GraduationCap className="h-6 w-6 text-green-600" />,
      benefits: [
        "Bachelor's and Master's degrees",
        "Criminal justice emphasis preferred",
        "Online and in-person options",
        "Flexible scheduling support"
      ]
    },
    {
      title: "Professional Development Courses",
      description: "Specialized law enforcement and leadership training",
      coverage: "Department Funded",
      duration: "Varies",
      icon: <BookOpen className="h-6 w-6 text-purple-600" />,
      benefits: [
        "Leadership development",
        "Advanced law enforcement techniques",
        "Crisis intervention training",
        "Community policing methods"
      ]
    },
    {
      title: "College Partnerships",
      description: "Special agreements with local colleges and universities",
      coverage: "Discounted Rates",
      duration: "Ongoing",
      icon: <Users className="h-6 w-6 text-orange-600" />,
      benefits: [
        "City College of San Francisco partnership",
        "UC and CSU system discounts",
        "Accelerated programs available",
        "Evening and weekend classes"
      ]
    }
  ];

  const eligibilitySteps = [
    {
      step: 1,
      title: "Complete Academy",
      description: "Successfully complete the San Francisco Deputy Sheriff Academy"
    },
    {
      step: 2,
      title: "Probationary Period",
      description: "Complete 12-month probationary period with satisfactory performance"
    },
    {
      step: 3,
      title: "Apply for Benefits",
      description: "Submit education benefit application with course approval"
    },
    {
      step: 4,
      title: "Maintain Standards",
      description: "Maintain job performance and educational progress requirements"
    }
  ];

  const popularPrograms = [
    {
      school: "City College of San Francisco",
      program: "Administration of Justice",
      type: "Associate Degree",
      schedule: "Evening/Weekend",
      cost: "Free with partnership"
    },
    {
      school: "San Francisco State University",
      program: "Criminal Justice",
      type: "Bachelor's Degree",
      schedule: "Flexible",
      cost: "Tuition reimbursement eligible"
    },
    {
      school: "Golden Gate University",
      program: "Public Administration",
      type: "Master's Degree",
      schedule: "Online/Evening",
      cost: "Partial reimbursement"
    },
    {
      school: "University of San Francisco",
      program: "Criminology",
      type: "Bachelor's/Master's",
      schedule: "Various",
      cost: "Discounted rates"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* Header Section */}
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-lg">
                <GraduationCap className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#0A3C1F] mb-4">
              🎓 Free College Programs
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Advance your career with comprehensive educational benefits and free college programs available to San Francisco Deputy Sheriffs. From academy training to advanced degrees, we invest in your education.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Badge className="bg-blue-100 text-blue-800 px-4 py-2">100% Paid Academy</Badge>
              <Badge className="bg-green-100 text-green-800 px-4 py-2">$5,250+ Annual Reimbursement</Badge>
              <Badge className="bg-purple-100 text-purple-800 px-4 py-2">College Partnerships</Badge>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="text-center bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6">
                <DollarSign className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-blue-700">$31,500</div>
                <div className="text-sm text-blue-600">Academy Value</div>
              </CardContent>
            </Card>
            <Card className="text-center bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6">
                <GraduationCap className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-green-700">$5,250</div>
                <div className="text-sm text-green-600">Annual Reimbursement</div>
              </CardContent>
            </Card>
            <Card className="text-center bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6">
                <Users className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-purple-700">15+</div>
                <div className="text-sm text-purple-600">Partner Schools</div>
              </CardContent>
            </Card>
            <Card className="text-center bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-6">
                <Clock className="h-8 w-8 text-orange-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-orange-700">Flexible</div>
                <div className="text-sm text-orange-600">Schedule Options</div>
              </CardContent>
            </Card>
          </div>

          {/* Education Programs */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-[#0A3C1F] text-center mb-8">
              Available Education Programs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {educationPrograms.map((program, index) => (
                <Card key={index} className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-blue-500">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        {program.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{program.title}</CardTitle>
                        <div className="flex gap-3 mt-2">
                          <Badge className="bg-green-100 text-green-800">{program.coverage}</Badge>
                          <Badge variant="outline">{program.duration}</Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{program.description}</p>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-[#0A3C1F]">Key Benefits:</h4>
                      <ul className="space-y-1">
                        {program.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Eligibility Process */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-[#0A3C1F] text-center">
              How to Qualify for Education Benefits
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {eligibilitySteps.map((step, index) => (
                <Card key={index} className="text-center relative">
                  <CardContent className="p-6">
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="w-8 h-8 bg-[#0A3C1F] text-white rounded-full flex items-center justify-center font-bold">
                        {step.step}
                      </div>
                    </div>
                    <div className="mt-4">
                      <h3 className="font-semibold text-[#0A3C1F] mb-2">{step.title}</h3>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Popular Programs */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-[#0A3C1F] text-center">
              Popular Partner Programs
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow-lg">
                <thead className="bg-[#0A3C1F] text-white">
                  <tr>
                    <th className="p-4 text-left">School</th>
                    <th className="p-4 text-left">Program</th>
                    <th className="p-4 text-left">Degree Type</th>
                    <th className="p-4 text-left">Schedule</th>
                    <th className="p-4 text-left">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {popularPrograms.map((program, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-medium">{program.school}</td>
                      <td className="p-4">{program.program}</td>
                      <td className="p-4">
                        <Badge variant="outline">{program.type}</Badge>
                      </td>
                      <td className="p-4">{program.schedule}</td>
                      <td className="p-4">
                        <span className="text-green-600 font-medium">{program.cost}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Investment in Your Future */}
          <Card className="bg-gradient-to-br from-[#0A3C1F] to-[#0A3C1F]/90 text-white">
            <CardContent className="p-8 text-center">
              <Star className="h-12 w-12 text-[#FFD700] mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">We Invest In Your Future</h2>
              <p className="text-xl text-white/90 mb-6 max-w-3xl mx-auto">
                The San Francisco Sheriff's Department believes in continuous learning and professional development. 
                Our comprehensive education benefits help you advance your career while serving the community.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#FFD700]">6 months</div>
                  <div className="text-white/80">Paid Academy Training</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#FFD700]">$5,250+</div>
                  <div className="text-white/80">Annual Education Support</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#FFD700]">Lifetime</div>
                  <div className="text-white/80">Career Development</div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/apply">
                  <Button size="lg" className="bg-[#FFD700] text-[#0A3C1F] hover:bg-[#FFD700]/90 font-semibold">
                    <Target className="mr-2 h-5 w-5" />
                    Start Your Application
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    <Calendar className="mr-2 h-5 w-5" />
                    Schedule Information Session
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Additional Resources */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                  Education Resources
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h4 className="font-semibold">Helpful Links:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• <a href="https://www.ccsf.edu" target="_blank" className="text-blue-600 hover:underline">City College of San Francisco</a></li>
                    <li>• <a href="https://www.sfsu.edu" target="_blank" className="text-blue-600 hover:underline">San Francisco State University</a></li>
                    <li>• <a href="https://www.ggu.edu" target="_blank" className="text-blue-600 hover:underline">Golden Gate University</a></li>
                    <li>• <a href="https://www.usfca.edu" target="_blank" className="text-blue-600 hover:underline">University of San Francisco</a></li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <MapPin className="h-6 w-6 text-green-600" />
                  Get Started
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Ready to take advantage of these education benefits? Contact our recruitment team to learn more about the application process.
                </p>
                <div className="space-y-2">
                  <div className="text-sm">
                    <strong>Recruitment Office:</strong><br />
                    Phone: (415) 554-7225<br />
                    Email: recruitment@sfsheriff.org
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
} 
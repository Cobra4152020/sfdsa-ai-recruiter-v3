"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  GraduationCap, 
  Home, 
  Flag, 
  Lock, 
  Star,
  ArrowRight,
  Zap
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function PopularLockedBenefits() {
  const popularBenefits = [
    {
      name: "Free College Programs",
      description: "Discover free college and continuing education programs available to deputies",
      pointsRequired: 250,
      imageUrl: "/ccsf_frontpg.jpg",
      path: "/free-college",
      icon: <GraduationCap className="h-6 w-6" />,
      badge: "🎓 Education",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50 border-blue-200",
      highlights: [
        "100% Paid Academy Training",
        "$5,250+ Annual Reimbursement", 
        "College Partnerships",
        "Flexible Scheduling"
      ]
    },
    {
      name: "G.I. Bill Benefits",
      description: "Learn how to use your G.I. Bill benefits for law enforcement training",
      pointsRequired: 300,
      imageUrl: "/veterans-law-enforcement-training.png",
      path: "/gi-bill",
      icon: <Flag className="h-6 w-6" />,
      badge: "🇺🇸 Veterans",
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50 border-red-200",
      highlights: [
        "Veterans Preference Points",
        "Academy Training Coverage",
        "Military Experience Valued",
        "Transition Support Programs"
      ]
    },
    {
      name: "Discounted Housing",
      description: "Special housing programs for law enforcement in San Francisco",
      pointsRequired: 500,
      imageUrl: "/san-francisco-apartments.png",
      path: "/discounted-housing",
      icon: <Home className="h-6 w-6" />,
      badge: "🏠 Housing",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50 border-green-200",
      highlights: [
        "First-Time Homebuyer Assistance",
        "Law Enforcement Discounts",
        "San Francisco Area Options",
        "Down Payment Assistance"
      ]
    }
  ];

  return (
    <section className="w-full py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-gradient-to-br from-[#0A3C1F] to-[#0A3C1F]/80 rounded-full shadow-lg">
                <Star className="h-8 w-8 text-[#FFD700]" />
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#0A3C1F] mb-4">
              Exclusive Deputy Benefits
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Unlock access to detailed information about the premium benefits and programs available to San Francisco Deputy Sheriffs. 
              These resources are available after you demonstrate your commitment to the recruitment process.
            </p>
            <div className="flex flex-wrap gap-3 justify-center mt-6">
              <Badge className="bg-[#FFD700] text-[#0A3C1F] px-4 py-2 text-sm font-semibold">
                Most Popular Benefits
              </Badge>
              <Badge variant="outline" className="border-[#0A3C1F] text-[#0A3C1F] px-4 py-2">
                Points Required to Unlock
              </Badge>
            </div>
          </div>

          {/* Featured Benefits Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {popularBenefits.map((benefit, index) => (
              <Card 
                key={benefit.name}
                className={`group overflow-hidden ${benefit.bgColor} border-2 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2`}
              >
                {/* Card Header with Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={benefit.imageUrl}
                    alt={benefit.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  {/* Badge Overlay */}
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-[#FFD700] text-[#0A3C1F] font-semibold">
                      {benefit.badge}
                    </Badge>
                  </div>
                  
                  {/* Lock Indicator */}
                  <div className="absolute bottom-4 left-4 flex items-center text-white">
                    <Lock className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">
                      {benefit.pointsRequired} points to unlock
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${benefit.color} text-white`}>
                      {benefit.icon}
                    </div>
                    <h3 className="text-xl font-bold text-[#0A3C1F]">
                      {benefit.name}
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {benefit.description}
                  </p>

                  {/* Highlights */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-[#0A3C1F] mb-2 text-sm">Key Benefits:</h4>
                    <ul className="space-y-1">
                      {benefit.highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                          <div className="w-1.5 h-1.5 bg-[#FFD700] rounded-full" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Points Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium text-gray-500">Unlock Progress</span>
                      <span className="text-xs text-[#0A3C1F] font-semibold">
                        0 / {benefit.pointsRequired}
                      </span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>

                  {/* Action Button */}
                  <Link href={benefit.path}>
                    <Button 
                      className={`w-full bg-gradient-to-r ${benefit.color} hover:opacity-90 text-white font-semibold group-hover:shadow-lg transition-all duration-300`}
                    >
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Call to Action */}
          <Card className="bg-gradient-to-br from-[#0A3C1F] to-[#0A3C1F]/90 text-white">
            <CardContent className="p-8 text-center">
              <Zap className="h-12 w-12 text-[#FFD700] mx-auto mb-4" />
              <h3 className="text-3xl font-bold mb-4">
                Unlock These Benefits Today
              </h3>
              <p className="text-xl text-white/90 mb-6 max-w-2xl mx-auto">
                Start earning points by engaging with our platform, completing your profile, and taking practice tests. 
                Each interaction brings you closer to unlocking these exclusive benefits.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/apply">
                  <Button size="lg" className="bg-[#FFD700] text-[#0A3C1F] hover:bg-[#FFD700]/90 font-semibold">
                    Start Your Application
                  </Button>
                </Link>
                <Link href="/deputy-launchpad">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    Learn About Points System
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </section>
  );
} 
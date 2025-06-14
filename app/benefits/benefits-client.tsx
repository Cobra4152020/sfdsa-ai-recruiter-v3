"use client";

import { PageWrapper } from "@/components/page-wrapper";
import { Card, CardContent } from "@/components/ui/card";
import {
  DollarSign,
  Heart,
  GraduationCap,
  Calendar,
  Shield,
  Clock,
  Briefcase,
  Trophy,
} from "lucide-react";

export default function BenefitsClient() {
  const benefitCategories = [
    {
      title: "Competitive Compensation",
      icon: DollarSign,
      benefits: [
        "Starting salary range: $118,768 - $184,362 annually (with incentives)",
        "Regular step increases and cost of living adjustments",
        "Premium pay for special assignments and certifications",
        "Overtime opportunities",
        "Night shift differential pay",
      ],
    },
    {
      title: "Healthcare & Wellness",
      icon: Heart,
      benefits: [
        "Comprehensive medical, dental, and vision coverage",
        "Mental health and wellness programs",
        "Life insurance coverage",
        "Fitness facility access",
        "Annual wellness incentive program",
      ],
    },
    {
      title: "Professional Development",
      icon: GraduationCap,
      benefits: [
        "Paid academy training",
        "Continuing education opportunities",
        "Specialized training programs",
        "Career advancement paths",
        "Tuition reimbursement program",
      ],
    },
    {
      title: "Time Off & Leave",
      icon: Calendar,
      benefits: [
        "Paid vacation starting at 2 weeks per year",
        "12 paid holidays annually",
        "Sick leave accrual",
        "Paid family medical leave",
        "Personal leave options",
      ],
    },
    {
      title: "Retirement & Security",
      icon: Shield,
      benefits: [
        "SFERS retirement plan - 3% at 58 formula",
        "Deferred compensation options",
        "Retirement health benefits",
        "Survivor benefits",
        "Long-term disability coverage",
      ],
    },
    {
      title: "Work-Life Balance",
      icon: Clock,
      benefits: [
        "Flexible scheduling options",
        "4/10 work schedule available",
        "Paid breaks and meal periods",
        "Family-friendly policies",
        "Employee assistance program",
      ],
    },
    {
      title: "Additional Perks",
      icon: Briefcase,
      benefits: [
        "Uniform allowance",
        "Equipment provided",
        "Free parking at work locations",
        "Public transportation benefits",
        "Employee discount programs",
      ],
    },
    {
      title: "Career Growth",
      icon: Trophy,
      benefits: [
        "Clear promotion pathways",
        "Leadership development programs",
        "Specialized unit opportunities",
        "Mentorship programs",
        "Recognition and awards program",
      ],
    },
  ];

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Comprehensive Benefits Package
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              As a San Francisco Deputy Sheriff, you&apos;ll enjoy a rewarding
              career with excellent benefits designed to support your
              professional growth, health, and financial security.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefitCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Card
                  key={category.title}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-foreground mb-3">
                          {category.title}
                        </h2>
                        <ul className="space-y-2">
                          {category.benefits.map((benefit) => (
                            <li
                              key={benefit}
                              className="flex items-start gap-2 text-muted-foreground"
                            >
                              <span className="text-primary font-bold">
                                •
                              </span>
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-12 bg-secondary/20 border border-secondary/40 rounded-lg p-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Start Your Career Today
              </h2>
              <p className="text-muted-foreground mb-6">
                Join the San Francisco Sheriff&apos;s Department and enjoy these
                comprehensive benefits while making a difference in your
                community.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <a
                  href="/requirements"
                  className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Check Requirements
                </a>
                <a
                  href="/application-process"
                  className="inline-flex items-center px-6 py-3 bg-card text-foreground font-semibold rounded-lg border border-border hover:bg-muted transition-colors"
                >
                  Apply Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

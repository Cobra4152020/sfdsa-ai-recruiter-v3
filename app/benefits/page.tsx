import type { Metadata } from "next"
import { PageWrapper } from "@/components/page-wrapper"
import { Card, CardContent } from "@/components/ui/card"
import { DollarSign, Heart, GraduationCap, Calendar, Shield, Clock, Briefcase, Trophy } from "lucide-react"

export const metadata: Metadata = {
  title: "Deputy Sheriff Benefits | SFDSA Recruitment",
  description: "Explore the comprehensive benefits package offered to San Francisco Deputy Sheriffs.",
}

export default function BenefitsPage() {
  const benefitCategories = [
    {
      title: "Competitive Compensation",
      icon: DollarSign,
      benefits: [
        "Starting salary range: $84,656 - $102,908 annually",
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
        "CalPERS pension plan",
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
  ]

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#0A3C1F] mb-4">Comprehensive Benefits Package</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              As a San Francisco Deputy Sheriff, you'll enjoy a rewarding career with excellent benefits designed to support
              your professional growth, health, and financial security.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefitCategories.map((category) => {
              const Icon = category.icon
              return (
                <Card key={category.title} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-[#0A3C1F]/10 rounded-full flex items-center justify-center">
                        <Icon className="h-6 w-6 text-[#0A3C1F]" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-[#0A3C1F] mb-3">{category.title}</h2>
                        <ul className="space-y-2">
                          {category.benefits.map((benefit) => (
                            <li key={benefit} className="flex items-start gap-2 text-gray-700">
                              <span className="text-[#0A3C1F] font-bold">•</span>
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-semibold text-blue-800 mb-4">Start Your Career Today</h2>
              <p className="text-blue-700 mb-6">
                Join the San Francisco Sheriff's Department and enjoy these comprehensive benefits while making a difference
                in your community.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <a
                  href="/requirements"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Check Requirements
                </a>
                <a
                  href="/application-process"
                  className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors"
                >
                  Apply Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
} 
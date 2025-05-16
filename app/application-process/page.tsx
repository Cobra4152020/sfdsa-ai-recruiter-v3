import type { Metadata } from "next"
import { PageWrapper } from "@/components/page-wrapper"
import { Card, CardContent } from "@/components/ui/card"
import { CircleIcon } from "lucide-react"

export const metadata: Metadata = {
  title: "Application Process | SFDSA Recruitment",
  description: "Learn about the step-by-step process to become a San Francisco Deputy Sheriff.",
}

export default function ApplicationProcessPage() {
  const steps = [
    {
      step: 1,
      title: "Initial Application",
      description:
        "Submit your online application through the SF Sheriff's Department website. You'll need to provide basic personal information, education history, and employment background.",
      timeframe: "1-2 days",
      tips: ["Have all your documents ready before starting", "Double-check all information for accuracy"],
    },
    {
      step: 2,
      title: "Written Examination",
      description:
        "Complete a written test that evaluates your reading comprehension, writing skills, and basic law enforcement knowledge.",
      timeframe: "2-3 hours",
      tips: ["Study the provided materials", "Get a good night's rest before the exam"],
    },
    {
      step: 3,
      title: "Physical Agility Test",
      description:
        "Demonstrate your physical fitness through various exercises including running, obstacle course, and strength tests.",
      timeframe: "Half day",
      tips: ["Train regularly before the test", "Wear appropriate athletic clothing"],
    },
    {
      step: 4,
      title: "Background Investigation",
      description:
        "Undergo a thorough background check including criminal history, employment verification, and reference checks.",
      timeframe: "2-3 months",
      tips: ["Be honest about your history", "Prepare your references in advance"],
    },
    {
      step: 5,
      title: "Medical Examination",
      description: "Complete a comprehensive medical examination to ensure you meet health requirements.",
      timeframe: "1-2 days",
      tips: ["Bring your medical history", "Fast if required for blood tests"],
    },
    {
      step: 6,
      title: "Psychological Evaluation",
      description: "Undergo psychological testing and interview with a licensed psychologist.",
      timeframe: "1-2 days",
      tips: ["Be honest and forthright", "Get adequate rest before the evaluation"],
    },
    {
      step: 7,
      title: "Interview Panel",
      description: "Face an oral interview panel to assess your suitability for the position.",
      timeframe: "1 day",
      tips: ["Prepare for common interview questions", "Dress professionally"],
    },
    {
      step: 8,
      title: "Academy Training",
      description: "Complete the required training at the Sheriff's Academy.",
      timeframe: "6 months",
      tips: ["Maintain physical fitness", "Study consistently"],
    },
  ]

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#0A3C1F] mb-4">Application Process</h1>
            <p className="text-lg text-gray-600">
              Follow these steps to begin your career as a San Francisco Deputy Sheriff. The entire process typically takes
              6-8 months to complete.
            </p>
          </div>

          <div className="space-y-8">
            {steps.map((step, index) => (
              <Card key={step.step}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-[#0A3C1F] rounded-full flex items-center justify-center text-white font-bold">
                      {step.step}
                    </div>
                    <div className="flex-grow">
                      <h2 className="text-2xl font-semibold text-[#0A3C1F] mb-2">{step.title}</h2>
                      <p className="text-gray-600 mb-4">{step.description}</p>
                      <div className="flex flex-wrap gap-6">
                        <div>
                          <span className="text-sm font-semibold text-gray-500">Timeframe:</span>
                          <span className="ml-2 text-gray-700">{step.timeframe}</span>
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-gray-500">Tips:</span>
                          <ul className="mt-1 space-y-1">
                            {step.tips.map((tip) => (
                              <li key={tip} className="flex items-center gap-2">
                                <CircleIcon className="h-2 w-2 text-[#0A3C1F]" />
                                <span className="text-gray-700">{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-blue-800 mb-3">Ready to Begin?</h2>
            <p className="text-blue-700 mb-4">
              Make sure you meet all the requirements before starting your application. Our recruitment team is here to
              support you throughout the process.
            </p>
            <div className="flex gap-4">
              <a
                href="/requirements"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Requirements
              </a>
              <a
                href="/contact"
                className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors"
              >
                Contact Recruitment Team
              </a>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
} 
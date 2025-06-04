import type { Metadata } from "next";
import { PageWrapper } from "@/components/page-wrapper";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Deputy Sheriff Requirements | SFDSA Recruitment",
  description:
    "Learn about the requirements and qualifications needed to become a San Francisco Deputy Sheriff.",
};

export default function RequirementsPage() {
  const requirements = [
    {
      category: "Basic Requirements",
      items: [
        "Must be at least 18 years of age",
        "Must be a U.S. citizen or permanent resident alien who is eligible for and has applied for citizenship",
        "Must possess a valid California Driver&apos;s License",
        "Must possess a high school diploma or equivalent (GED)",
        "Must have no felony convictions",
      ],
    },
    {
      category: "Physical Requirements",
      items: [
        "Must pass a physical agility test",
        "Must pass a medical examination",
        "Must maintain physical fitness standards throughout career",
        "Vision requirements: 20/30 uncorrected or corrected",
        "Must pass a drug screening test",
      ],
    },
    {
      category: "Background Requirements",
      items: [
        "Must pass an extensive background investigation",
        "Must pass a psychological evaluation",
        "No domestic violence convictions",
        "No misdemeanor convictions within the last 5 years",
        "Must have good moral character",
      ],
    },
    {
      category: "Additional Qualifications",
      items: [
        "Must be willing to work various shifts, including nights, weekends, and holidays",
        "Must be able to effectively communicate in English (written and verbal)",
        "Must be able to maintain professional demeanor and composure",
        "Must be willing to carry a firearm",
        "Must complete required training at the Sheriff&apos;s Academy",
      ],
    },
  ];

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#0A3C1F] mb-4">
              Deputy Sheriff Requirements
            </h1>
            <p className="text-lg text-gray-600">
              Learn about the qualifications and requirements needed to join the
              San Francisco Sheriff&apos;s Department.
            </p>
          </div>

          <div className="space-y-8">
            {requirements.map((section) => (
              <Card key={section.category}>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-semibold text-[#0A3C1F] mb-4">
                    {section.category}
                  </h2>
                  <ul className="space-y-3">
                    {section.items.map((item) => (
                      <li key={item} className="flex items-start">
                        <CheckCircle2 className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-blue-800 mb-3">
              Ready to Take the Next Step?
            </h2>
            <p className="text-blue-700 mb-4">
              If you meet these requirements and are ready to begin your journey
              as a San Francisco Deputy Sheriff, we encourage you to start the
              application process.
            </p>
            <div className="flex gap-4">
              <a
                href="/application-process"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Application Process
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
  );
}

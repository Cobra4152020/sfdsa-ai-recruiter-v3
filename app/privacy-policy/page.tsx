import type { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Privacy Policy | SF Deputy Sheriff Recruitment",
  description: "Privacy policy for the San Francisco Deputy Sheriff recruitment platform.",
  openGraph: {
    title: "Privacy Policy | SF Deputy Sheriff Recruitment",
    description: "Privacy policy for the San Francisco Deputy Sheriff recruitment platform.",
    url: "/privacy-policy",
    type: "website",
  },
}

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Card className="shadow-md">
        <CardHeader className="border-b bg-muted/50">
          <CardTitle className="text-2xl font-bold text-[#0A3C1F]">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6 text-gray-700 dark:text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-[#0A3C1F] mb-2">Introduction</h2>
            <p>
              The San Francisco Deputy Sheriff's Association ("SFDSA") is committed to protecting your privacy. This
              Privacy Policy explains how we collect, use, and safeguard your information when you visit our recruitment
              platform or participate in our gamified recruitment activities.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#0A3C1F] mb-2">Information We Collect</h2>
            <p className="mb-2">We may collect the following types of information:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Personal information (name, email address, phone number) that you voluntarily provide</li>
              <li>Application and recruitment related information</li>
              <li>Activity data related to your participation in our gamified recruitment platform</li>
              <li>Usage data and analytics information regarding how you interact with our platform</li>
              <li>Device information including IP address, browser type, and operating system</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#0A3C1F] mb-2">How We Use Your Information</h2>
            <p className="mb-2">We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Facilitate the recruitment process</li>
              <li>Track your progress through our gamified recruitment activities</li>
              <li>Award points, badges, and other recognition within the platform</li>
              <li>Communicate with you regarding your application and recruitment status</li>
              <li>Improve our recruitment platform and user experience</li>
              <li>Generate anonymous, aggregated statistics about platform usage</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#0A3C1F] mb-2">Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information from unauthorized access,
              alteration, disclosure, or destruction. However, no internet transmission or electronic storage is 100%
              secure, and we cannot guarantee absolute security of your data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#0A3C1F] mb-2">Cookies and Tracking Technologies</h2>
            <p>
              Our platform uses cookies and similar tracking technologies to track activity and retain certain
              information. Cookies are files with a small amount of data which may include an anonymous unique
              identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being
              sent.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#0A3C1F] mb-2">Third-Party Services</h2>
            <p>
              We may employ third-party companies and individuals to facilitate our recruitment platform, provide
              services on our behalf, perform service-related services, or assist us in analyzing how our platform is
              used. These third parties have access to your personal information only to perform these tasks on our
              behalf and are obligated not to disclose or use it for any other purpose.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#0A3C1F] mb-2">Your Data Protection Rights</h2>
            <p className="mb-2">
              Under certain circumstances, you have rights under data protection laws in relation to your personal data,
              including the right to:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Request access to your personal data</li>
              <li>Request correction of your personal data</li>
              <li>Request erasure of your personal data</li>
              <li>Object to processing of your personal data</li>
              <li>Request restriction of processing your personal data</li>
              <li>Request transfer of your personal data</li>
              <li>Right to withdraw consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#0A3C1F] mb-2">Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
              Privacy Policy on this page and updating the "Last Updated" date at the bottom of this Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#0A3C1F] mb-2">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at privacy@sfdeputysheriff.com.
            </p>
          </section>

          <div className="text-sm text-gray-500 pt-4 border-t">Last Updated: May 8, 2025</div>
        </CardContent>
      </Card>
    </div>
  )
}

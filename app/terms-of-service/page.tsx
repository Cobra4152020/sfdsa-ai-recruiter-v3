import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Terms of Service | SF Deputy Sheriff Recruitment",
  description:
    "Terms of Service for the San Francisco Deputy Sheriff recruitment platform.",
  openGraph: {
    title: "Terms of Service | SF Deputy Sheriff Recruitment",
    description:
      "Terms of Service for the San Francisco Deputy Sheriff recruitment platform.",
    url: "/terms-of-service",
    type: "website",
  },
};

export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <Card className="shadow-md">
        <CardHeader className="border-b bg-muted/50">
          <CardTitle className="text-2xl font-bold text-primary">
            Terms of Service
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6 text-gray-700 dark:text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-primary mb-2">
              Introduction
            </h2>
            <p>
              Welcome to the San Francisco Deputy Sheriff&apos;s Association
              (&quot;SFDSA&quot;) recruitment platform. These Terms of Service
              (&quot;Terms&quot;) govern your access to and use of our
              recruitment website, applications, and gamified recruitment
              activities (collectively, the &quot;Platform&quot;).
            </p>
            <p className="mt-2">
              By accessing or using the Platform, you agree to be bound by these
              Terms. If you disagree with any part of the Terms, you may not
              access the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mb-2">
              Entertainment Purpose
            </h2>
            <p className="font-bold">
              The gamified elements of the Platform, including the trivia game,
              points system, badges, leaderboards, and other interactive
              features, are provided for entertainment purposes only.
            </p>
            <p className="mt-2">
              Participation in these gamified activities does not guarantee
              employment, preferential treatment in the recruitment process, or
              any advantage in becoming a Deputy Sheriff. The official
              recruitment process is governed by civil service rules,
              regulations, and procedures established by the City and County of
              San Francisco.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mb-2">
              Account Registration
            </h2>
            <p>
              When you create an account on our Platform, you must provide
              information that is accurate, complete, and current at all times.
              Failure to do so constitutes a breach of the Terms, which may
              result in immediate termination of your account.
            </p>
            <p className="mt-2">
              You are responsible for safeguarding the password that you use to
              access the Platform and for any activities or actions under your
              password. You must notify us immediately upon becoming aware of
              any breach of security or unauthorized use of your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mb-2">
              User Conduct
            </h2>
            <p className="mb-2">As a user of the Platform, you agree not to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                Use the Platform in any way that violates any applicable laws or
                regulations
              </li>
              <li>
                Impersonate any person or entity or falsely state or
                misrepresent your affiliation with a person or entity
              </li>
              <li>
                Attempt to gain unauthorized access to any portion of the
                Platform
              </li>
              <li>Interfere with or disrupt the operation of the Platform</li>
              <li>
                Engage in any activity that could harm or disparage the SFDSA or
                its reputation
              </li>
              <li>
                Use automated means to access or interact with the Platform
                without our express permission
              </li>
              <li>
                Engage in any fraudulent activity, including manipulating
                points, badges, or leaderboard standings
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mb-2">
              Intellectual Property
            </h2>
            <p>
              The Platform and its original content, features, and functionality
              are and will remain the exclusive property of the SFDSA and its
              licensors. The Platform is protected by copyright, trademark, and
              other laws. Our trademarks and trade dress may not be used in
              connection with any product or service without the prior written
              consent of the SFDSA.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mb-2">
              User-Generated Content
            </h2>
            <p>
              By posting, uploading, or otherwise making available any content
              on the Platform, you grant the SFDSA a non-exclusive,
              transferable, sub-licensable, royalty-free, worldwide license to
              use, copy, modify, create derivative works based on, distribute,
              and display that content in any format and on any platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mb-2">
              Termination
            </h2>
            <p>
              We may terminate or suspend your account immediately, without
              prior notice or liability, for any reason, including without
              limitation if you breach the Terms. Upon termination, your right
              to use the Platform will immediately cease.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mb-2">
              Limitation of Liability
            </h2>
            <p>
              In no event shall the SFDSA, its officers, directors, employees,
              agents, or affiliates be liable for any indirect, incidental,
              special, consequential or punitive damages, including without
              limitation, loss of profits, data, use, goodwill, or other
              intangible losses, resulting from your access to or use of or
              inability to access or use the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mb-2">
              Disclaimer
            </h2>
            <p>
              Your use of the Platform is at your sole risk. The Platform is
              provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot;
              basis. The Platform is provided without warranties of any kind,
              whether express or implied.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mb-2">
              Governing Law
            </h2>
            <p>
              These Terms shall be governed and construed in accordance with the
              laws of the State of California, without regard to its conflict of
              law provisions. Our failure to enforce any right or provision of
              these Terms will not be considered a waiver of those rights.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mb-2">
              Changes to These Terms
            </h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace
              these Terms at any time. If a revision is material, we will try to
              provide at least 30 days&apos; notice prior to any new terms
              taking effect.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mb-2">
              Contact Us
            </h2>
            <p>
              If you have any questions about these Terms, please contact us at
              terms@sfdeputysheriff.com.
            </p>
          </section>

          <div className="text-sm text-gray-500 pt-4 border-t">
            Last Updated: May 8, 2025
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

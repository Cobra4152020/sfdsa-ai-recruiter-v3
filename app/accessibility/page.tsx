import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Accessibility Statement | SF Deputy Sheriff Recruitment",
  description:
    "Accessibility statement for the San Francisco Deputy Sheriff recruitment platform.",
  openGraph: {
    title: "Accessibility Statement | SF Deputy Sheriff Recruitment",
    description:
      "Accessibility statement for the San Francisco Deputy Sheriff recruitment platform.",
    url: "/accessibility",
    type: "website",
  },
};

export default function AccessibilityStatement() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Card className="shadow-md">
        <CardHeader className="border-b bg-muted/50">
          <CardTitle className="text-2xl font-bold text-[#0A3C1F]">
            Accessibility Statement
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6 text-gray-700 dark:text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-[#0A3C1F] mb-2">
              Our Commitment
            </h2>
            <p>
              The San Francisco Deputy Sheriff&apos;s Association (SFDSA) is
              committed to ensuring digital accessibility for people with
              disabilities. We are continually improving the user experience for
              everyone, and applying the relevant accessibility standards.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#0A3C1F] mb-2">
              Conformance Status
            </h2>
            <p>
              The Web Content Accessibility Guidelines (WCAG) define
              requirements for designers and developers to improve accessibility
              for people with disabilities. It defines three levels of
              conformance: Level A, Level AA, and Level AAA.
            </p>
            <p className="mt-2">
              Our recruitment platform is partially conformant with WCAG 2.1
              level AA. Partially conformant means that some parts of the
              content do not fully conform to the accessibility standard.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#0A3C1F] mb-2">
              Accessibility Features
            </h2>
            <p className="mb-2">
              Our recruitment platform includes the following accessibility
              features:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                Semantic HTML structure for improved screen reader navigation
              </li>
              <li>Keyboard navigation support for all interactive elements</li>
              <li>
                Sufficient color contrast ratios between text and backgrounds
              </li>
              <li>
                Text alternatives for non-text content (alt text for images)
              </li>
              <li>
                Responsive design that adapts to different screen sizes and
                devices
              </li>
              <li>Labeled form elements and error messages</li>
              <li>Skip to content links for keyboard users</li>
              <li>
                ARIA attributes where appropriate to enhance accessibility
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#0A3C1F] mb-2">
              Known Limitations
            </h2>
            <p className="mb-2">
              Despite our efforts, there may be some parts of our platform that
              are not fully accessible:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                Some older content may not fully meet accessibility standards
              </li>
              <li>
                Some third-party content or functions may not be fully
                accessible
              </li>
              <li>
                Some interactive games or trivia components may have limited
                accessibility options
              </li>
              <li>
                Some dynamic content may not be announced properly to screen
                readers
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#0A3C1F] mb-2">
              Feedback and Assistance
            </h2>
            <p>
              We welcome your feedback on the accessibility of our recruitment
              platform. Please let us know if you encounter accessibility
              barriers:
            </p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Email: accessibility@sfdeputysheriff.com</li>
              <li>Phone: (415) 555-1234</li>
            </ul>
            <p className="mt-2">
              We try to respond to feedback within 3 business days. If you need
              assistance with a particular page or feature on our platform,
              please provide the URL and a description of the content you are
              trying to access.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#0A3C1F] mb-2">
              Assessment and Remediation
            </h2>
            <p>
              Our recruitment platform is regularly tested for accessibility
              using a combination of automated testing tools and manual testing
              with assistive technologies. We conduct internal audits of our
              platform and work to address accessibility issues as they are
              identified.
            </p>
            <p className="mt-2">
              As we develop new features and content, we strive to ensure they
              meet accessibility standards from the beginning. We provide
              accessibility training to our staff involved in web development
              and content creation.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#0A3C1F] mb-2">
              Alternative Formats
            </h2>
            <p>
              Upon request, we can provide information in alternative formats
              such as large print, braille, or audio recordings. Please contact
              accessibility@sfdeputysheriff.com to request alternative formats.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#0A3C1F] mb-2">
              Employment and Accommodations
            </h2>
            <p>
              The San Francisco Deputy Sheriff&apos;s Association is committed
              to providing equal employment opportunities for individuals with
              disabilities. Reasonable accommodations are available to qualified
              applicants with disabilities throughout the application and
              recruitment process.
            </p>
            <p className="mt-2">
              If you require an accommodation to access or participate in any
              aspect of the recruitment process, please contact our recruitment
              team at recruiting@sfdeputysheriff.com or call (415) 555-5678.
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

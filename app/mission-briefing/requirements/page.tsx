import { RequirementsExplainer } from "../content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Requirements | SF Deputy Sheriff Recruitment",
  description:
    "Learn about the requirements and qualifications needed to become a San Francisco Deputy Sheriff.",
  keywords:
    "deputy sheriff requirements, qualifications, law enforcement career, San Francisco",
};

export default function RequirementsPage() {
  return (
    <main className="flex-1 bg-white dark:bg-black pt-8 pb-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-primary mb-4">Requirements</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Essential qualifications and requirements to become a San Francisco
          Deputy Sheriff.
        </p>
        <RequirementsExplainer />
      </div>
    </main>
  );
}

import { RecruiterContactForm } from "@/components/recruiter-contact-form";

export default function TestResumeUploadPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Resume Upload Test Page</h1>
      <p className="mb-4 text-gray-600">
        This is a direct test of the resume upload functionality in the RecruiterContactForm component.
      </p>
      <RecruiterContactForm />
    </div>
  );
} 
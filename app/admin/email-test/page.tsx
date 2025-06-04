import { EmailTest } from "@/components/email-test";
import { PageWrapper } from "@/components/page-wrapper";

export default function EmailTestPage() {
  return (
    <PageWrapper>
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-6">Email Testing</h1>
        <EmailTest />
      </div>
    </PageWrapper>
  );
}

import ImagePathDiagnostics from "@/components/image-path-diagnostics"
import { PageWrapper } from "@/components/page-wrapper"

export default function ImageDiagnosticsPage() {
  return (
    <PageWrapper>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Image Path Diagnostics</h1>
        <p className="mb-4">This page helps diagnose issues with image paths in the application.</p>
        <ImagePathDiagnostics />
      </div>
    </PageWrapper>
  )
}

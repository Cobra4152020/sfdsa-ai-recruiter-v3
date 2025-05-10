import ImagePathDiagnostics from "@/components/image-path-diagnostics"

export default function ImageDiagnosticsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Image Path Diagnostics</h1>
      <p className="mb-4">This page helps diagnose issues with image paths in the application.</p>
      <ImagePathDiagnostics />
    </div>
  )
}

import { SchemaDiagram } from "@/components/admin/schema-diagram"
import { PageWrapper } from "@/components/page-wrapper"

export default function DatabaseDiagramPage() {
  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Database Schema Diagram</h1>
        <SchemaDiagram />
      </div>
    </PageWrapper>
  )
}

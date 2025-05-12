import { ImportBriefingsButton } from "@/components/admin/import-briefings-button"

export default function ImportBriefingsPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Import Daily Briefings</h1>
      <p className="text-gray-600 mb-8">Use this tool to import Sgt. Ken's Daily Briefings from a CSV file.</p>

      <ImportBriefingsButton />
    </div>
  )
}

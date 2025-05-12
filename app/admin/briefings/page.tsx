import { ImportBriefingsButton } from "@/components/admin/import-briefings-button"
import { CreateDefaultBriefingButton } from "@/components/admin/create-default-briefing-button"
import { BriefingsTable } from "@/components/admin/briefings-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata = {
  title: "Briefings Administration - SFDSA Recruiter",
  description: "Manage Sgt. Ken's Daily Briefings",
}

export default function BriefingsAdminPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Briefings Administration</h1>
      <p className="text-gray-600 mb-8">
        Manage Sgt. Ken's Daily Briefings. Import briefings from a CSV file, create a default briefing, or view existing
        briefings.
      </p>

      <Tabs defaultValue="import" className="space-y-8">
        <TabsList>
          <TabsTrigger value="import">Import Briefings</TabsTrigger>
          <TabsTrigger value="manage">Manage Briefings</TabsTrigger>
        </TabsList>

        <TabsContent value="import" className="space-y-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">CSV Import Instructions</h2>
            <p className="text-blue-700 mb-2">
              To import briefings, provide a URL to a CSV file with the following columns:
            </p>
            <ul className="list-disc list-inside text-blue-700 ml-4 space-y-1">
              <li>date (YYYY-MM-DD format)</li>
              <li>quote (the inspirational quote)</li>
              <li>author (who said the quote)</li>
              <li>sgt_ken_take (Sgt. Ken's perspective)</li>
              <li>call_to_action (what users should do)</li>
            </ul>
            <p className="text-blue-700 mt-2">The system will automatically infer the theme based on the content.</p>
          </div>

          <ImportBriefingsButton />

          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-xl font-semibold mb-4">Create Default Briefing</h2>
            <p className="text-gray-600 mb-4">
              If you don't have a CSV file, you can create a default briefing for today.
            </p>
            <CreateDefaultBriefingButton />
          </div>
        </TabsContent>

        <TabsContent value="manage">
          <BriefingsTable />
        </TabsContent>
      </Tabs>
    </div>
  )
}

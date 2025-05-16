import { SqlQueryRunner } from "@/components/admin/sql-query-runner"

export default function SqlRunnerPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">SQL Query Runner</h1>
      <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
        <h2 className="text-amber-800 font-medium mb-2">⚠️ Warning</h2>
        <p className="text-amber-700">
          This tool allows direct execution of SQL queries against your database. Use with extreme caution as improper
          queries can result in data loss or corruption. This tool should only be used by administrators with database
          knowledge.
        </p>
      </div>

      <SqlQueryRunner />
    </div>
  )
}

import { DatabaseSchemaUpdateButton } from "@/components/database-schema-update-button"
import { DatabaseSchemaDiagram } from "@/components/database-schema-diagram"

export default function DatabaseSchemaPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Database Schema Update</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Separate User Tables Migration</h2>

          <p className="mb-4">
            This action will update the database schema to create separate tables for recruits and volunteer recruiters.
            This provides better security and separation of concerns.
          </p>

          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
            <p className="text-amber-700">
              <strong>Warning:</strong> This is a significant database change. Please ensure you have a backup before
              proceeding. This operation will migrate existing users to the new schema.
            </p>
          </div>

          <DatabaseSchemaUpdateButton />
        </div>

        <DatabaseSchemaDiagram />
      </div>
    </div>
  )
}

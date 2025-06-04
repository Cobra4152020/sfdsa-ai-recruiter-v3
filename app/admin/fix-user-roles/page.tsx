import { UpdateUserRolesButton } from "@/components/admin/update-user-roles-button";

export default function FixUserRolesPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Fix User Roles Schema</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Database Schema Update</h2>

        <p className="mb-4">
          This utility will add the missing columns to the user_roles table:
        </p>

        <ul className="list-disc pl-6 mb-6">
          <li>assigned_at (TIMESTAMPTZ)</li>
          <li>is_active (BOOLEAN)</li>
        </ul>

        <div className="bg-amber-50 border border-amber-200 p-4 rounded-md mb-6">
          <p className="text-amber-800">
            <strong>Note:</strong> This will modify your database schema.
            Existing records will have their assigned_at set to created_at and
            is_active set to TRUE.
          </p>
        </div>

        <UpdateUserRolesButton />
      </div>
    </div>
  );
}

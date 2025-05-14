import { SimpleFixLoginButton } from "@/components/admin/simple-fix-login-button"

export default function SimpleLoginFixPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Simple Login Fix</h1>

        <div className="mb-8">
          <p className="text-gray-600 mb-4">
            This is a simplified login repair tool that directly fixes the database without checking constraints first.
          </p>

          <p className="text-gray-600 mb-4">Use this if the standard fix is giving you constraint checking errors.</p>
        </div>

        <SimpleFixLoginButton />

        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <h2 className="font-semibold text-yellow-800 mb-2">Direct SQL Fix</h2>
          <p className="text-yellow-700 text-sm mb-2">
            If the button doesn't work, you can run this SQL directly in your Supabase SQL editor:
          </p>
          <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">
            {`-- Fix login issues
BEGIN;

-- Drop constraints if they exist
ALTER TABLE user_roles DROP CONSTRAINT IF EXISTS user_roles_role_check;
ALTER TABLE user_roles DROP CONSTRAINT IF EXISTS user_roles_user_type_check;

-- Add correct constraint
ALTER TABLE user_roles ADD CONSTRAINT user_roles_role_check 
CHECK (role IN ('recruit', 'volunteer', 'admin'));

-- Sync user_types table
INSERT INTO user_types (user_id, user_type, email)
SELECT ur.user_id, ur.role, u.email
FROM user_roles ur
JOIN auth.users u ON ur.user_id = u.id
LEFT JOIN user_types ut ON ur.user_id = ut.user_id
WHERE ut.user_id IS NULL;

COMMIT;`}
          </pre>
        </div>
      </div>
    </div>
  )
}

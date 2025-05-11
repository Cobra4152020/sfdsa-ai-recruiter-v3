export function DatabaseSchemaDiagram() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md overflow-auto">
      <h2 className="text-xl font-semibold mb-4">Database Schema Diagram</h2>

      <div className="border border-gray-200 rounded-lg p-4 mb-6">
        <pre className="text-xs overflow-auto whitespace-pre">
          {`
┌─────────────────────┐     ┌─────────────────────┐
│   auth.users        │     │   public.user_types │
├─────────────────────┤     ├─────────────────────┤
│ id (PK)             │     │ user_id (PK)        │
│ email               │     │ user_type           │
│ encrypted_password  │     │ created_at          │
│ user_metadata       │     └─────────┬───────────┘
│ created_at          │               │
└──────────┬──────────┘               │
           │                          │
           │                          │
┌──────────┴──────────┐     ┌─────────┴───────────┐
│  recruit.users      │     │ volunteer.recruiters│
├─────────────────────┤     ├─────────────────────┤
│ id (PK)             │     │ id (PK)             │
│ email               │     │ email               │
│ name                │     │ first_name          │
│ avatar_url          │     │ last_name           │
│ phone               │     │ avatar_url          │
│ application_status  │     │ phone               │
│ points              │     │ organization        │
│ level               │     │ position            │
│ has_applied         │     │ location            │
│ created_at          │     │ is_active           │
│ updated_at          │     │ is_verified         │
└─────────────────────┘     │ verified_by         │
                            │ verified_at         │
                            │ referrals_count     │
                            │ successful_referrals│
                            │ events_participated │
                            │ events_organized    │
                            │ total_points        │
                            │ created_at          │
                            │ updated_at          │
                            └─────────────────────┘
`}
        </pre>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-2">Key Features:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Separate schemas for recruit and volunteer data</li>
            <li>Central user_types table for quick user type lookup</li>
            <li>Both tables reference auth.users for authentication</li>
            <li>Role-specific fields in each table</li>
            <li>Verification system for volunteer recruiters</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Security Benefits:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Physical separation of user data</li>
            <li>Clear delineation of user roles</li>
            <li>Simplified access control</li>
            <li>Reduced risk of unauthorized access</li>
            <li>Better data organization and management</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

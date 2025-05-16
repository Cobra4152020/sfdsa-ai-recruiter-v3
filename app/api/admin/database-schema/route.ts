import { NextResponse } from "next/server"

export const dynamic = "force-static"
export const revalidate = 3600 // Revalidate every hour

// Static mock database schema
const mockSchema = {
  tables: [
    {
      name: "admin.users",
      columns: [
        { name: "id", type: "uuid", isPrimary: true },
        { name: "email", type: "text", isNullable: false },
        { name: "name", type: "text", isNullable: true },
        { name: "avatar_url", type: "text", isNullable: true },
        { name: "created_at", type: "timestamp with time zone", isNullable: false },
        { name: "updated_at", type: "timestamp with time zone", isNullable: false }
      ]
    },
    {
      name: "public.user_types",
      columns: [
        { name: "user_id", type: "uuid", isPrimary: true },
        { name: "user_type", type: "text", isNullable: false },
        { name: "email", type: "text", isNullable: true },
        { name: "created_at", type: "timestamp with time zone", isNullable: false }
      ]
    },
    {
      name: "public.user_roles",
      columns: [
        { name: "id", type: "serial", isPrimary: true },
        { name: "user_id", type: "uuid", isNullable: false },
        { name: "role", type: "text", isNullable: false },
        { name: "assigned_at", type: "timestamp with time zone", isNullable: false },
        { name: "is_active", type: "boolean", isNullable: false }
      ]
    },
    {
      name: "volunteer.recruiters",
      columns: [
        { name: "id", type: "uuid", isPrimary: true },
        { name: "is_active", type: "boolean", isNullable: false },
        { name: "is_verified", type: "boolean", isNullable: false },
        { name: "verified_at", type: "timestamp with time zone", isNullable: true }
      ]
    }
  ],
  relationships: [
    {
      from: { table: "public.user_types", column: "user_id" },
      to: { table: "auth.users", column: "id" },
      type: "foreign_key"
    },
    {
      from: { table: "public.user_roles", column: "user_id" },
      to: { table: "auth.users", column: "id" },
      type: "foreign_key"
    },
    {
      from: { table: "volunteer.recruiters", column: "id" },
      to: { table: "auth.users", column: "id" },
      type: "foreign_key"
    }
  ],
  source: 'static'
}

export async function GET() {
  return NextResponse.json(mockSchema)
} 
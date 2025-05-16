import { generateUserStaticParams } from "@/lib/static-params"
import { AdminUserPageClient } from "@/components/admin-user-page-client"

export async function generateStaticParams() {
  // Add dummy params for testing
  return [{ id: "user1" }, { id: "user2" }, { id: "user3" }]
}

export default function AdminUserPage({ params }: { params: { id: string } }) {
  return <AdminUserPageClient params={params} />
}

import { AdminUserPageClient } from "@/components/admin-user-page-client";
import { PageWrapper } from "@/components/page-wrapper";

export async function generateStaticParams() {
  // Add dummy params for testing
  return [{ id: "user1" }, { id: "user2" }, { id: "user3" }];
}

export default async function AdminUserPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const resolvedParams = await params;
  
  return (
    <PageWrapper>
      <AdminUserPageClient params={resolvedParams} />
    </PageWrapper>
  );
}

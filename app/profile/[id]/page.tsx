import { ProfilePageClient } from "@/components/profile-page-client";

export async function generateStaticParams() {
  // Add dummy params for testing
  return [{ id: "user1" }, { id: "user2" }, { id: "user3" }];
}

export default function ProfilePage({ params }: { params: { id: string } }) {
  return <ProfilePageClient params={params} />;
}

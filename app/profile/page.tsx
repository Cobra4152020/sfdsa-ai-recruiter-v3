"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/user-context";
import { PageWrapper } from "@/components/page-wrapper";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const router = useRouter();
  const { currentUser, isLoggedIn } = useUser();

  useEffect(() => {
    if (!isLoggedIn && !currentUser) {
      router.push("/?auth=login");
    }
  }, [isLoggedIn, currentUser, router]);

  if (!currentUser) {
    return (
      <PageWrapper>
        <div className="container mx-auto px-4 py-8 text-center">
          <p>Loading profile or not logged in...</p>
          <Button onClick={() => router.push("/?auth=login")}>Login</Button>
        </div>
      </PageWrapper>
    );
  }

  // ... rest of the component
}

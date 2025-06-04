import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";
import { PageWrapper } from "@/components/page-wrapper";

export default function UnauthorizedPage() {
  return (
    <PageWrapper>
      <div className="flex min-h-[calc(100vh-theme(spacing.16))] flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-red-100">
            <ShieldAlert className="h-12 w-12 text-red-600" />
          </div>

          <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Access Denied
          </h1>

          <p className="mt-3 text-gray-600">
            You do not have permission to access the admin area. Please contact
            an administrator if you believe this is an error.
          </p>

          <div className="mt-8">
            <Link href="/">
              <Button>Return to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

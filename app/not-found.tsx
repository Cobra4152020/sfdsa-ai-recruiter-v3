import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, Home, Search, ArrowLeft } from "lucide-react";
import { PageWrapper } from "@/components/page-wrapper";

export default function NotFound() {
  return (
    <PageWrapper>
      <main className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Shield className="h-24 w-24 text-[#0A3C1F] opacity-20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold text-[#0A3C1F]">404</span>
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-[#0A3C1F] mb-4">
            Page Not Found
          </h1>

          <p className="text-gray-600 mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90">
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>

            <Button asChild variant="outline">
              <Link href="/contact">
                <Search className="h-4 w-4 mr-2" />
                Contact Support
              </Link>
            </Button>
          </div>

          <div className="mt-12">
            <Button asChild variant="link" className="text-[#0A3C1F]">
              <Link href="javascript:history.back()">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </PageWrapper>
  );
}

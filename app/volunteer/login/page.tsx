import { PageWrapper } from "@/components/page-wrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UnifiedLoginForm } from "@/components/unified-login-form";
import { Users } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Volunteer Login | SF Deputy Sheriff&apos;s Association",
  description: "Login portal for SFDSA volunteer recruiters",
};

export default function VolunteerLoginPage() {
  return (
    <PageWrapper>
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-md mx-auto">
          <Card className="border-t-4 border-t-[#0A3C1F] shadow-lg">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-center mb-4">
                <Users className="h-10 w-10 text-primary mr-2" />
                <CardTitle className="text-2xl font-bold text-center text-primary">
                  Volunteer Login
                </CardTitle>
              </div>
              <CardDescription className="text-center">
                Sign in to access your volunteer recruiter dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <UnifiedLoginForm
                userType="volunteer"
                redirectTo="/volunteer-dashboard"
        
              />
            </CardContent>
          </Card>

          <div className="mt-8 bg-muted rounded-lg p-4 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Thank you for volunteering!
            </h3>
            <p className="text-sm text-gray-600">
              Your dedication to helping recruit the next generation of deputy
              sheriffs is greatly appreciated. If you need any assistance,
              please contact our volunteer coordinator.
            </p>
          </div>
        </div>
      </main>
    </PageWrapper>
  );
}

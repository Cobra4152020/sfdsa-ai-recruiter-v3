import { PageWrapper } from "@/components/page-wrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UnifiedLoginForm } from "@/components/unified-login-form";
import { User } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | SF Deputy Sheriff&apos;s Association",
  description: "Sign in to access your recruitment dashboard",
};

export default function LoginPage() {
  return (
    <PageWrapper>
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-md mx-auto">
          <Card className="border-t-4 border-t-[#0A3C1F] shadow-lg">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-center mb-4">
                <User className="h-10 w-10 text-primary mr-2" />
                <CardTitle className="text-2xl font-bold text-center text-primary">
                  Recruit Login
                </CardTitle>
              </div>
              <CardDescription className="text-center">
                Sign in to access your recruitment dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <UnifiedLoginForm
                userType="recruit"
                redirectTo="/dashboard"
        
              />
            </CardContent>
          </Card>

          <div className="mt-8 bg-muted rounded-lg p-4 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Why join the Sheriff&apos;s Department?
            </h3>
            <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
              <li>Competitive salary and benefits</li>
              <li>Career advancement opportunities</li>
              <li>Serve and protect your community</li>
              <li>Specialized training and development</li>
            </ul>
          </div>
        </div>
      </main>
    </PageWrapper>
  );
}

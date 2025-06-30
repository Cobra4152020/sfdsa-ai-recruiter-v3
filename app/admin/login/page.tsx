import { PageWrapper } from "@/components/page-wrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UnifiedLoginForm } from "@/components/unified-login-form";
import { Shield } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login | SF Deputy Sheriff's Association",
  description: "Secure login portal for SFDSA administrators",
};

export default function AdminLoginPage() {
  return (
    <PageWrapper>
      <div className="min-h-[calc(100vh-theme(spacing.16))] flex items-center justify-center bg-gray-100 p-4">
        <div className="w-full max-w-md">
          <Card className="border-t-4 border-t-[#0A3C1F] shadow-lg">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-center mb-4">
                <Shield className="h-10 w-10 text-primary mr-2" />
                <CardTitle className="text-2xl font-bold text-center text-primary">
                  Admin Login
                </CardTitle>
              </div>
              <CardDescription className="text-center">
                Secure access for SFDSA administrators
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <UnifiedLoginForm
                userType="admin"
                redirectTo="/admin/dashboard"
        
              />
              <div className="text-center text-sm text-muted-foreground">
                <p>This access is for authorized administrators only.</p>
                <p>
                  If you need assistance, please contact the system
                  administrator.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}

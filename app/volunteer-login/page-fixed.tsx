import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield } from "lucide-react";
import { VolunteerLoginFormClient } from "@/components/volunteer-login-form-client";

export default function VolunteerLoginPage() {
  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-md mx-auto">
        <Card className="border-t-4 border-t-[#0A3C1F] shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-10 w-10 text-[#FFD700] mr-2" />
              <CardTitle className="text-2xl font-bold text-center text-primary">
                Volunteer Recruiter Login
              </CardTitle>
            </div>
            <CardDescription className="text-center">
              Sign in to access your volunteer recruiter dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <VolunteerLoginFormClient />
          </CardContent>
        </Card>

        <div className="mt-8 bg-muted rounded-lg p-4 border border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Why become a Volunteer Recruiter?
          </h3>
          <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
            <li>Help build a stronger Sheriff&apos;s Department</li>
            <li>Earn points and rewards for successful referrals</li>
            <li>Access to exclusive recruitment resources</li>
            <li>Make a difference in your community</li>
          </ul>
        </div>
      </div>
    </main>
  );
}

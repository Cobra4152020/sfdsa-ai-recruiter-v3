import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, CheckCircle, Mail } from "lucide-react";

export default function VolunteerPendingPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <Card className="max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <Clock className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-center text-primary">
            Account Pending Verification
          </CardTitle>
          <CardDescription className="text-center">
            Your volunteer recruiter account is pending verification by an
            administrator.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
            <p className="text-amber-800">
              Thank you for registering as a volunteer recruiter. Your account
              is currently under review. This process typically takes 1-2
              business days.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <p className="text-sm">Your registration has been received</p>
            </div>
            <div className="flex items-start space-x-2">
              <Clock className="h-5 w-5 text-amber-600 mt-0.5" />
              <p className="text-sm">Administrator review in progress</p>
            </div>
            <div className="flex items-start space-x-2">
              <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
              <p className="text-sm">
                You will receive an email when your account is approved
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button asChild variant="outline" className="w-full">
            <Link href="/">Return to Home Page</Link>
          </Button>
          <div className="text-center text-sm text-gray-500">
            <p>
              If you have any questions, please{" "}
              <Link href="/contact" className="text-primary hover:underline">
                contact us
              </Link>
              .
            </p>
          </div>
        </CardFooter>
      </Card>
    </main>
  );
}

import type { Metadata } from "next";
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
import { CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Thank You for Your Donation | SF Deputy Sheriff's Association",
  description:
    "Thank you for supporting the San Francisco Deputy Sheriff's Association.",
};

export default function ThankYouPage() {
  return (
    <div className="container max-w-md py-12">
      <Card className="text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">
            Thank You for Your Donation!
          </CardTitle>
          <CardDescription>
            Your support helps us continue our mission.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            We&apos;ve sent a receipt to your email address. If you have any
            questions about your donation, please contact us.
          </p>
          <p className="text-sm text-muted-foreground">
            Your contribution directly supports the San Francisco Deputy
            Sheriff&apos;s Association and our community programs.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </CardFooter>
      </Card>
      <div className="mt-8 p-6 bg-primary/5 rounded-lg">
        <h3 className="text-lg font-semibold text-primary mb-2">
          Donor Recognition
        </h3>
        <p className="text-gray-600 mb-4">
          If you chose to be recognized for your donation, your name will appear
          on our{" "}
          <a
            href="/donor-recognition"
            className="text-primary font-medium hover:underline"
          >
            Donor Recognition Wall
          </a>{" "}
          within 24-48 hours.
        </p>
        <p className="text-gray-600">
          If you&apos;d like to change your recognition preferences, please
          contact us at{" "}
          <a
            href="mailto:donations@protectingsanfrancisco.com"
            className="text-primary font-medium hover:underline"
          >
            donations@protectingsanfrancisco.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}

import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Thank You for Your Donation | SF Deputy Sheriff's Association",
  description: "Thank you for supporting the San Francisco Deputy Sheriff's Association.",
}

export default function ThankYouPage() {
  return (
    <div className="container max-w-md py-12">
      <Card className="text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Thank You for Your Donation!</CardTitle>
          <CardDescription>Your support helps us continue our mission.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            We've sent a receipt to your email address. If you have any questions about your donation, please contact
            us.
          </p>
          <p className="text-sm text-muted-foreground">
            Your contribution directly supports the San Francisco Deputy Sheriff's Association and our community
            programs.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

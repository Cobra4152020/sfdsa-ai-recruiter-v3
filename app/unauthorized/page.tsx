import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldAlert } from "lucide-react"

export default function UnauthorizedPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <Card className="max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <ShieldAlert className="h-16 w-16 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Unauthorized Access</CardTitle>
          <CardDescription className="text-center">You do not have permission to access this page.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">
              This area is restricted. You may not have the correct role or permissions to view this content.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button asChild className="w-full bg-[#0A3C1F] hover:bg-[#0A3C1F]/90">
            <Link href="/">Return to Home Page</Link>
          </Button>
          <div className="text-center text-sm text-gray-500">
            <p>
              If you believe this is an error, please{" "}
              <Link href="/contact" className="text-[#0A3C1F] hover:underline">
                contact support
              </Link>
              .
            </p>
          </div>
        </CardFooter>
      </Card>
    </main>
  )
}

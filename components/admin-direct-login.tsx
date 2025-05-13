"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Shield, ArrowRight } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"

export function AdminDirectLogin() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleAdminAccess = async () => {
    setIsLoading(true)

    try {
      // In a real implementation, this would verify the user has admin privileges
      // For now, we'll just simulate a delay and redirect
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Admin access granted",
        description: "Welcome to the admin dashboard",
      })

      router.push("/admin/dashboard")
    } catch (error) {
      console.error("Admin access error:", error)
      toast({
        variant: "destructive",
        title: "Access denied",
        description: "You do not have permission to access the admin dashboard",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-t-4 border-t-[#0A3C1F] shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center text-[#0A3C1F]">Admin Access</CardTitle>
        <CardDescription className="text-center">Secure access for authorized administrators only</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center mb-6">
          <div className="bg-[#0A3C1F]/10 p-6 rounded-full">
            <Shield className="h-12 w-12 text-[#0A3C1F]" />
          </div>
        </div>

        <Button
          className="w-full bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white"
          onClick={handleAdminAccess}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center">
              <Spinner size="sm" variant="white" className="mr-2" />
              Verifying...
            </span>
          ) : (
            <span className="flex items-center">
              Access Admin Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </span>
          )}
        </Button>

        <div className="text-center text-sm text-gray-600">
          <p>This access is for authorized administrators only.</p>
          <p>If you need assistance, please contact the system administrator.</p>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Shield, ArrowRight } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { createClient } from "@/lib/supabase-clients"

export function AdminDirectLogin() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleAdminAccess = async () => {
    setIsLoading(true)

    try {
      // Check if the user is already authenticated
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        // Check if the user has admin role
        const { data: userTypeData } = await supabase
          .from("user_types")
          .select("user_type")
          .eq("user_id", session.user.id)
          .single()

        if (userTypeData?.user_type === "admin") {
          // Log the admin access
          await supabase.from("login_audit_logs").insert({
            user_id: session.user.id,
            event_type: "admin_direct_access",
            details: {
              email: session.user.email,
              method: "direct_access",
            },
            created_at: new Date().toISOString(),
          })

          toast({
            title: "Admin access granted",
            description: "Welcome to the admin dashboard",
          })

          router.push("/admin/dashboard")
          return
        }
      }

      // If not authenticated or not an admin, show error
      toast({
        variant: "destructive",
        title: "Access denied",
        description: "You need to authenticate as an admin",
      })

      setIsLoading(false)
    } catch (error) {
      console.error("Admin access error:", error)
      toast({
        variant: "destructive",
        title: "Access denied",
        description: "An error occurred while verifying your access",
      })
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
              <Spinner size="sm" className="mr-2" />
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

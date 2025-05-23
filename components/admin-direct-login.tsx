"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Shield, Loader2 } from "lucide-react"
import { getClientSideSupabase } from "@/lib/supabase"

const supabase = getClientSideSupabase()

export function AdminDirectLogin() {
  const [isLoading] = useState(false)
  const [error] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  return (
    <Card className="border-t-4 border-t-primary shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-primary">Admin Access</CardTitle>
        <CardDescription>Enter your credentials to access the admin dashboard</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-primary/10 p-6 rounded-full">
          <Shield className="h-12 w-12 text-primary" />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">{error}</div>
        )}

        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging in...
            </>
          ) : (
            "Log In"
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

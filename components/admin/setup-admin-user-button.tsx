"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { setupAdminUser } from "@/app/actions/setup-admin-user"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export function SetupAdminUserButton({ userId, email, name }: { userId: string; email: string; name: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSetupAdmin = async () => {
    setIsLoading(true)
    try {
      const result = await setupAdminUser(userId, email, name)

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleSetupAdmin} disabled={isLoading} className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90">
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Setting up admin...
        </>
      ) : (
        "Setup Admin User"
      )}
    </Button>
  )
}

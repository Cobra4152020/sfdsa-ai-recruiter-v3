"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { fixLoginIssues } from "@/app/actions/fix-login-issues"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"

export function FixLoginButton() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const { toast } = useToast()

  const handleFix = async () => {
    setIsLoading(true)
    try {
      const result = await fixLoginIssues()
      setResult(result)

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
      console.error("Error fixing login issues:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Fix Login Issues</CardTitle>
        <CardDescription>
          This will fix common login issues by correcting database constraints and ensuring user roles are properly set
          up.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {result && (
          <Alert className={result.success ? "bg-green-50 border-green-200 mb-4" : "bg-red-50 border-red-200 mb-4"}>
            {result.success ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertTitle>{result.success ? "Success" : "Error"}</AlertTitle>
            <AlertDescription>{result.message}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <p className="text-sm">This fix will:</p>
          <ul className="list-disc pl-5 text-sm space-y-1">
            <li>Check and fix constraints on the user_roles table</li>
            <li>Ensure at least one admin user exists</li>
            <li>Sync user_roles with user_types table</li>
            <li>Revalidate login-related pages</li>
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleFix} disabled={isLoading} className="w-full">
          {isLoading ? "Fixing..." : "Fix Login Issues"}
        </Button>
      </CardFooter>
    </Card>
  )
}

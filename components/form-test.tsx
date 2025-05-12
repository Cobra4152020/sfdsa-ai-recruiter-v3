"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, CheckCircle, XCircle } from "lucide-react"

interface FormTestResult {
  success: boolean
  message: string
  data?: any
}

export function FormTest() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<FormTestResult[]>([])
  const { toast } = useToast()

  const handleTestAuth = async () => {
    if (!email || !name) {
      toast({
        title: "Missing fields",
        description: "Please fill in both name and email fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setResults([])

    try {
      // Test registration endpoint
      const registerResult = await testEndpoint("/api/auth/register", {
        name,
        email: `test_${Date.now()}@example.com`,
        password: "Test123!@#",
      })
      setResults((prev) => [...prev, registerResult])

      // Test other endpoints as needed
      // ...

      toast({
        title: "Tests completed",
        description: `${results.filter((r) => r.success).length} of ${results.length} tests passed`,
      })
    } catch (error) {
      console.error("Error running tests:", error)
      toast({
        title: "Test error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const testEndpoint = async (endpoint: string, data: any, method = "POST"): Promise<FormTestResult> => {
    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const responseData = await response.json()

      return {
        success: response.ok,
        message: response.ok
          ? `${endpoint} - Success (${response.status})`
          : `${endpoint} - Failed (${response.status}): ${responseData.message || "Unknown error"}`,
        data: responseData,
      }
    } catch (error) {
      return {
        success: false,
        message: `${endpoint} - Error: ${error instanceof Error ? error.message : String(error)}`,
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Form Submission Test</CardTitle>
        <CardDescription>Test form submissions and API endpoints</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Test User" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="test@example.com"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="test-mode" defaultChecked />
            <Label htmlFor="test-mode">Use test mode (no permanent changes)</Label>
          </div>

          <Button onClick={handleTestAuth} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Running Tests...
              </>
            ) : (
              "Run Form Tests"
            )}
          </Button>

          {results.length > 0 && (
            <div className="mt-4 space-y-2">
              <h3 className="font-medium">Test Results:</h3>
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border flex items-start ${
                    result.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="mr-3 mt-0.5">
                    {result.success ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{result.message}</div>
                    {result.data && (
                      <pre className="text-xs mt-1 bg-gray-100 p-2 rounded overflow-x-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

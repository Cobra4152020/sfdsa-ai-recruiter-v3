"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, ExternalLink } from "lucide-react"

export default function FixUrlPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const checkSiteUrl = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/fix-site-url")
      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-green-900">Fix Supabase Site URL</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Supabase Site URL Configuration</CardTitle>
          <CardDescription>Update your Supabase site URL to fix magic link and authentication issues</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>
              To fix magic link issues, you need to update the site URL in your Supabase project settings. Follow these
              steps:
            </p>

            <ol className="list-decimal pl-5 space-y-2">
              <li>
                Log in to the{" "}
                <a
                  href="https://app.supabase.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-yellow-600 hover:underline"
                >
                  Supabase Dashboard
                </a>
              </li>
              <li>Select your project (the one connected to sfdeputysheriff.com)</li>
              <li>
                Navigate to <strong>Authentication</strong> → <strong>URL Configuration</strong>
              </li>
              <li>
                Update the <strong>Site URL</strong> field to:{" "}
                <code className="bg-gray-100 px-2 py-1 rounded">https://www.sfdeputysheriff.com</code>
              </li>
              <li>Save your changes</li>
            </ol>

            <div className="flex justify-center my-4">
              <Button
                onClick={() => window.open("https://app.supabase.com", "_blank")}
                className="bg-green-800 hover:bg-green-900 text-white"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Supabase Dashboard
              </Button>
            </div>

            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertTitle className="text-yellow-800">Important</AlertTitle>
              <AlertDescription className="text-yellow-700">
                After updating the site URL in Supabase, you may need to wait a few minutes for the changes to take
                effect. You should also redeploy your application to ensure all settings are updated.
              </AlertDescription>
            </Alert>
          </div>

          <div className="mt-6">
            <Button onClick={checkSiteUrl} disabled={loading} className="bg-yellow-500 hover:bg-yellow-600 text-white">
              {loading ? "Checking..." : "Check Current Site URL"}
            </Button>
          </div>

          {result && (
            <div className="mt-4">
              <Alert className={result.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}>
                {result.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertTitle className={result.success ? "text-green-800" : "text-red-800"}>
                  {result.success ? "Success" : "Action Required"}
                </AlertTitle>
                <AlertDescription className={result.success ? "text-green-700" : "text-red-700"}>
                  {result.message || result.error}
                  {result.currentUrl && (
                    <div className="mt-2">
                      <strong>Current URL:</strong> {result.currentUrl}
                    </div>
                  )}
                  {result.correctUrl && (
                    <div>
                      <strong>Correct URL:</strong> {result.correctUrl}
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            </div>
          )}

          {error && (
            <div className="mt-4">
              <Alert className="bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertTitle className="text-red-800">Error</AlertTitle>
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            After updating the Supabase site URL, make sure your environment variables are correctly set in your Vercel
            deployment:
          </p>

          <div className="bg-gray-100 p-4 rounded mb-4">
            <code>NEXT_PUBLIC_SITE_URL=https://www.sfdeputysheriff.com</code>
          </div>

          <p className="mb-4">
            You should also check that your application is using the correct URL in all authentication flows. The code
            changes we've made will ensure that your application uses the correct URL for all redirects.
          </p>

          <div className="flex justify-center">
            <Button
              onClick={() => window.open("/debug/url-config", "_self")}
              className="bg-green-800 hover:bg-green-900 text-white"
            >
              Check URL Configuration
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

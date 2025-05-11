import { ImprovedHeader } from "@/components/improved-header"
import { ImprovedFooter } from "@/components/improved-footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AuthTestClient } from "@/components/auth-test-client"

export default function AuthTestPage() {
  return (
    <>
      <ImprovedHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#0A3C1F]">Authentication Diagnostic Tool</CardTitle>
              <CardDescription>
                Use this tool to check your authentication status and troubleshoot login issues
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <AuthTestClient />
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-[#0A3C1F]">Troubleshooting Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">Common Issues</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Session expired or missing</li>
                  <li>Cookies blocked by browser settings</li>
                  <li>Incorrect redirect URLs</li>
                  <li>Multiple browser tabs causing session conflicts</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium">Try These Solutions</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Clear your browser cookies and cache</li>
                  <li>Try using a private/incognito window</li>
                  <li>Ensure third-party cookies are enabled</li>
                  <li>Request a new password reset link if needed</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <ImprovedFooter />
    </>
  )
}

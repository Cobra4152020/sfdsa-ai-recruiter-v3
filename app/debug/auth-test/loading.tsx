import { ImprovedHeader } from "@/components/improved-header"
import { ImprovedFooter } from "@/components/improved-footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AuthTestLoading() {
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
              <div className="text-center py-4">
                <div
                  className="animate-spin inline-block w-6 h-6 border-2 border-current border-t-transparent text-[#0A3C1F] rounded-full"
                  aria-hidden="true"
                ></div>
                <p className="mt-2">Loading authentication diagnostic tool...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <ImprovedFooter />
    </>
  )
}

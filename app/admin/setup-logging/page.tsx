import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ImprovedHeader } from "@/components/improved-header"
import { ImprovedFooter } from "@/components/improved-footer"
import { SetupLoggingButton } from "@/components/admin/setup-logging-button"

export default function SetupLoggingPage() {
  return (
    <>
      <ImprovedHeader showOptInForm={() => {}} />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Setup Logging System</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Logging System Setup</CardTitle>
            <CardDescription>Set up the database tables required for the enhanced logging system</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              This will create the necessary database tables and functions for the enhanced logging system. The logging
              system is used to track errors and system events, which helps with debugging and monitoring.
            </p>

            <SetupLoggingButton />
          </CardContent>
        </Card>
      </main>
      <ImprovedFooter />
    </>
  )
}

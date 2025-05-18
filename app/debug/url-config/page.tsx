import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { URLConfigClient } from "@/components/url-config-client"

export default function URLConfigPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-[#0A3C1F]">URL Configuration Debug</CardTitle>
            <CardDescription>Check your site URL configuration for authentication and redirects</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <URLConfigClient />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

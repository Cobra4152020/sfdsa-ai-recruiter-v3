import { PageWrapper } from "@/components/page-wrapper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoginForm } from "@/components/login-form"
import { User } from "lucide-react"

export default function LoginPage() {
  return (
    <PageWrapper>
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-md mx-auto">
          <Card className="border-t-4 border-t-[#0A3C1F] shadow-lg">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-center mb-4">
                <User className="h-10 w-10 text-[#0A3C1F] mr-2" />
                <CardTitle className="text-2xl font-bold text-center text-[#0A3C1F]">Recruit Login</CardTitle>
              </div>
              <CardDescription className="text-center">Sign in to access your recruitment dashboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <LoginForm redirectTo="/dashboard" />
            </CardContent>
          </Card>

          <div className="mt-8 bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Why join the Sheriff's Department?</h3>
            <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
              <li>Competitive salary and benefits</li>
              <li>Career advancement opportunities</li>
              <li>Serve and protect your community</li>
              <li>Specialized training and development</li>
            </ul>
          </div>
        </div>
      </main>
    </PageWrapper>
  )
}

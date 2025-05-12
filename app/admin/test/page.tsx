"use client"

import { ImprovedHeader } from "@/components/improved-header"
import { ImprovedFooter } from "@/components/improved-footer"
import { AppDiagnostics } from "@/components/app-diagnostics"
import { LinkChecker } from "@/components/link-checker"
import { FormTest } from "@/components/form-test"
import { ResponsiveTest } from "@/components/responsive-test"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ErrorBoundaryWrapper } from "@/components/error-boundary-wrapper"

export default function TestPage() {
  return (
    <>
      <ImprovedHeader showOptInForm={() => {}} />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0A3C1F] mb-2">Application Testing</h1>
          <p className="text-gray-600">
            Comprehensive testing tools for the SF Deputy Sheriff AI Recruitment application
          </p>
        </div>

        <Tabs defaultValue="diagnostics">
          <TabsList className="mb-6">
            <TabsTrigger value="diagnostics">Diagnostics</TabsTrigger>
            <TabsTrigger value="links">Links</TabsTrigger>
            <TabsTrigger value="forms">Forms</TabsTrigger>
            <TabsTrigger value="responsive">Responsive</TabsTrigger>
          </TabsList>

          <TabsContent value="diagnostics">
            <ErrorBoundaryWrapper>
              <AppDiagnostics />
            </ErrorBoundaryWrapper>
          </TabsContent>

          <TabsContent value="links">
            <ErrorBoundaryWrapper>
              <LinkChecker />
            </ErrorBoundaryWrapper>
          </TabsContent>

          <TabsContent value="forms">
            <ErrorBoundaryWrapper>
              <FormTest />
            </ErrorBoundaryWrapper>
          </TabsContent>

          <TabsContent value="responsive">
            <ErrorBoundaryWrapper>
              <ResponsiveTest />
            </ErrorBoundaryWrapper>
          </TabsContent>
        </Tabs>
      </main>
      <ImprovedFooter />
    </>
  )
}

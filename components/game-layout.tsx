import type { ReactNode } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type ImprovedfooterProps, ImprovedFooter } from "@/components/improved-footer"
import { ImprovedHeader } from "@/components/improved-header"
import { SkipToContent } from "@/components/skip-to-content"
import { PageWrapper } from "@/components/page-wrapper"

interface GameLayoutProps {
  children: ReactNode
  title: string
  description: string
  footerProps?: ImprovedfooterProps
}

export function GameLayout({ children, title, description, footerProps }: GameLayoutProps) {
  return (
    <PageWrapper>
      <SkipToContent />
      <ImprovedHeader />
      <main id="main-content" className="flex-1 py-8 px-4 md:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-4xl">
          <Card className="w-full border-[#0A3C1F] border-t-4">
            <CardHeader className="bg-gradient-to-r from-[#0A3C1F]/10 to-transparent">
              <CardTitle className="text-2xl md:text-3xl text-[#0A3C1F]">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">{children}</CardContent>
          </Card>
        </div>
      </main>
      <ImprovedFooter {...footerProps} />
    </PageWrapper>
  )
}

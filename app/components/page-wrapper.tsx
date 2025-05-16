import { ImprovedHeader } from "@/components/improved-header"
import { ImprovedFooter } from "@/components/improved-footer"

interface PageWrapperProps {
  children: React.ReactNode
}

export function PageWrapper({ children }: PageWrapperProps) {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <ImprovedHeader />
        <main className="flex-1 bg-white dark:bg-gray-900">
          {children}
        </main>
        <ImprovedFooter />
      </div>
    </>
  )
} 
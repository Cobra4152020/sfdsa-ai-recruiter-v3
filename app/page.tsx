import { ExactHeaderMatch } from "@/components/exact-header-match"
import { ImprovedFooter } from "@/components/improved-footer"

function MainPageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <ExactHeaderMatch />
        <main className="flex-1 bg-white dark:bg-gray-900">
          {children}
        </main>
        <ImprovedFooter />
      </div>
    </>
  )
}

export default function HomePage() {
  return (
    <MainPageWrapper>
      {/* Your existing home page content */}
      // ... existing code ...
    </MainPageWrapper>
  )
} 
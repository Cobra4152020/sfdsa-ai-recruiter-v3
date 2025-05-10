import GamificationExplainer from "./content"
import { ImprovedHeader } from "@/components/improved-header"
import { ImprovedFooter } from "@/components/improved-footer"

export default function GamificationPage() {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <ImprovedHeader />
        <main className="flex-1 bg-white dark:bg-gray-900 pt-8 pb-12">
          <GamificationExplainer />
        </main>
        <ImprovedFooter />
      </div>
    </>
  )
}

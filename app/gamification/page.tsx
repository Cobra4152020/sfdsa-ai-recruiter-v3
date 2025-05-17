import GamificationExplainer from "./content"
import { PageWrapper } from "@/components/page-wrapper"

export default function GamificationPage() {
  return (
    <PageWrapper>
      <main className="flex-1 bg-white dark:bg-gray-900 pt-8 pb-12">
        <GamificationExplainer />
      </main>
    </PageWrapper>
  )
}

import type { Metadata } from "next"
import GamificationExplainer from "./content"

export const metadata: Metadata = {
  title: "Gamification System | SF Deputy Sheriff Recruitment",
  description:
    "Learn about our points system, badges, unlockable content, and NFT rewards in our recruitment platform.",
  keywords: "gamification, points system, badges, NFT rewards, law enforcement recruitment",
}

export default function GamificationPage() {
  return <GamificationExplainer />
}

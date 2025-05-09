import { GameLayout } from "@/components/game-layout"
import { MemoryMatch } from "@/components/games/memory-match"

export default function MemoryMatchPage() {
  return (
    <GameLayout
      title="Memory Match Deluxe"
      description="Test your memory by matching card pairs. Share your high score to earn extra participation points!"
    >
      <MemoryMatch />
    </GameLayout>
  )
}

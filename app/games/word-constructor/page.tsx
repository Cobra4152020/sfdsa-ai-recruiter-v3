import { GameLayout } from "@/components/game-layout"
import { WordConstructor } from "@/components/games/word-constructor"

export default function WordConstructorPage() {
  return (
    <GameLayout
      title="Word Constructor"
      description="Create words from letters and earn points. Share your high score to earn extra participation points!"
    >
      <WordConstructor />
    </GameLayout>
  )
}

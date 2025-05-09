import { GameLayout } from "@/components/game-layout"
import { SpinToWin } from "@/components/games/spin-to-win"

export default function SpinToWinPage() {
  return (
    <GameLayout
      title="Spin to Win"
      description="Spin the wheel to win or lose points. Share your high score to earn extra participation points!"
    >
      <SpinToWin />
    </GameLayout>
  )
}

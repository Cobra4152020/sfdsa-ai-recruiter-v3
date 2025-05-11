"use client"

import { AskSgtKenButton } from "./ask-sgt-ken-button"

export function FloatingChatBubble() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AskSgtKenButton position="fixed" variant="secondary" />
    </div>
  )
}

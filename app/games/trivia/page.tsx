"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TriviaGame } from "@/components/trivia-game"

export default function TriviaPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <TriviaGame />
    </div>
  )
} 
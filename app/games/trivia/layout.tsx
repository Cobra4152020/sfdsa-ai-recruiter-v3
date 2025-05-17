import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "SF Trivia Challenge | SF Deputy Sheriff Recruitment",
  description: "Test your knowledge about San Francisco and law enforcement with our interactive trivia game. Earn points and badges while learning!",
}

export default function TriviaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 
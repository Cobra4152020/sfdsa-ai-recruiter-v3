import { Button } from "@/components/ui/button"

const SUGGESTED_QUESTIONS = [
  "What are the requirements to become a deputy sheriff?",
  "How long is the training academy?",
  "What is the starting salary?",
  "What benefits do deputies receive?",
  "What is the work schedule like?",
  "Can you tell me about career advancement opportunities?"
]

interface ChatSuggestionsProps {
  onSelect: (suggestion: string) => void
}

export function ChatSuggestions({ onSelect }: ChatSuggestionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {SUGGESTED_QUESTIONS.map((question, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          onClick={() => onSelect(question)}
          className="text-sm text-gray-600 hover:text-[#0A3C1F] hover:border-[#0A3C1F]"
        >
          {question}
        </Button>
      ))}
    </div>
  )
} 
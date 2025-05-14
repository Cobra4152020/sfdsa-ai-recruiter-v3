// Simple client-side utility for querying the AI
export async function queryAI(message: string) {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    })

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()

    return {
      text: data.message || "I'm sorry, I couldn't process that request.",
      source: data.sources || ["San Francisco Sheriff's Department"],
    }
  } catch (error) {
    console.error("Error querying AI:", error)
    return {
      text: "I'm having trouble connecting right now. Please try again later or contact our recruitment office directly at (415) 554-7225.",
      source: ["Offline Response"],
    }
  }
}

// Mock function for development/testing
export function mockQueryAI(message: string) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        text: `This is a mock response to: "${message}". In a real environment, this would be answered by our AI assistant with information about the San Francisco Sheriff's Department.`,
        source: ["Mock Data"],
      })
    }, 1000)
  })
}

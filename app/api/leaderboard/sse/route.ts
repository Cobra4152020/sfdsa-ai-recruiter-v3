import { fetchLeaderboard } from "@/lib/leaderboard-service"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const timeframe = searchParams.get("timeframe") as any
  const category = searchParams.get("category") as any
  const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit") as string) : undefined
  const search = searchParams.get("search") || undefined

  // Create a response object with appropriate headers for SSE
  const responseStream = new TransformStream()
  const writer = responseStream.writable.getWriter()
  const encoder = new TextEncoder()

  // Set up SSE headers
  const response = new Response(responseStream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })

  // Function to send SSE events
  const sendEvent = async (data: any) => {
    await writer.write(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
  }

  // Send initial event
  await sendEvent({ type: "connected" })

  // Set up interval for periodic updates
  const intervalId = setInterval(async () => {
    try {
      const filters = {
        timeframe,
        category,
        limit,
        search,
      }

      // Fetch the leaderboard data
      const leaderboard = await fetchLeaderboard(filters)

      await sendEvent({
        type: "update",
        timestamp: new Date().toISOString(),
        leaderboard,
      })
    } catch (error) {
      console.error("Error sending leaderboard update:", error)
      await sendEvent({
        type: "error",
        message: "Failed to update leaderboard",
      })
    }
  }, 10000) // Update every 10 seconds

  // Handle client disconnect
  request.signal.addEventListener("abort", () => {
    clearInterval(intervalId)
    writer.close()
  })

  return response
}

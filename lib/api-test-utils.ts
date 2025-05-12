/**
 * Utility functions for testing API endpoints
 */

export async function testApiEndpoint(endpoint: string): Promise<{
  success: boolean
  status: number
  message: string
  data?: any
}> {
  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const status = response.status
    let data

    try {
      data = await response.json()
    } catch (e) {
      return {
        success: false,
        status,
        message: "Failed to parse JSON response",
      }
    }

    return {
      success: response.ok,
      status,
      message: response.ok ? "API endpoint is working" : `API error: ${status}`,
      data,
    }
  } catch (error) {
    return {
      success: false,
      status: 0,
      message: `Network error: ${error instanceof Error ? error.message : String(error)}`,
    }
  }
}

export async function testAllApiEndpoints(): Promise<
  Array<{
    endpoint: string
    success: boolean
    status: number
    message: string
  }>
> {
  const endpoints = [
    "/api/leaderboard",
    "/api/badges",
    "/api/trivia/questions",
    "/api/trivia/leaderboard",
    "/api/health/database",
    "/api/health/endpoints",
  ]

  const results = await Promise.all(
    endpoints.map(async (endpoint) => {
      const result = await testApiEndpoint(endpoint)
      return {
        endpoint,
        success: result.success,
        status: result.status,
        message: result.message,
      }
    }),
  )

  return results
}

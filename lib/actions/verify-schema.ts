export async function verifySchema() {
  try {
    const response = await fetch("/api/actions/verify-schema")
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Failed to verify schema")
    }

    return data
  } catch (error) {
    console.error("Error in verifySchema action:", error)
    return {
      tables: [],
      globalIssues: [
        {
          type: "other" as const,
          description: `Client error: ${error instanceof Error ? error.message : String(error)}`,
          severity: "high" as const,
        },
      ],
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
} 
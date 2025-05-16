export async function runSqlQuery(query: string, revalidatePaths: string[] = []) {
  try {
    const response = await fetch("/api/actions/run-sql-query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, revalidatePaths }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Failed to execute SQL query")
    }

    return data
  } catch (error) {
    console.error("Error executing SQL query:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
      query,
    }
  }
} 
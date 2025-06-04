export async function runSqlQuery(params: unknown) {
  try {
    const response = await fetch(`/api/admin-actions/run-sql-query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Failed to execute runSqlQuery`);
    }

    return data;
  } catch (error) {
    console.error(`Error in runSqlQuery:`, error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

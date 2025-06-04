export async function databaseSetup(params: unknown) {
  try {
    const response = await fetch(`/api/admin-actions/database-setup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Failed to execute databaseSetup`);
    }

    return data;
  } catch (error) {
    console.error(`Error in databaseSetup:`, error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

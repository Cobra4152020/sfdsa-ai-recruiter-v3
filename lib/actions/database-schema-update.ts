export async function databaseSchemaUpdate(params: unknown) {
  try {
    const response = await fetch(`/api/admin-actions/database-schema-update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Failed to execute databaseSchemaUpdate`);
    }

    return data;
  } catch (error) {
    console.error(`Error in databaseSchemaUpdate:`, error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function setupLoggingSystem(params: unknown) {
  try {
    const response = await fetch(`/api/admin-actions/setup-logging-system`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Failed to setup logging system`);
    }

    return data;
  } catch (error) {
    console.error(`Error in setupLoggingSystem:`, error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

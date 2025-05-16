export async function adminActions(params: any) {
  try {
    const response = await fetch(`/api/admin-actions/admin-actions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Failed to execute adminActions`);
    }

    return data;
  } catch (error) {
    console.error(`Error in adminActions:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
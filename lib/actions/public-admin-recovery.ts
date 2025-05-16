export async function publicAdminRecovery(params: any) {
  try {
    const response = await fetch(`/api/admin-actions/public-admin-recovery`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Failed to execute publicAdminRecovery`);
    }

    return data;
  } catch (error) {
    console.error(`Error in publicAdminRecovery:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
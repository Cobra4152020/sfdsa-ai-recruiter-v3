export async function publicFixAdminAlt(params: any) {
  try {
    const response = await fetch(`/api/admin-actions/public-fix-admin-alt`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Failed to execute publicFixAdminAlt`);
    }

    return data;
  } catch (error) {
    console.error(`Error in publicFixAdminAlt:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
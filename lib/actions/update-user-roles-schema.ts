export async function updateUserRolesSchema(params: any) {
  try {
    const response = await fetch(`/api/admin-actions/update-user-roles-schema`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Failed to update user roles schema`);
    }

    return data;
  } catch (error) {
    console.error(`Error in updateUserRolesSchema:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
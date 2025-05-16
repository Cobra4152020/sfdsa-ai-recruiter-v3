export async function simpleLoginFix(params: any) {
  try {
    const response = await fetch(`/api/admin-actions/simple-login-fix`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Failed to fix login issues`);
    }

    return data;
  } catch (error) {
    console.error(`Error in simpleLoginFix:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
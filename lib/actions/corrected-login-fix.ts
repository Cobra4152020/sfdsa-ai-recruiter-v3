export async function correctedLoginFix(params: unknown) {
  try {
    const response = await fetch(`/api/admin-actions/corrected-login-fix`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Failed to execute correctedLoginFix`);
    }

    return data;
  } catch (error) {
    console.error(`Error in correctedLoginFix:`, error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

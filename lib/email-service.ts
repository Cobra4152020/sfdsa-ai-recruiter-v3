interface StatusEmailParams {
  email: string;
  firstName: string;
  lastName: string;
  status: string;
  trackingNumber: string;
}

export async function sendApplicantStatusEmail({
  email,
  firstName,
  lastName,
  status,
  trackingNumber,
}: StatusEmailParams) {
  try {
    // Call the API route to send the email and log it
    const response = await fetch("/api/send-application-status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        firstName,
        lastName,
        status,
        trackingNumber,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to send email");
    }

    return true;
  } catch (error) {
    console.error("Error sending applicant status email:", error);
    throw error;
  }
}

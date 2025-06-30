"use client";

import { useEffect } from "react";
// import type { RegistrationOptions } from "@/context/registration-context";
import { useRegistration } from "@/context/registration-context";

export default function VolunteerLoginPage() {
  const { openRegistrationPopup } = useRegistration();

  useEffect(() => {
    if (!openRegistrationPopup) return;
    // Open the registration popup automatically with volunteer settings
    openRegistrationPopup({
      userType: "volunteer",
      initialTab: "signin",
      title: "Volunteer Recruiter Login",
      description: "Sign in to access your volunteer recruiter dashboard",
    });
  }, [openRegistrationPopup]);

  return (
    <main className="container mx-auto px-4 py-8 md:py-12 min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Volunteer Recruiter Login</h1>
        <p className="mb-6">
          The login form should appear automatically. If it doesn&apos;t, please
          click the button below.
        </p>
        <button
          onClick={() =>
            openRegistrationPopup &&
            openRegistrationPopup({
              userType: "volunteer",
              initialTab: "signin",
            })
          }
          className="bg-primary text-white py-2 px-4 rounded hover:bg-primary/90"
        >
          Open Login Form
        </button>
      </div>
    </main>
  );
}

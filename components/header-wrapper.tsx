"use client";

import { ImprovedHeader } from "./improved-header";
import { useRegistration } from "@/context/registration-context";

export function HeaderWrapper() {
  const { openRegistrationPopup } = useRegistration();

  const showOptInForm = (applying = false) => {
    openRegistrationPopup({
      applying,
      initialTab: applying ? "optin" : "signin",
    });
  };

  return <ImprovedHeader showOptInForm={showOptInForm} />;
}

"use client";

import type React from "react";

import { useState } from "react";
import { OptInForm } from "@/components/opt-in-form";

interface PageWrapperProps {
  children: React.ReactNode;
}

export function PageWrapper({ children }: PageWrapperProps) {
  const [isOptInFormOpen, setIsOptInFormOpen] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const showOptInForm = (applying = false) => {
    setIsApplying(applying);
    setIsOptInFormOpen(true);
  };

  const handleCloseOptInForm = () => {
    setIsOptInFormOpen(false);
  };

  return (
    <>
      <main id="main-content" className="flex-1 pt-16 pb-12 bg-white dark:bg-black">
        {children}
      </main>
      {isOptInFormOpen && (
        <OptInForm
          onClose={handleCloseOptInForm}
          isApplying={isApplying}
          isOpen={isOptInFormOpen}
        />
      )}
    </>
  );
}

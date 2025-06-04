"use client";

import type React from "react";

import { useState } from "react";
import { OptInForm } from "@/components/opt-in-form";
import { AskSgtKenButton } from "@/components/ask-sgt-ken-button";

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
      <main id="main-content" className="flex-1 pt-16 pb-12">
        {children}
      </main>
      {isOptInFormOpen && (
        <OptInForm
          onClose={handleCloseOptInForm}
          isApplying={isApplying}
          isOpen={isOptInFormOpen}
        />
      )}
      <div className="fixed bottom-6 right-6 z-50">
        <AskSgtKenButton position="fixed" variant="secondary" />
      </div>
    </>
  );
}

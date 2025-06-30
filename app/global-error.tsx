"use client";

import { ShieldLogo } from "@/components/shield-logo";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    // console.error(_error); // _error is not defined, should be error
    console.error(error); // Log the actual error prop
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[#121212] p-4">
          <div className="text-[#FFD700] mb-6">
            <ShieldLogo className="w-16 h-16" />
          </div>
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold text-primary dark:text-[#FFD700] mb-4">
              Something went wrong
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              We apologize for the inconvenience. A critical error occurred.
            </p>
            <div className="space-y-4">
              <button
                onClick={reset}
                className="px-4 py-2 bg-primary text-white hover:bg-primary/90 dark:bg-[#FFD700] dark:text-primary dark:hover:bg-[#FFD700]/90 rounded"
              >
                Try again
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="ml-4 px-4 py-2 border border-primary text-primary hover:bg-primary/10 dark:border-[#FFD700] dark:text-[#FFD700] dark:hover:bg-[#FFD700]/10 rounded"
              >
                Return home
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

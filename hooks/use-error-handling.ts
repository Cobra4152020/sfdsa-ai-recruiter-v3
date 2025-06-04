import { useCallback } from "react";

type SetErrorState = (error: string | null) => void;

export function useErrorHandling(setError: SetErrorState) {
  const handleError = useCallback(
    (error: Error | unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      setError(errorMessage);

      // Clear error after 5 seconds
      setTimeout(() => setError(null), 5000);
    },
    [setError],
  );

  return {
    handleError,
  };
}

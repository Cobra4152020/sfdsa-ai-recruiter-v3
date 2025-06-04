import { useCallback, useState } from "react";

type SetReconnectingState = (isReconnecting: boolean) => void;

export function useReconnection(setIsReconnecting: SetReconnectingState) {
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 2000; // 2 seconds

  const reconnect = useCallback(() => {
    if (retryCount >= MAX_RETRIES) {
      return false;
    }

    setIsReconnecting(true);
    setRetryCount((prev) => prev + 1);

    // Simulate reconnection attempt
    setTimeout(() => {
      setIsReconnecting(false);
    }, RETRY_DELAY);

    return true;
  }, [retryCount, setIsReconnecting]);

  return {
    reconnect,
  };
}

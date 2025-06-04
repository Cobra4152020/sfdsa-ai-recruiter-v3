import { useState, useCallback } from "react";

const RATE_LIMIT_DELAY = 1000; // 1 second between messages

type SetRateLimitState = (isRateLimited: boolean) => void;

export function useRateLimit(setIsRateLimited: SetRateLimitState) {
  const [lastMessageTime, setLastMessageTime] = useState(0);

  const checkRateLimit = useCallback(() => {
    const now = Date.now();
    const timeSinceLastMessage = now - lastMessageTime;

    if (timeSinceLastMessage < RATE_LIMIT_DELAY) {
      setIsRateLimited(true);
      setTimeout(
        () => setIsRateLimited(false),
        RATE_LIMIT_DELAY - timeSinceLastMessage,
      );
      return false;
    }

    setLastMessageTime(now);
    return true;
  }, [lastMessageTime, setIsRateLimited]);

  return {
    checkRateLimit,
  };
}

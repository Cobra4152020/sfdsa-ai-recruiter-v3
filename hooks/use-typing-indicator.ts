import { useCallback } from "react";

type SetTypingState = (isTyping: boolean) => void;

export function useTypingIndicator(setIsTyping: SetTypingState) {
  const startTyping = useCallback(() => {
    setIsTyping(true);
  }, [setIsTyping]);

  const stopTyping = useCallback(() => {
    setIsTyping(false);
  }, [setIsTyping]);

  return {
    startTyping,
    stopTyping,
  };
}

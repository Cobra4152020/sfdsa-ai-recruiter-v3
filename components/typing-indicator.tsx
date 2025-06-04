import { cn } from "@/lib/utils";

interface TypingIndicatorProps {
  isTyping: boolean;
  className?: string;
}

export function TypingIndicator({ isTyping, className }: TypingIndicatorProps) {
  if (!isTyping) return null;

  return (
    <div
      className={cn(
        "max-w-[80%] rounded-lg p-3 bg-[#F0F0F0] dark:bg-[#2A2A2A] text-black dark:text-white",
        className,
      )}
      aria-live="polite"
      aria-label="Sgt. Ken is typing"
    >
      <div className="flex space-x-1">
        <div
          className="w-2 h-2 bg-[#0A3C1F]/60 rounded-full animate-bounce"
          style={{ animationDelay: "0ms" }}
        ></div>
        <div
          className="w-2 h-2 bg-[#0A3C1F]/60 rounded-full animate-bounce"
          style={{ animationDelay: "150ms" }}
        ></div>
        <div
          className="w-2 h-2 bg-[#0A3C1F]/60 rounded-full animate-bounce"
          style={{ animationDelay: "300ms" }}
        ></div>
      </div>
    </div>
  );
}

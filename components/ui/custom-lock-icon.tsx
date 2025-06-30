"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface CustomLockIconProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  unlocked?: boolean;
}

export function CustomLockIcon({ 
  className, 
  size = "md", 
  unlocked = false 
}: CustomLockIconProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5", 
    lg: "h-6 w-6",
    xl: "h-8 w-8"
  };

  const imageSrc = unlocked ? "/unlocked.png" : "/locked.png";
  const altText = unlocked ? "Unlocked" : "Locked";

  return (
    <Image
      src={imageSrc}
      alt={altText}
      width={32}
      height={32}
      className={cn(sizeClasses[size], className)}
    />
  );
} 
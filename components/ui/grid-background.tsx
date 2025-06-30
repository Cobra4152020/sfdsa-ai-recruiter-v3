"use client";

import { cn } from "@/lib/utils";

interface GridBackgroundProps {
  className?: string;
  variant?: "subtle" | "prominent" | "animated";
  color?: "primary" | "secondary" | "muted";
  size?: "sm" | "md" | "lg";
  opacity?: number;
}

export function GridBackground({ 
  className,
  variant = "subtle",
  color = "primary", 
  size = "md",
  opacity = 0.1
}: GridBackgroundProps) {
  const sizeMap = {
    sm: "20px 20px",
    md: "30px 30px", 
    lg: "40px 40px"
  };

  const colorMap = {
    primary: "hsl(148, 63%, 13%)", // #0A3C1F
    secondary: "hsl(48, 100%, 65%)", // #FFD700
    muted: "hsl(210, 40%, 60%)" // Gray
  };

  const gridPattern = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='${encodeURIComponent(colorMap[color])}' fillOpacity='${opacity}'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`;

  const baseStyles = {
    backgroundImage: gridPattern,
    backgroundSize: sizeMap[size],
  };

  const variantStyles = {
    subtle: "opacity-40 dark:opacity-20",
    prominent: "opacity-60 dark:opacity-40", 
    animated: "opacity-40 dark:opacity-20 animate-pulse"
  };

  return (
    <div 
      className={cn(
        "absolute inset-0 z-0 pointer-events-none",
        variantStyles[variant],
        className
      )}
      style={baseStyles}
      aria-hidden="true"
    />
  );
}

interface RippleBackgroundProps {
  className?: string;
  children?: React.ReactNode;
  variant?: "hero" | "card" | "section";
  enableRipples?: boolean;
}

export function RippleBackground({ 
  className, 
  children, 
  variant = "section",
  enableRipples = true 
}: RippleBackgroundProps) {
  const variantConfig = {
    hero: {
      gridVariant: "subtle" as const,
      gridColor: "muted" as const,
      gridSize: "lg" as const,
      secondaryGrid: true
    },
    card: {
      gridVariant: "subtle" as const,
      gridColor: "muted" as const,
      gridSize: "sm" as const,
      secondaryGrid: false
    },
    section: {
      gridVariant: "subtle" as const,
      gridColor: "primary" as const,
      gridSize: "md" as const,
      secondaryGrid: false
    }
  };

  const config = variantConfig[variant];

  return (
    <div className={cn("relative", className)}>
      {enableRipples && (
        <>
          <GridBackground 
            variant={config.gridVariant}
            color={config.gridColor}
            size={config.gridSize}
            opacity={0.08}
          />
          {config.secondaryGrid && (
            <GridBackground 
              variant="subtle"
              color="secondary"
              size={config.gridSize}
              opacity={0.04}
              className="dark:opacity-5"
            />
          )}
        </>
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
} 
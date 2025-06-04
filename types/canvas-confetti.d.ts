declare module "canvas-confetti" {
  interface ConfettiConfig {
    angle?: number;
    spread?: number;
    startVelocity?: number;
    decay?: number;
    gravity?: number;
    drift?: number;
    ticks?: number;
    origin?: {
      x: number;
      y: number;
    };
    colors?: string[];
    shapes?: string[];
    scalar?: number;
    zIndex?: number;
    disableForReducedMotion?: boolean;
    particleCount?: number;
  }

  function confetti(config?: ConfettiConfig): Promise<null>;

  export = confetti;
}

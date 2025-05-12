// Types for animation frame generation

export interface AnimationConfig {
  frameDelay?: number // Milliseconds between frames
  quality?: number // 1-20, lower means better quality but larger file
  loop?: boolean // Whether to loop animation
}

export interface GradientStop {
  position: number // 0-1
  color: string
}

export interface GradientConfig {
  stops: GradientStop[]
}

export interface BackgroundConfig {
  gradient?: GradientConfig
}

export interface PatternOverlayConfig {
  opacity: number
  color: string
}

export interface ImageConfig {
  path: string
  x?: number
  y?: number
  width?: number
  height?: number
  opacity?: number
  centered?: boolean
  rotation?: number // Degrees
}

export interface TextAnimationConfig {
  text: string
  x?: number
  y: number
  fontSize?: number
  fontFamily?: string
  fontWeight?: string
  color?: string
  align?: CanvasTextAlign
  opacity?: number
  maxWidth?: number
  lineHeight?: number
  shadow?: {
    color?: string
    blur?: number
    offsetX?: number
    offsetY?: number
  }
}

export interface ShapeCircleConfig {
  type: "circle"
  x: number
  y: number
  radius: number
  fill?: string
  stroke?: {
    color: string
    width?: number
  }
}

export interface ShapeRectConfig {
  type: "rect"
  x: number
  y: number
  width: number
  height: number
  fill?: string
  stroke?: {
    color: string
    width?: number
  }
}

export type ShapeConfig = ShapeCircleConfig | ShapeRectConfig

export interface ShineEffectConfig {
  x: number
  y: number
  width: number
  height: number
  opacity?: number
}

export interface ParticleConfig {
  x: number
  y: number
  size: number
}

export interface ParticlesEffectConfig {
  color?: string
  items: ParticleConfig[]
}

export interface EffectsConfig {
  shine?: ShineEffectConfig
  particles?: ParticlesEffectConfig
}

export interface AnimationFrame {
  background?: string | { gradient: GradientConfig }
  patternOverlay?: PatternOverlayConfig
  images?: ImageConfig[]
  texts?: TextAnimationConfig[]
  shapes?: ShapeConfig[]
  effects?: EffectsConfig
}

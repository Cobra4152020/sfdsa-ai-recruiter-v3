"use client"

import { useState } from "react"
import Image from "next/image"
import { getFallbackImagePath } from "@/lib/image-path-utils"

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
}

export default function OptimizedImage({
  src,
  alt,
  width = 500,
  height = 300,
  className = "",
  priority = false,
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    if (!hasError) {
      console.warn(`Image failed to load: ${src}`)
      setImgSrc(getFallbackImagePath())
      setHasError(true)
    }
  }

  // For external URLs, use regular img tag
  if (src.startsWith("http")) {
    return (
      <img
        src={imgSrc || "/placeholder.svg"}
        alt={alt}
        width={width}
        height={height}
        className={className}
        onError={handleError}
      />
    )
  }

  // For local images, use Next.js Image component
  return (
    <Image
      src={imgSrc || "/placeholder.svg"}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      onError={handleError}
      unoptimized={true}
    />
  )
}

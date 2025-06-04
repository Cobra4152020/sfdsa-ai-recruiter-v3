"use client";

import { useState, useEffect } from "react";
import Image, { type ImageProps } from "next/image";
import { resolveImagePath, checkImageExists } from "@/lib/image-path-utils";

interface OptimizedImageProps extends Omit<ImageProps, "src"> {
  src: string;
  fallbackSrc?: string;
  className?: string;
}

export function OptimizedImage({
  src,
  fallbackSrc = "/abstract-geometric-shapes.png",
  alt,
  width,
  height,
  className,
  ...props
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState<string>(src);
  const [imageError, setImageError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const resolvedSrc = resolveImagePath(src);

    const verifyImage = async () => {
      try {
        const exists = await checkImageExists(resolvedSrc);
        if (!exists) {
          console.warn(
            `Image at ${resolvedSrc} does not exist, using fallback`,
          );
          setImageSrc(fallbackSrc);
        } else {
          setImageSrc(resolvedSrc);
        }
      } catch (error) {
        console.error("Error verifying image:", error);
        setImageSrc(fallbackSrc);
      } finally {
        setIsLoading(false);
      }
    };

    verifyImage();
  }, [src, fallbackSrc]);

  const handleError = () => {
    if (!imageError) {
      console.warn(`Error loading image from ${imageSrc}, using fallback`);
      setImageSrc(fallbackSrc);
      setImageError(true);
    }
  };

  return (
    <>
      {isLoading ? (
        <div
          className={`bg-gray-200 animate-pulse ${className}`}
          style={{
            width: typeof width === "number" ? `${width}px` : width,
            height: typeof height === "number" ? `${height}px` : height,
          }}
        />
      ) : (
        <Image
          src={imageSrc || "/placeholder.svg"}
          alt={alt}
          width={width}
          height={height}
          onError={handleError}
          className={className}
          {...props}
        />
      )}
    </>
  );
}

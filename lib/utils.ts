import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const isBrowser = () => typeof window !== 'undefined'

export const getWindowOrigin = () => {
  return isBrowser() ? window.location.origin : ''
}

export const getWindowLocation = () => {
  return isBrowser() ? window.location : null
}

export const getWindowDimensions = () => {
  if (!isBrowser()) {
    return {
      width: 0,
      height: 0,
      scrollY: 0,
      innerWidth: 0,
      innerHeight: 0
    }
  }
  
  return {
    width: window.innerWidth,
    height: window.innerHeight,
    scrollY: window.scrollY,
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight
  }
}

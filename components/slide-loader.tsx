"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { Loader2 } from "lucide-react"

// This component implements lazy loading for slides
interface SlideLoaderProps {
  children: React.ReactNode
  isActive: boolean
  slideIndex: number
}

export default function SlideLoader({ children, isActive, slideIndex }: SlideLoaderProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  // Only load content when slide is active or adjacent to active slide
  useEffect(() => {
    if (isActive || isLoaded) {
      setIsLoaded(true)
    }
  }, [isActive, isLoaded])

  // Preload adjacent slides for smoother transitions
  useEffect(() => {
    const preloadTimer = setTimeout(() => {
      setIsLoaded(true)
    }, 1000)

    return () => clearTimeout(preloadTimer)
  }, [])

  if (!isLoaded) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 text-cyan-400 animate-spin" />
      </div>
    )
  }

  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center">
          <Loader2 className="h-8 w-8 text-cyan-400 animate-spin" />
        </div>
      }
    >
      {children}
    </Suspense>
  )
}

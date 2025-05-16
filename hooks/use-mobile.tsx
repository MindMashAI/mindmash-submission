"use client"

import { useState, useEffect } from "react"

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false)
  const [isPortrait, setIsPortrait] = useState(false)

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === "undefined") {
      return
    }

    // Function to check device and orientation
    const checkDevice = () => {
      // Check if mobile based on screen width
      setIsMobile(window.innerWidth < 768)

      // Check orientation
      setIsPortrait(window.innerHeight > window.innerWidth)
    }

    // Initial check
    checkDevice()

    // Add event listeners for resize and orientation change
    window.addEventListener("resize", checkDevice)
    window.addEventListener("orientationchange", checkDevice)

    // Cleanup
    return () => {
      window.removeEventListener("resize", checkDevice)
      window.removeEventListener("orientationchange", checkDevice)
    }
  }, [])

  return { isMobile, isPortrait }
}

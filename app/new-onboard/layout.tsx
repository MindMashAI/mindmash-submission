"use client"

import type React from "react"

import { useEffect } from "react"
import { useAudio } from "@/components/audio-manager"

export default function NewOnboardingLayout({ children }: { children: React.ReactNode }) {
  const { playSound } = useAudio()

  useEffect(() => {
    console.log("NEW ONBOARDING LAYOUT MOUNTED")
    playSound("/sounds/boot.mp3")

    // Add a visual indicator to confirm the new layout is being used
    const indicator = document.createElement("div")
    indicator.style.position = "fixed"
    indicator.style.top = "0"
    indicator.style.right = "0"
    indicator.style.backgroundColor = "red"
    indicator.style.color = "white"
    indicator.style.padding = "8px"
    indicator.style.zIndex = "9999"
    indicator.textContent = "NEW LAYOUT ACTIVE"
    document.body.appendChild(indicator)

    return () => {
      if (indicator && indicator.parentNode) {
        indicator.parentNode.removeChild(indicator)
      }
    }
  }, [playSound])

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#000",
        color: "#fff",
        fontFamily: "monospace",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      {/* Distinct visual header to make it clear this is the new layout */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: "#ff00ff",
          padding: "10px 20px",
          textAlign: "center",
          zIndex: 100,
        }}
      >
        <h1
          style={{
            margin: 0,
            color: "black",
            fontWeight: "bold",
            fontSize: "24px",
          }}
        >
          NEW ONBOARDING PROCESS
        </h1>
      </div>

      {children}
    </div>
  )
}

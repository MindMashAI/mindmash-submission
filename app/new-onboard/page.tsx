"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

// Simplified button component to avoid any styling conflicts
function SimpleButton({
  onClick,
  children,
  color = "purple",
}: {
  onClick: () => void
  children: React.ReactNode
  color?: "purple" | "blue" | "green"
}) {
  const colors = {
    purple: {
      bg: "#8b5cf6",
      hover: "#7c3aed",
    },
    blue: {
      bg: "#3b82f6",
      hover: "#2563eb",
    },
    green: {
      bg: "#10b981",
      hover: "#059669",
    },
  }

  const [isHovered, setIsHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: isHovered ? colors[color].hover : colors[color].bg,
        color: "white",
        border: "none",
        borderRadius: "8px",
        padding: "12px 24px",
        fontSize: "16px",
        fontWeight: "bold",
        cursor: "pointer",
        transition: "background-color 0.3s",
        width: "100%",
        margin: "10px 0",
      }}
    >
      {children}
    </button>
  )
}

export default function NewOnboardingPage() {
  const [hasLoaded, setHasLoaded] = useState(false)
  const router = useRouter()

  useEffect(() => {
    console.log("NEW ONBOARDING PAGE MOUNTED")
    setHasLoaded(true)

    // Log to the page to make it visible
    const logElement = document.getElementById("new-onboard-log")
    if (logElement) {
      logElement.textContent = "Page loaded at: " + new Date().toISOString()
    }
  }, [])

  const handleContinue = () => {
    console.log("Continue button clicked")
    router.push("/new-onboard/wallet")
  }

  const handleViewOld = () => {
    console.log("View old onboarding clicked")
    router.push("/onboarding")
  }

  return (
    <div
      style={{
        maxWidth: "600px",
        width: "100%",
        margin: "0 auto",
        marginTop: "70px",
        backgroundColor: "#111",
        borderRadius: "16px",
        padding: "32px",
        border: "3px solid #ff00ff",
        boxShadow: "0 0 20px rgba(255, 0, 255, 0.5)",
      }}
    >
      {/* Hidden log element to verify rendering */}
      <div
        id="new-onboard-log"
        style={{
          position: "fixed",
          top: "40px",
          right: "5px",
          backgroundColor: "#333",
          padding: "5px",
          fontSize: "10px",
          zIndex: 1000,
        }}
      ></div>

      <h1
        style={{
          fontSize: "36px",
          fontWeight: "bold",
          marginBottom: "24px",
          textAlign: "center",
          color: "#ff00ff",
        }}
      >
        Welcome to MindMash.AI
      </h1>

      <p
        style={{
          fontSize: "18px",
          lineHeight: "1.6",
          marginBottom: "24px",
          textAlign: "center",
        }}
      >
        This is a completely new onboarding process with distinct styling to verify that new code is being rendered.
      </p>

      <div
        style={{
          padding: "20px",
          backgroundColor: "#222",
          borderRadius: "8px",
          marginBottom: "24px",
          border: "1px solid #333",
        }}
      >
        <h2 style={{ color: "#ff00ff", marginBottom: "16px" }}>Debug Information:</h2>
        <p>Rendered at: {new Date().toISOString()}</p>
        <p>Component loaded: {hasLoaded ? "YES" : "NO"}</p>
        <p>Your screen width: {typeof window !== "undefined" ? window.innerWidth : "Unknown"} px</p>
      </div>

      <SimpleButton onClick={handleContinue}>Continue to Wallet Creation</SimpleButton>

      <SimpleButton onClick={handleViewOld} color="blue">
        View Old Onboarding
      </SimpleButton>

      <div
        style={{
          marginTop: "20px",
          padding: "10px",
          backgroundColor: "#333",
          borderRadius: "8px",
          fontSize: "14px",
          textAlign: "center",
        }}
      >
        This new page should be visibly different with a bright pink header and border
      </div>
    </div>
  )
}

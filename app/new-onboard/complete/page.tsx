"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface ButtonProps {
  onClick: () => void
  children: React.ReactNode
  color?: "purple" | "blue" | "green" | "red"
}

function SimpleButton({ onClick, children, color = "purple" }: ButtonProps) {
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
    red: {
      bg: "#ef4444",
      hover: "#dc2626",
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

export default function NewCompletePage() {
  const router = useRouter()

  useEffect(() => {
    console.log("NEW COMPLETE PAGE MOUNTED")
  }, [])

  const handleEnterMindMash = () => {
    console.log("Entering MindMash")
    router.push("/soulsig")
  }

  const handleReturnToStart = () => {
    console.log("Returning to start")
    router.push("/new-onboard")
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
      <div
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          backgroundColor: "#10b981",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 24px auto",
          fontSize: "40px",
        }}
      >
        ✓
      </div>

      <h1
        style={{
          fontSize: "32px",
          fontWeight: "bold",
          marginBottom: "24px",
          textAlign: "center",
          color: "#ff00ff",
        }}
      >
        Setup Complete!
      </h1>

      <p
        style={{
          fontSize: "18px",
          lineHeight: "1.6",
          marginBottom: "24px",
          textAlign: "center",
        }}
      >
        Your MindMash.AI account has been successfully set up!
      </p>

      <div
        style={{
          padding: "20px",
          backgroundColor: "#222",
          borderRadius: "8px",
          marginBottom: "24px",
          border: "1px solid #3f3",
        }}
      >
        <h2
          style={{
            color: "#3f3",
            fontSize: "20px",
            marginBottom: "16px",
          }}
        >
          Your Account Summary
        </h2>

        <div style={{ marginBottom: "16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div
              style={{
                padding: "16px",
                backgroundColor: "#333",
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "14px", color: "#aaa", marginBottom: "8px" }}>SynBot</div>
              <div style={{ fontSize: "16px", fontWeight: "bold", color: "#ff00ff" }}>Active</div>
            </div>

            <div
              style={{
                padding: "16px",
                backgroundColor: "#333",
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "14px", color: "#aaa", marginBottom: "8px" }}>Wallet</div>
              <div style={{ fontSize: "16px", fontWeight: "bold", color: "#ff00ff" }}>Connected</div>
            </div>

            <div
              style={{
                padding: "16px",
                backgroundColor: "#333",
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "14px", color: "#aaa", marginBottom: "8px" }}>SoulSig NFT</div>
              <div style={{ fontSize: "16px", fontWeight: "bold", color: "#ff00ff" }}>Minted</div>
            </div>

            <div
              style={{
                padding: "16px",
                backgroundColor: "#333",
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "14px", color: "#aaa", marginBottom: "8px" }}>Account</div>
              <div style={{ fontSize: "16px", fontWeight: "bold", color: "#ff00ff" }}>Ready</div>
            </div>
          </div>
        </div>

        <div
          style={{
            padding: "12px",
            backgroundColor: "#111",
            borderRadius: "6px",
            fontSize: "14px",
          }}
        >
          <div style={{ marginBottom: "8px", fontWeight: "bold", color: "#3f3" }}>What's Next:</div>
          <ul style={{ paddingLeft: "20px", color: "#ddd" }}>
            <li style={{ marginBottom: "6px" }}>Explore your SynBot interface</li>
            <li style={{ marginBottom: "6px" }}>Join Syndicates to collaborate</li>
            <li style={{ marginBottom: "6px" }}>Earn MINDMASH tokens</li>
            <li>Connect with other users</li>
          </ul>
        </div>
      </div>

      <SimpleButton onClick={handleEnterMindMash} color="green">
        Enter MindMash
      </SimpleButton>

      <SimpleButton onClick={handleReturnToStart} color="blue">
        Return to Start
      </SimpleButton>

      {/* Debug information */}
      <div
        style={{
          marginTop: "20px",
          padding: "10px",
          backgroundColor: "#333",
          borderRadius: "8px",
          fontSize: "12px",
          textAlign: "center",
        }}
      >
        Page rendered at: {new Date().toISOString()}
      </div>
    </div>
  )
}

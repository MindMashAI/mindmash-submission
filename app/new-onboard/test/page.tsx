"use client"

import { useState, useEffect } from "react"

export default function TestPage() {
  const [renderTime, setRenderTime] = useState("")
  const [mounted, setMounted] = useState(false)
  const [screenInfo, setScreenInfo] = useState({
    width: 0,
    height: 0,
    userAgent: "",
  })

  useEffect(() => {
    console.log("TEST PAGE MOUNTED")
    setRenderTime(new Date().toISOString())
    setMounted(true)

    if (typeof window !== "undefined") {
      setScreenInfo({
        width: window.innerWidth,
        height: window.innerHeight,
        userAgent: navigator.userAgent,
      })
    }
  }, [])

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
      <h1
        style={{
          fontSize: "32px",
          fontWeight: "bold",
          marginBottom: "24px",
          textAlign: "center",
          color: "#ff00ff",
        }}
      >
        New Onboarding Test Page
      </h1>

      <div
        style={{
          padding: "20px",
          backgroundColor: "#222",
          borderRadius: "8px",
          marginBottom: "24px",
          border: "1px solid #ff00ff",
        }}
      >
        <h2
          style={{
            color: "#ff00ff",
            fontSize: "20px",
            marginBottom: "16px",
          }}
        >
          Debug Information
        </h2>

        <div
          style={{
            fontFamily: "monospace",
            backgroundColor: "#000",
            padding: "12px",
            borderRadius: "6px",
            marginBottom: "16px",
          }}
        >
          <p style={{ marginBottom: "8px" }}>Render time: {renderTime}</p>
          <p style={{ marginBottom: "8px" }}>Component mounted: {mounted ? "Yes" : "No"}</p>
          <p style={{ marginBottom: "8px" }}>Screen width: {screenInfo.width}px</p>
          <p style={{ marginBottom: "8px" }}>Screen height: {screenInfo.height}px</p>
          <p style={{ wordBreak: "break-all" }}>User agent: {screenInfo.userAgent}</p>
        </div>

        <p
          style={{
            backgroundColor: "#333",
            padding: "10px",
            borderRadius: "6px",
            fontSize: "14px",
            textAlign: "center",
            fontWeight: "bold",
            color: "#ff00ff",
          }}
        >
          If you can see this page, the new onboarding files are being rendered!
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <a
          href="/new-onboard"
          style={{
            padding: "16px",
            backgroundColor: "#8b5cf6",
            color: "white",
            textAlign: "center",
            borderRadius: "8px",
            fontWeight: "bold",
            textDecoration: "none",
          }}
        >
          Start Page
        </a>

        <a
          href="/new-onboard/wallet"
          style={{
            padding: "16px",
            backgroundColor: "#3b82f6",
            color: "white",
            textAlign: "center",
            borderRadius: "8px",
            fontWeight: "bold",
            textDecoration: "none",
          }}
        >
          Wallet Page
        </a>

        <a
          href="/new-onboard/mint"
          style={{
            padding: "16px",
            backgroundColor: "#ec4899",
            color: "white",
            textAlign: "center",
            borderRadius: "8px",
            fontWeight: "bold",
            textDecoration: "none",
          }}
        >
          Mint Page
        </a>

        <a
          href="/new-onboard/complete"
          style={{
            padding: "16px",
            backgroundColor: "#10b981",
            color: "white",
            textAlign: "center",
            borderRadius: "8px",
            fontWeight: "bold",
            textDecoration: "none",
          }}
        >
          Complete Page
        </a>
      </div>

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
        If the styles look completely different than the regular app, that means our new code is working!
      </div>
    </div>
  )
}

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface ButtonProps {
  onClick: () => void
  children: React.ReactNode
  color?: "purple" | "blue" | "green" | "red"
  disabled?: boolean
}

function SimpleButton({ onClick, children, color = "purple", disabled = false }: ButtonProps) {
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
      disabled={disabled}
      style={{
        backgroundColor: disabled ? "#666" : isHovered ? colors[color].hover : colors[color].bg,
        color: "white",
        border: "none",
        borderRadius: "8px",
        padding: "12px 24px",
        fontSize: "16px",
        fontWeight: "bold",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "background-color 0.3s",
        width: "100%",
        margin: "10px 0",
        opacity: disabled ? 0.7 : 1,
      }}
    >
      {children}
    </button>
  )
}

export default function NewMintPage() {
  const [isMinting, setIsMinting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [mintComplete, setMintComplete] = useState(false)
  const router = useRouter()

  useEffect(() => {
    console.log("NEW MINT PAGE MOUNTED")
  }, [])

  const handleMint = () => {
    setIsMinting(true)
    console.log("Starting NFT mint process")

    // Simulate minting progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 4
      })
    }, 200)

    // Simulate minting completion
    setTimeout(() => {
      clearInterval(interval)
      setProgress(100)
      setMintComplete(true)
      console.log("NFT minted successfully")
    }, 5000)
  }

  const handleContinue = () => {
    console.log("Continue to completion")
    router.push("/new-onboard/complete")
  }

  const handleBack = () => {
    console.log("Going back to wallet")
    router.push("/new-onboard/wallet")
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
      <h1
        style={{
          fontSize: "32px",
          fontWeight: "bold",
          marginBottom: "24px",
          textAlign: "center",
          color: "#ff00ff",
        }}
      >
        Mint Your SoulSig NFT
      </h1>

      <p
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          marginBottom: "24px",
          textAlign: "center",
        }}
      >
        This new NFT minting page has distinct styling to verify that new code is being rendered.
      </p>

      {/* Trading card style NFT display - smaller and rectangular */}
      <div
        style={{
          width: "180px",
          height: "250px",
          margin: "0 auto",
          marginBottom: "24px",
          position: "relative",
          backgroundColor: "black",
          border: "3px solid #ff00ff",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <img
          src="/images/soulsig-nft-image.png"
          alt="SoulSig NFT"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* Success Checkmark */}
        {mintComplete && (
          <div
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              backgroundColor: "#10b981",
              borderRadius: "50%",
              width: "30px",
              height: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✓
          </div>
        )}
      </div>

      {!mintComplete ? (
        <div>
          <div
            style={{
              padding: "20px",
              backgroundColor: "#222",
              borderRadius: "8px",
              marginBottom: "24px",
              border: "1px solid #333",
            }}
          >
            <h2
              style={{
                color: "#ff00ff",
                fontSize: "20px",
                marginBottom: "16px",
              }}
            >
              About SoulSig NFTs:
            </h2>

            <ul style={{ paddingLeft: "20px" }}>
              <li style={{ marginBottom: "8px" }}>Soulbound NFTs cannot be transferred or sold</li>
              <li style={{ marginBottom: "8px" }}>Represents your unique identity in MindMash</li>
              <li style={{ marginBottom: "8px" }}>Connects to your SynBot and enables special features</li>
              <li>Evolves based on your contributions and interactions</li>
            </ul>
          </div>

          {isMinting && (
            <div style={{ marginBottom: "24px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <span>Minting NFT...</span>
                <span>{progress}%</span>
              </div>
              <div
                style={{
                  height: "20px",
                  backgroundColor: "#333",
                  borderRadius: "10px",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${progress}%`,
                    background: "linear-gradient(to right, #ff00ff, #00ffff)",
                    boxShadow: "0 0 15px #ff00ff, 0 0 30px #ff00ff",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    transition: "width 0.2s",
                  }}
                ></div>
              </div>
              <div style={{ marginTop: "8px", fontSize: "14px" }}>
                {progress < 25 && "Preparing metadata..."}
                {progress >= 25 && progress < 50 && "Connecting to network..."}
                {progress >= 50 && progress < 75 && "Creating transaction..."}
                {progress >= 75 && progress < 100 && "Finalizing..."}
              </div>
            </div>
          )}

          <SimpleButton onClick={handleMint} disabled={isMinting} color="purple">
            {isMinting ? "Minting..." : "Mint SoulSig NFT"}
          </SimpleButton>
        </div>
      ) : (
        <div>
          <div
            style={{
              padding: "20px",
              backgroundColor: "#222",
              borderRadius: "8px",
              marginBottom: "24px",
              border: "1px solid #3f3",
              boxShadow: "0 0 10px rgba(63, 255, 63, 0.3)",
            }}
          >
            <h2
              style={{
                color: "#3f3",
                textAlign: "center",
                marginBottom: "20px",
                fontSize: "24px",
              }}
            >
              NFT Minted Successfully!
            </h2>

            <div style={{ marginBottom: "16px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <span>Name:</span>
                <span style={{ color: "#ff00ff" }}>SoulSig #5289</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <span>Collection:</span>
                <span>MindMash SoulSig</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <span>Mint Address:</span>
                <span style={{ color: "#ff00ff" }}>7xDy3L...yVUc</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <span>Network:</span>
                <span>Solana</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>Type:</span>
                <span>Soulbound NFT</span>
              </div>
            </div>
          </div>

          <SimpleButton onClick={handleContinue} color="green">
            Continue to Complete Setup
          </SimpleButton>
        </div>
      )}

      <SimpleButton onClick={handleBack} color="blue">
        Back to Wallet
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

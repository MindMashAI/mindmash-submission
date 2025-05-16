"use client"

import { useState, useEffect } from "react"

interface EmergencyNFTDisplayProps {
  size?: "small" | "medium" | "large"
}

export function EmergencyNFTDisplay({ size = "medium" }: EmergencyNFTDisplayProps) {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoaded(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const dimensions = {
    small: { width: "120px", height: "160px" },
    medium: { width: "180px", height: "250px" },
    large: { width: "240px", height: "320px" },
  }

  return (
    <div
      className="relative overflow-hidden border-2 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]"
      style={{
        width: dimensions[size].width,
        height: dimensions[size].height,
        borderRadius: "10px",
        margin: "0 auto",
      }}
    >
      {/* Animated holographic overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-cyan-500/5 to-pink-500/10 opacity-50 animate-pulse"></div>

      {/* Animated scan line */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="h-1 w-full bg-cyan-400/30 animate-scan-line"></div>
      </div>

      <img
        src="/images/soulsig-nft-image.png"
        alt="SoulSig NFT"
        className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
      />

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
        <h3 className="text-cyan-400 font-bold text-lg mb-0.5">SoulSig</h3>
        <p className="text-cyan-100 text-xs">Your digital identity token</p>
      </div>

      {/* Animated corner accents */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400"></div>
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400"></div>
    </div>
  )
}

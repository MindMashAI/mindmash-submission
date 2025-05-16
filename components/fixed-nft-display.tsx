"use client"

interface FixedNFTDisplayProps {
  showLabel?: boolean
  size?: "small" | "medium" | "large"
  className?: string
}

export function FixedNFTDisplay({ showLabel = true, size = "medium", className = "" }: FixedNFTDisplayProps) {
  // Calculate dimensions based on size
  const dimensions = {
    small: { width: 140, height: 200 },
    medium: { width: 180, height: 250 },
    large: { width: 220, height: 300 },
  }

  const { width, height } = dimensions[size]

  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        position: "relative",
        margin: "0 auto",
      }}
      className={`relative rounded-lg overflow-hidden border-2 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all hover:shadow-[0_0_25px_rgba(6,182,212,0.8)] ${className}`}
    >
      {/* Image with object-cover to fill the trading card style container */}
      <img src="/images/soulsig-nft-image.png" alt="SoulSig NFT" className="w-full h-full object-cover" />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
        <h3 className="text-cyan-400 font-bold text-lg mb-0.5">Neural Pioneer Bot</h3>
        <p className="text-cyan-100 text-xs">Legendary • Power: 95/100</p>
      </div>
    </div>
  )
}

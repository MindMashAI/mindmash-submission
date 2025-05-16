"use client"

import { useState } from "react"
import { X, Check, Circle, Square, Hexagon, Zap } from "lucide-react"
import type { ThoughtNode } from "@/types/types"
import { useAudio } from "@/components/audio-manager"

interface NodeCustomizerProps {
  thoughtNode: ThoughtNode
  onUpdate: (nodeId: string, visualStyle: ThoughtNode["visualStyle"]) => void
  onClose: () => void
}

// Neon colors for thoughts
const NEON_COLORS = [
  "#4ade80", // neon green
  "#d946ef", // neon purple
  "#22d3ee", // neon cyan
  "#facc15", // neon yellow
  "#f87171", // neon red
  "#60a5fa", // neon blue
  "#c084fc", // neon violet
  "#34d399", // neon teal
  "#fb923c", // neon orange
]

export function NodeCustomizer({ thoughtNode, onUpdate, onClose }: NodeCustomizerProps) {
  const [visualStyle, setVisualStyle] = useState<ThoughtNode["visualStyle"]>(
    thoughtNode.visualStyle || {
      color: NEON_COLORS[0],
      shape: "circle",
      size: 1,
      glow: false,
      pulseEffect: false,
    },
  )
  const { playSound } = useAudio()

  const handleColorChange = (color: string) => {
    setVisualStyle((prev) => ({ ...prev, color }))
    playSound("/sounds/button-click.mp3")
  }

  const handleShapeChange = (shape: "circle" | "square" | "hexagon") => {
    setVisualStyle((prev) => ({ ...prev, shape }))
    playSound("/sounds/button-click.mp3")
  }

  const handleSizeChange = (size: number) => {
    setVisualStyle((prev) => ({ ...prev, size }))
    playSound("/sounds/button-click.mp3")
  }

  const toggleGlow = () => {
    setVisualStyle((prev) => ({ ...prev, glow: !prev.glow }))
    playSound("/sounds/button-click.mp3")
  }

  const togglePulse = () => {
    setVisualStyle((prev) => ({ ...prev, pulseEffect: !prev.pulseEffect }))
    playSound("/sounds/button-click.mp3")
  }

  const handleSave = () => {
    onUpdate(thoughtNode.id, visualStyle)
    playSound("/sounds/feature-select.mp3")
    onClose()
  }

  return (
    <div className="neural-node-customizer">
      <div className="neural-node-customizer-header">
        <h3 className="text-lg font-bold">Customize Node</h3>
        <button className="neural-button-circle small" onClick={onClose}>
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="neural-node-customizer-content">
        <div className="neural-node-preview">
          <div
            className="neural-node-avatar preview"
            style={{
              borderColor: visualStyle.color,
              boxShadow: visualStyle.glow ? `0 0 8px ${visualStyle.color}` : "none",
              width: `${40 * (visualStyle.size || 1)}px`,
              height: `${40 * (visualStyle.size || 1)}px`,
              animation: visualStyle.pulseEffect ? "pulse 2s infinite" : "none",
              borderRadius: visualStyle.shape === "circle" ? "50%" : visualStyle.shape === "square" ? "4px" : "50%",
              clipPath:
                visualStyle.shape === "hexagon"
                  ? "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"
                  : "none",
            }}
          >
            {thoughtNode.author.type === "ai" ? (
              <span className="neural-avatar-icon">AI</span>
            ) : (
              <span>
                {thoughtNode.author.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .toUpperCase()
                  .substring(0, 2)}
              </span>
            )}
          </div>
        </div>

        <div className="neural-customizer-section">
          <h4>Color</h4>
          <div className="neural-color-options">
            {NEON_COLORS.map((color) => (
              <button
                key={color}
                className={`neural-color-option ${visualStyle.color === color ? "selected" : ""}`}
                style={{ backgroundColor: color }}
                onClick={() => handleColorChange(color)}
              >
                {visualStyle.color === color && <Check className="h-3 w-3" />}
              </button>
            ))}
          </div>
        </div>

        <div className="neural-customizer-section">
          <h4>Shape</h4>
          <div className="neural-shape-options">
            <button
              className={`neural-shape-option ${visualStyle.shape === "circle" ? "selected" : ""}`}
              onClick={() => handleShapeChange("circle")}
            >
              <Circle className="h-5 w-5" />
              <span>Circle</span>
            </button>
            <button
              className={`neural-shape-option ${visualStyle.shape === "square" ? "selected" : ""}`}
              onClick={() => handleShapeChange("square")}
            >
              <Square className="h-5 w-5" />
              <span>Square</span>
            </button>
            <button
              className={`neural-shape-option ${visualStyle.shape === "hexagon" ? "selected" : ""}`}
              onClick={() => handleShapeChange("hexagon")}
            >
              <Hexagon className="h-5 w-5" />
              <span>Hexagon</span>
            </button>
          </div>
        </div>

        <div className="neural-customizer-section">
          <h4>Size</h4>
          <div className="neural-size-slider">
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={visualStyle.size}
              onChange={(e) => handleSizeChange(Number.parseFloat(e.target.value))}
              className="neural-slider"
            />
            <span>{visualStyle.size?.toFixed(1)}x</span>
          </div>
        </div>

        <div className="neural-customizer-section">
          <h4>Effects</h4>
          <div className="neural-effects-options">
            <button className={`neural-effect-option ${visualStyle.glow ? "selected" : ""}`} onClick={toggleGlow}>
              <div className="neural-effect-icon glow">
                <Zap className="h-5 w-5" />
              </div>
              <span>Glow</span>
            </button>
            <button
              className={`neural-effect-option ${visualStyle.pulseEffect ? "selected" : ""}`}
              onClick={togglePulse}
            >
              <div className="neural-effect-icon pulse">
                <Circle className="h-5 w-5" />
              </div>
              <span>Pulse</span>
            </button>
          </div>
        </div>
      </div>

      <div className="neural-node-customizer-footer">
        <button className="neural-button secondary" onClick={onClose}>
          Cancel
        </button>
        <button className="neural-button primary" onClick={handleSave}>
          Apply
        </button>
      </div>
    </div>
  )
}

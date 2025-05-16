"use client"

import { useState, useEffect, useRef } from "react"
import { useAudio } from "@/components/audio-manager"

interface TokenVisualizationProps {
  isActive: boolean
  tokenCount: number
}

export default function TokenVisualization({ isActive, tokenCount = 0 }: TokenVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number | null>(null)
  const [tokens, setTokens] = useState<
    {
      x: number
      y: number
      vx: number
      vy: number
      radius: number
      color: string
      alpha: number
      rotationSpeed: number
      rotation: number
    }[]
  >([])
  const tokensRef = useRef(tokens)
  const { playSound } = useAudio()

  // Update the ref when tokens state changes
  useEffect(() => {
    tokensRef.current = tokens
  }, [tokens])

  // Initialize tokens when component becomes active
  useEffect(() => {
    if (!isActive) return

    // Play token sound
    playSound("/sounds/feature-select.mp3")

    // Create new tokens
    const newTokens = []
    for (let i = 0; i < tokenCount; i++) {
      newTokens.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: Math.random() * 5 + 15,
        color: `hsl(${Math.random() * 60 + 270}, 100%, 70%)`,
        alpha: Math.random() * 0.5 + 0.5,
        rotationSpeed: (Math.random() - 0.5) * 0.05,
        rotation: Math.random() * Math.PI * 2,
      })
    }
    setTokens(newTokens)

    // Clean up function
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isActive, tokenCount, playSound])

  // Animation loop
  useEffect(() => {
    if (!isActive || !canvasRef.current || tokens.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Draw token function
    const drawToken = (x: number, y: number, radius: number, color: string, alpha: number, rotation: number) => {
      ctx.save()
      ctx.globalAlpha = alpha
      ctx.translate(x, y)
      ctx.rotate(rotation)

      // Hexagon shape for token
      ctx.beginPath()
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i
        const tokenX = radius * Math.cos(angle)
        const tokenY = radius * Math.sin(angle)
        if (i === 0) {
          ctx.moveTo(tokenX, tokenY)
        } else {
          ctx.lineTo(tokenX, tokenY)
        }
      }
      ctx.closePath()

      // Gradient fill
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius)
      gradient.addColorStop(0, color)
      gradient.addColorStop(1, "rgba(0, 0, 0, 0.5)")
      ctx.fillStyle = gradient
      ctx.fill()

      // Border
      ctx.strokeStyle = "rgba(255, 255, 255, 0.8)"
      ctx.lineWidth = 1
      ctx.stroke()

      // "M" logo in center
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
      ctx.font = `${radius * 0.8}px Arial`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText("M", 0, 0)

      ctx.restore()
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Create a new array to hold updated tokens
      const updatedTokens = tokensRef.current.map((token) => {
        // Create a new token object with updated properties
        const updatedToken = { ...token }

        // Update position
        updatedToken.x += token.vx
        updatedToken.y += token.vy

        // Bounce off edges
        if (updatedToken.x < updatedToken.radius || updatedToken.x > canvas.width - updatedToken.radius) {
          updatedToken.vx = -token.vx
        }
        if (updatedToken.y < updatedToken.radius || updatedToken.y > canvas.height - updatedToken.radius) {
          updatedToken.vy = -token.vy
        }

        // Update rotation
        updatedToken.rotation += token.rotationSpeed

        // Draw token
        drawToken(
          updatedToken.x,
          updatedToken.y,
          updatedToken.radius,
          updatedToken.color,
          updatedToken.alpha,
          updatedToken.rotation,
        )

        return updatedToken
      })

      // Update the ref directly without using setState
      tokensRef.current = updatedTokens

      // Schedule the next frame
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    // Start the animation
    animate()

    // Cleanup function
    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
    }
  }, [isActive, tokens])

  // Periodically update the state from the ref (much less frequently)
  useEffect(() => {
    if (!isActive || tokens.length === 0) return

    const intervalId = setInterval(() => {
      setTokens([...tokensRef.current])
    }, 1000) // Update state only once per second

    return () => clearInterval(intervalId)
  }, [isActive, tokens])

  if (!isActive) return null

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-40" />
}

"use client"

import { useEffect, useRef } from "react"

interface EnhancedNeuralNetworkProps {
  className?: string
}

export function EnhancedNeuralNetwork({ className = "" }: EnhancedNeuralNetworkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Neural nodes
    const nodes: { x: number; y: number; vx: number; vy: number; connections: number[] }[] = []
    const nodeCount = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 25000), 100)

    // Create nodes
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        connections: [],
      })
    }

    // Establish connections
    nodes.forEach((node, i) => {
      const connectionCount = Math.floor(Math.random() * 3) + 1
      const distances: { index: number; distance: number }[] = []

      nodes.forEach((otherNode, j) => {
        if (i !== j) {
          const dx = node.x - otherNode.x
          const dy = node.y - otherNode.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          distances.push({ index: j, distance })
        }
      })

      // Sort by distance and take the closest nodes
      distances.sort((a, b) => a.distance - b.distance)
      node.connections = distances.slice(0, connectionCount).map((d) => d.index)
    })

    // Animation loop
    let animationFrame: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw connections and nodes
      nodes.forEach((node) => {
        node.x += node.vx
        node.y += node.vy

        // Dampen velocity
        node.vx *= 0.9
        node.vy *= 0.9

        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1

        // Draw connections
        ctx.strokeStyle = "rgba(34, 211, 238, 0.15)"
        ctx.lineWidth = 0.5

        node.connections.forEach((connectionIndex) => {
          const connectedNode = nodes[connectionIndex]
          ctx.beginPath()
          ctx.moveTo(node.x, node.y)
          ctx.lineTo(connectedNode.x, connectedNode.y)
          ctx.stroke()
        })

        // Draw nodes
        ctx.fillStyle = "rgba(34, 211, 238, 0.3)"
        ctx.beginPath()
        ctx.arc(node.x, node.y, 1.5, 0, Math.PI * 2)
        ctx.fill()
      })

      animationFrame = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrame)
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  return <canvas ref={canvasRef} className={`fixed inset-0 z-0 ${className}`} />
}

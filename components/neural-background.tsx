"use client"

import { useEffect, useRef } from "react"

export default function NeuralBackground() {
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

    // Neural network nodes
    class Node {
      x: number
      y: number
      radius: number
      vx: number
      vy: number
      connections: Node[]
      color: string
      pulseSpeed: number
      pulseSize: number
      maxPulse: number

      constructor(x: number, y: number) {
        this.x = x
        this.y = y
        this.radius = Math.random() * 2 + 1
        this.vx = (Math.random() - 0.5) * 0.3
        this.vy = (Math.random() - 0.5) * 0.3
        this.connections = []

        // Random color from cyberpunk palette
        const colors = [
          "rgba(138, 43, 226, 0.8)", // purple
          "rgba(0, 255, 255, 0.8)", // cyan
          "rgba(255, 0, 255, 0.8)", // magenta
          "rgba(0, 191, 255, 0.8)", // deep sky blue
        ]
        this.color = colors[Math.floor(Math.random() * colors.length)]

        this.pulseSpeed = Math.random() * 0.02 + 0.01
        this.pulseSize = 0
        this.maxPulse = Math.random() * 5 + 5
      }

      update(width: number, height: number) {
        this.x += this.vx
        this.y += this.vy

        // Bounce off edges
        if (this.x < 0 || this.x > width) this.vx *= -1
        if (this.y < 0 || this.y > height) this.vy *= -1

        // Update pulse
        this.pulseSize = (this.pulseSize + this.pulseSpeed) % this.maxPulse
      }

      draw(ctx: CanvasRenderingContext2D) {
        // Draw node
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius + this.pulseSize, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()

        // Draw connections
        this.connections.forEach((node) => {
          const distance = Math.sqrt(Math.pow(this.x - node.x, 2) + Math.pow(this.y - node.y, 2))

          if (distance < 150) {
            ctx.beginPath()
            ctx.moveTo(this.x, this.y)
            ctx.lineTo(node.x, node.y)

            // Gradient based on distance
            const alpha = 1 - distance / 150
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.2})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })
      }
    }

    // Create nodes
    const nodeCount = Math.floor((window.innerWidth * window.innerHeight) / 15000)
    const nodes: Node[] = []

    for (let i = 0; i < nodeCount; i++) {
      nodes.push(new Node(Math.random() * canvas.width, Math.random() * canvas.height))
    }

    // Connect nodes
    nodes.forEach((node) => {
      nodes.forEach((otherNode) => {
        if (node !== otherNode) {
          node.connections.push(otherNode)
        }
      })
    })

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, "rgba(10, 10, 20, 1)")
      gradient.addColorStop(1, "rgba(30, 10, 40, 1)")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw nodes
      nodes.forEach((node) => {
        node.update(canvas.width, canvas.height)
        node.draw(ctx)
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" />
}

"use client"

import { useEffect, useRef, useState } from "react"

export default function KnowledgeGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isInteracting, setIsInteracting] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = 500
    canvas.height = 350

    // Node class
    class GraphNode {
      x: number
      y: number
      radius: number
      label: string
      color: string
      connections: { node: GraphNode; strength: number }[]
      vx: number
      vy: number
      isHovered: boolean
      originalRadius: number

      constructor(x: number, y: number, radius: number, label: string, color: string) {
        this.x = x
        this.y = y
        this.radius = radius
        this.originalRadius = radius
        this.label = label
        this.color = color
        this.connections = []
        this.vx = 0
        this.vy = 0
        this.isHovered = false
      }

      connect(node: GraphNode, strength: number) {
        this.connections.push({ node, strength })
      }

      draw(ctx: CanvasRenderingContext2D) {
        // Draw connections
        this.connections.forEach(({ node, strength }) => {
          ctx.beginPath()
          ctx.moveTo(this.x, this.y)
          ctx.lineTo(node.x, node.y)

          // Enhanced connection style
          const gradient = ctx.createLinearGradient(this.x, this.y, node.x, node.y)
          gradient.addColorStop(0, this.color)
          gradient.addColorStop(1, node.color)

          ctx.strokeStyle = this.isHovered || node.isHovered ? gradient : `rgba(255, 255, 255, ${strength * 0.5})`

          ctx.lineWidth = this.isHovered || node.isHovered ? strength * 3 : strength * 2

          ctx.stroke()
        })

        // Draw glow effect for hovered nodes
        if (this.isHovered) {
          ctx.beginPath()
          ctx.arc(this.x, this.y, this.radius + 10, 0, Math.PI * 2)
          const glowGradient = ctx.createRadialGradient(this.x, this.y, this.radius, this.x, this.y, this.radius + 10)
          glowGradient.addColorStop(0, this.color)
          glowGradient.addColorStop(1, "rgba(0, 0, 0, 0)")
          ctx.fillStyle = glowGradient
          ctx.fill()
        }

        // Draw node
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()

        // Draw border
        ctx.strokeStyle = "rgba(255, 255, 255, 0.8)"
        ctx.lineWidth = 1
        ctx.stroke()

        // Draw label
        ctx.font = this.isHovered ? "bold 12px Arial" : "10px Arial"
        ctx.fillStyle = "white"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(this.label, this.x, this.y)
      }

      update() {
        this.x += this.vx
        this.y += this.vy

        // Dampen velocity
        this.vx *= 0.9
        this.vy *= 0.9

        // Update radius based on hover state
        if (this.isHovered && this.radius < this.originalRadius * 1.5) {
          this.radius += 0.5
        } else if (!this.isHovered && this.radius > this.originalRadius) {
          this.radius -= 0.5
        }

        // Keep nodes within canvas boundaries
        this.keepInBounds()
      }

      checkHover(mouseX: number, mouseY: number) {
        const distance = Math.sqrt(Math.pow(this.x - mouseX, 2) + Math.pow(this.y - mouseY, 2))
        this.isHovered = distance < this.radius + 5
        return this.isHovered
      }

      keepInBounds() {
        const margin = this.radius + 5

        if (this.x < margin) this.x = margin
        if (this.x > canvas.width - margin) this.x = canvas.width - margin
        if (this.y < margin) this.y = margin
        if (this.y > canvas.height - margin) this.y = canvas.height - margin
      }
    }

    // Create nodes
    const user = new GraphNode(250, 150, 20, "User", "rgba(138, 43, 226, 0.8)")
    const gpt4 = new GraphNode(150, 100, 15, "GPT-4", "rgba(0, 255, 255, 0.8)")
    const grok = new GraphNode(350, 100, 15, "Grok", "rgba(255, 0, 255, 0.8)")
    const gemini = new GraphNode(250, 220, 15, "Gemini", "rgba(0, 191, 255, 0.8)")
    const otherUser = new GraphNode(350, 200, 15, "User 2", "rgba(138, 43, 226, 0.6)")

    // Connect nodes
    user.connect(gpt4, 0.8)
    user.connect(grok, 0.7)
    user.connect(gemini, 0.6)
    user.connect(otherUser, 0.5)
    gpt4.connect(grok, 0.3)
    grok.connect(gemini, 0.3)
    gemini.connect(gpt4, 0.3)
    otherUser.connect(gpt4, 0.4)

    const nodes = [user, gpt4, grok, gemini, otherUser]

    // Mouse interaction
    let mouseX = 0
    let mouseY = 0

    canvas.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect()
      mouseX = e.clientX - rect.left
      mouseY = e.clientY - rect.top

      let anyHovered = false
      nodes.forEach((node) => {
        if (node.checkHover(mouseX, mouseY)) {
          anyHovered = true
        }
      })

      setIsInteracting(anyHovered)
      canvas.style.cursor = anyHovered ? "pointer" : "default"
    })

    canvas.addEventListener("mousedown", () => {
      nodes.forEach((node) => {
        if (node.isHovered) {
          // Add some velocity when clicked
          node.vx = (Math.random() - 0.5) * 5
          node.vy = (Math.random() - 0.5) * 5

          // Also affect connected nodes
          node.connections.forEach(({ node: connectedNode }) => {
            connectedNode.vx = (Math.random() - 0.5) * 3
            connectedNode.vy = (Math.random() - 0.5) * 3
          })
        }
      })
    })

    // Animation
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw connections and nodes
      nodes.forEach((node) => {
        node.update()
        node.draw(ctx)
      })

      requestAnimationFrame(animate)
    }

    animate()

    // Add some random movement
    setInterval(() => {
      nodes.forEach((node) => {
        node.vx += (Math.random() - 0.5) * 0.5
        node.vy += (Math.random() - 0.5) * 0.5
      })
    }, 1000)

    return () => {}
  }, [])

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className={`rounded-lg border ${isInteracting ? "border-cyan-400" : "border-gray-800"} bg-black/30 transition-all duration-300`}
        width={500}
        height={350}
      />
      <div className="absolute bottom-2 right-2 text-xs text-cyan-400 opacity-70">Interactive Graph - Click & Drag</div>
    </div>
  )
}

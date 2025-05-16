"use client"

import { useEffect, useRef } from "react"

export default function AnimatedLogo() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = 80
    canvas.height = 80

    // Logo particles
    const particles: {
      x: number
      y: number
      size: number
      color: string
      vx: number
      vy: number
      alpha: number
      targetX: number
      targetY: number
    }[] = []

    // Create particles
    const createParticles = () => {
      particles.length = 0

      // Create random particles
      for (let i = 0; i < 100; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 1,
          color: `hsl(${Math.random() * 60 + 270}, 100%, 70%)`,
          vx: 0,
          vy: 0,
          alpha: Math.random() * 0.5 + 0.5,
          targetX: 0,
          targetY: 0,
        })
      }

      // Set target positions to form "M" shape
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const logoSize = canvas.width * 0.6

      // Define points for "M" shape
      const logoPoints: [number, number][] = []

      // Left vertical line
      for (let y = centerY - logoSize / 2; y <= centerY + logoSize / 2; y += 2) {
        logoPoints.push([centerX - logoSize / 2, y])
      }

      // Middle diagonal lines
      for (let i = 0; i <= 1; i += 0.05) {
        const x = centerX - logoSize / 2 + (logoSize / 2) * i
        const y = centerY - logoSize / 2 + logoSize * i
        logoPoints.push([x, y])

        const x2 = centerX + (logoSize / 2) * i
        const y2 = centerY + logoSize / 2 - logoSize * i
        logoPoints.push([x2, y2])
      }

      // Right vertical line
      for (let y = centerY - logoSize / 2; y <= centerY + logoSize / 2; y += 2) {
        logoPoints.push([centerX + logoSize / 2, y])
      }

      // Assign target positions to particles
      for (let i = 0; i < Math.min(particles.length, logoPoints.length); i++) {
        particles[i].targetX = logoPoints[i][0]
        particles[i].targetY = logoPoints[i][1]
      }
    }

    createParticles()

    // Animation loop
    let animationFrameId: number
    let phase = "scatter" // 'scatter' or 'form'
    let timer = 0

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update timer
      timer++

      // Switch phases
      if (timer > 120) {
        phase = phase === "scatter" ? "form" : "scatter"
        timer = 0
      }

      // Update and draw particles
      particles.forEach((particle) => {
        if (phase === "form") {
          // Move towards target position
          const dx = particle.targetX - particle.x
          const dy = particle.targetY - particle.y
          particle.vx = dx * 0.05
          particle.vy = dy * 0.05
        } else {
          // Random movement
          particle.vx = (Math.random() - 0.5) * 2
          particle.vy = (Math.random() - 0.5) * 2
        }

        // Update position
        particle.x += particle.vx
        particle.y += particle.vy

        // Draw particle
        ctx.globalAlpha = particle.alpha
        ctx.fillStyle = particle.color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className="w-20 h-20" />
}

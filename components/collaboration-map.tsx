"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAudio } from "@/components/audio-manager"

// Types for map data
interface NodeData {
  id: string
  color: string
  position: { x: number; y: number }
  name: string
  description?: string
  metrics?: {
    accuracy?: number
    speed?: number
    creativity?: number
    reasoning?: number
  }
  status?: "online" | "offline" | "busy"
  lastActive?: string
  connectionCount?: number
  type?: "ai" | "human" | "system" | "custom"
  customIcon?: string
}

interface ConnectionData {
  from: string
  to: string
  strength: number
  type?: "data" | "control" | "feedback" | "custom"
  status?: "active" | "inactive" | "pending"
  lastActive?: string
  dataFlow?: number // Data flow rate (0-1)
  bidirectional?: boolean
}

interface MapData {
  nodes: Record<string, NodeData>
  connections: ConnectionData[]
}

// Default AI model types and positions
const DEFAULT_AI_MODELS = {
  grok: {
    id: "grok",
    color: "rgba(74, 222, 128, 0.8)", // green
    position: { x: 0.85, y: 0.25 },
    name: "Grok",
    description: "Grok is an AI model focused on technical and creative tasks",
    metrics: {
      accuracy: 0.87,
      speed: 0.92,
      creativity: 0.85,
      reasoning: 0.89,
    },
    status: "online",
    lastActive: "2 minutes ago",
    connectionCount: 3,
    type: "ai",
  },
  chatgpt: {
    id: "chatgpt",
    color: "rgba(217, 70, 239, 0.8)", // fuchsia
    position: { x: 0.15, y: 0.75 },
    name: "ChatGPT",
    description: "ChatGPT excels at conversation and general knowledge tasks",
    metrics: {
      accuracy: 0.91,
      speed: 0.78,
      creativity: 0.82,
      reasoning: 0.93,
    },
    status: "online",
    lastActive: "1 minute ago",
    connectionCount: 4,
    type: "ai",
  },
  gemini: {
    id: "gemini",
    color: "rgba(34, 211, 238, 0.8)", // cyan
    position: { x: 0.15, y: 0.25 },
    name: "Gemini",
    description: "Gemini specializes in multimodal understanding and analysis",
    metrics: {
      accuracy: 0.89,
      speed: 0.85,
      creativity: 0.79,
      reasoning: 0.88,
    },
    status: "online",
    lastActive: "5 minutes ago",
    connectionCount: 3,
    type: "ai",
  },
  user: {
    id: "user",
    color: "rgba(96, 165, 250, 0.8)", // blue
    position: { x: 0.5, y: 0.5 },
    name: "User",
    description: "Human user interacting with the AI collaboration network",
    status: "online",
    lastActive: "just now",
    connectionCount: 4,
    type: "human",
  },
  system: {
    id: "system",
    color: "rgba(250, 204, 21, 0.8)", // yellow
    position: { x: 0.85, y: 0.75 },
    name: "System",
    description: "Central system coordinating AI model interactions",
    metrics: {
      accuracy: 0.95,
      speed: 0.97,
      creativity: 0.75,
      reasoning: 0.92,
    },
    status: "online",
    lastActive: "just now",
    connectionCount: 4,
    type: "system",
  },
}

// Default connection definitions
const DEFAULT_CONNECTIONS = [
  { from: "user", to: "chatgpt", strength: 0.8, type: "data", status: "active", dataFlow: 0.7, bidirectional: true },
  { from: "user", to: "grok", strength: 0.8, type: "data", status: "active", dataFlow: 0.6, bidirectional: true },
  { from: "user", to: "gemini", strength: 0.8, type: "data", status: "active", dataFlow: 0.5, bidirectional: true },
  { from: "user", to: "system", strength: 0.6, type: "control", status: "active", dataFlow: 0.9, bidirectional: false },
  {
    from: "chatgpt",
    to: "system",
    strength: 0.9,
    type: "feedback",
    status: "active",
    dataFlow: 0.8,
    bidirectional: false,
  },
  {
    from: "grok",
    to: "system",
    strength: 0.9,
    type: "feedback",
    status: "active",
    dataFlow: 0.7,
    bidirectional: false,
  },
  {
    from: "gemini",
    to: "system",
    strength: 0.9,
    type: "feedback",
    status: "active",
    dataFlow: 0.6,
    bidirectional: false,
  },
  { from: "chatgpt", to: "grok", strength: 0.5, type: "data", status: "inactive", dataFlow: 0.3, bidirectional: true },
  {
    from: "chatgpt",
    to: "gemini",
    strength: 0.5,
    type: "data",
    status: "inactive",
    dataFlow: 0.2,
    bidirectional: true,
  },
  { from: "grok", to: "gemini", strength: 0.5, type: "data", status: "inactive", dataFlow: 0.4, bidirectional: true },
]

interface CollaborationMapProps {
  activeNode: string
  onNodeClick: (node: string) => void
  className?: string
  mapData?: MapData
  onNodeUpdate?: (nodeId: string, data: Partial<NodeData>) => void
  onConnectionUpdate?: (connectionId: string, data: Partial<ConnectionData>) => void
  editable?: boolean
}

export function CollaborationMap({
  activeNode,
  onNodeClick,
  className = "",
  mapData,
  onNodeUpdate,
  onConnectionUpdate,
  editable = false,
}: CollaborationMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [hoveredConnection, setHoveredConnection] = useState<string | null>(null)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [nodeDetailsVisible, setNodeDetailsVisible] = useState(false)
  const [draggingNode, setDraggingNode] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const router = useRouter()
  const { playSound } = useAudio()

  // Add these state variables to track tooltip positions
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [connectionTooltipPosition, setConnectionTooltipPosition] = useState({ x: 0, y: 0 })

  // Use a ref for animation phase instead of state to avoid re-renders
  const animationPhaseRef = useRef(0)
  const animationFrameRef = useRef<number | null>(null)

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (canvasRef.current) {
        setDimensions({
          width: canvasRef.current.offsetWidth,
          height: canvasRef.current.offsetHeight,
        })
      }
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  // Add this function to the component to get the canvas position relative to the viewport
  const getCanvasPosition = useCallback(() => {
    if (!canvasRef.current) return { left: 0, top: 0 }
    const rect = canvasRef.current.getBoundingClientRect()
    return {
      left: rect.left,
      top: rect.top,
    }
  }, [])

  // Draw the map
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || dimensions.width === 0) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = dimensions.width
    canvas.height = dimensions.height

    // Use mapData if provided, otherwise use default data
    const nodes = mapData?.nodes || DEFAULT_AI_MODELS
    const connections = mapData?.connections || DEFAULT_CONNECTIONS

    // Calculate node positions based on canvas size
    const positions: { [key: string]: { x: number; y: number } } = {}
    Object.entries(nodes).forEach(([key, node]) => {
      positions[key] = {
        x: node.position.x * canvas.width,
        y: node.position.y * canvas.height,
      }
    })

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Get the canvas position for tooltip positioning
      const canvasPosition = getCanvasPosition()

      // Draw connections
      connections.forEach((conn) => {
        const fromPos = positions[conn.from]
        const toPos = positions[conn.to]

        if (!fromPos || !toPos) return

        // Draw connection line
        ctx.beginPath()
        ctx.moveTo(fromPos.x, fromPos.y)
        ctx.lineTo(toPos.x, toPos.y)

        // Set line style based on connection properties
        const isActive = activeNode === conn.from || activeNode === conn.to
        const isHovered = hoveredConnection === `${conn.from}-${conn.to}`
        const isSelected = selectedNode === conn.from || selectedNode === conn.to

        // Determine line width based on state and connection strength
        const baseWidth = conn.strength * 2
        ctx.lineWidth = isActive
          ? baseWidth * 1.5
          : isHovered
            ? baseWidth * 1.3
            : isSelected
              ? baseWidth * 1.2
              : baseWidth

        // Create gradient for the line
        const gradient = ctx.createLinearGradient(fromPos.x, fromPos.y, toPos.x, toPos.y)

        const fromNode = nodes[conn.from]
        const toNode = nodes[conn.to]

        if (fromNode && toNode) {
          const alpha = isActive ? 0.8 : isHovered ? 0.7 : isSelected ? 0.6 : 0.4
          gradient.addColorStop(0, fromNode.color.replace("0.8", alpha.toString()))
          gradient.addColorStop(1, toNode.color.replace("0.8", alpha.toString()))
          ctx.strokeStyle = gradient
        } else {
          ctx.strokeStyle = isActive
            ? "rgba(255, 255, 255, 0.8)"
            : isHovered
              ? "rgba(255, 255, 255, 0.7)"
              : isSelected
                ? "rgba(255, 255, 255, 0.6)"
                : "rgba(255, 255, 255, 0.4)"
        }

        // Apply dashed line for inactive connections
        if (conn.status === "inactive") {
          ctx.setLineDash([5, 3])
        } else if (conn.status === "pending") {
          ctx.setLineDash([2, 2])
        } else {
          ctx.setLineDash([])
        }

        ctx.stroke()
        ctx.setLineDash([]) // Reset dash

        // Draw bidirectional arrows if applicable
        if (conn.bidirectional) {
          // Draw arrowheads at both ends
          drawArrowhead(ctx, fromPos.x, fromPos.y, toPos.x, toPos.y, 10, ctx.strokeStyle)
          drawArrowhead(ctx, toPos.x, toPos.y, fromPos.x, fromPos.y, 10, ctx.strokeStyle)
        } else {
          // Draw arrowhead at the target end
          drawArrowhead(ctx, fromPos.x, fromPos.y, toPos.x, toPos.y, 10, ctx.strokeStyle)
        }

        // Draw animated data packets
        if (conn.status === "active" && (isActive || isHovered || isSelected || Math.random() > 0.7)) {
          const packetCount = Math.ceil(conn.dataFlow * 3) // More packets for higher data flow

          for (let i = 0; i < packetCount; i++) {
            // Calculate position based on animation phase with offset for each packet
            const offset = (i / packetCount) * 0.9
            const packetPos = (animationPhaseRef.current + offset) % 1
            const packetX = fromPos.x + (toPos.x - fromPos.x) * packetPos
            const packetY = fromPos.y + (toPos.y - fromPos.y) * packetPos

            // Draw the data packet
            ctx.beginPath()
            const packetSize = conn.dataFlow * 4 + 2 // Size based on data flow
            ctx.arc(packetX, packetY, packetSize, 0, Math.PI * 2)

            if (fromNode && toNode) {
              const packetColor = packetPos < 0.5 ? fromNode.color : toNode.color
              ctx.fillStyle = packetColor
            } else {
              ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
            }

            ctx.fill()
          }
        }
      })

      // Draw nodes
      Object.entries(nodes).forEach(([key, node]) => {
        const pos = positions[key]
        if (!pos) return

        const isActive = activeNode === key
        const isHovered = hoveredNode === key
        const isSelected = selectedNode === key

        // Draw glow effect for active/hovered/selected nodes
        if (isActive || isHovered || isSelected) {
          ctx.beginPath()
          const radius = isActive ? 18 : isSelected ? 16 : isHovered ? 14 : 12
          const gradient = ctx.createRadialGradient(pos.x, pos.y, radius * 0.8, pos.x, pos.y, radius * 2.5)

          gradient.addColorStop(0, node.color.replace("0.8", "0.4"))
          gradient.addColorStop(1, node.color.replace("0.8", "0"))

          ctx.fillStyle = gradient
          ctx.arc(pos.x, pos.y, radius * 2.5, 0, Math.PI * 2)
          ctx.fill()
        }

        // Draw node status indicator
        if (node.status) {
          ctx.beginPath()
          const statusRadius = 5
          const statusX = pos.x + 15
          const statusY = pos.y - 15

          // Set color based on status
          if (node.status === "online") {
            ctx.fillStyle = "rgba(74, 222, 128, 0.8)" // green
          } else if (node.status === "busy") {
            ctx.fillStyle = "rgba(250, 204, 21, 0.8)" // yellow
          } else {
            ctx.fillStyle = "rgba(248, 113, 113, 0.8)" // red
          }

          ctx.arc(statusX, statusY, statusRadius, 0, Math.PI * 2)
          ctx.fill()

          // Add white border
          ctx.strokeStyle = "rgba(255, 255, 255, 0.8)"
          ctx.lineWidth = 1.5
          ctx.stroke()
        }

        // Draw node circle
        ctx.beginPath()
        const baseRadius = 12
        const radius = isActive
          ? baseRadius * 1.5
          : isSelected
            ? baseRadius * 1.3
            : isHovered
              ? baseRadius * 1.2
              : baseRadius
        ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2)

        // Fill with gradient
        const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, radius)
        gradient.addColorStop(0, node.color)
        gradient.addColorStop(1, node.color.replace("0.8", "0.4"))

        ctx.fillStyle = gradient
        ctx.fill()

        // Draw border
        ctx.lineWidth = isActive ? 3 : isSelected ? 2.5 : isHovered ? 2 : 1.5
        ctx.strokeStyle = node.color.replace("0.8", "1.0")
        ctx.stroke()

        // Draw icon or initials based on node type
        if (node.type === "ai") {
          // Draw AI icon
          drawAIIcon(ctx, pos.x, pos.y, radius * 0.6)
        } else if (node.type === "human") {
          // Draw human icon
          drawHumanIcon(ctx, pos.x, pos.y, radius * 0.6)
        } else if (node.type === "system") {
          // Draw system icon
          drawSystemIcon(ctx, pos.x, pos.y, radius * 0.6)
        } else if (node.customIcon) {
          // Draw custom icon (placeholder)
          ctx.font = `${radius * 0.8}px Arial`
          ctx.fillStyle = "white"
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.fillText("⚙️", pos.x, pos.y)
        }

        // Draw label
        ctx.font = isActive
          ? "bold 14px Arial"
          : isSelected
            ? "bold 13px Arial"
            : isHovered
              ? "bold 12px Arial"
              : "11px Arial"
        ctx.fillStyle = "white"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(node.name, pos.x, pos.y + radius + 15)

        // Draw metrics indicator if available and node is active/hovered/selected
        if (node.metrics && (isActive || isHovered || isSelected)) {
          const metrics = node.metrics
          const metricsRadius = radius * 0.8
          const startAngle = -Math.PI / 2 // Start at top

          // Draw metrics circle
          if (metrics.accuracy) {
            drawMetricArc(
              ctx,
              pos.x,
              pos.y,
              metricsRadius + 5,
              startAngle,
              startAngle + Math.PI / 2,
              metrics.accuracy,
              "rgba(74, 222, 128, 0.8)",
            )
          }
          if (metrics.speed) {
            drawMetricArc(
              ctx,
              pos.x,
              pos.y,
              metricsRadius + 5,
              startAngle + Math.PI / 2,
              startAngle + Math.PI,
              metrics.speed,
              "rgba(250, 204, 21, 0.8)",
            )
          }
          if (metrics.creativity) {
            drawMetricArc(
              ctx,
              pos.x,
              pos.y,
              metricsRadius + 5,
              startAngle + Math.PI,
              startAngle + (3 * Math.PI) / 2,
              metrics.creativity,
              "rgba(217, 70, 239, 0.8)",
            )
          }
          if (metrics.reasoning) {
            drawMetricArc(
              ctx,
              pos.x,
              pos.y,
              metricsRadius + 5,
              startAngle + (3 * Math.PI) / 2,
              startAngle + 2 * Math.PI,
              metrics.reasoning,
              "rgba(34, 211, 238, 0.8)",
            )
          }
        }
      })

      // Update animation phase using the ref
      animationPhaseRef.current = (animationPhaseRef.current + 0.005) % 1

      // Store the animation frame ID in the ref for cleanup
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    // Helper function to draw arrowhead
    function drawArrowhead(
      ctx: CanvasRenderingContext2D,
      fromX: number,
      fromY: number,
      toX: number,
      toY: number,
      radius: number,
      color: string | CanvasGradient | CanvasPattern,
    ) {
      const angle = Math.atan2(toY - fromY, toX - fromX)
      const x = toX - radius * Math.cos(angle)
      const y = toY - radius * Math.sin(angle)

      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x - radius * Math.cos(angle - Math.PI / 6), y - radius * Math.sin(angle - Math.PI / 6))
      ctx.lineTo(x - radius * Math.cos(angle + Math.PI / 6), y - radius * Math.sin(angle + Math.PI / 6))
      ctx.closePath()
      ctx.fillStyle = color
      ctx.fill()
    }

    // Helper function to draw metric arc
    function drawMetricArc(
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      radius: number,
      startAngle: number,
      endAngle: number,
      value: number,
      color: string,
    ) {
      const actualEndAngle = startAngle + (endAngle - startAngle) * value

      ctx.beginPath()
      ctx.arc(x, y, radius, startAngle, actualEndAngle)
      ctx.lineWidth = 3
      ctx.strokeStyle = color
      ctx.stroke()
    }

    // Helper function to draw AI icon
    function drawAIIcon(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
      ctx.fillStyle = "white"

      // Draw a simple CPU-like icon
      ctx.fillRect(x - size / 2, y - size / 2, size, size)

      ctx.fillStyle = ctx.strokeStyle
      ctx.fillRect(x - size / 4, y - size / 4, size / 2, size / 2)

      // Draw connecting lines
      ctx.beginPath()
      // Top line
      ctx.moveTo(x, y - size / 2)
      ctx.lineTo(x, y - size / 4)
      // Right line
      ctx.moveTo(x + size / 2, y)
      ctx.lineTo(x + size / 4, y)
      // Bottom line
      ctx.moveTo(x, y + size / 2)
      ctx.lineTo(x, y + size / 4)
      // Left line
      ctx.moveTo(x - size / 2, y)
      ctx.lineTo(x - size / 4, y)

      ctx.strokeStyle = "white"
      ctx.lineWidth = 1
      ctx.stroke()
    }

    // Helper function to draw human icon
    function drawHumanIcon(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
      ctx.fillStyle = "white"

      // Draw head
      ctx.beginPath()
      ctx.arc(x, y - size / 4, size / 3, 0, Math.PI * 2)
      ctx.fill()

      // Draw body
      ctx.beginPath()
      ctx.moveTo(x, y - size / 4 + size / 3)
      ctx.lineTo(x, y + size / 2)

      // Draw arms
      ctx.moveTo(x - size / 2, y)
      ctx.lineTo(x + size / 2, y)

      // Draw legs
      ctx.moveTo(x, y + size / 2)
      ctx.lineTo(x - size / 3, y + size)

      ctx.moveTo(x, y + size / 2)
      ctx.lineTo(x + size / 3, y + size)

      ctx.strokeStyle = "white"
      ctx.lineWidth = size / 5
      ctx.stroke()
    }

    // Helper function to draw system icon
    function drawSystemIcon(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
      ctx.fillStyle = "white"

      // Draw gear-like shape
      ctx.beginPath()
      const outerRadius = size
      const innerRadius = size * 0.6
      const teethCount = 8

      for (let i = 0; i < teethCount * 2; i++) {
        const angle = (i * Math.PI) / teethCount
        const radius = i % 2 === 0 ? outerRadius : innerRadius
        const px = x + Math.cos(angle) * radius
        const py = y + Math.sin(angle) * radius

        if (i === 0) {
          ctx.moveTo(px, py)
        } else {
          ctx.lineTo(px, py)
        }
      }

      ctx.closePath()
      ctx.fill()

      // Draw center circle
      ctx.beginPath()
      ctx.arc(x, y, size * 0.3, 0, Math.PI * 2)
      ctx.fillStyle = ctx.strokeStyle
      ctx.fill()
    }

    // Start animation
    animate()

    // Helper function to calculate distance from point to line
    function distanceToLine(x: number, y: number, x1: number, y1: number, x2: number, y2: number): number {
      const A = x - x1
      const B = y - y1
      const C = x2 - x1
      const D = y2 - y1

      const dot = A * C + B * D
      const lenSq = C * C + D * D
      let param = -1

      if (lenSq !== 0) param = dot / lenSq

      let xx, yy

      if (param < 0) {
        xx = x1
        yy = y1
      } else if (param > 1) {
        xx = x2
        yy = y2
      } else {
        xx = x1 + param * C
        yy = y1 + param * D
      }

      const dx = x - xx
      const dy = y - yy

      return Math.sqrt(dx * dx + dy * dy)
    }

    // Handle mouse interactions
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top
      const canvasPosition = getCanvasPosition()

      // If dragging a node, update its position
      if (draggingNode && editable) {
        const node = nodes[draggingNode]
        if (node) {
          const newX = (mouseX - dragOffset.x) / canvas.width
          const newY = (mouseY - dragOffset.y) / canvas.height

          // Clamp values to keep node within canvas
          const clampedX = Math.max(0.05, Math.min(0.95, newX))
          const clampedY = Math.max(0.05, Math.min(0.95, newY))

          // Update node position
          if (onNodeUpdate) {
            onNodeUpdate(draggingNode, {
              position: { x: clampedX, y: clampedY },
            })
          }

          // Update local positions for immediate visual feedback
          positions[draggingNode] = {
            x: clampedX * canvas.width,
            y: clampedY * canvas.height,
          }
        }
        return
      }

      // Check if mouse is over a node
      let hovered: string | null = null
      Object.entries(positions).forEach(([key, pos]) => {
        const distance = Math.sqrt(Math.pow(mouseX - pos.x, 2) + Math.pow(mouseY - pos.y, 2))
        if (distance < 20) {
          hovered = key
          canvas.style.cursor = editable ? "move" : "pointer"

          // Update tooltip position for node
          setTooltipPosition({
            x: canvasPosition.left + pos.x,
            y: canvasPosition.top + pos.y - 20,
          })
        }
      })

      // If not over a node, check if over a connection
      let hoveredConn: string | null = null
      if (!hovered) {
        connections.forEach((conn) => {
          const fromPos = positions[conn.from]
          const toPos = positions[conn.to]

          if (!fromPos || !toPos) return

          // Check if mouse is near the connection line
          const distToLine = distanceToLine(mouseX, mouseY, fromPos.x, fromPos.y, toPos.x, toPos.y)
          if (distToLine < 10) {
            hoveredConn = `${conn.from}-${conn.to}`
            canvas.style.cursor = "pointer"

            // Update tooltip position for connection
            setConnectionTooltipPosition({
              x: canvasPosition.left + (fromPos.x + toPos.x) / 2,
              y: canvasPosition.top + (fromPos.y + toPos.y) / 2,
            })
          }
        })

        setHoveredConnection(hoveredConn)
        canvas.style.cursor = hoveredConn ? "pointer" : "default"
      } else {
        setHoveredConnection(null)
      }

      setHoveredNode(hovered)
    }

    const handleMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      if (hoveredNode && editable) {
        setDraggingNode(hoveredNode)

        // Calculate drag offset
        const nodePos = positions[hoveredNode]
        setDragOffset({
          x: e.clientX - rect.left - nodePos.x,
          y: e.clientY - rect.top - nodePos.y,
        })

        canvas.style.cursor = "grabbing"
        e.preventDefault()
      }
    }

    const handleMouseUp = () => {
      if (draggingNode) {
        setDraggingNode(null)
        canvas.style.cursor = hoveredNode ? "pointer" : "default"
      }
    }

    const handleClick = (e: MouseEvent) => {
      // If we were dragging, don't trigger click
      if (draggingNode) return

      const rect = canvas.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      // Check if clicked on a node
      Object.entries(positions).forEach(([key, pos]) => {
        const distance = Math.sqrt(Math.pow(mouseX - pos.x, 2) + Math.pow(mouseY - pos.y, 2))
        if (distance < 20) {
          // Toggle selection
          setSelectedNode(selectedNode === key ? null : key)

          // Call the provided click handler
          onNodeClick(key)

          // Play sound
          playSound("/sounds/feature-select.mp3")

          // Show node details
          setNodeDetailsVisible(true)
        }
      })

      // Check if clicked on a connection
      if (!hoveredNode && hoveredConnection) {
        const [from, to] = hoveredConnection.split("-")

        // Toggle connection status if editable
        if (editable && onConnectionUpdate) {
          const connection = connections.find((c) => c.from === from && c.to === to)
          if (connection) {
            // Cycle through statuses: active -> inactive -> pending -> active
            const newStatus =
              connection.status === "active" ? "inactive" : connection.status === "inactive" ? "pending" : "active"

            onConnectionUpdate(hoveredConnection, { status: newStatus })

            // Play sound
            playSound("/sounds/button-click.mp3")
          }
        }
      }
    }

    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mousedown", handleMouseDown)
    canvas.addEventListener("mouseup", handleMouseUp)
    canvas.addEventListener("click", handleClick)

    return () => {
      // Clean up event listeners
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("mousedown", handleMouseDown)
      canvas.removeEventListener("mouseup", handleMouseUp)
      canvas.removeEventListener("click", handleClick)

      // Cancel animation frame
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [
    activeNode,
    hoveredNode,
    hoveredConnection,
    selectedNode,
    onNodeClick,
    dimensions,
    mapData,
    draggingNode,
    dragOffset,
    editable,
    onNodeUpdate,
    onConnectionUpdate,
    playSound,
    getCanvasPosition,
  ])

  return (
    <div className={`w-full h-full relative ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full" />

      {/* Node details tooltip */}
      {hoveredNode && !draggingNode && (
        <div
          className="fixed bg-black/80 border border-gray-700 rounded-md p-2 text-xs text-white z-50 pointer-events-none"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: "translate(-50%, -100%)",
            maxWidth: "200px",
          }}
        >
          <div className="font-bold text-sm mb-1">{(mapData?.nodes || DEFAULT_AI_MODELS)[hoveredNode].name}</div>
          {(mapData?.nodes || DEFAULT_AI_MODELS)[hoveredNode].description && (
            <div className="text-gray-300 mb-1">{(mapData?.nodes || DEFAULT_AI_MODELS)[hoveredNode].description}</div>
          )}
          {(mapData?.nodes || DEFAULT_AI_MODELS)[hoveredNode].status && (
            <div className="flex items-center mt-1">
              <span className="mr-1">Status:</span>
              <span
                className={`
                  ${
                    (mapData?.nodes || DEFAULT_AI_MODELS)[hoveredNode].status === "online"
                      ? "text-green-400"
                      : (mapData?.nodes || DEFAULT_AI_MODELS)[hoveredNode].status === "busy"
                        ? "text-yellow-400"
                        : "text-red-400"
                  }
                `}
              >
                {(mapData?.nodes || DEFAULT_AI_MODELS)[hoveredNode].status}
              </span>
            </div>
          )}
          {(mapData?.nodes || DEFAULT_AI_MODELS)[hoveredNode].lastActive && (
            <div className="text-gray-400 text-xs mt-1">
              Last active: {(mapData?.nodes || DEFAULT_AI_MODELS)[hoveredNode].lastActive}
            </div>
          )}
        </div>
      )}

      {/* Connection tooltip - also update this to use fixed positioning */}
      {hoveredConnection && !hoveredNode && !draggingNode && (
        <div
          className="fixed bg-black/80 border border-gray-700 rounded-md p-2 text-xs text-white z-50 pointer-events-none"
          style={{
            left: `${connectionTooltipPosition.x}px`,
            top: `${connectionTooltipPosition.y}px`,
            transform: "translate(-50%, -50%)",
            maxWidth: "200px",
          }}
        >
          <div className="font-bold mb-1">
            {hoveredConnection
              .split("-")
              .map((nodeId) => (mapData?.nodes || DEFAULT_AI_MODELS)[nodeId].name)
              .join(" → ")}
          </div>
          {(() => {
            const [from, to] = hoveredConnection.split("-")
            const connection = (mapData?.connections || DEFAULT_CONNECTIONS).find((c) => c.from === from && c.to === to)
            if (!connection) return null

            return (
              <>
                <div className="flex items-center">
                  <span className="mr-1">Type:</span>
                  <span className="capitalize">{connection.type || "data"}</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-1">Status:</span>
                  <span
                    className={`
                      ${
                        connection.status === "active"
                          ? "text-green-400"
                          : connection.status === "pending"
                            ? "text-yellow-400"
                            : "text-red-400"
                      }
                    `}
                  >
                    {connection.status || "active"}
                  </span>
                </div>
                {connection.dataFlow !== undefined && (
                  <div className="flex items-center">
                    <span className="mr-1">Data flow:</span>
                    <span>{Math.round(connection.dataFlow * 100)}%</span>
                  </div>
                )}
                {connection.bidirectional !== undefined && (
                  <div className="flex items-center">
                    <span className="mr-1">Direction:</span>
                    <span>{connection.bidirectional ? "Bidirectional" : "One-way"}</span>
                  </div>
                )}
                {editable && <div className="text-gray-400 text-xs mt-1 italic">Click to change status</div>}
              </>
            )
          })()}
        </div>
      )}

      {/* Editable mode indicator */}
      {editable && (
        <div className="absolute top-2 right-2 bg-blue-900/50 text-blue-300 text-xs px-2 py-1 rounded-md">
          Edit Mode
        </div>
      )}
    </div>
  )
}

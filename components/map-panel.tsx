"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Save, Upload, Download, Globe, BarChart, Edit, Plus, Trash, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAudio } from "@/components/audio-manager"
import { CollaborationMap } from "@/components/collaboration-map"
import MashbitMinterModal from "@/components/mashbit-minter-modal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Define the map data structure
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

// Default map data
const DEFAULT_MAP_DATA: MapData = {
  nodes: {
    grok: {
      id: "grok",
      color: "rgba(74, 222, 128, 0.8)",
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
      color: "rgba(217, 70, 239, 0.8)",
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
      color: "rgba(34, 211, 238, 0.8)",
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
      color: "rgba(96, 165, 250, 0.8)",
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
      color: "rgba(250, 204, 21, 0.8)",
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
  },
  connections: [
    { from: "user", to: "chatgpt", strength: 0.8, type: "data", status: "active", dataFlow: 0.7, bidirectional: true },
    { from: "user", to: "grok", strength: 0.8, type: "data", status: "active", dataFlow: 0.6, bidirectional: true },
    { from: "user", to: "gemini", strength: 0.8, type: "data", status: "active", dataFlow: 0.5, bidirectional: true },
    {
      from: "user",
      to: "system",
      strength: 0.6,
      type: "control",
      status: "active",
      dataFlow: 0.9,
      bidirectional: false,
    },
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
    {
      from: "chatgpt",
      to: "grok",
      strength: 0.5,
      type: "data",
      status: "inactive",
      dataFlow: 0.3,
      bidirectional: true,
    },
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
  ],
}

interface MapPanelProps {
  activeNode: string
  onNodeClick: (node: string) => void
  tokenCount: number
}

export default function MapPanel({ activeNode, onNodeClick, tokenCount }: MapPanelProps) {
  const router = useRouter()
  const { playSound } = useAudio()
  const [isMashbitModalOpen, setIsMashbitModalOpen] = useState(false)
  const [mapData, setMapData] = useState<MapData>(DEFAULT_MAP_DATA)
  const [editMode, setEditMode] = useState(false)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [selectedConnection, setSelectedConnection] = useState<string | null>(null)
  const [isAddNodeDialogOpen, setIsAddNodeDialogOpen] = useState(false)
  const [isNodeDetailsOpen, setIsNodeDetailsOpen] = useState(false)
  const [newNodeData, setNewNodeData] = useState<Partial<NodeData>>({
    name: "",
    color: "rgba(255, 255, 255, 0.8)",
    type: "custom",
    position: { x: 0.5, y: 0.5 },
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  // We'll keep track of which node is active but not calculate sentiment here
  useEffect(() => {
    console.log("Active node changed to:", activeNode)
    setSelectedNode(activeNode)
  }, [activeNode])

  // Get color based on active node
  const getNodeColor = () => {
    switch (activeNode) {
      case "grok":
        return "text-green-400"
      case "chatgpt":
        return "text-fuchsia-400"
      case "gemini":
        return "text-cyan-400"
      case "user":
        return "text-blue-400"
      default:
        return "text-yellow-400"
    }
  }

  const handleMintMashbit = () => {
    playSound("/sounds/button-click.mp3")
    setIsMashbitModalOpen(true)
  }

  // Save map data as JSON file
  const handleSaveMap = () => {
    try {
      playSound("/sounds/button-click.mp3")
      console.log("Saving map data...")

      // Convert to JSON string
      const jsonString = JSON.stringify(mapData, null, 2)

      // Create a blob from the JSON string
      const blob = new Blob([jsonString], { type: "application/json" })

      // Create a URL for the blob
      const url = URL.createObjectURL(blob)

      // Create a temporary anchor element
      const a = document.createElement("a")
      a.href = url
      a.download = "mindmash-map.json"

      // Append to body, click, and remove
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)

      // Clean up the URL
      URL.revokeObjectURL(url)

      console.log("Map saved successfully!")
    } catch (error) {
      console.error("Error saving map:", error)
      alert("Failed to save map. See console for details.")
    }
  }

  // Trigger file input click
  const handleLoadClick = () => {
    playSound("/sounds/button-click.mp3")
    console.log("Load button clicked, triggering file input...")
    fileInputRef.current?.click()
  }

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("File input changed")

    const file = event.target.files?.[0]
    if (!file) {
      console.log("No file selected")
      return
    }

    console.log("File selected:", file.name)

    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        console.log("File content loaded, parsing JSON...")

        const parsedData = JSON.parse(content) as MapData

        // Validate the data structure
        if (!parsedData.nodes || !parsedData.connections) {
          throw new Error("Invalid map data format")
        }

        console.log("Map data parsed successfully")
        setMapData(parsedData)
      } catch (error) {
        console.error("Error parsing map data:", error)
        alert("Invalid map data format. Please upload a valid map JSON file.")
      }
    }

    reader.onerror = (error) => {
      console.error("Error reading file:", error)
      alert("Error reading file. Please try again.")
    }

    reader.readAsText(file)

    // Reset the input value
    event.target.value = ""
  }

  const handleCollabSphereClick = () => {
    playSound("/sounds/button-click.mp3")
    router.push("/collabsphere")
  }

  // Toggle edit mode
  const toggleEditMode = () => {
    setEditMode(!editMode)
    playSound("/sounds/button-click.mp3")
  }

  // Handle node updates
  const handleNodeUpdate = (nodeId: string, data: Partial<NodeData>) => {
    setMapData((prev) => ({
      ...prev,
      nodes: {
        ...prev.nodes,
        [nodeId]: {
          ...prev.nodes[nodeId],
          ...data,
        },
      },
    }))
  }

  // Handle connection updates
  const handleConnectionUpdate = (connectionId: string, data: Partial<ConnectionData>) => {
    const [from, to] = connectionId.split("-")

    setMapData((prev) => ({
      ...prev,
      connections: prev.connections.map((conn) => (conn.from === from && conn.to === to ? { ...conn, ...data } : conn)),
    }))
  }

  // Add a new node
  const handleAddNode = () => {
    if (!newNodeData.name || !newNodeData.id) {
      alert("Node name and ID are required")
      return
    }

    // Generate a unique ID if not provided
    const nodeId = newNodeData.id || `node-${Date.now()}`

    // Add the new node
    setMapData((prev) => ({
      ...prev,
      nodes: {
        ...prev.nodes,
        [nodeId]: {
          id: nodeId,
          name: newNodeData.name || "New Node",
          color: newNodeData.color || "rgba(255, 255, 255, 0.8)",
          position: newNodeData.position || { x: 0.5, y: 0.5 },
          type: newNodeData.type || "custom",
          description: newNodeData.description || "",
          status: "online",
          lastActive: "just now",
        } as NodeData,
      },
    }))

    // Reset form and close dialog
    setNewNodeData({
      name: "",
      color: "rgba(255, 255, 255, 0.8)",
      type: "custom",
      position: { x: 0.5, y: 0.5 },
    })
    setIsAddNodeDialogOpen(false)
    playSound("/sounds/feature-select.mp3")
  }

  // Delete a node
  const handleDeleteNode = (nodeId: string) => {
    // Remove the node
    const { [nodeId]: removedNode, ...remainingNodes } = mapData.nodes

    // Remove any connections involving this node
    const filteredConnections = mapData.connections.filter((conn) => conn.from !== nodeId && conn.to !== nodeId)

    setMapData({
      nodes: remainingNodes,
      connections: filteredConnections,
    })

    setSelectedNode(null)
    playSound("/sounds/button-click.mp3")
  }

  // Add a connection between nodes
  const handleAddConnection = (from: string, to: string) => {
    // Check if connection already exists
    const connectionExists = mapData.connections.some((conn) => conn.from === from && conn.to === to)

    if (connectionExists) {
      alert("Connection already exists")
      return
    }

    // Add the new connection
    setMapData((prev) => ({
      ...prev,
      connections: [
        ...prev.connections,
        {
          from,
          to,
          strength: 0.5,
          type: "data",
          status: "active",
          dataFlow: 0.5,
          bidirectional: false,
        },
      ],
    }))

    playSound("/sounds/feature-select.mp3")
  }

  // Delete a connection
  const handleDeleteConnection = (from: string, to: string) => {
    setMapData((prev) => ({
      ...prev,
      connections: prev.connections.filter((conn) => !(conn.from === from && conn.to === to)),
    }))

    setSelectedConnection(null)
    playSound("/sounds/button-click.mp3")
  }

  // Get the selected node data
  const getSelectedNodeData = () => {
    if (!selectedNode) return null
    return mapData.nodes[selectedNode]
  }

  // Get the selected connection data
  const getSelectedConnectionData = () => {
    if (!selectedConnection) return null
    const [from, to] = selectedConnection.split("-")
    return mapData.connections.find((conn) => conn.from === from && conn.to === to) || null
  }

  return (
    <>
      <div className="border border-gray-800 bg-black/80 rounded-md overflow-hidden h-full flex flex-col">
        <div className="p-3 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-lg font-bold text-cyan-400">AI Collaboration Map</h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-cyan-400"
              onClick={toggleEditMode}
              title={editMode ? "Exit Edit Mode" : "Enter Edit Mode"}
            >
              <Edit className="h-4 w-4" />
            </Button>
            {editMode && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-green-400"
                onClick={() => setIsAddNodeDialogOpen(true)}
                title="Add New Node"
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="map" className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-2 mx-3 mt-2">
            <TabsTrigger value="map">Map</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="flex-1 overflow-hidden">
            <div className="h-[300px]">
              <CollaborationMap
                activeNode={activeNode}
                onNodeClick={onNodeClick}
                mapData={mapData}
                onNodeUpdate={handleNodeUpdate}
                onConnectionUpdate={handleConnectionUpdate}
                editable={editMode}
              />
            </div>
          </TabsContent>

          <TabsContent value="details" className="flex-1 overflow-auto p-3">
            {selectedNode && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold" style={{ color: mapData.nodes[selectedNode].color }}>
                  {mapData.nodes[selectedNode].name}
                </h3>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-black/50 border border-gray-800 rounded-md p-2">
                    <div className="text-xs text-gray-400 mb-1">Type:</div>
                    <div className="font-bold text-sm capitalize">{mapData.nodes[selectedNode].type || "custom"}</div>
                  </div>

                  <div className="bg-black/50 border border-gray-800 rounded-md p-2">
                    <div className="text-xs text-gray-400 mb-1">Status:</div>
                    <div
                      className={`font-bold text-sm ${
                        mapData.nodes[selectedNode].status === "online"
                          ? "text-green-400"
                          : mapData.nodes[selectedNode].status === "busy"
                            ? "text-yellow-400"
                            : "text-red-400"
                      }`}
                    >
                      {mapData.nodes[selectedNode].status || "unknown"}
                    </div>
                  </div>
                </div>

                <div className="bg-black/50 border border-gray-800 rounded-md p-2">
                  <div className="text-xs text-gray-400 mb-1">Description:</div>
                  <div className="text-sm">
                    {mapData.nodes[selectedNode].description || "No description available."}
                  </div>
                </div>

                {mapData.nodes[selectedNode].metrics && (
                  <div className="bg-black/50 border border-gray-800 rounded-md p-2">
                    <div className="text-xs text-gray-400 mb-2">Performance Metrics:</div>

                    {mapData.nodes[selectedNode].metrics.accuracy !== undefined && (
                      <div className="mb-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Accuracy</span>
                          <span>{Math.round(mapData.nodes[selectedNode].metrics.accuracy * 100)}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500"
                            style={{ width: `${mapData.nodes[selectedNode].metrics.accuracy * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {mapData.nodes[selectedNode].metrics.speed !== undefined && (
                      <div className="mb-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Speed</span>
                          <span>{Math.round(mapData.nodes[selectedNode].metrics.speed * 100)}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-500"
                            style={{ width: `${mapData.nodes[selectedNode].metrics.speed * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {mapData.nodes[selectedNode].metrics.creativity !== undefined && (
                      <div className="mb-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Creativity</span>
                          <span>{Math.round(mapData.nodes[selectedNode].metrics.creativity * 100)}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-fuchsia-500"
                            style={{ width: `${mapData.nodes[selectedNode].metrics.creativity * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {mapData.nodes[selectedNode].metrics.reasoning !== undefined && (
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Reasoning</span>
                          <span>{Math.round(mapData.nodes[selectedNode].metrics.reasoning * 100)}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-cyan-500"
                            style={{ width: `${mapData.nodes[selectedNode].metrics.reasoning * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="bg-black/50 border border-gray-800 rounded-md p-2">
                  <div className="text-xs text-gray-400 mb-1">Connections:</div>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {mapData.connections
                      .filter((conn) => conn.from === selectedNode || conn.to === selectedNode)
                      .map((conn, index) => {
                        const otherNodeId = conn.from === selectedNode ? conn.to : conn.from
                        const otherNode = mapData.nodes[otherNodeId]
                        const direction = conn.from === selectedNode ? "→" : "←"
                        const bidirectional = conn.bidirectional ? "↔" : direction

                        return (
                          <div
                            key={index}
                            className="flex items-center justify-between text-sm p-1 hover:bg-gray-800/50 rounded"
                            onClick={() => {
                              setSelectedConnection(`${conn.from}-${conn.to}`)
                              playSound("/sounds/button-click.mp3")
                            }}
                          >
                            <div className="flex items-center">
                              <span className="mr-1">{bidirectional}</span>
                              <span style={{ color: otherNode.color }}>{otherNode.name}</span>
                            </div>
                            <div
                              className={`text-xs px-1.5 py-0.5 rounded ${
                                conn.status === "active"
                                  ? "bg-green-900/30 text-green-400"
                                  : conn.status === "pending"
                                    ? "bg-yellow-900/30 text-yellow-400"
                                    : "bg-red-900/30 text-red-400"
                              }`}
                            >
                              {conn.status}
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </div>

                {editMode && (
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-900/50 bg-black/50 hover:bg-red-900/20 text-red-400"
                      onClick={() => handleDeleteNode(selectedNode)}
                    >
                      <Trash className="h-3.5 w-3.5 mr-1.5" />
                      Delete Node
                    </Button>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-cyan-900/50 bg-black/50 hover:bg-cyan-900/20 text-cyan-400"
                        >
                          <Settings className="h-3.5 w-3.5 mr-1.5" />
                          Edit Node
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 bg-gray-900 border-gray-800">
                        <div className="space-y-3">
                          <h4 className="font-medium">Edit Node Properties</h4>

                          <div className="space-y-2">
                            <Label htmlFor="edit-node-name">Name</Label>
                            <Input
                              id="edit-node-name"
                              value={mapData.nodes[selectedNode].name}
                              onChange={(e) => handleNodeUpdate(selectedNode, { name: e.target.value })}
                              className="bg-black/50 border-gray-700"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="edit-node-description">Description</Label>
                            <Input
                              id="edit-node-description"
                              value={mapData.nodes[selectedNode].description || ""}
                              onChange={(e) => handleNodeUpdate(selectedNode, { description: e.target.value })}
                              className="bg-black/50 border-gray-700"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="edit-node-status">Status</Label>
                            <select
                              id="edit-node-status"
                              value={mapData.nodes[selectedNode].status || "online"}
                              onChange={(e) =>
                                handleNodeUpdate(selectedNode, {
                                  status: e.target.value as "online" | "offline" | "busy",
                                })
                              }
                              className="w-full bg-black/50 border border-gray-700 rounded-md p-2 text-sm"
                            >
                              <option value="online">Online</option>
                              <option value="busy">Busy</option>
                              <option value="offline">Offline</option>
                            </select>
                          </div>

                          <div className="space-y-2">
                            <Label>Color</Label>
                            <div className="flex space-x-2">
                              {[
                                "rgba(74, 222, 128, 0.8)",
                                "rgba(217, 70, 239, 0.8)",
                                "rgba(34, 211, 238, 0.8)",
                                "rgba(250, 204, 21, 0.8)",
                                "rgba(248, 113, 113, 0.8)",
                                "rgba(96, 165, 250, 0.8)",
                              ].map((color) => (
                                <button
                                  key={color}
                                  className={`w-6 h-6 rounded-full ${mapData.nodes[selectedNode].color === color ? "ring-2 ring-white" : ""}`}
                                  style={{ backgroundColor: color }}
                                  onClick={() => handleNodeUpdate(selectedNode, { color })}
                                />
                              ))}
                            </div>
                          </div>

                          {mapData.nodes[selectedNode].metrics && (
                            <div className="space-y-2">
                              <Label>Metrics</Label>

                              <div className="space-y-3">
                                <div className="space-y-1">
                                  <div className="flex justify-between text-xs">
                                    <span>Accuracy</span>
                                    <span>
                                      {Math.round((mapData.nodes[selectedNode].metrics?.accuracy || 0) * 100)}%
                                    </span>
                                  </div>
                                  <Slider
                                    value={[(mapData.nodes[selectedNode].metrics?.accuracy || 0) * 100]}
                                    min={0}
                                    max={100}
                                    step={1}
                                    onValueChange={(value) => {
                                      const metrics = {
                                        ...mapData.nodes[selectedNode].metrics,
                                        accuracy: value[0] / 100,
                                      }
                                      handleNodeUpdate(selectedNode, { metrics })
                                    }}
                                  />
                                </div>

                                <div className="space-y-1">
                                  <div className="flex justify-between text-xs">
                                    <span>Speed</span>
                                    <span>{Math.round((mapData.nodes[selectedNode].metrics?.speed || 0) * 100)}%</span>
                                  </div>
                                  <Slider
                                    value={[(mapData.nodes[selectedNode].metrics?.speed || 0) * 100]}
                                    min={0}
                                    max={100}
                                    step={1}
                                    onValueChange={(value) => {
                                      const metrics = { ...mapData.nodes[selectedNode].metrics, speed: value[0] / 100 }
                                      handleNodeUpdate(selectedNode, { metrics })
                                    }}
                                  />
                                </div>

                                <div className="space-y-1">
                                  <div className="flex justify-between text-xs">
                                    <span>Creativity</span>
                                    <span>
                                      {Math.round((mapData.nodes[selectedNode].metrics?.creativity || 0) * 100)}%
                                    </span>
                                  </div>
                                  <Slider
                                    value={[(mapData.nodes[selectedNode].metrics?.creativity || 0) * 100]}
                                    min={0}
                                    max={100}
                                    step={1}
                                    onValueChange={(value) => {
                                      const metrics = {
                                        ...mapData.nodes[selectedNode].metrics,
                                        creativity: value[0] / 100,
                                      }
                                      handleNodeUpdate(selectedNode, { metrics })
                                    }}
                                  />
                                </div>

                                <div className="space-y-1">
                                  <div className="flex justify-between text-xs">
                                    <span>Reasoning</span>
                                    <span>
                                      {Math.round((mapData.nodes[selectedNode].metrics?.reasoning || 0) * 100)}%
                                    </span>
                                  </div>
                                  <Slider
                                    value={[(mapData.nodes[selectedNode].metrics?.reasoning || 0) * 100]}
                                    min={0}
                                    max={100}
                                    step={1}
                                    onValueChange={(value) => {
                                      const metrics = {
                                        ...mapData.nodes[selectedNode].metrics,
                                        reasoning: value[0] / 100,
                                      }
                                      handleNodeUpdate(selectedNode, { metrics })
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
              </div>
            )}

            {selectedConnection && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Connection Details</h3>

                {(() => {
                  const [from, to] = selectedConnection.split("-")
                  const connection = mapData.connections.find((c) => c.from === from && c.to === to)
                  const fromNode = mapData.nodes[from]
                  const toNode = mapData.nodes[to]

                  if (!connection || !fromNode || !toNode) return null

                  return (
                    <>
                      <div className="flex items-center justify-center space-x-2">
                        <span
                          className="px-2 py-1 rounded bg-black/50 border border-gray-800"
                          style={{ color: fromNode.color }}
                        >
                          {fromNode.name}
                        </span>
                        <span className="text-gray-400">{connection.bidirectional ? "↔" : "→"}</span>
                        <span
                          className="px-2 py-1 rounded bg-black/50 border border-gray-800"
                          style={{ color: toNode.color }}
                        >
                          {toNode.name}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-black/50 border border-gray-800 rounded-md p-2">
                          <div className="text-xs text-gray-400 mb-1">Type:</div>
                          <div className="font-bold text-sm capitalize">{connection.type || "data"}</div>
                        </div>

                        <div className="bg-black/50 border border-gray-800 rounded-md p-2">
                          <div className="text-xs text-gray-400 mb-1">Status:</div>
                          <div
                            className={`font-bold text-sm ${
                              connection.status === "active"
                                ? "text-green-400"
                                : connection.status === "pending"
                                  ? "text-yellow-400"
                                  : "text-red-400"
                            }`}
                          >
                            {connection.status || "active"}
                          </div>
                        </div>
                      </div>

                      <div className="bg-black/50 border border-gray-800 rounded-md p-2">
                        <div className="text-xs text-gray-400 mb-1">Connection Strength:</div>
                        <div className="h-2 bg-gray-800/70 rounded-full overflow-hidden shadow-inner">
                          <div
                            className="h-full bg-blue-500 transition-all duration-300 ease-in-out"
                            style={{ width: `${connection.strength * 100}%` }}
                          ></div>
                        </div>
                        <div className="text-right text-xs mt-1">{Math.round(connection.strength * 100)}%</div>
                      </div>

                      {connection.dataFlow !== undefined && (
                        <div className="bg-black/50 border border-gray-800 rounded-md p-2">
                          <div className="text-xs text-gray-400 mb-1">Data Flow Rate:</div>
                          <div className="h-2 bg-gray-800/70 rounded-full overflow-hidden shadow-inner">
                            <div
                              className="h-full bg-cyan-500 transition-all duration-300 ease-in-out"
                              style={{ width: `${connection.dataFlow * 100}%` }}
                            ></div>
                          </div>
                          <div className="text-right text-xs mt-1">{Math.round(connection.dataFlow * 100)}%</div>
                        </div>
                      )}

                      <div className="bg-black/50 border border-gray-800 rounded-md p-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Bidirectional</span>
                          <Switch
                            checked={connection.bidirectional || false}
                            onCheckedChange={(checked) => {
                              handleConnectionUpdate(selectedConnection, { bidirectional: checked })
                            }}
                          />
                        </div>
                      </div>

                      {editMode && (
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-900/50 bg-black/50 hover:bg-red-900/20 text-red-400"
                            onClick={() => handleDeleteConnection(from, to)}
                          >
                            <Trash className="h-3.5 w-3.5 mr-1.5" />
                            Delete Connection
                          </Button>

                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-cyan-900/50 bg-black/50 hover:bg-cyan-900/20 text-cyan-400"
                              >
                                <Settings className="h-3.5 w-3.5 mr-1.5" />
                                Edit Connection
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 bg-gray-900 border-gray-800">
                              <div className="space-y-3">
                                <h4 className="font-medium">Edit Connection Properties</h4>

                                <div className="space-y-2">
                                  <Label htmlFor="edit-connection-type">Type</Label>
                                  <select
                                    id="edit-connection-type"
                                    value={connection.type || "data"}
                                    onChange={(e) =>
                                      handleConnectionUpdate(selectedConnection, {
                                        type: e.target.value as "data" | "control" | "feedback" | "custom",
                                      })
                                    }
                                    className="w-full bg-black/50 border border-gray-700 rounded-md p-2 text-sm"
                                  >
                                    <option value="data">Data</option>
                                    <option value="control">Control</option>
                                    <option value="feedback">Feedback</option>
                                    <option value="custom">Custom</option>
                                  </select>
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="edit-connection-status">Status</Label>
                                  <select
                                    id="edit-connection-status"
                                    value={connection.status || "active"}
                                    onChange={(e) =>
                                      handleConnectionUpdate(selectedConnection, {
                                        status: e.target.value as "active" | "inactive" | "pending",
                                      })
                                    }
                                    className="w-full bg-black/50 border border-gray-700 rounded-md p-2 text-sm"
                                  >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="pending">Pending</option>
                                  </select>
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-xs">
                                    <Label>Connection Strength</Label>
                                    <span>{Math.round(connection.strength * 100)}%</span>
                                  </div>
                                  <Slider
                                    value={[connection.strength * 100]}
                                    min={0}
                                    max={100}
                                    step={1}
                                    onValueChange={(value) => {
                                      handleConnectionUpdate(selectedConnection, { strength: value[0] / 100 })
                                    }}
                                  />
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-xs">
                                    <Label>Data Flow Rate</Label>
                                    <span>{Math.round((connection.dataFlow || 0) * 100)}%</span>
                                  </div>
                                  <Slider
                                    value={[(connection.dataFlow || 0) * 100]}
                                    min={0}
                                    max={100}
                                    step={1}
                                    onValueChange={(value) => {
                                      handleConnectionUpdate(selectedConnection, { dataFlow: value[0] / 100 })
                                    }}
                                  />
                                </div>

                                <div className="flex items-center justify-between">
                                  <Label htmlFor="edit-connection-bidirectional">Bidirectional</Label>
                                  <Switch
                                    id="edit-connection-bidirectional"
                                    checked={connection.bidirectional || false}
                                    onCheckedChange={(checked) => {
                                      handleConnectionUpdate(selectedConnection, { bidirectional: checked })
                                    }}
                                  />
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      )}
                    </>
                  )
                })()}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="p-3 border-t border-gray-800">
          {/* Map data and controls section */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-black/50 border border-gray-800 rounded-md p-2">
              <div className="text-xs text-gray-400 mb-1">Active AI:</div>
              <div className={`font-bold text-base ${getNodeColor()}`}>
                {activeNode.charAt(0).toUpperCase() + activeNode.slice(1)}
              </div>
            </div>

            <div className="bg-black/50 border border-gray-800 rounded-md p-2">
              <div className="text-xs text-gray-400 mb-1">Status:</div>
              <div className="font-bold text-base text-green-400">Connected</div>
            </div>
          </div>

          {/* Save/Load buttons */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <Button
              variant="outline"
              className="border-cyan-900/50 bg-black/50 hover:bg-cyan-900/20 text-cyan-400"
              onClick={handleSaveMap}
            >
              <Save className="mr-1.5 h-3.5 w-3.5" />
              <span className="text-xs">Save Map</span>
            </Button>

            <Button
              variant="outline"
              className="border-cyan-900/50 bg-black/50 hover:bg-cyan-900/20 text-cyan-400"
              onClick={handleLoadClick}
            >
              <Upload className="mr-1.5 h-3.5 w-3.5" />
              <span className="text-xs">Load Map</span>
            </Button>

            {/* Hidden file input */}
            <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleFileUpload} />
          </div>

          {/* Node activity visualization */}
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Activity Level</span>
            </div>
            <div className="h-2 bg-gray-800/70 rounded-full overflow-hidden shadow-inner">
              <div
                className={`h-full ${getNodeColor().replace("text-", "bg-")} transition-all duration-700 ease-in-out`}
                style={{
                  width: `${Math.random() * 30 + 70}%`,
                  boxShadow: `0 0 10px ${getNodeColor().replace("text-", "rgb").replace("400", "500")}`,
                }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <Button
              variant="outline"
              className="border-cyan-900/50 bg-black/50 hover:bg-cyan-900/20 text-cyan-400"
              onClick={() => playSound("/sounds/button-click.mp3")}
            >
              <BarChart className="mr-1.5 h-3.5 w-3.5" />
              <span className="text-xs">Analytics</span>
            </Button>

            <Button
              variant="outline"
              className="border-cyan-900/50 bg-black/50 hover:bg-cyan-900/20 text-cyan-400"
              onClick={handleCollabSphereClick}
            >
              <Globe className="mr-1.5 h-3.5 w-3.5" />
              <span className="text-xs">Collab.Sphere</span>
            </Button>
          </div>

          <a
            href="https://www.crossmint.com/collections/flight-to-the-future-78/drop"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            <Button
              className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white"
              onClick={() => playSound("/sounds/button-click.mp3")}
            >
              <Download className="mr-2 h-4 w-4" />
              Help: Donnie Accelerate
            </Button>
          </a>
        </div>
      </div>

      {/* MashBit Minter Modal */}
      <MashbitMinterModal
        isOpen={isMashbitModalOpen}
        onClose={() => setIsMashbitModalOpen(false)}
        currentTokens={tokenCount}
      />

      {/* Add Node Dialog */}
      <Dialog open={isAddNodeDialogOpen} onOpenChange={setIsAddNodeDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle>Add New Node</DialogTitle>
            <DialogDescription>Create a new node in the AI collaboration map.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="node-id">Node ID (unique identifier)</Label>
              <Input
                id="node-id"
                placeholder="e.g., claude, llama, custom-ai"
                value={newNodeData.id || ""}
                onChange={(e) => setNewNodeData({ ...newNodeData, id: e.target.value })}
                className="bg-black/50 border-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="node-name">Display Name</Label>
              <Input
                id="node-name"
                placeholder="e.g., Claude, Llama, Custom AI"
                value={newNodeData.name || ""}
                onChange={(e) => setNewNodeData({ ...newNodeData, name: e.target.value })}
                className="bg-black/50 border-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="node-description">Description</Label>
              <Input
                id="node-description"
                placeholder="Describe this node's purpose or capabilities"
                value={newNodeData.description || ""}
                onChange={(e) => setNewNodeData({ ...newNodeData, description: e.target.value })}
                className="bg-black/50 border-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="node-type">Node Type</Label>
              <select
                id="node-type"
                value={newNodeData.type || "custom"}
                onChange={(e) =>
                  setNewNodeData({ ...newNodeData, type: e.target.value as "ai" | "human" | "system" | "custom" })
                }
                className="w-full bg-black/50 border border-gray-700 rounded-md p-2 text-sm"
              >
                <option value="ai">AI Model</option>
                <option value="human">Human</option>
                <option value="system">System</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Node Color</Label>
              <div className="flex flex-wrap gap-2">
                {[
                  "rgba(74, 222, 128, 0.8)",
                  "rgba(217, 70, 239, 0.8)",
                  "rgba(34, 211, 238, 0.8)",
                  "rgba(250, 204, 21, 0.8)",
                  "rgba(248, 113, 113, 0.8)",
                  "rgba(96, 165, 250, 0.8)",
                  "rgba(192, 132, 252, 0.8)",
                  "rgba(251, 146, 60, 0.8)",
                  "rgba(255, 255, 255, 0.8)",
                ].map((color) => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-full ${newNodeData.color === color ? "ring-2 ring-white" : ""}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setNewNodeData({ ...newNodeData, color })}
                  />
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddNodeDialogOpen(false)}
              className="border-gray-700 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button onClick={handleAddNode} className="bg-cyan-700 hover:bg-cyan-600 text-white">
              Add Node
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

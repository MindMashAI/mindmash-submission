"use client"

import { useState } from "react"
import { Layers, Users, ChevronRight, ChevronDown } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useAudio } from "@/components/audio-manager"

interface User {
  id: string
  name: string
  avatar: string
  status: string
  role: string
}

interface Project {
  id: string
  name: string
  description: string
  members: string[]
  aiModels: string[]
  progress: number
  lastActive: string
}

interface CollabProjectsProps {
  projects: Project[]
  users: User[]
}

export function CollabProjects({ projects, users }: CollabProjectsProps) {
  const { playSound } = useAudio()
  const [expandedProject, setExpandedProject] = useState<string | null>(null)

  const toggleProject = (projectId: string) => {
    playSound("/sounds/button-click.mp3")
    setExpandedProject(expandedProject === projectId ? null : projectId)
  }

  const getUserById = (id: string) => {
    return users.find((user) => user.id === id)
  }

  const getAIColor = (ai: string) => {
    switch (ai) {
      case "grok":
        return "bg-green-900/30 text-green-300 border-green-500/30"
      case "chatgpt":
        return "bg-fuchsia-900/30 text-fuchsia-300 border-fuchsia-500/30"
      case "gemini":
        return "bg-cyan-900/30 text-cyan-300 border-cyan-500/30"
      case "system":
        return "bg-yellow-900/30 text-yellow-300 border-yellow-500/30"
      default:
        return "bg-gray-900/30 text-gray-300 border-gray-500/30"
    }
  }

  return (
    <div className="space-y-3">
      {projects.map((project) => (
        <div key={project.id} className="bg-black/50 border border-gray-800 rounded-md overflow-hidden">
          {/* Project header */}
          <div
            className="p-3 flex items-center justify-between cursor-pointer hover:bg-gray-900/30"
            onClick={() => toggleProject(project.id)}
          >
            <div className="flex items-center">
              <Layers className="h-4 w-4 mr-2 text-cyan-400" />
              <span className="font-medium">{project.name}</span>
            </div>
            {expandedProject === project.id ? (
              <ChevronDown className="h-4 w-4 text-gray-400" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-400" />
            )}
          </div>

          {/* Project details */}
          {expandedProject === project.id && (
            <div className="p-3 border-t border-gray-800">
              <p className="text-sm text-gray-300 mb-3">{project.description}</p>

              {/* Progress bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-1.5" />
              </div>

              {/* Team members */}
              <div className="mb-3">
                <div className="text-xs text-gray-400 mb-1 flex items-center">
                  <Users className="h-3 w-3 mr-1" />
                  <span>Team Members</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {project.members.map((memberId) => {
                    const user = getUserById(memberId)
                    return user ? (
                      <div key={memberId} className="flex items-center bg-gray-900/30 rounded-full pl-0.5 pr-2 py-0.5">
                        <img
                          src={user.avatar || "/placeholder.svg"}
                          alt={user.name}
                          className="w-5 h-5 rounded-full mr-1"
                        />
                        <span className="text-xs">{user.name}</span>
                      </div>
                    ) : null
                  })}
                </div>
              </div>

              {/* AI Models */}
              <div className="mb-2">
                <div className="text-xs text-gray-400 mb-1">AI Models</div>
                <div className="flex flex-wrap gap-1">
                  {project.aiModels.map((ai, index) => (
                    <div key={index} className={`text-xs border px-2 py-0.5 rounded-full ${getAIColor(ai)}`}>
                      {ai.charAt(0).toUpperCase() + ai.slice(1)}
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-xs text-gray-400">Last active: {project.lastActive}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

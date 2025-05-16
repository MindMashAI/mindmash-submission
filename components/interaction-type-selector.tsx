"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { MessageSquare, GitCompare, Lightbulb, Users, Zap, BookOpen, Info } from "lucide-react"

type InteractionType = "chat" | "debate" | "brainstorm" | "collaborative" | "rapid" | "educational"

interface InteractionTypeSelectorProps {
  onSelect: (type: InteractionType) => void
  currentType: InteractionType
}

export function InteractionTypeSelector({ onSelect, currentType }: InteractionTypeSelectorProps) {
  const [hoveredType, setHoveredType] = useState<InteractionType | null>(null)

  const interactionTypes = [
    {
      id: "chat" as InteractionType,
      icon: <MessageSquare className="h-4 w-4" />,
      label: "Chat",
      description: "Standard conversational mode with balanced responses",
    },
    {
      id: "debate" as InteractionType,
      icon: <GitCompare className="h-4 w-4" />,
      label: "Debate",
      description: "AI models present opposing viewpoints on a topic",
    },
    {
      id: "brainstorm" as InteractionType,
      icon: <Lightbulb className="h-4 w-4" />,
      label: "Brainstorm",
      description: "Rapid idea generation with multiple perspectives",
    },
    {
      id: "collaborative" as InteractionType,
      icon: <Users className="h-4 w-4" />,
      label: "Collab",
      description: "Multiple AI models work together to solve problems",
    },
    {
      id: "rapid" as InteractionType,
      icon: <Zap className="h-4 w-4" />,
      label: "Rapid",
      description: "Quick, concise responses optimized for speed",
    },
    {
      id: "educational" as InteractionType,
      icon: <BookOpen className="h-4 w-4" />,
      label: "Learn",
      description: "Detailed explanations with educational context",
    },
  ]

  return (
    <div className="relative">
      <TooltipProvider>
        <Tabs
          defaultValue={currentType}
          value={currentType}
          onValueChange={(value) => onSelect(value as InteractionType)}
          className="w-full"
        >
          <TabsList className="grid grid-cols-6 h-9 bg-background border border-input">
            {interactionTypes.map((type) => (
              <Tooltip key={type.id}>
                <TooltipTrigger asChild>
                  <TabsTrigger
                    value={type.id}
                    className="data-[state=active]:bg-muted data-[state=active]:text-primary flex items-center gap-1.5 px-3 text-xs"
                    onMouseEnter={() => setHoveredType(type.id)}
                    onMouseLeave={() => setHoveredType(null)}
                  >
                    {type.icon}
                    <span className="hidden sm:inline">{type.label}</span>
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  <p className="font-semibold">{type.label}</p>
                  <p>{type.description}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </TabsList>
        </Tabs>
      </TooltipProvider>

      <div className="absolute right-0 top-0 -mt-6 flex items-center text-xs text-muted-foreground">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1 cursor-help">
                <Info className="h-3 w-3" />
                <span>Interaction Mode</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <p>Select different interaction modes to change how AI models respond to your queries.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}

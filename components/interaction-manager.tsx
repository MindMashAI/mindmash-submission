"use client"
import { DebateInteraction } from "./debate-interaction"
import { BrainstormInteraction } from "./brainstorm-interaction"
import { InteractionTypeSelector } from "./interaction-type-selector"
import { Card, CardContent } from "@/components/ui/card"

type InteractionType = "chat" | "debate" | "brainstorm" | "collaborative" | "rapid" | "educational"

interface InteractionManagerProps {
  onInteractionTypeChange: (type: InteractionType) => void
  currentInteractionType: InteractionType
  topic?: string
  onReturnToChat: () => void
}

export function InteractionManager({
  onInteractionTypeChange,
  currentInteractionType,
  topic = "AI-assisted collaboration tools",
  onReturnToChat,
}: InteractionManagerProps) {
  return (
    <div className="space-y-4 w-full">
      <Card className="border border-input bg-black/40 backdrop-blur-sm">
        <CardContent className="p-3">
          <InteractionTypeSelector onSelect={onInteractionTypeChange} currentType={currentInteractionType} />
        </CardContent>
      </Card>

      {currentInteractionType === "debate" && <DebateInteraction topic={topic} onContinue={onReturnToChat} />}

      {currentInteractionType === "brainstorm" && <BrainstormInteraction topic={topic} onContinue={onReturnToChat} />}
    </div>
  )
}

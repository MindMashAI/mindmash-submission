"use client"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type ColorVariant = "cyan" | "purple" | "green" | "pink" | "orange" | "random"
type SizeVariant = "sm" | "md" | "lg" | "xl"

interface CyberpunkAvatarProps {
  name: string
  src?: string
  size?: SizeVariant
  colorVariant?: ColorVariant
  status?: "online" | "away" | "offline"
  className?: string
  showStatusIndicator?: boolean
}

// Utility function to get user initials
const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)
}

// Utility function to get a consistent gradient based on name
const getGradientByName = (name: string, colorVariant: ColorVariant): string => {
  if (colorVariant === "random") {
    // Use name to deterministically select a gradient
    const gradients = [
      "from-green-400 to-cyan-500",
      "from-blue-500 to-purple-500",
      "from-yellow-400 to-orange-500",
      "from-pink-400 to-red-500",
      "from-lime-400 to-teal-500",
    ]
    const index = Math.abs(name.charCodeAt(0) + name.charCodeAt(name.length - 1)) % gradients.length
    return gradients[index]
  }

  // Return specific gradients based on colorVariant
  switch (colorVariant) {
    case "cyan":
      return "from-cyan-400 to-blue-500"
    case "purple":
      return "from-purple-400 to-fuchsia-500"
    case "green":
      return "from-green-400 to-emerald-500"
    case "pink":
      return "from-pink-400 to-rose-500"
    case "orange":
      return "from-orange-400 to-amber-500"
    default:
      return "from-cyan-400 to-blue-500"
  }
}

// Utility function to get size classes
const getSizeClasses = (size: SizeVariant): string => {
  switch (size) {
    case "sm":
      return "h-8 w-8 text-xs"
    case "md":
      return "h-10 w-10 text-sm"
    case "lg":
      return "h-12 w-12 text-base"
    case "xl":
      return "h-16 w-16 text-lg"
    default:
      return "h-10 w-10 text-sm"
  }
}

// Utility function to get status indicator classes
const getStatusClasses = (status: string, size: SizeVariant): string => {
  const baseClasses = "absolute rounded-full border-2 border-black"
  const sizeClasses = size === "sm" ? "h-2 w-2 right-0 bottom-0" : "h-3 w-3 right-0 bottom-0"

  let colorClasses = "bg-gray-500" // offline by default
  if (status === "online") colorClasses = "bg-green-500"
  if (status === "away") colorClasses = "bg-orange-500"

  return cn(baseClasses, sizeClasses, colorClasses)
}

export function CyberpunkAvatar({
  name,
  src,
  size = "md",
  colorVariant = "random",
  status,
  className,
  showStatusIndicator = false,
}: CyberpunkAvatarProps) {
  const sizeClasses = getSizeClasses(size)
  const gradientClasses = getGradientByName(name, colorVariant)
  const initials = getInitials(name)

  return (
    <div className="relative">
      <Avatar className={cn(sizeClasses, "border border-gray-700 shadow-glow", className)}>
        {src && <AvatarImage src={src || "/placeholder.svg"} alt={name} />}
        <AvatarFallback className={cn("bg-gradient-to-r", gradientClasses, "text-black font-bold")}>
          {initials}
        </AvatarFallback>
      </Avatar>

      {status && showStatusIndicator && <span className={getStatusClasses(status, size)}></span>}
    </div>
  )
}

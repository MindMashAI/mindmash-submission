import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface DashboardPanelProps {
  title: string
  children: ReactNode
  className?: string
}

export default function DashboardPanel({ title, children, className }: DashboardPanelProps) {
  return (
    <div className={cn("border border-cyan-900/30 bg-black/60 rounded-sm", className)}>
      <div className="bg-gradient-to-r from-cyan-900/30 to-purple-900/30 px-2 py-1 border-b border-cyan-900/30">
        <h3 className="text-xs font-bold text-cyan-400">{title}</h3>
      </div>
      <div className="p-3">{children}</div>
    </div>
  )
}

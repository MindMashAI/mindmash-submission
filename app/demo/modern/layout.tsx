import type React from "react"
import { AudioProvider } from "@/components/audio-manager"

export default function ModernDemoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AudioProvider>
      <div className="bg-black min-h-screen w-full overflow-hidden">{children}</div>
    </AudioProvider>
  )
}

import type React from "react"
import { AudioProvider } from "@/components/audio-manager"
import "./demo.css"

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AudioProvider>
      <div className="bg-black min-h-screen w-full overflow-x-hidden">
        <div
          className="max-w-full"
          style={{ overflowY: "auto", overflowX: "hidden", WebkitOverflowScrolling: "touch" }}
        >
          {children}
        </div>
      </div>
    </AudioProvider>
  )
}

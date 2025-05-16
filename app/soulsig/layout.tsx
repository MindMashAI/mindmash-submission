import type React from "react"
import "../globals.css"
import "./soulsig.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AudioProvider } from "@/components/audio-manager"

export default function SoulSigLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <AudioProvider>{children}</AudioProvider>
    </ThemeProvider>
  )
}

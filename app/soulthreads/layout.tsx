import type React from "react"
import "../globals.css"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata = {
  title: "SoulThreads - The Narrative Layer of Your Identity | MindMash.ai",
  description: "Weave your contributions, beliefs, and creative expressions into your digital presence",
}

export default function SoulThreadsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      {children}
    </ThemeProvider>
  )
}

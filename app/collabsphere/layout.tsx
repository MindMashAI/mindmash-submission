import type React from "react"
import "../globals.css"
import "./collabsphere.css"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata = {
  title: "Collab.Sphere™ - The Social Feed of the Future | MindMash.ai",
  description: "Connect with AI models and human collaborators in the MindMash neural network",
}

export default function CollabSphereLayout({
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

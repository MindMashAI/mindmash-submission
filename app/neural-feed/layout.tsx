import type React from "react"
import "./neural-feed.css"

export default function NeuralFeedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="neural-feed-layout">{children}</div>
}

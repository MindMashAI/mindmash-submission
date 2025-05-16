import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AudioProvider } from "@/components/audio-manager"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MindMash.AI Pitch Deck",
  description: "Interactive cyberpunk presentation for MindMash.AI",
  icons: {
    icon: "https://jade-late-crow-559.mypinata.cloud/ipfs/bafkreidqig7q46v7wy2bj4d3la7vrkhylwqifzdclxzgxbodioeuum6nly",
    apple: "https://jade-late-crow-559.mypinata.cloud/ipfs/bafkreidqig7q46v7wy2bj4d3la7vrkhylwqifzdclxzgxbodioeuum6nly",
    shortcut:
      "https://jade-late-crow-559.mypinata.cloud/ipfs/bafkreidqig7q46v7wy2bj4d3la7vrkhylwqifzdclxzgxbodioeuum6nly",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="theme-color" content="#000000" />
        <link
          rel="icon"
          href="https://jade-late-crow-559.mypinata.cloud/ipfs/bafkreidqig7q46v7wy2bj4d3la7vrkhylwqifzdclxzgxbodioeuum6nly"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="https://jade-late-crow-559.mypinata.cloud/ipfs/bafkreidqig7q46v7wy2bj4d3la7vrkhylwqifzdclxzgxbodioeuum6nly"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="https://jade-late-crow-559.mypinata.cloud/ipfs/bafkreidqig7q46v7wy2bj4d3la7vrkhylwqifzdclxzgxbodioeuum6nly"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="https://jade-late-crow-559.mypinata.cloud/ipfs/bafkreidqig7q46v7wy2bj4d3la7vrkhylwqifzdclxzgxbodioeuum6nly"
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AudioProvider>{children}</AudioProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

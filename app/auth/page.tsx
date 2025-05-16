"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import CrossmintLogin from "@/components/auth/crossmint-login"
import NeuralConnectionEffect from "@/components/neural-connection-effect"
import { useAudio } from "@/components/audio-manager"

export default function AuthPage() {
  const [authStatus, setAuthStatus] = useState<"idle" | "success" | "error">("idle")
  const [statusMessage, setStatusMessage] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const isDemo = searchParams.get("demo") === "true"
  const { playSound } = useAudio()

  const handleAuthSuccess = (data: any) => {
    playSound("/sounds/power.mp3")
    setAuthStatus("success")
    setStatusMessage("Authentication successful! Redirecting...")

    // Store user info in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("mindmash_user", JSON.stringify(data.user))
    }

    // Redirect to demo page if demo parameter is present, otherwise to dashboard
    setTimeout(() => {
      if (isDemo) {
        router.push("/demo")
      } else {
        router.push("/dashboard")
      }
    }, 2000)
  }

  const handleAuthError = (error: any) => {
    playSound("/sounds/terminal-command.mp3")
    setAuthStatus("error")
    setStatusMessage(error.message || "Authentication failed. Please try again.")
  }

  const handleDemoMode = () => {
    playSound("/sounds/power.mp3")
    setAuthStatus("success")
    setStatusMessage("Demo mode activated! Redirecting...")

    // Store demo user info in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "mindmash_user",
        JSON.stringify({
          id: "demo-user",
          email: "demo@mindmash.ai",
          wallet: {
            publicKey: "demo123456789",
            balance: 100,
          },
        }),
      )
    }

    // Redirect to demo page
    setTimeout(() => {
      router.push("/demo")
    }, 2000)
  }

  return (
    <div className="relative min-h-screen bg-black text-white font-mono overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="absolute inset-0 bg-scanline opacity-5"></div>
      <NeuralConnectionEffect className="opacity-30" />

      {/* Back button */}
      <div className="absolute top-4 left-4 z-20">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            playSound("/sounds/button-click.mp3")
            router.push("/landing")
          }}
          className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-900/20"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
      </div>

      {/* Auth container */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md p-8 bg-gradient-to-br from-gray-900 to-black rounded-lg border border-cyan-900/50 shadow-[0_0_25px_rgba(8,145,178,0.2)]">
          {authStatus === "idle" && (
            <>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                  {isDemo ? "Try MindMash.AI Demo" : "Join MindMash.AI"}
                </h2>
                <p className="text-gray-400">
                  {isDemo
                    ? "Sign in to experience the interactive demo"
                    : "Sign in with your email to create a Solana wallet and access the neural frontier."}
                </p>
              </div>

              <div className="space-y-6">
                <CrossmintLogin onSuccess={handleAuthSuccess} onError={handleAuthError} />

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-black text-gray-500">Or</span>
                  </div>
                </div>

                <Button
                  onClick={handleDemoMode}
                  className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700"
                >
                  Continue as Guest
                </Button>
              </div>

              <p className="mt-6 text-xs text-center text-gray-500">
                By continuing, you agree to our{" "}
                <Link href="#" className="text-cyan-400 hover:text-cyan-300">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-cyan-400 hover:text-cyan-300">
                  Privacy Policy
                </Link>
                .
              </p>
            </>
          )}

          {authStatus === "success" && (
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-green-400"
                  >
                    <path d="M20 6L9 17l-5-5"></path>
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">
                Authentication Successful!
              </h2>
              <p className="text-gray-400 mb-6">{statusMessage}</p>
              <div className="flex justify-center">
                <div className="h-2 w-32 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 to-cyan-500 animate-[loading_3s_ease-in-out]"></div>
                </div>
              </div>
            </div>
          )}

          {authStatus === "error" && (
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-red-400"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
                Authentication Failed
              </h2>
              <p className="text-gray-400 mb-6">{statusMessage}</p>
              <Button
                onClick={() => {
                  playSound("/sounds/button-click.mp3")
                  setAuthStatus("idle")
                }}
                className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white"
              >
                Try Again
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

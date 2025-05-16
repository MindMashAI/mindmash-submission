"use client"

import { useEffect, useState, useRef } from "react"
import { getCrossmint } from "@/lib/crossmint"
import { useAudio } from "@/components/audio-manager"

interface CrossmintLoginProps {
  onSuccess?: (user: any) => void
  onError?: (error: any) => void
}

export default function CrossmintLogin({ onSuccess, onError }: CrossmintLoginProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { playSound } = useAudio()
  const buttonRef = useRef<HTMLDivElement>(null)
  const crossmintInitialized = useRef(false)

  useEffect(() => {
    // Only initialize once
    if (crossmintInitialized.current || !buttonRef.current) return

    try {
      const crossmint = getCrossmint()
      if (!crossmint) {
        setError("Wallet provider not available")
        return
      }

      crossmint.renderButton(buttonRef.current, {
        authMethods: ["email"],
        onSuccess: async (user: any) => {
          setIsLoading(true)
          playSound("/sounds/button-click.mp3")

          try {
            // Send user data to our API
            const response = await fetch("/api/auth/callback", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ user }),
            })

            if (!response.ok) {
              throw new Error("Failed to authenticate")
            }

            const data = await response.json()

            // Call onSuccess callback if provided
            if (onSuccess) {
              onSuccess(data)
            }
          } catch (error: any) {
            console.error("Authentication error:", error)
            setError(error.message || "Authentication failed")
            if (onError) {
              onError(error)
            }
          } finally {
            setIsLoading(false)
          }
        },
        onError: (error: any) => {
          console.error("Crossmint error:", error)
          setError(error.message || "Wallet connection failed")
          if (onError) {
            onError(error)
          }
        },
      })

      crossmintInitialized.current = true
    } catch (error: any) {
      console.error("Failed to initialize Crossmint:", error)
      setError(error.message || "Failed to initialize wallet provider")
    }
  }, [onSuccess, onError, playSound])

  return (
    <div className="w-full">
      {error ? (
        <div className="w-full p-4 bg-red-900/20 border border-red-700 rounded-md text-center">
          <p className="text-red-400 mb-2">{error}</p>
          <button
            className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-md"
            onClick={() => setError(null)}
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          <div
            ref={buttonRef}
            id="crossmint-button"
            className="w-full"
            onClick={() => !isLoading && playSound("/sounds/button-click.mp3")}
          />
          {isLoading && (
            <div className="mt-4 text-center">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent"></div>
              <p className="mt-2 text-sm text-cyan-400">Connecting to your wallet...</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

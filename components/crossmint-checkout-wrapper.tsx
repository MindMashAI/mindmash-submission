"use client"

import { useState, useEffect } from "react"
import { RefreshCw } from "lucide-react"

interface CrossmintCheckoutWrapperProps {
  collectionId: string
  environment: "staging" | "production"
  clientId: string
  mintConfig: {
    quantity: number
    totalPrice: string
  }
  payment: {
    fiat: { enabled: boolean }
    crypto: { enabled: boolean }
  }
  recipient: string
  onEvent: (event: any) => void
  uiConfig: {
    colors: {
      background: string
      surface: string
      textPrimary: string
      textSecondary: string
      accent: string
    }
  }
}

export default function CrossmintCheckoutWrapper(props: CrossmintCheckoutWrapperProps) {
  const [CrossmintComponent, setCrossmintComponent] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCrossmintComponent = async () => {
      try {
        setLoading(true)
        // Dynamically import the component
        const { CrossmintEmbeddedCheckout } = await import("@crossmint/client-sdk-react-ui")
        setCrossmintComponent(() => CrossmintEmbeddedCheckout)
        setError(null)
      } catch (err: any) {
        console.error("Failed to load Crossmint component:", err)
        setError(err.message || "Failed to load checkout component")
      } finally {
        setLoading(false)
      }
    }

    loadCrossmintComponent()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-black/60 border border-gray-800 rounded-md">
        <RefreshCw className="h-8 w-8 text-cyan-400 animate-spin mb-4" />
        <p className="text-gray-300">Loading checkout...</p>
      </div>
    )
  }

  if (error || !CrossmintComponent) {
    return (
      <div className="p-6 bg-black/60 border border-gray-800 rounded-md">
        <h3 className="text-red-400 font-medium mb-2">Checkout Unavailable</h3>
        <p className="text-gray-300 text-sm mb-4">
          The checkout component couldn't be loaded. Please try again later or contact support.
        </p>
        <div className="text-xs text-gray-500">{error}</div>
      </div>
    )
  }

  return <CrossmintComponent {...props} />
}

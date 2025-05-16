class MockCrossmintProvider {
  renderButton(element: HTMLElement | string, options: any) {
    if (typeof element === "string") {
      const el = document.getElementById(element)
      if (el) this.createMockButton(el, options)
    } else {
      this.createMockButton(element, options)
    }
  }

  private createMockButton(element: HTMLElement, options: any) {
    // Clear any existing content
    element.innerHTML = ""

    // Create a styled button that mimics Crossmint
    const button = document.createElement("button")
    button.innerText = "Sign in with Email (Mock)"
    button.className =
      "w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md transition-colors"

    // Add click handler that simulates successful login
    button.onclick = () => {
      if (options.onSuccess) {
        // Simulate a delay
        setTimeout(() => {
          options.onSuccess({
            email: "demo@mindmash.ai",
            wallet: {
              publicKey: "8ZaDMEy1MrBNxTW3TxNQgJgxKkfYbNHPJbHX4AYMKq9V",
              blockchain: "solana",
            },
            id: "user_" + Math.random().toString(36).substring(2, 11),
          })
        }, 1500)
      }
    }

    element.appendChild(button)
  }
}

// Only initialize on the client side
let crossmintInstance: any = null

export function getCrossmint() {
  if (typeof window === "undefined") return null

  if (!crossmintInstance) {
    try {
      // Try to use the real SDK if available
      const CrossmintEmbeddedWalletProvider = require("@crossmint/client-sdk").CrossmintEmbeddedWalletProvider
      crossmintInstance = new CrossmintEmbeddedWalletProvider({
        environment: "production",
        clientId: process.env.NEXT_PUBLIC_CROSSMINT_PROJECT_ID!,
        blockchain: "solana",
      })
    } catch (error) {
      console.warn("Crossmint SDK not available, using mock implementation")
      // Use mock implementation if SDK is not available
      crossmintInstance = new MockCrossmintProvider()
    }
  }

  return crossmintInstance
}

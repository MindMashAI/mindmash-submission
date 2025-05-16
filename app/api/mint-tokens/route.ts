import { NextResponse } from "next/server"

// Temp embedding for testing
const CROSSMINT_API_KEY = process.env.CROSSMINT_API_KEY

export async function POST(request: Request) {
  try {
    const { recipient, mintAmount } = await request.json()

    if (!recipient) {
      return NextResponse.json({ error: "Recipient is required" }, { status: 400 })
    }

    // Format recipient based on whether it's an email or wallet address
    const formattedRecipient = recipient.includes("@") ? `email:${recipient}:solana` : `wallet:${recipient}:solana`

    console.log("Making API call to Crossmint with recipient:", formattedRecipient)

    // Make the API call to Crossmint
    const response = await fetch(
      "https://staging.crossmint.com/api/2022-06-09/collections/bb74a5fe-efe4-4906-b44a-0b08b2796ef5/nfts",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": CROSSMINT_API_KEY,
        },
        body: JSON.stringify({
          recipient: formattedRecipient,
          metadata: {
            name: `Mash.BiT Token #${Math.floor(Math.random() * 1000000)}`,
            description: `Mash.BiT Token - ${mintAmount} tokens`,
            image:
              "https://jade-late-crow-559.mypinata.cloud/ipfs/bafybeia5skhvck24266qahayvxuhc5k3ez27xnmscrlwfjnwloeal5rdam",
            attributes: [
              { trait_type: "Amount", value: mintAmount.toString() },
              { trait_type: "Type", value: "Mash.BiT Token" },
            ],
          },
          quantity: 1, // Set to 1 for testing
        }),
      },
    )

    // Log the response status for debugging
    console.log("Crossmint API response status:", response.status)

    // Handle API response
    if (!response.ok) {
      const errorData = await response.json()
      console.error("Crossmint API error:", errorData)
      return NextResponse.json({ error: errorData.message || "Minting failed" }, { status: response.status })
    }

    const result = await response.json()
    console.log("Crossmint API success:", result)
    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Server error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}

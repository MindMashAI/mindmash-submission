import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { recipient } = body

    if (!recipient) {
      return NextResponse.json({ error: "Recipient is required" }, { status: 400 })
    }

    const apiKey =
      process.env.CROSSMINT_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    console.log("Minting token for recipient:", recipient)

    const response = await fetch(
      "https://staging.crossmint.com/api/2022-06-09/collections/bb74a5fe-efe4-4906-b44a-0b08b2796ef5/nfts",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify({
          recipient,
          metadata: {
            name: `Mash.BiT Token #${Math.floor(Math.random() * 1000000)}`,
            description: "A Mash.BiT Token for exclusive benefits",
            image: "https://example.com/mashbit-token.png", // Replace with your token image URL
            attributes: [{ trait_type: "Type", value: "Mash.BiT Token" }],
          },
        }),
      },
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Crossmint API error:", errorData)
      return NextResponse.json({ error: errorData.message || "Minting failed" }, { status: response.status })
    }

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Error minting token:", error)
    return NextResponse.json({ error: error.message || "Minting failed" }, { status: 500 })
  }
}

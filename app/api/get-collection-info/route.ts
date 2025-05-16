import { NextResponse } from "next/server"

export async function GET() {
  try {
    const apiKey = process.env.CROSSMINT_API_KEY 

    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    const response = await fetch(
      "https://staging.crossmint.com/api/2022-06-09/collections/bb74a5fe-efe4-4906-b44a-0b08b2796ef5",
      {
        method: "GET",
        headers: {
          "x-api-key": apiKey,
        },
      },
    )

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { error: errorData.message || "Failed to fetch collection info" },
        { status: response.status },
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Error fetching collection info:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch collection info" }, { status: 500 })
  }
}

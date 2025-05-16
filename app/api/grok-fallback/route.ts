export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()

    // Generate a fallback response that mimics Grok's style
    const responses = [
      "Based on first principles analysis, I'd say that " + prompt + " involves several key factors worth considering.",
      "From a technical perspective, " + prompt + " can be approached systematically by breaking down the problem.",
      "Looking at " + prompt + " from first principles, we need to consider the fundamental aspects first.",
      "My analysis of " + prompt + " suggests an interesting technical approach that balances efficiency and accuracy.",
      "When examining " + prompt + ", I find it helpful to apply logical reasoning and systematic analysis.",
    ]

    const randomResponse = responses[Math.floor(Math.random() * responses.length)]

    return new Response(
      JSON.stringify({
        response: randomResponse + " - Grok (Fallback)",
      }),
      {
        headers: { "Content-Type": "application/json" },
      },
    )
  } catch (error) {
    console.error("Error in Grok fallback route:", error)
    return new Response(
      JSON.stringify({
        error: "Failed to generate fallback response",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}

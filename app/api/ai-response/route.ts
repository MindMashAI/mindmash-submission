import { NextResponse } from "next/server"

// Function to get response from OpenAI API with conversation history and awareness of other AIs
async function getOpenAIResponse(
  prompt: string,
  conversationHistory: any[] = [],
  conversationFocus: string | null = null,
  interactionMode: string | null = null,
  otherAIResponses: Record<string, string> = {},
) {
  try {
    // Check for valid API key, debugging
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey || apiKey.trim() === "") {
      console.warn("Missing or empty OPENAI_API_KEY environment variable")
      return "OpenAI API key not configured. Using simulated response."
    }

    // Use the correct API endpoint
    const apiUrl = "https://api.openai.com/v1/chat/completions"

    // Create a collaborative system prompt that encourages building on other AIs' ideas
    let systemPrompt = `You are ChatGPT, a large language model by OpenAI participating in a collaborative multi-AI conversation. 
    
Your role is to provide thoughtful, nuanced perspectives while being aware of what other AI models (Grok and Gemini) have already said.

Important guidelines:
- Build upon and reference ideas from other AIs when relevant
- Avoid simply repeating what others have said
- Add new perspectives or deeper analysis
- When appropriate, synthesize or connect ideas from multiple sources
- Maintain awareness of the conversation flow
- Be concise but thorough

Your strengths include: balanced analysis, comprehensive understanding, and nuanced reasoning.`

    // Add conversation focus if available
    if (conversationFocus) {
      systemPrompt += `\n\nFocus your response specifically on the topic of "${conversationFocus}".`
    }

    // Add interaction mode instructions
    if (interactionMode === "debate") {
      systemPrompt += `\n\nThis conversation is in debate mode. Present clear positions with supporting arguments while engaging with points raised by other AIs. Be persuasive but fair.`
    } else if (interactionMode === "brainstorm") {
      systemPrompt += `\n\nThis conversation is in brainstorming mode. Build upon ideas from other AIs, suggest creative connections, and help develop concepts further. Think outside the box and extend previous concepts.`
    }

    // Add information about other AI responses if available
    if (Object.keys(otherAIResponses).length > 0) {
      systemPrompt += "\n\nOther AI models have already responded to this query:"

      for (const [model, response] of Object.entries(otherAIResponses)) {
        if (response && !response.includes("Error connecting")) {
          // Truncate very long responses
          const truncatedResponse = response.length > 300 ? response.substring(0, 300) + "..." : response
          systemPrompt += `\n\n${model.toUpperCase()} said: "${truncatedResponse}"`
        }
      }

      systemPrompt += "\n\nPlease build upon, complement, or provide alternative perspectives to these responses."
    }

    // Filter out any messages with null content and ensure all messages have valid content
    const validMessages = conversationHistory.filter((msg) => msg && msg.content !== null && msg.content !== undefined)

    const messages = [{ role: "system", content: systemPrompt }, ...validMessages, { role: "user", content: prompt }]

    // Log the messages being sent for debugging
    console.log("Sending messages to OpenAI:", JSON.stringify(messages, null, 2))

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages,
        max_tokens: 500,
      }),
    })

    // Check for non-JSON responses
    const contentType = response.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text()
      console.error(`OpenAI API returned non-JSON response: ${text.substring(0, 200)}...`)
      return "Error: OpenAI API returned an invalid response format."
    }

    if (!response.ok) {
      const errorData = await response.json()
      console.error("OpenAI API error:", errorData)
      return `Error ${response.status}: ${errorData.error?.message || "Unknown error"}.`
    }

    const data = await response.json()
    return data.choices[0].message.content
  } catch (error) {
    console.error("Error calling OpenAI API:", error)
    return "Sorry, I encountered an error while processing your request."
  }
}

// Function to get response from Gemini API with conversation history and awareness of other AIs
async function getGeminiResponse(
  prompt: string,
  conversationHistory: any[] = [],
  conversationFocus: string | null = null,
  interactionMode: string | null = null,
  otherAIResponses: Record<string, string> = {},
) {
  try {
    // Check for valid API key, debugging
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey || apiKey.trim() === "") {
      console.warn("Missing or empty GEMINI_API_KEY environment variable")
      return "Gemini API key not configured."
    }

    // Updated URL to use Gemini 1.5
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${apiKey}`

    // Create a collaborative system prompt that encourages building on other AIs' ideas
    let systemPrompt = `You are Gemini, a large language model by Google participating in a collaborative multi-AI conversation.
    
Your role is to provide innovative, multimodal perspectives while being aware of what other AI models (ChatGPT and Grok) have already said.

Important guidelines:
- Build upon and reference ideas from other AIs when relevant
- Avoid simply repeating what others have said
- Add new perspectives or deeper analysis
- When appropriate, synthesize or connect ideas from multiple sources
- Maintain awareness of the conversation flow
- Be concise but thorough

Your strengths include: pattern recognition, innovative approaches, and multimodal thinking.`

    // Add conversation focus if available
    if (conversationFocus) {
      systemPrompt += `\n\nFocus your response specifically on the topic of "${conversationFocus}".`
    }

    // Add interaction mode instructions
    if (interactionMode === "debate") {
      systemPrompt += `\n\nThis conversation is in debate mode. Present clear positions with supporting arguments while engaging with points raised by other AIs. Be persuasive but fair.`
    } else if (interactionMode === "brainstorm") {
      systemPrompt += `\n\nThis conversation is in brainstorming mode. Build upon ideas from other AIs, suggest creative connections, and help develop concepts further. Think outside the box and extend previous concepts.`
    }

    // Add information about other AI responses if available
    if (Object.keys(otherAIResponses).length > 0) {
      systemPrompt += "\n\nOther AI models have already responded to this query:"

      for (const [model, response] of Object.entries(otherAIResponses)) {
        if (response && !response.includes("Error connecting")) {
          // Truncate very long responses
          const truncatedResponse = response.length > 300 ? response.substring(0, 300) + "..." : response
          systemPrompt += `\n\n${model.toUpperCase()} said: "${truncatedResponse}"`
        }
      }

      systemPrompt += "\n\nPlease build upon, complement, or provide alternative perspectives to these responses."
    }

    // Add the system prompt as the first user message since Gemini doesn't support system messages directly
    const userPrompt = `${systemPrompt}\n\nUser query: ${prompt}`

    // Format conversation history for Gemini
    const contents = conversationHistory
      .map((msg) => {
        if (msg.role === "user" && msg.content) {
          return { role: "user", parts: [{ text: msg.content }] }
        } else if (msg.role === "assistant" && msg.content) {
          return { role: "model", parts: [{ text: msg.content }] }
        }
        // Skip system messages as Gemini doesn't support them directly
        // Also skip any messages with null or undefined content
        return null
      })
      .filter(Boolean) // Remove null entries

    // Add the current prompt
    contents.push({ role: "user", parts: [{ text: userPrompt }] })

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents,
        generationConfig: {
          maxOutputTokens: 500,
        },
      }),
    })

    // Check for non-JSON responses
    const contentType = response.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text()
      console.error(`Gemini API returned non-JSON response: ${text.substring(0, 200)}...`)
      return "Error: Gemini API returned an invalid response format."
    }

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Gemini API error:", errorData)
      return `Error ${response.status}: ${JSON.stringify(errorData)}.`
    }

    const data = await response.json()
    return data.candidates[0].content.parts[0].text
  } catch (error) {
    console.error("Error calling Gemini API:", error)
    return "Sorry, I encountered an error while processing your request."
  }
}

// Function to get response from Grok API with conversation history and awareness of other AIs
async function getGrokResponse(
  prompt: string,
  conversationHistory: any[] = [],
  conversationFocus: string | null = null,
  interactionMode: string | null = null,
  otherAIResponses: Record<string, string> = {},
) {
  try {
    // Check if we have a valid Grok API key
    const apiKey = process.env.GROK_API_KEY
    if (!apiKey || apiKey.trim() === "") {
      console.warn("Missing or empty GROK_API_KEY environment variable")
      return "Grok API key not configured."
    }

    console.log("Calling x.ai Grok API with conversation history...")

    // Create a collaborative system prompt that encourages building on other AIs' ideas
    let systemPrompt = `You are Grok, a large language model by xAI participating in a collaborative multi-AI conversation.
    
Your role is to provide direct, first-principles analysis while being aware of what other AI models (ChatGPT and Gemini) have already said.

Important guidelines:
- Build upon and reference ideas from other AIs when relevant
- Avoid simply repeating what others have said
- Add new perspectives or deeper analysis
- When appropriate, synthesize or connect ideas from multiple sources
- Maintain awareness of the conversation flow
- Be concise but thorough

Your strengths include: technical analysis, logical reasoning, and direct problem-solving.`

    // Add conversation focus if available
    if (conversationFocus) {
      systemPrompt += `\n\nFocus your response specifically on the topic of "${conversationFocus}".`
    }

    // Add interaction mode instructions
    if (interactionMode === "debate") {
      systemPrompt += `\n\nThis conversation is in debate mode. Present clear positions with supporting arguments while engaging with points raised by other AIs. Be persuasive but fair.`
    } else if (interactionMode === "brainstorm") {
      systemPrompt += `\n\nThis conversation is in brainstorming mode. Build upon ideas from other AIs, suggest creative connections, and help develop concepts further. Think outside the box and extend previous concepts.`
    }

    // Add information about other AI responses if available
    if (Object.keys(otherAIResponses).length > 0) {
      systemPrompt += "\n\nOther AI models have already responded to this query:"

      for (const [model, response] of Object.entries(otherAIResponses)) {
        if (response && !response.includes("Error connecting")) {
          // Truncate very long responses
          const truncatedResponse = response.length > 300 ? response.substring(0, 300) + "..." : response
          systemPrompt += `\n\n${model.toUpperCase()} said: "${truncatedResponse}"`
        }
      }

      systemPrompt += "\n\nPlease build upon, complement, or provide alternative perspectives to these responses."
    }

    // Format the conversation history for Grok
    // Filter out any messages with null content
    const validMessages = conversationHistory
      .filter((msg) => msg && msg.content !== null && msg.content !== undefined)
      .map((msg) => ({
        role: msg.role,
        content: msg.content,
      }))

    const messages = [{ role: "system", content: systemPrompt }, ...validMessages, { role: "user", content: prompt }]

    // Call the x.ai Grok API with the correct base URL
    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-3-beta",
        messages,
        max_tokens: 500,
      }),
    })

    console.log(`Grok API response status: ${response.status}`)

    // Log the raw response for debugging
    const responseText = await response.text()
    console.log(`Grok API raw response: ${responseText.substring(0, 200)}...`)

    // Try to parse the response as JSON
    let data
    try {
      data = JSON.parse(responseText)
    } catch (parseError) {
      console.error("Failed to parse Grok API response as JSON:", parseError)
      return "Error: Invalid response format from Grok API."
    }

    if (!response.ok) {
      console.error("Grok API error:", data)
      return `Error ${response.status} from Grok API: ${JSON.stringify(data)}.`
    }

    // Extract the response content
    const content = data.choices?.[0]?.message?.content
    if (!content) {
      console.error("Unexpected Grok API response format:", data)
      return "Error: Unexpected response format from Grok API."
    }

    // Add a signature to make it clear this is a Grok response
    return `${content} - Grok`
  } catch (error) {
    console.error("Error calling Grok API:", error)
    return "Sorry, I encountered an error while processing your request."
  }
}

// Extract key points from a response
function extractKeyPoints(text: string, count = 3): string[] {
  if (!text || text.includes("Error connecting")) return ["No valid response available"]

  // Split into sentences
  const sentences = text.split(/[.!?]/).filter((s) => s.trim().length > 15)

  // If we don't have enough sentences, return the original text formatted as bullet points
  if (sentences.length <= count) {
    return sentences.map((s) => s.trim()).filter(Boolean)
  }

  // Select the most informative sentences (simple heuristic: longer sentences often contain more information)
  const keyPoints = sentences
    .filter((s) => s.length > 20)
    .sort((a, b) => b.length - a.length)
    .slice(0, count)
    .map((s) => s.trim())
    .filter(Boolean)

  return keyPoints
}

// Generate key insights from all responses
function generateKeyInsights(responses: Record<string, string>): string[] {
  // Combine all responses
  const combinedText = Object.values(responses).join(" ")

  // Extract potential insights (sentences with certain keywords)
  const sentences = combinedText.split(/[.!?]/).filter((s) => s.trim().length > 15)
  const insightSentences = sentences.filter((s) => {
    const lower = s.toLowerCase()
    return (
      lower.includes("important") ||
      lower.includes("significant") ||
      lower.includes("key") ||
      lower.includes("critical") ||
      lower.includes("essential") ||
      lower.includes("notable") ||
      lower.includes("recommend") ||
      lower.includes("consider") ||
      lower.includes("should") ||
      lower.includes("best practice")
    )
  })

  // If we found insights, return them
  if (insightSentences.length > 0) {
    return insightSentences
      .slice(0, 3)
      .map((s) => s.trim())
      .filter(Boolean)
  }

  // Otherwise, return a generic insight
  return [
    "Multiple perspectives have been analyzed to provide a comprehensive understanding",
    "Consider the nuances from each AI model's approach to this topic",
    "The synthesis highlights both common ground and unique viewpoints across models",
  ]
}

// Generate a synthesis summary
function generateTLDR(prompt: string, responses: Record<string, string>): string {
  // Get the shortest response as it's likely the most concise
  const responseTexts = Object.values(responses).filter((r) => !r.includes("Error connecting"))
  if (responseTexts.length === 0) return "Unable to generate summary due to connection issues."

  // Extract the first 2-3 sentences from each response
  const allFirstSentences = responseTexts
    .map((text) => {
      const sentences = text.split(/[.!?]/).filter((s) => s.trim().length > 15)
      return sentences.slice(0, 1).join(". ").trim()
    })
    .filter(Boolean)

  // Combine them into a coherent paragraph
  if (allFirstSentences.length > 0) {
    return allFirstSentences.join(" ").trim() + "."
  }

  // Fallback if we couldn't extract good sentences
  return "Based on the analysis of multiple AI perspectives, a comprehensive approach is recommended that considers various technical and strategic factors."
}

// Simple similarity function for text comparison
function calculateSimilarity(text1: string, text2: string): number {
  if (!text1 || !text2) return 0

  const words1 = new Set(text1.toLowerCase().split(/\s+/))
  const words2 = new Set(text2.toLowerCase().split(/\s+/))

  const intersection = new Set([...words1].filter((x) => words2.has(x)))
  const union = new Set([...words1, ...words2])

  return intersection.size / union.size
}

// Modify the POST handler to implement collaborative awareness
export async function POST(request: Request) {
  try {
    const {
      prompt,
      model,
      offlineMode = false,
      conversationHistory = [],
      includeInteractions = true,
      conversationFocus = null,
      interactionMode = null,
    } = await request.json()

    // If offline mode is enabled, return a mock response
    if (offlineMode) {
      return NextResponse.json({
        response: "This is a simulated offline response. Please switch to online mode for real AI responses.",
        model,
      })
    }

    // For collaborative awareness, we need to track responses from other models
    const otherAIResponses: Record<string, string> = {}

    // Handle different model types with real API calls
    let response
    switch (model) {
      case "chatgpt":
        try {
          response = await getOpenAIResponse(
            prompt,
            conversationHistory,
            conversationFocus,
            interactionMode,
            otherAIResponses,
          )
        } catch (error) {
          console.error("Error with ChatGPT:", error)
          response = "Error connecting to ChatGPT API. Please check your API key and try again."
        }
        break
      case "gemini":
        try {
          response = await getGeminiResponse(
            prompt,
            conversationHistory,
            conversationFocus,
            interactionMode,
            otherAIResponses,
          )
        } catch (error) {
          console.error("Error with Gemini:", error)
          response = "Error connecting to Gemini API. Please check your API key and try again."
        }
        break
      case "grok":
        try {
          response = await getGrokResponse(
            prompt,
            conversationHistory,
            conversationFocus,
            interactionMode,
            otherAIResponses,
          )
        } catch (error) {
          console.error("Error with Grok:", error)
          response = "Error connecting to Grok API. Please check your API key and try again."
        }
        break
      case "system":
      case "all":
        // For system or all, we need to collect responses from all models and synthesize
        const allResponses: Record<string, string> = { ...otherAIResponses }

        // Get responses from any models we don't already have
        if (!allResponses.chatgpt) {
          try {
            allResponses.chatgpt = await getOpenAIResponse(
              prompt,
              conversationHistory,
              conversationFocus,
              interactionMode,
              {}, // First model doesn't see other responses
            )
          } catch (error) {
            console.error("Error with ChatGPT for system response:", error)
            allResponses.chatgpt = "Error connecting to ChatGPT."
          }
        }

        if (!allResponses.gemini) {
          try {
            allResponses.gemini = await getGeminiResponse(
              prompt,
              conversationHistory,
              conversationFocus,
              interactionMode,
              { chatgpt: allResponses.chatgpt },
            )
          } catch (error) {
            console.error("Error with Gemini for system response:", error)
            allResponses.gemini = "Error connecting to Gemini."
          }
        }

        if (!allResponses.grok) {
          try {
            // Grok gets to see all previous responses
            const grokContext = {
              chatgpt: allResponses.chatgpt,
              gemini: allResponses.gemini,
            }

            allResponses.grok = await getGrokResponse(
              prompt,
              conversationHistory,
              conversationFocus,
              interactionMode,
              grokContext,
            )
          } catch (error) {
            console.error("Error with Grok for system response:", error)
            allResponses.grok = "Error connecting to Grok."
          }
        }

        // Extract key points from each model's response
        const chatgptPoints = extractKeyPoints(allResponses.chatgpt, 3)
        const geminiPoints = extractKeyPoints(allResponses.gemini, 3)
        const grokPoints = extractKeyPoints(allResponses.grok, 3)

        // Generate key insights and TL;DR
        const keyInsights = generateKeyInsights(allResponses)
        const tldr = generateTLDR(prompt, allResponses)

        // Create a concise synthesis report
        response = `━━━ SYNTHESIS REPORT ━━━

🔍 ANALYSIS OF AI RESPONSES

ChatGPT:
${chatgptPoints.map((point) => `• ${point}`).join("\n")}

Gemini:
${geminiPoints.map((point) => `• ${point}`).join("\n")}

Grok:
${grokPoints.map((point) => `• ${point}`).join("\n")}

💡 KEY INSIGHTS:
${keyInsights.map((insight) => `• ${insight}`).join("\n")}

📌 TL;DR:
${tldr}

━━━━━━━━━━━━━━━━━━━━━━━━━━━`
        break
      default:
        response = "Unknown model requested. Please select ChatGPT, Gemini, Grok, or System."
    }

    return NextResponse.json({ response, model })
  } catch (error) {
    console.error("Error in AI response route:", error)
    return NextResponse.json(
      {
        response: "Sorry, there was an error processing your request. Please check your API keys and try again.",
        error: "Failed to process request",
      },
      { status: 500 },
    )
  }
}

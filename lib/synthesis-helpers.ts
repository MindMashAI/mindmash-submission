// Types for structured synthesis
export interface KeyPoint {
  text: string
  source: string
  confidence: number
  type: "factual" | "analytical" | "speculative" | "recommendation"
}

export interface SynthesisResult {
  keyPoints: KeyPoint[]
  contradictions: {
    topic: string
    positions: {
      model: string
      stance: string
    }[]
  }[]
  consensus: string[]
  actionItems: string[]
}

// Extract structured key points from responses
export function extractStructuredKeyPoints(responses: Record<string, string>): KeyPoint[] {
  const keyPoints: KeyPoint[] = []

  Object.entries(responses).forEach(([model, response]) => {
    if (!response || response.includes("Error connecting")) return

    // Split into sentences
    const sentences = response
      .split(/[.!?]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 15)

    // Classify sentences
    sentences.forEach((sentence) => {
      const lower = sentence.toLowerCase()

      // Determine type
      let type: KeyPoint["type"] = "analytical"

      if (lower.includes("recommend") || lower.includes("should") || lower.includes("consider")) {
        type = "recommendation"
      } else if (lower.includes("might") || lower.includes("could") || lower.includes("possibly")) {
        type = "speculative"
      } else if (lower.includes("is") || lower.includes("are") || lower.includes("was") || lower.includes("were")) {
        type = "factual"
      }

      // Estimate confidence
      let confidence = 0.7 // Default

      if (lower.includes("definitely") || lower.includes("certainly") || lower.includes("always")) {
        confidence = 0.9
      } else if (lower.includes("likely") || lower.includes("probably")) {
        confidence = 0.7
      } else if (lower.includes("might") || lower.includes("perhaps") || lower.includes("possibly")) {
        confidence = 0.5
      }

      // Add to key points if it's substantial
      if (sentence.length > 30) {
        keyPoints.push({
          text: sentence,
          source: model,
          confidence,
          type,
        })
      }
    })
  })

  // Sort by confidence and remove duplicates
  return keyPoints
    .sort((a, b) => b.confidence - a.confidence)
    .filter((point, index, self) => index === self.findIndex((p) => calculateSimilarity(p.text, point.text) > 0.7))
}

// Identify contradictions between models
export function identifyContradictions(keyPoints: KeyPoint[]): SynthesisResult["contradictions"] {
  const contradictions: SynthesisResult["contradictions"] = []

  // Group points by similar topics
  const topics: Record<string, KeyPoint[]> = {}

  keyPoints.forEach((point) => {
    // Extract topic keywords (simplified)
    const keywords = point.text
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 4)

    const topicKey = keywords.slice(0, 3).join("-")

    if (!topics[topicKey]) {
      topics[topicKey] = []
    }

    topics[topicKey].push(point)
  })

  // Look for contradictions within each topic
  Object.entries(topics).forEach(([topic, points]) => {
    if (points.length < 2) return

    // Check if points from different models contradict each other
    const contradictionFound = points.some((p1) =>
      points.some(
        (p2) =>
          p1.source !== p2.source &&
          ((p1.text.includes("is") && p2.text.includes("is not")) ||
            (p1.text.includes("should") && p2.text.includes("should not")) ||
            (p1.text.includes("can") && p2.text.includes("cannot"))),
      ),
    )

    if (contradictionFound) {
      contradictions.push({
        topic: points[0].text.substring(0, 50) + "...",
        positions: points.map((p) => ({
          model: p.source,
          stance: p.text,
        })),
      })
    }
  })

  return contradictions
}

// Find consensus points across models
export function findConsensus(keyPoints: KeyPoint[], responses: Record<string, string>): string[] {
  const modelCount = Object.keys(responses).length

  // Group similar points
  const pointClusters: KeyPoint[][] = []

  keyPoints.forEach((point) => {
    const existingCluster = pointClusters.find((cluster) =>
      cluster.some((p) => calculateSimilarity(p.text, point.text) > 0.6),
    )

    if (existingCluster) {
      existingCluster.push(point)
    } else {
      pointClusters.push([point])
    }
  })

  // Find clusters with points from multiple models
  return pointClusters
    .filter((cluster) => {
      const uniqueModels = new Set(cluster.map((p) => p.source))
      return uniqueModels.size > 1 && uniqueModels.size >= modelCount / 2
    })
    .map((cluster) => {
      // Use the highest confidence point as the representative
      const bestPoint = cluster.sort((a, b) => b.confidence - a.confidence)[0]
      return bestPoint.text
    })
}

// Extract actionable items
export function extractActionItems(responses: Record<string, string>): string[] {
  const actionItems: string[] = []

  Object.values(responses).forEach((response) => {
    if (!response || response.includes("Error connecting")) return

    // Look for sentences that suggest actions
    const sentences = response
      .split(/[.!?]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 15)

    sentences.forEach((sentence) => {
      const lower = sentence.toLowerCase()

      if (
        (lower.startsWith("use ") ||
          lower.startsWith("try ") ||
          lower.startsWith("consider ") ||
          lower.startsWith("implement ") ||
          lower.includes("should ") ||
          lower.includes("need to ") ||
          lower.includes("important to ")) &&
        !actionItems.some((item) => calculateSimilarity(item, sentence) > 0.6)
      ) {
        actionItems.push(sentence)
      }
    })
  })

  return actionItems.slice(0, 5) // Limit to top 5
}

// Generate a complete synthesis
export function generateEnhancedSynthesis(prompt: string, responses: Record<string, string>): string {
  const keyPoints = extractStructuredKeyPoints(responses)
  const contradictions = identifyContradictions(keyPoints)
  const consensus = findConsensus(keyPoints, responses)
  const actionItems = extractActionItems(responses)

  // Format the synthesis report
  let report = `━━━ ENHANCED SYNTHESIS REPORT ━━━\n\n`

  // Model perspectives
  report += `🔍 MODEL PERSPECTIVES\n\n`

  Object.entries(responses).forEach(([model, response]) => {
    if (!response || response.includes("Error connecting")) {
      report += `${model.toUpperCase()}:\n• No valid response available\n\n`
      return
    }

    const modelPoints = keyPoints
      .filter((p) => p.source === model)
      .slice(0, 3)
      .map((p) => `• ${p.text}`)

    report += `${model.toUpperCase()}:\n${modelPoints.join("\n")}\n\n`
  })

  // Consensus view
  if (consensus.length > 0) {
    report += `💡 CONSENSUS VIEW\n\n`
    consensus.forEach((point) => {
      report += `• ${point}\n`
    })
    report += `\n`
  }

  // Contradictions
  if (contradictions.length > 0) {
    report += `⚠️ DIFFERING PERSPECTIVES\n\n`
    contradictions.forEach((contradiction) => {
      report += `On "${contradiction.topic}":\n`
      contradiction.positions.forEach((position) => {
        report += `• ${position.model}: ${position.stance}\n`
      })
      report += `\n`
    })
  }

  // Action items
  if (actionItems.length > 0) {
    report += `📋 RECOMMENDED ACTIONS\n\n`
    actionItems.forEach((item) => {
      report += `• ${item}\n`
    })
    report += `\n`
  }

  // Final synthesis
  report += `📌 SYNTHESIS\n\n`

  // Create a coherent paragraph from consensus and high-confidence points
  const synthesisPoints = [
    ...consensus,
    ...keyPoints
      .filter((p) => p.confidence > 0.7 && p.type !== "speculative")
      .slice(0, 3)
      .map((p) => p.text),
  ]

  if (synthesisPoints.length > 0) {
    report += synthesisPoints.join(" ")
  } else {
    report += `Based on the analysis of multiple AI perspectives, a comprehensive approach is recommended that considers various technical and strategic factors.`
  }

  report += `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━`

  return report
}

// Helper function to calculate text similarity
function calculateSimilarity(text1: string, text2: string): number {
  const words1 = new Set(text1.toLowerCase().split(/\s+/))
  const words2 = new Set(text2.toLowerCase().split(/\s+/))

  const intersection = new Set([...words1].filter((x) => words2.has(x)))
  const union = new Set([...words1, ...words2])

  return intersection.size / union.size
}

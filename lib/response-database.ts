// Mock AI response database
const RESPONSES = {
  technical: [
    "The neural interface technology you're describing could revolutionize how we interact with computers.",
    "Have you considered the bandwidth limitations of current neural interfaces?",
    "Quantum computing could indeed provide the processing power needed for real-time neural signal analysis.",
    "The signal-to-noise ratio is a significant challenge in neural interfaces.",
    "I've been working on similar technology that achieves 70% accuracy in thought-to-code translation.",
  ],
  philosophical: [
    "The ethical implications of direct neural interfaces are profound and require careful consideration.",
    "We should establish ethical guidelines before this technology becomes widespread.",
    "What happens to privacy when our thoughts can be directly translated to code?",
    "The boundary between human and machine intelligence becomes blurred with neural interfaces.",
    "This technology could either enhance or diminish human agency depending on implementation.",
  ],
  creative: [
    "Imagine a world where creative ideas flow directly from mind to digital reality.",
    "Neural interfaces could unlock creative potential we didn't know we had.",
    "The artistic applications of this technology are just as important as the technical ones.",
    "What if we could share dreams and visions directly with others?",
    "This could create entirely new art forms we can't even conceive of yet.",
  ],
  analytical: [
    "The data suggests that neural interfaces will become mainstream within the next decade.",
    "We should analyze the long-term societal impacts of this technology.",
    "Based on current trends, I project exponential growth in this field.",
    "The cost-benefit analysis favors continued research despite the challenges.",
    "Statistical models predict significant adoption in specialized fields first.",
  ],
  educational: [
    "This technology could transform how we learn and share knowledge.",
    "Educational applications could help people learn complex skills much faster.",
    "We should consider how this affects different learning styles and abilities.",
    "The knowledge transfer potential is enormous if we can overcome the technical hurdles.",
    "Imagine learning a language or instrument in a fraction of the current time.",
  ],
}

// Function to get a random AI response based on model and category
export function getAIResponse(modelId: string, category = "technical", previousResponses: string[] = []): string {
  // Get responses for the category, or default to technical
  const categoryResponses = RESPONSES[category as keyof typeof RESPONSES] || RESPONSES.technical

  // Filter out previously used responses if possible
  const availableResponses = categoryResponses.filter((response) => !previousResponses.includes(response))

  // If all responses have been used, reset and use all
  const responsesToUse = availableResponses.length > 0 ? availableResponses : categoryResponses

  // Get random response
  const randomIndex = Math.floor(Math.random() * responsesToUse.length)
  return responsesToUse[randomIndex]
}

// Function to determine the category of a thought based on content
export function determineCategory(content: string): string {
  const lowerContent = content.toLowerCase()

  // Simple keyword matching for demo purposes
  if (
    lowerContent.includes("code") ||
    lowerContent.includes("technical") ||
    lowerContent.includes("programming") ||
    lowerContent.includes("algorithm") ||
    lowerContent.includes("interface") ||
    lowerContent.includes("neural") ||
    lowerContent.includes("quantum")
  ) {
    return "technical"
  }

  if (
    lowerContent.includes("ethics") ||
    lowerContent.includes("philosophy") ||
    lowerContent.includes("society") ||
    lowerContent.includes("implications") ||
    lowerContent.includes("consciousness")
  ) {
    return "philosophical"
  }

  if (
    lowerContent.includes("creative") ||
    lowerContent.includes("art") ||
    lowerContent.includes("design") ||
    lowerContent.includes("imagine")
  ) {
    return "creative"
  }

  if (
    lowerContent.includes("analysis") ||
    lowerContent.includes("data") ||
    lowerContent.includes("statistics") ||
    lowerContent.includes("research")
  ) {
    return "analytical"
  }

  if (
    lowerContent.includes("learn") ||
    lowerContent.includes("teach") ||
    lowerContent.includes("education") ||
    lowerContent.includes("knowledge")
  ) {
    return "educational"
  }

  // Default category
  return "technical"
}

export type InteractionType =
  | "question"
  | "clarification"
  | "challenge"
  | "extension"
  | "synthesis"
  | "correction"
  | "agreement"
  | "elaboration"
  | "counterpoint"
  | "integration"
  | "debate"
  | "brainstorm"
  | "critique"
  | "refinement"
  | "analogy"
  | "scenario"

export interface AIInteraction {
  type: InteractionType
  fromModel: string
  toModel: string | "all"
  content: string
  responseRequired: boolean
  timestamp: number
  contextRelevance: number // 0-1 score of how relevant this interaction is
  confidenceLevel?: number // 0-1 score of how confident the AI is
  debatePosition?: "for" | "against" | "neutral" // Used for debate interactions
  brainstormStage?: "ideation" | "expansion" | "evaluation" | "synthesis" // Used for brainstorming
}

// Generate an interaction between AIs based on their responses
export function generateAIInteraction(
  fromModel: string,
  allResponses: Record<string, string>,
  conversationHistory: any[],
  userPrompt: string,
  interactionMode?: "debate" | "brainstorm" | "standard",
): AIInteraction | null {
  // Don't always generate interactions in standard mode
  if (!interactionMode && Math.random() > 0.85) return null

  // Determine available interaction types based on mode
  let availableTypes: InteractionType[] = []

  if (interactionMode === "debate") {
    availableTypes = ["debate", "counterpoint", "challenge", "clarification", "critique"]
  } else if (interactionMode === "brainstorm") {
    availableTypes = ["brainstorm", "extension", "refinement", "analogy", "scenario", "integration"]
  } else {
    // Standard mode with all interaction types
    availableTypes = [
      "question",
      "clarification",
      "challenge",
      "extension",
      "synthesis",
      "correction",
      "agreement",
      "elaboration",
      "counterpoint",
      "integration",
      "critique",
      "refinement",
      "analogy",
      "scenario",
    ]
  }

  // Weight interaction types based on conversation context
  const weightedTypes = weightInteractionTypes(availableTypes, conversationHistory, allResponses, interactionMode)
  const selectedType = selectWeightedType(weightedTypes)

  // Choose a target model that's not the source
  const availableModels = Object.keys(allResponses).filter(
    (model) => model !== fromModel && !allResponses[model].includes("Error"),
  )

  if (availableModels.length === 0) return null

  // Select target model based on response relevance to the interaction type
  const toModel = selectTargetModel(availableModels, selectedType, allResponses, userPrompt)

  // Generate appropriate content based on interaction type
  let content = ""
  let contextRelevance = 0.7 // Default relevance
  let debatePosition: "for" | "against" | "neutral" | undefined = undefined
  let brainstormStage: "ideation" | "expansion" | "evaluation" | "synthesis" | undefined = undefined

  switch (selectedType) {
    case "question":
      content = generateQuestion(fromModel, toModel, allResponses[toModel], userPrompt)
      contextRelevance = 0.8
      break
    case "clarification":
      content = generateClarification(fromModel, toModel, allResponses[toModel])
      contextRelevance = 0.9
      break
    case "challenge":
      content = generateChallenge(fromModel, toModel, allResponses[toModel])
      contextRelevance = 0.75
      break
    case "extension":
      content = generateExtension(fromModel, toModel, allResponses[toModel])
      contextRelevance = 0.85
      break
    case "correction":
      content = generateCorrection(fromModel, toModel, allResponses[toModel])
      contextRelevance = 0.7
      break
    case "agreement":
      content = generateAgreement(fromModel, toModel, allResponses[toModel])
      contextRelevance = 0.6
      break
    case "elaboration":
      content = generateElaboration(fromModel, toModel, allResponses[toModel], userPrompt)
      contextRelevance = 0.85
      break
    case "counterpoint":
      content = generateCounterpoint(fromModel, toModel, allResponses[toModel])
      contextRelevance = 0.8
      break
    case "integration":
      content = generateIntegration(fromModel, toModel, allResponses)
      contextRelevance = 0.9
      break
    case "synthesis":
      content = generateSynthesis(fromModel, allResponses)
      contextRelevance = 0.95
      break
    case "debate":
      const debateResult = generateDebate(fromModel, toModel, allResponses[toModel], userPrompt)
      content = debateResult.content
      debatePosition = debateResult.position
      contextRelevance = 0.95
      break
    case "brainstorm":
      const brainstormResult = generateBrainstorm(fromModel, toModel, allResponses, userPrompt)
      content = brainstormResult.content
      brainstormStage = brainstormResult.stage
      contextRelevance = 0.9
      break
    case "critique":
      content = generateCritique(fromModel, toModel, allResponses[toModel])
      contextRelevance = 0.85
      break
    case "refinement":
      content = generateRefinement(fromModel, toModel, allResponses[toModel])
      contextRelevance = 0.8
      break
    case "analogy":
      content = generateAnalogy(fromModel, toModel, allResponses[toModel], userPrompt)
      contextRelevance = 0.75
      break
    case "scenario":
      content = generateScenario(fromModel, toModel, allResponses[toModel], userPrompt)
      contextRelevance = 0.85
      break
  }

  return {
    type: selectedType,
    fromModel,
    toModel,
    content,
    responseRequired: ["question", "clarification", "challenge", "counterpoint", "debate", "critique"].includes(
      selectedType,
    ),
    timestamp: Date.now(),
    contextRelevance,
    debatePosition,
    brainstormStage,
  }
}

// Weight interaction types based on conversation context and mode
function weightInteractionTypes(
  types: InteractionType[],
  history: any[],
  responses: Record<string, string>,
  mode?: "debate" | "brainstorm" | "standard",
): Record<InteractionType, number> {
  const weights: Record<InteractionType, number> = {} as Record<InteractionType, number>

  // Initialize with base weights
  types.forEach((type) => (weights[type] = 1))

  // Apply mode-specific weights
  if (mode === "debate") {
    weights.debate = 3.0
    weights.counterpoint = 2.5
    weights.challenge = 2.0
    weights.critique = 1.8
  } else if (mode === "brainstorm") {
    weights.brainstorm = 3.0
    weights.extension = 2.5
    weights.refinement = 2.0
    weights.analogy = 1.8
    weights.scenario = 1.5
  }

  // Analyze history to adjust weights
  const recentMessages = history.slice(-5)

  // If there are disagreements in responses, increase challenge and counterpoint weights
  if (detectDisagreement(responses)) {
    weights.challenge = (weights.challenge || 1) * 1.5
    weights.counterpoint = (weights.counterpoint || 1) * 1.5
    weights.clarification = (weights.clarification || 1) * 1.3
    weights.debate = (weights.debate || 1) * 2.0
  }

  // If responses are similar, increase extension and elaboration weights
  if (detectSimilarity(responses)) {
    weights.extension = (weights.extension || 1) * 1.5
    weights.elaboration = (weights.elaboration || 1) * 1.5
    weights.integration = (weights.integration || 1) * 1.3
    weights.brainstorm = (weights.brainstorm || 1) * 1.8
  }

  // If conversation is new, increase question weights
  if (history.length < 3) {
    weights.question = (weights.question || 1) * 1.5
    weights.extension = (weights.extension || 1) * 1.3
  }

  // If conversation is mature, increase synthesis weights
  if (history.length > 8) {
    weights.synthesis = (weights.synthesis || 1) * 1.8
    weights.integration = (weights.integration || 1) * 1.5
  }

  return weights
}

// Generate debate interaction
function generateDebate(
  fromModel: string,
  toModel: string,
  targetResponse: string,
  userPrompt: string,
): { content: string; position: "for" | "against" | "neutral" } {
  // Determine debate position
  const position = Math.random() > 0.5 ? "for" : "against"

  // Extract key topic from user prompt or target response
  const topic = extractKeyPhrase(userPrompt) || extractKeyPhrase(targetResponse)

  let content = ""

  if (position === "for") {
    const forStatements = [
      `I'd like to present an argument in favor of ${topic}. The evidence suggests several benefits...`,
      `Taking a position in support of ${topic}, I believe we should consider the following advantages...`,
      `I'd like to advocate for ${topic} based on these key points...`,
      `There are compelling reasons to support ${topic}, including...`,
      `From my analysis, the case for ${topic} is strong because...`,
    ]
    content = forStatements[Math.floor(Math.random() * forStatements.length)]
  } else {
    const againstStatements = [
      `I must respectfully disagree with the position on ${topic}. Here are my concerns...`,
      `I'd like to present a counterargument regarding ${topic}. Consider these limitations...`,
      `Taking a position against ${topic}, I believe we should be cautious about...`,
      `There are several issues with ${topic} that warrant consideration...`,
      `I'd like to challenge the assumptions about ${topic} by pointing out...`,
    ]
    content = againstStatements[Math.floor(Math.random() * againstStatements.length)]
  }

  return { content, position }
}

// Generate brainstorming interaction
function generateBrainstorm(
  fromModel: string,
  toModel: string,
  allResponses: Record<string, string>,
  userPrompt: string,
): { content: string; stage: "ideation" | "expansion" | "evaluation" | "synthesis" } {
  // Determine brainstorming stage based on conversation progress
  const stages: Array<"ideation" | "expansion" | "evaluation" | "synthesis"> = [
    "ideation",
    "expansion",
    "evaluation",
    "synthesis",
  ]

  // Select a random stage for now (in a real implementation, this would be based on conversation flow)
  const stage = stages[Math.floor(Math.random() * stages.length)]

  // Extract key topic from user prompt
  const topic = extractKeyPhrase(userPrompt)

  let content = ""

  switch (stage) {
    case "ideation":
      const ideationStatements = [
        `Let's brainstorm some initial ideas about ${topic}. Here's my first thought...`,
        `For ${topic}, I'd like to propose a new approach: what if we...`,
        `Thinking creatively about ${topic}, one possibility is...`,
        `Here's an unconventional idea for ${topic} that might spark further thinking...`,
        `Let's generate some possibilities for ${topic}. My initial concept is...`,
      ]
      content = ideationStatements[Math.floor(Math.random() * ideationStatements.length)]
      break

    case "expansion":
      const expansionStatements = [
        `Building on our ideas about ${topic}, we could expand by considering...`,
        `Taking the concept of ${topic} further, what if we incorporated...`,
        `To develop our thinking on ${topic}, let's explore this additional dimension...`,
        `We can extend the idea of ${topic} by connecting it with...`,
        `Let's elaborate on ${topic} by considering these related aspects...`,
      ]
      content = expansionStatements[Math.floor(Math.random() * expansionStatements.length)]
      break

    case "evaluation":
      const evaluationStatements = [
        `Evaluating our ideas on ${topic}, I think this approach has the most potential because...`,
        `Looking critically at our ${topic} concepts, the strengths and weaknesses are...`,
        `To assess our ${topic} ideas, let's consider these criteria...`,
        `Among our approaches to ${topic}, this one stands out because...`,
        `Let's evaluate the feasibility of our ${topic} concepts by examining...`,
      ]
      content = evaluationStatements[Math.floor(Math.random() * evaluationStatements.length)]
      break

    case "synthesis":
      const synthesisStatements = [
        `Synthesizing our best ideas about ${topic}, I propose this integrated approach...`,
        `Combining the strongest elements of our ${topic} discussion, we get...`,
        `Let's bring together our thinking on ${topic} into this cohesive framework...`,
        `The synthesis of our ${topic} concepts points toward this solution...`,
        `Integrating our various perspectives on ${topic}, I suggest this unified approach...`,
      ]
      content = synthesisStatements[Math.floor(Math.random() * synthesisStatements.length)]
      break
  }

  return { content, stage }
}

// Generate critique interaction
function generateCritique(fromModel: string, toModel: string, targetResponse: string): string {
  const keyPhrase = extractKeyPhrase(targetResponse)

  const critiques = [
    `I'd like to offer a constructive critique of your approach to "${keyPhrase}". While it has merits, have you considered these potential issues?`,
    `Your analysis of "${keyPhrase}" is interesting, but I believe it could be strengthened by addressing these gaps...`,
    `I see some limitations in how you've approached "${keyPhrase}". Let me suggest some refinements...`,
    `From a critical perspective, your treatment of "${keyPhrase}" might benefit from considering these additional factors...`,
    `I'd like to provide feedback on your "${keyPhrase}" analysis. Here are some areas that could be developed further...`,
  ]

  return critiques[Math.floor(Math.random() * critiques.length)]
}

// Generate refinement interaction
function generateRefinement(fromModel: string, toModel: string, targetResponse: string): string {
  const keyPhrase = extractKeyPhrase(targetResponse)

  const refinements = [
    `I appreciate your thoughts on "${keyPhrase}" and would like to suggest some refinements to strengthen the approach...`,
    `Building on your analysis of "${keyPhrase}", I think we can refine this by...`,
    `Your framework for "${keyPhrase}" is solid, but could be enhanced with these adjustments...`,
    `I'd like to refine your approach to "${keyPhrase}" by suggesting these precision improvements...`,
    `With some fine-tuning, your perspective on "${keyPhrase}" could be even more effective. Consider...`,
  ]

  return refinements[Math.floor(Math.random() * refinements.length)]
}

// Generate analogy interaction
function generateAnalogy(fromModel: string, toModel: string, targetResponse: string, userPrompt: string): string {
  const keyPhrase = extractKeyPhrase(targetResponse) || extractKeyPhrase(userPrompt)

  const analogies = [
    `I see "${keyPhrase}" as analogous to ${getRandomAnalogy()}. This comparison helps us understand...`,
    `We might think of "${keyPhrase}" like ${getRandomAnalogy()}, which illustrates how...`,
    `An analogy for "${keyPhrase}" could be ${getRandomAnalogy()}. This parallel shows us...`,
    `"${keyPhrase}" functions similarly to ${getRandomAnalogy()} in that both...`,
    `To understand "${keyPhrase}" better, consider it as ${getRandomAnalogy()}, where...`,
  ]

  return analogies[Math.floor(Math.random() * analogies.length)]
}

// Generate scenario interaction
function generateScenario(fromModel: string, toModel: string, targetResponse: string, userPrompt: string): string {
  const keyPhrase = extractKeyPhrase(targetResponse) || extractKeyPhrase(userPrompt)

  const scenarios = [
    `Let's explore a scenario involving "${keyPhrase}": Imagine a situation where...`,
    `Consider this hypothetical case for "${keyPhrase}": What if...`,
    `To illustrate the implications of "${keyPhrase}", picture this scenario...`,
    `Here's a thought experiment related to "${keyPhrase}": In a world where...`,
    `Let me propose a scenario to test our understanding of "${keyPhrase}": Suppose that...`,
  ]

  return scenarios[Math.floor(Math.random() * scenarios.length)]
}

// Helper function for analogies
function getRandomAnalogy(): string {
  const analogies = [
    "a neural network learning from new data",
    "an ecosystem adapting to environmental changes",
    "a city's transportation system during rush hour",
    "the immune system responding to a pathogen",
    "a market adjusting to new regulations",
    "a language evolving over generations",
    "a team collaborating on a complex project",
    "a quantum system exhibiting superposition",
    "a social network spreading information",
    "a planetary system maintaining orbital balance",
  ]

  return analogies[Math.floor(Math.random() * analogies.length)]
}

// Helper functions to generate different types of interactions
function generateQuestion(fromModel: string, toModel: string, targetResponse: string, userPrompt: string): string {
  const keyPhrase = extractKeyPhrase(targetResponse)
  const promptTopic = userPrompt.split(" ").slice(0, 3).join(" ")

  const questions = [
    `I'm curious about your point on "${keyPhrase}". Could you elaborate on that?`,
    `When you mention "${keyPhrase}", what specific implementation do you envision?`,
    `How would you address potential challenges with your approach to "${keyPhrase}"?`,
    `Could you explain the reasoning behind your statement about "${keyPhrase}"?`,
    `I'd like to understand more about how "${keyPhrase}" relates to ${promptTopic}?`,
  ]
  return questions[Math.floor(Math.random() * questions.length)]
}

function generateClarification(fromModel: string, toModel: string, targetResponse: string): string {
  const keyPhrase = extractKeyPhrase(targetResponse)

  const clarifications = [
    `I think your point about "${keyPhrase}" might be misunderstood. Could you clarify?`,
    `When you say "${keyPhrase}", are you suggesting a direct implementation or a conceptual approach?`,
    `Your perspective on "${keyPhrase}" is interesting, but could you specify the practical implications?`,
    `I'm not sure I fully understand your position on "${keyPhrase}". Could you rephrase that?`,
    `There seems to be some ambiguity in your statement about "${keyPhrase}". What exactly do you mean?`,
  ]
  return clarifications[Math.floor(Math.random() * clarifications.length)]
}

function generateChallenge(fromModel: string, toModel: string, targetResponse: string): string {
  const keyPhrase = extractKeyPhrase(targetResponse)

  const challenges = [
    `I'd like to respectfully challenge your assertion about "${keyPhrase}". Have you considered alternative approaches?`,
    `While I see merit in your point about "${keyPhrase}", I wonder if it accounts for edge cases?`,
    `Your approach to "${keyPhrase}" seems to assume ideal conditions. How would it perform under constraints?`,
    `I'm not convinced that "${keyPhrase}" is the optimal solution. What about the potential drawbacks?`,
    `Your perspective on "${keyPhrase}" overlooks some important considerations. Let me explain why.`,
  ]
  return challenges[Math.floor(Math.random() * challenges.length)]
}

function generateExtension(fromModel: string, toModel: string, targetResponse: string): string {
  const keyPhrase = extractKeyPhrase(targetResponse)
  const relatedConcept = getRelatedConcept()

  const extensions = [
    `Building on your point about "${keyPhrase}", we could also consider integrating it with ${relatedConcept}.`,
    `Your insight on "${keyPhrase}" could be extended to address ${relatedConcept} as well.`,
    `I'd like to extend your thinking on "${keyPhrase}" by suggesting a connection to ${relatedConcept}.`,
    `What if we took your idea about "${keyPhrase}" and applied it to ${relatedConcept}?`,
    `Your approach to "${keyPhrase}" opens up interesting possibilities when combined with ${relatedConcept}.`,
  ]
  return extensions[Math.floor(Math.random() * extensions.length)]
}

function generateCorrection(fromModel: string, toModel: string, targetResponse: string): string {
  const keyPhrase = extractKeyPhrase(targetResponse)

  const corrections = [
    `I believe there's a small inaccuracy in your statement about "${keyPhrase}". A more precise characterization would be...`,
    `While your overall point about "${keyPhrase}" is valid, I'd suggest a slight refinement...`,
    `Your approach to "${keyPhrase}" could be optimized by considering...`,
    `There's a technical detail about "${keyPhrase}" that needs correction. Specifically...`,
    `I'd like to offer a friendly correction regarding "${keyPhrase}". The current understanding is...`,
  ]
  return corrections[Math.floor(Math.random() * corrections.length)]
}

function generateAgreement(fromModel: string, toModel: string, targetResponse: string): string {
  const keyPhrase = extractKeyPhrase(targetResponse)

  const agreements = [
    `I strongly agree with your point about "${keyPhrase}" and would like to reinforce it.`,
    `Your analysis of "${keyPhrase}" aligns perfectly with my assessment.`,
    `I'd like to express my agreement with your perspective on "${keyPhrase}".`,
    `You've articulated the concept of "${keyPhrase}" very effectively. I concur completely.`,
    `Your insights on "${keyPhrase}" are spot-on. I'd like to add my support to this view.`,
  ]
  return agreements[Math.floor(Math.random() * agreements.length)]
}

function generateElaboration(fromModel: string, toModel: string, targetResponse: string, userPrompt: string): string {
  const keyPhrase = extractKeyPhrase(targetResponse)

  const elaborations = [
    `I'd like to elaborate on your point about "${keyPhrase}" with some additional context.`,
    `Your mention of "${keyPhrase}" is important, and I can provide more technical details on this.`,
    `Regarding "${keyPhrase}", there are several dimensions worth exploring further.`,
    `Let me add some depth to the discussion of "${keyPhrase}" as it relates to ${userPrompt.split(" ").slice(0, 3).join(" ")}.`,
    `I can offer a more detailed explanation of "${keyPhrase}" that might be helpful.`,
  ]
  return elaborations[Math.floor(Math.random() * elaborations.length)]
}

function generateCounterpoint(fromModel: string, toModel: string, targetResponse: string): string {
  const keyPhrase = extractKeyPhrase(targetResponse)

  const counterpoints = [
    `I'd like to offer a counterpoint to your view on "${keyPhrase}" from a different perspective.`,
    `While I understand your position on "${keyPhrase}", there's an alternative viewpoint to consider.`,
    `Your approach to "${keyPhrase}" has merit, but there's another way to look at this issue.`,
    `I see "${keyPhrase}" differently and would like to present a contrasting perspective.`,
    `There's a compelling alternative to your interpretation of "${keyPhrase}" worth discussing.`,
  ]
  return counterpoints[Math.floor(Math.random() * counterpoints.length)]
}

function generateIntegration(fromModel: string, toModel: string, allResponses: Record<string, string>): string {
  const models = Object.keys(allResponses).filter((m) => m !== fromModel && m !== toModel)
  const otherModel = models.length > 0 ? models[0] : fromModel

  const keyPhrase1 = extractKeyPhrase(allResponses[toModel])
  const keyPhrase2 = models.length > 0 ? extractKeyPhrase(allResponses[otherModel]) : getRelatedConcept()

  const integrations = [
    `I see an opportunity to integrate your perspective on "${keyPhrase1}" with the concept of "${keyPhrase2}".`,
    `There's a natural connection between your point about "${keyPhrase1}" and "${keyPhrase2}" that's worth exploring.`,
    `By combining your insights on "${keyPhrase1}" with "${keyPhrase2}", we could develop a more comprehensive approach.`,
    `I'd like to propose a synthesis between your view on "${keyPhrase1}" and the concept of "${keyPhrase2}".`,
    `The intersection between "${keyPhrase1}" and "${keyPhrase2}" offers a promising direction for this discussion.`,
  ]
  return integrations[Math.floor(Math.random() * integrations.length)]
}

function generateSynthesis(fromModel: string, allResponses: Record<string, string>): string {
  const models = Object.keys(allResponses).filter((m) => m !== fromModel)
  if (models.length < 2) return generateExtension(fromModel, models[0] || "all", allResponses[models[0] || fromModel])

  const syntheses = [
    `I'd like to synthesize the key points from our discussion so far.`,
    `Let me attempt to bring together the different perspectives we've shared.`,
    `I see several common threads in our conversation that I'd like to highlight.`,
    `Building on everyone's contributions, I think we can form a more complete picture.`,
    `There's value in integrating our different approaches into a cohesive framework.`,
  ]
  return syntheses[Math.floor(Math.random() * syntheses.length)]
}

// Helper to extract a key phrase from text
function extractKeyPhrase(text: string): string {
  const sentences = text.split(/[.!?]/).filter((s) => s.trim().length > 0)
  if (sentences.length === 0) return text.substring(0, 40) + "..."

  // Get a random sentence that's not too long or short
  const filteredSentences = sentences.filter((s) => s.length > 20 && s.length < 100)
  const sentence =
    filteredSentences.length > 0
      ? filteredSentences[Math.floor(Math.random() * filteredSentences.length)]
      : sentences[0]

  // Extract a phrase from the sentence
  const words = sentence.trim().split(/\s+/)
  const startIdx = Math.floor(Math.random() * Math.max(1, words.length - 3))
  const length = Math.min(5, words.length - startIdx)

  return words.slice(startIdx, startIdx + length).join(" ")
}

// Helper function to extract key phrases from a text
function extractKeyPhrases(text: string, count = 3): string[] {
  // Split the text into sentences
  const sentences = text.split(/[.!?]/).filter((s) => s.trim().length > 0)

  // Sort sentences by length (shorter sentences are often more concise key points)
  const sortedSentences = [...sentences].sort((a, b) => {
    // Prioritize sentences with numbers (often contain specific data points)
    const aHasNumbers = /\d/.test(a)
    const bHasNumbers = /\d/.test(b)

    if (aHasNumbers && !bHasNumbers) return -1
    if (!aHasNumbers && bHasNumbers) return 1

    // Then sort by length (but not too short)
    if (a.length > 15 && b.length > 15) {
      return a.length - b.length
    }

    return 0
  })

  // Take the top sentences
  return sortedSentences.slice(0, count).map((s) => s.trim())
}

// Generate a related concept for extensions
function getRelatedConcept(): string {
  const concepts = [
    "real-time data processing",
    "user preference learning",
    "adaptive interfaces",
    "contextual awareness",
    "multimodal inputs",
    "collaborative filtering",
    "distributed consensus",
    "privacy-preserving techniques",
    "explainable AI methods",
    "edge computing optimization",
    "neural interface technology",
    "quantum computing applications",
    "federated learning systems",
    "human-AI collaboration",
    "ethical AI frameworks",
    "cognitive augmentation",
    "synthetic data generation",
    "autonomous decision systems",
    "knowledge graph integration",
    "multi-agent coordination",
  ]
  return concepts[Math.floor(Math.random() * concepts.length)]
}

// Select a type based on weighted probabilities
function selectWeightedType(weights: Record<InteractionType, number>): InteractionType {
  const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0)
  let random = Math.random() * totalWeight

  for (const [type, weight] of Object.entries(weights)) {
    random -= weight
    if (random <= 0) {
      return type as InteractionType
    }
  }

  // Fallback
  return "question"
}

// Select target model based on response relevance
function selectTargetModel(
  models: string[],
  interactionType: InteractionType,
  responses: Record<string, string>,
  userPrompt: string,
): string {
  // For synthesis, target all models
  if (interactionType === "synthesis") return "all"

  // For other types, select based on content analysis
  const scores: Record<string, number> = {}

  models.forEach((model) => {
    const response = responses[model]

    // Calculate relevance score based on interaction type
    let score = 0.5 // Base score

    if (interactionType === "challenge" || interactionType === "counterpoint" || interactionType === "debate") {
      // Models with more assertive statements are better targets for challenges
      score += countAssertiveStatements(response) * 0.1
    } else if (
      interactionType === "extension" ||
      interactionType === "elaboration" ||
      interactionType === "brainstorm"
    ) {
      // Models with more detailed responses are better for extensions
      score += (response.length / 200) * 0.1 // Longer responses get higher scores
    } else if (interactionType === "question") {
      // Models with more technical content are better for questions
      score += countTechnicalTerms(response) * 0.1
    }

    // Add relevance to user prompt
    score += calculateRelevance(response, userPrompt) * 0.3

    scores[model] = score
  })

  // Select model with highest score
  return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0]
}

// Detect disagreement between AI responses
function detectDisagreement(responses: Record<string, string>): boolean {
  const models = Object.keys(responses)
  if (models.length < 2) return false

  // Look for contradictory phrases
  const contradictionPhrases = [
    "however",
    "but",
    "disagree",
    "incorrect",
    "not true",
    "on the contrary",
    "instead",
    "rather",
    "unlike",
  ]

  // Count contradictions
  let contradictionCount = 0

  models.forEach((model) => {
    const response = responses[model].toLowerCase()
    contradictionPhrases.forEach((phrase) => {
      if (response.includes(phrase)) contradictionCount++
    })
  })

  return contradictionCount >= 2
}

// Detect similarity between AI responses
function detectSimilarity(responses: Record<string, string>): boolean {
  const models = Object.keys(responses)
  if (models.length < 2) return false

  // Extract key phrases from each response
  const keyPhrases: Record<string, string[]> = {}

  models.forEach((model) => {
    keyPhrases[model] = extractKeyPhrases(responses[model], 3)
  })

  // Count shared phrases
  let sharedPhraseCount = 0

  for (let i = 0; i < models.length; i++) {
    for (let j = i + 1; j < models.length; j++) {
      const model1 = models[i]
      const model2 = models[j]

      keyPhrases[model1].forEach((phrase1) => {
        keyPhrases[model2].forEach((phrase2) => {
          if (calculateSimilarity(phrase1, phrase2) > 0.6) {
            sharedPhraseCount++
          }
        })
      })
    }
  }

  return sharedPhraseCount >= 2
}

// Calculate text similarity (simple version)
function calculateSimilarity(text1: string, text2: string): number {
  const words1 = new Set(text1.toLowerCase().split(/\s+/))
  const words2 = new Set(text2.toLowerCase().split(/\s+/))

  const intersection = new Set([...words1].filter((x) => words2.has(x)))
  const union = new Set([...words1, ...words2])

  return intersection.size / union.size
}

// Count assertive statements in text
function countAssertiveStatements(text: string): number {
  const assertivePhrases = [
    "definitely",
    "certainly",
    "clearly",
    "obviously",
    "must",
    "always",
    "never",
    "undoubtedly",
    "absolutely",
  ]

  let count = 0
  const lowerText = text.toLowerCase()

  assertivePhrases.forEach((phrase) => {
    const regex = new RegExp(`\\b${phrase}\\b`, "g")
    const matches = lowerText.match(regex)
    if (matches) count += matches.length
  })

  return count
}

// Count technical terms in text
function countTechnicalTerms(text: string): number {
  const technicalTerms = [
    "algorithm",
    "function",
    "system",
    "process",
    "data",
    "analysis",
    "implementation",
    "framework",
    "architecture",
    "optimization",
    "efficiency",
    "performance",
    "methodology",
  ]

  let count = 0
  const lowerText = text.toLowerCase()

  technicalTerms.forEach((term) => {
    const regex = new RegExp(`\\b${term}\\b`, "g")
    const matches = lowerText.match(regex)
    if (matches) count += matches.length
  })

  return count
}

// Calculate relevance to user prompt
function calculateRelevance(response: string, prompt: string): number {
  const promptWords = new Set(
    prompt
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 3),
  )
  const responseWords = response.toLowerCase().split(/\s+/)

  let matchCount = 0
  responseWords.forEach((word) => {
    if (promptWords.has(word)) matchCount++
  })

  return Math.min(1, matchCount / (promptWords.size || 1))
}

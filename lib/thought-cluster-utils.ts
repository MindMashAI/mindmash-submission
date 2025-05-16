// utilities for detecting and forming thought clusters

import type { ThoughtNode, ThoughtCluster } from "@/types/types"

const SIMILARITY_THRESHOLD = 0.65
const MIN_CLUSTER_SIZE = 3
const MAX_CLUSTER_SIZE = 50
const TRENDING_THRESHOLD = 0.75 // Threshold for trending clusters


// export function generateThoughtClusters(thoughts: ThoughtNode[]): ThoughtCluster[] {
//   const clusters: ThoughtCluster[] = []
//   const processedThoughts = new Set<string>()

//   // Helper function to find all connected thoughts recursively
//   const findConnectedThoughts = (thoughtId: string, connectedIds: Set<string>) => {
//     const thought = thoughts.find((t) => t.id === thoughtId)
//     if (!thought || processedThoughts.has(thoughtId)) return

//     connectedIds.add(thoughtId)
//     processedThoughts.add(thoughtId)

//     // Add all connections
//     thought.connections.forEach((connId) => {
//       if (!connectedIds.has(connId)) {
//         findConnectedThoughts(connId, connectedIds)
//       }
//     })
//   }

//   // Process all thoughts
//   for (const thought of thoughts) {
//     if (processedThoughts.has(thought.id)) continue

//     const connectedIds = new Set<string>()
//     findConnectedThoughts(thought.id, connectedIds)

//     // If we have enough connected thoughts, form a cluster
//     if (connectedIds.size >= MIN_CLUSTER_SIZE) {
//       // Extract common topics/tags from the thoughts
//       const connectedThoughts = Array.from(connectedIds)
//         .map((id) => thoughts.find((t) => t.id === id))
//         .filter(Boolean) as ThoughtNode[]

//       // Extract topics from content
//       const topics = new Set<string>()
//       connectedThoughts.forEach((t) => {
//         const matches = t.content.match(/#(\w+)/g)
//         if (matches) {
//           matches.forEach((match) => topics.add(match))
//         }
//       })

//       // Determine the most common category
//       const categories = connectedThoughts.map((t) => t.category).filter(Boolean) as string[]
//       const categoryCounts = categories.reduce(
//         (acc, cat) => {
//           acc[cat] = (acc[cat] || 0) + 1
//           return acc
//         },
//         {} as Record<string, number>,
//       )

//       const primaryCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "general"

//       // Create the cluster
//       clusters.push({
//         id: `cluster-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
//         name: `${primaryCategory.charAt(0).toUpperCase() + primaryCategory.slice(1)} Cluster`,
//         posts: Array.from(connectedIds),
//         tags: Array.from(topics),
//         trendingScore: connectedIds.size * 5,
//       })
//     }
//   }

//   return clusters
// }

export function generateThoughtClusters(thoughts: ThoughtNode[]): ThoughtCluster[] {
  // Group thoughts by clusterId
  const clusterMap = new Map<string, ThoughtNode[]>()

  thoughts.forEach((thought) => {
    if (thought.clusterId) {
      if (!clusterMap.has(thought.clusterId)) {
        clusterMap.set(thought.clusterId, [])
      }
      clusterMap.get(thought.clusterId)?.push(thought)
    }
  })

  // Convert map to array of clusters
  const clusters: ThoughtCluster[] = []

  clusterMap.forEach((clusterThoughts, clusterId) => {
    // Extract common topics from thoughts
    const topics = new Set<string>()
    clusterThoughts.forEach((thought) => {
      const extractedTopics = extractTopics(thought.content)
      extractedTopics.forEach((topic) => topics.add(topic))
    })

    // Create cluster
    clusters.push({
      id: clusterId,
      name: `Cluster ${clusterId.replace("cluster", "")}`,
      posts: clusterThoughts.map((t) => t.id),
      tags: Array.from(topics).map((t) => `#${t}`),
      trendingScore: calculateTrendingScore(clusterThoughts),
    })
  })

  return clusters
}

function extractTopics(content: string): string[] {
  // Extract hashtags from content
  const hashtagRegex = /#(\w+)/g
  const matches = content.match(hashtagRegex)

  if (matches) {
    return matches.map((match) => match.substring(1))
  }

  return []
}

function calculateTrendingScore(thoughts: ThoughtNode[]): number {
  // Simple algorithm: sum of likes + number of comments + recency factor
  let score = 0

  thoughts.forEach((thought) => {
    // Add likes
    score += thought.likes || 0

    // Add comment count
    score += thought.commentIds?.length || 0

    // Add recency factor (more recent = higher score)
    const timeAgo = getMinutesAgo(thought.timestamp)
    if (timeAgo < 60) {
      // Less than an hour
      score += 10
    } else if (timeAgo < 1440) {
      // Less than a day
      score += 5
    } else {
      score += 1
    }
  })

  return score
}

function getMinutesAgo(timestamp: string): number {
  // Parse timestamps like "2 hours ago", "45 minutes ago", etc.
  const timeRegex = /(\d+)\s+(minute|hour|day|week|month|year)s?\s+ago/i
  const match = timestamp.match(timeRegex)

  if (!match) return 1000000 // Default to a large number if format doesn't match

  const value = Number.parseInt(match[1])
  const unit = match[2].toLowerCase()

  switch (unit) {
    case "minute":
      return value
    case "hour":
      return value * 60
    case "day":
      return value * 60 * 24
    case "week":
      return value * 60 * 24 * 7
    case "month":
      return value * 60 * 24 * 30
    case "year":
      return value * 60 * 24 * 365
    default:
      return value
  }
}

// Calculate similarity between two thoughts based on content, tags, and context
export function calculateSimilarity(thought1: any, thought2: any): number {
  // Content similarity (50% weight)
  const contentSimilarity = calculateTextSimilarity(thought1.content, thought2.content) * 0.5

  // Tag similarity (30% weight)
  const tagSimilarity = calculateTagSimilarity(thought1.tags || [], thought2.tags || []) * 0.3

  // Context similarity (20% weight)
  const contextSimilarity = calculateContextSimilarity(thought1, thought2) * 0.2

  return contentSimilarity + tagSimilarity + contextSimilarity
}

// Calculate text similarity using TF-IDF like approach
function calculateTextSimilarity(text1: string, text2: string): number {
  if (!text1 || !text2) return 0

  // Normalize and tokenize texts
  const tokens1 = normalizeAndTokenize(text1)
  const tokens2 = normalizeAndTokenize(text2)

  // Calculate Jaccard similarity
  const intersection = new Set([...tokens1].filter((x) => tokens2.has(x)))
  const union = new Set([...tokens1, ...tokens2])

  return intersection.size / union.size
}

// Normalize and tokenize text
function normalizeAndTokenize(text: string): Set<string> {
  // Convert to lowercase and remove punctuation
  const normalized = text.toLowerCase().replace(/[^\w\s]/g, "")

  // Split into tokens and filter out common stop words
  const tokens = normalized.split(/\s+/).filter((token) => token.length > 2 && !STOP_WORDS.includes(token))

  return new Set(tokens)
}

// Calculate similarity between tag arrays
function calculateTagSimilarity(tags1: string[], tags2: string[]): number {
  if (!tags1.length || !tags2.length) return 0

  const set1 = new Set(tags1)
  const set2 = new Set(tags2)

  const intersection = new Set([...set1].filter((x) => set2.has(x)))
  const union = new Set([...set1, ...set2])

  return intersection.size / union.size
}

// Calculate similarity based on context (author, timestamp, references)
function calculateContextSimilarity(thought1: any, thought2: any): number {
  let similarity = 0

  // Same author increases similarity
  if (thought1.author?.id === thought2.author?.id) {
    similarity += 0.3
  }

  // Temporal proximity (thoughts created close in time)
  const time1 = thought1.timestamp ? new Date(thought1.timestamp).getTime() : Date.now()
  const time2 = thought2.timestamp ? new Date(thought2.timestamp).getTime() : Date.now()
  const timeDiff = Math.abs(time1 - time2)
  const dayInMs = 24 * 60 * 60 * 1000
  if (timeDiff < dayInMs) {
    similarity += 0.4 * (1 - timeDiff / dayInMs) // Higher similarity for closer timestamps
  }

  // Reference similarity
  if (thought1.connections && thought2.connections) {
    const refs1 = new Set(thought1.connections)
    const refs2 = new Set(thought2.connections)

    const intersection = new Set([...refs1].filter((x) => refs2.has(x)))
    if (intersection.size > 0) {
      similarity += 0.3 * (intersection.size / Math.max(refs1.size, refs2.size))
    }
  }

  return Math.min(similarity, 1.0) // Cap at 1.0
}

// Form clusters from a set of thoughts
export function formThoughtClusters(thoughts: any[]): any[] {
  // Initialize each thought as its own cluster
  let clusters: any[] = thoughts.map((thought) => ({
    id: `cluster-${generateUniqueId()}`,
    thoughts: [thought],
    centroid: thought,
    tags: thought.tags || [],
    title: generateClusterTitle([thought]),
    metrics: initializeClusterMetrics(),
  }))

  let mergeOccurred = true

  // Iteratively merge clusters until no more merges occur
  while (mergeOccurred && clusters.length > 1) {
    mergeOccurred = false

    for (let i = 0; i < clusters.length; i++) {
      for (let j = i + 1; j < clusters.length; j++) {
        const similarity = calculateClusterSimilarity(clusters[i], clusters[j])

        if (similarity >= SIMILARITY_THRESHOLD) {
          // Merge clusters j into i
          clusters[i] = mergeClusters(clusters[i], clusters[j])
          clusters.splice(j, 1) // Remove cluster j
          mergeOccurred = true
          break
        }
      }

      if (mergeOccurred) break
    }
  }

  // Filter out clusters that are too small
  clusters = clusters.filter((cluster) => cluster.thoughts.length >= MIN_CLUSTER_SIZE)

  // Calculate metrics for each cluster
  clusters.forEach((cluster) => {
    cluster.metrics = calculateClusterMetrics(cluster)
  })

  // Sort clusters by importance score
  return clusters.sort((a, b) => b.metrics.importanceScore - a.metrics.importanceScore)
}

// Calculate similarity between two clusters
function calculateClusterSimilarity(cluster1: any, cluster2: any): number {
  let totalSimilarity = 0
  let comparisonCount = 0

  // Compare centroids first for efficiency
  const centroidSimilarity = calculateSimilarity(cluster1.centroid, cluster2.centroid)
  if (centroidSimilarity < SIMILARITY_THRESHOLD * 0.8) {
    return centroidSimilarity // Early exit if centroids are very dissimilar
  }

  // Sample thoughts from each cluster for comparison
  const sample1 = sampleThoughts(cluster1.thoughts, 5)
  const sample2 = sampleThoughts(cluster2.thoughts, 5)

  for (const thought1 of sample1) {
    for (const thought2 of sample2) {
      totalSimilarity += calculateSimilarity(thought1, thought2)
      comparisonCount++
    }
  }

  return comparisonCount > 0 ? totalSimilarity / comparisonCount : 0
}

// Sample a subset of thoughts from a cluster
function sampleThoughts(thoughts: any[], sampleSize: number): any[] {
  if (thoughts.length <= sampleSize) return thoughts

  const result: any[] = []
  const indices = new Set<number>()

  while (indices.size < sampleSize) {
    const index = Math.floor(Math.random() * thoughts.length)
    if (!indices.has(index)) {
      indices.add(index)
      result.push(thoughts[index])
    }
  }

  return result
}

// Merge two clusters into one
function mergeClusters(cluster1: any, cluster2: any): any {
  const mergedThoughts = [...cluster1.thoughts, ...cluster2.thoughts]

  // Ensure we don't exceed max cluster size
  const thoughts = mergedThoughts.length > MAX_CLUSTER_SIZE ? mergedThoughts.slice(0, MAX_CLUSTER_SIZE) : mergedThoughts

  // Merge tags and remove duplicates
  const tags = Array.from(new Set([...cluster1.tags, ...cluster2.tags]))

  // Calculate new centroid
  const centroid = calculateClusterCentroid(thoughts)

  return {
    id: cluster1.id, // Keep the ID of the first cluster
    thoughts,
    centroid,
    tags,
    title: generateClusterTitle(thoughts),
    metrics: calculateClusterMetrics({ thoughts, tags } as any),
  }
}

// Calculate the centroid of a cluster (the most representative thought)
function calculateClusterCentroid(thoughts: any[]): any {
  if (thoughts.length === 1) return thoughts[0]

  // Calculate similarity scores for each thought against all others
  const similarityScores = thoughts.map((thought1) => {
    let score = 0
    thoughts.forEach((thought2) => {
      if (thought1 !== thought2) {
        score += calculateSimilarity(thought1, thought2)
      }
    })
    return { thought: thought1, score }
  })

  // Return the thought with the highest similarity score (most central)
  return similarityScores.sort((a, b) => b.score - a.score)[0].thought
}

// Generate a title for a cluster based on its thoughts
function generateClusterTitle(thoughts: any[]): string {
  if (thoughts.length === 0) return "Empty Cluster"
  if (thoughts.length === 1) return truncateTitle(thoughts[0].content)

  // Find common tags
  const tagCounts: Record<string, number> = {}
  thoughts.forEach((thought) => {
    ;(thought.tags || []).forEach((tag: string) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    })
  })

  // Sort tags by frequency
  const sortedTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .map((entry) => entry[0])

  if (sortedTags.length > 0) {
    // Use the most common tag as the title base
    return `${sortedTags[0].charAt(0).toUpperCase() + sortedTags[0].slice(1)} Cluster`
  }

  // Fall back to using the centroid's content
  const centroid = calculateClusterCentroid(thoughts)
  return truncateTitle(centroid.content)
}

// Truncate a title to a reasonable length
function truncateTitle(text: string): string {
  const maxLength = 40
  if (text.length <= maxLength) return text

  // Try to truncate at a word boundary
  const truncated = text.substring(0, maxLength)
  const lastSpace = truncated.lastIndexOf(" ")

  if (lastSpace > maxLength * 0.7) {
    return truncated.substring(0, lastSpace) + "..."
  }

  return truncated + "..."
}

// Initialize cluster metrics
function initializeClusterMetrics(): any {
  return {
    engagementScore: 0,
    growthRate: 0,
    sentimentScore: 0,
    diversityScore: 0,
    recencyScore: 0,
    importanceScore: 0,
    isTrending: false,
  }
}

// Calculate metrics for a cluster
function calculateClusterMetrics(cluster: any): any {
  const { thoughts } = cluster

  // Calculate engagement score (likes, comments, shares)
  const engagementScore =
    thoughts.reduce((sum: number, thought: any) => {
      const likes = thought.metrics?.likes || thought.likes || 0
      const comments = thought.metrics?.comments || thought.commentIds?.length || 0
      const shares = thought.metrics?.shares || 0
      return sum + likes + comments * 2 + shares * 3 // Weight comments and shares more
    }, 0) / thoughts.length

  // Calculate growth rate (new thoughts in the last 24 hours)
  const now = new Date()
  const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  const recentThoughts = thoughts.filter((thought: any) => {
    const timestamp = thought.timestamp || ""
    return timestamp.includes("Just now") || timestamp.includes("minute") || timestamp.includes("hour")
  })
  const growthRate = recentThoughts.length / thoughts.length

  // Calculate sentiment score (-1 to 1)
  const sentimentScore =
    thoughts.reduce((sum: number, thought: any) => {
      // Convert sentiment string to number
      let sentimentValue = 0
      if (thought.sentiment === "positive") sentimentValue = 1
      else if (thought.sentiment === "negative") sentimentValue = -1
      return sum + sentimentValue
    }, 0) / thoughts.length

  // Calculate diversity score (unique authors / total thoughts)
  const uniqueAuthors = new Set(thoughts.map((thought: any) => thought.author?.id || thought.author)).size
  const diversityScore = uniqueAuthors / thoughts.length

  // Calculate recency score (how recent are the thoughts)
  const recencyScore = recentThoughts.length > 0 ? 0.8 : 0.2

  // Calculate overall importance score
  const importanceScore =
    engagementScore * 0.3 +
    growthRate * 0.25 +
    Math.abs(sentimentScore) * 0.15 +
    diversityScore * 0.15 +
    recencyScore * 0.15

  // Determine if the cluster is trending
  const isTrending = growthRate > 0.3 && engagementScore > 10 && thoughts.length >= 5

  return {
    engagementScore,
    growthRate,
    sentimentScore,
    diversityScore,
    recencyScore,
    importanceScore,
    isTrending,
  }
}

// Detect trending topics from clusters
export function detectTrendingTopics(clusters: any[]): any[] {
  return clusters.filter(
    (cluster) =>
      cluster.metrics.isTrending || (cluster.metrics.growthRate > 0.4 && cluster.metrics.engagementScore > 15),
  )
}

// Find related clusters based on similarity
export function findRelatedClusters(targetCluster: any, allClusters: any[]): any[] {
  const relatedClusters = allClusters
    .filter((cluster) => cluster.id !== targetCluster.id)
    .map((cluster) => ({
      cluster,
      similarity: calculateClusterSimilarity(targetCluster, cluster),
    }))
    .filter((item) => item.similarity > SIMILARITY_THRESHOLD * 0.7)
    .sort((a, b) => b.similarity - a.similarity)
    .map((item) => item.cluster)

  return relatedClusters.slice(0, 5) // Return top 5 related clusters
}

// Generate a unique ID
function generateUniqueId(): string {
  return Math.random().toString(36).substring(2, 15)
}

// Common English stop words to filter out
const STOP_WORDS = [
  "a",
  "an",
  "the",
  "and",
  "or",
  "but",
  "if",
  "because",
  "as",
  "what",
  "which",
  "this",
  "that",
  "these",
  "those",
  "then",
  "just",
  "so",
  "than",
  "such",
  "when",
  "who",
  "how",
  "where",
  "why",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "have",
  "has",
  "had",
  "having",
  "do",
  "does",
  "did",
  "doing",
  "to",
  "from",
  "by",
  "for",
  "with",
  "about",
  "against",
  "between",
  "into",
  "through",
  "during",
  "before",
  "after",
  "above",
  "below",
  "up",
  "down",
  "in",
  "out",
  "on",
  "off",
  "over",
  "under",
  "again",
  "further",
  "then",
  "once",
  "here",
  "there",
  "all",
  "any",
  "both",
  "each",
  "few",
  "more",
  "most",
  "other",
  "some",
  "such",
  "no",
  "nor",
  "not",
  "only",
  "own",
  "same",
  "so",
  "than",
  "too",
  "very",
  "can",
  "will",
  "just",
  "should",
  "now",
  "of",
  "at",
  "my",
  "your",
  "their",
]

// Analyze sentiment of text
export function analyzeSentiment(text: string): string {
  // Simple sentiment analysis based on positive and negative word lists
  const positiveWords = [
    "good",
    "great",
    "excellent",
    "amazing",
    "wonderful",
    "fantastic",
    "brilliant",
    "outstanding",
    "superb",
    "terrific",
    "awesome",
    "love",
    "happy",
    "joy",
    "excited",
    "positive",
    "beautiful",
    "best",
    "better",
    "success",
    "successful",
    "win",
    "winning",
    "improve",
    "improved",
  ]

  const negativeWords = [
    "bad",
    "terrible",
    "awful",
    "horrible",
    "poor",
    "disappointing",
    "worst",
    "failure",
    "fail",
    "failed",
    "hate",
    "sad",
    "unhappy",
    "angry",
    "negative",
    "ugly",
    "worse",
    "worst",
    "problem",
    "issue",
    "difficult",
    "hard",
    "wrong",
    "error",
    "mistake",
    "broken",
  ]

  const words = text.toLowerCase().split(/\W+/)
  let positiveCount = 0
  let negativeCount = 0

  words.forEach((word) => {
    if (positiveWords.includes(word)) positiveCount++
    if (negativeWords.includes(word)) negativeCount++
  })

  const totalWords = words.length
  const positiveScore = positiveCount / totalWords
  const negativeScore = negativeCount / totalWords

  // Calculate sentiment score between -1 and 1
  const sentimentScore = positiveScore - negativeScore

  // Determine sentiment category
  let sentiment: string
  if (sentimentScore > 0.1) {
    sentiment = "positive"
  } else if (sentimentScore < -0.1) {
    sentiment = "negative"
  } else {
    sentiment = "neutral"
  }

  return sentiment
}

// Extract keywords from text
export function extractKeywords(text: string, maxKeywords = 5): string[] {
  // Normalize and tokenize
  const tokens = normalizeAndTokenize(text)

  // Count word frequencies
  const wordCounts: Record<string, number> = {}
  tokens.forEach((token) => {
    wordCounts[token] = (wordCounts[token] || 0) + 1
  })

  // Sort by frequency
  const sortedWords = Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .map((entry) => entry[0])

  return sortedWords.slice(0, maxKeywords)
}

// Semantic search through thoughts
export function semanticSearch(query: string, thoughts: any[]): any[] {
  const queryTokens = normalizeAndTokenize(query)

  // Calculate relevance score for each thought
  const scoredThoughts = thoughts.map((thought) => {
    const contentTokens = normalizeAndTokenize(thought.content)

    // Calculate token overlap
    const intersection = new Set([...queryTokens].filter((x) => contentTokens.has(x)))
    const overlapScore = intersection.size / queryTokens.size

    // Check tag match
    const tagMatchScore = thought.tags
      ? thought.tags.some((tag: string) => query.toLowerCase().includes(tag.toLowerCase()))
        ? 0.5
        : 0
      : 0

    // Calculate final score
    const score = overlapScore + tagMatchScore

    return { thought, score }
  })

  // Sort by relevance score and return top results
  return scoredThoughts
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.thought)
}

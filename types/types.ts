export interface AICompletionSuggestion {
  id: string
  model: string
  content: string
  confidence: number
}

export interface ThoughtNode {
  id: string
  content: string
  author: {
    id: string
    name: string
    avatar: string
    type: "human" | "ai"
    model?: string
  }
  timestamp: string
  connections: string[]
  position: { x: number; y: number }
  sentiment?: "positive" | "neutral" | "negative"
  category?: string
  likes: number
  expansions: ThoughtExpansion[]
  isExpanded: boolean
  commentIds?: string[] // IDs of comments linked to this thought
  clusterId?: string // ID of the cluster this thought belongs to
  isComment?: boolean // Flag to identify if this is a comment
  parentId?: string // ID of the parent thought if this is a comment
  visualStyle?: {
    color?: string
    shape?: "circle" | "square" | "hexagon"
    size?: number
    glow?: boolean
    pulseEffect?: boolean
  }
  userId?: string
  userName?: string
  userAvatar?: string
  isVerified?: boolean
  isLiked?: boolean
}

export interface ThoughtCluster {
  id: string
  name: string
  posts: string[]
  tags: string[]
  trendingScore: number
}

export interface User {
  id: string
  username: string
  name: string
  avatar: string
  bio: string
  syndicates: Array<{ id: string; name: string; joinedAt: string }>
}

export interface Post {
  id: string
  author: {
    id: string
    name: string
    avatar: string
  }
  content: string
  timestamp: string
  likes: number
  comments: number
  reposts: number
  isLiked: boolean
  isReposted: boolean
  isBookmarked: boolean
  syndicate?: string
}

export interface ThoughtExpansion {
  id: string
  content: string
  author: {
    id: string
    name: string
    avatar: string
    type: "human" | "ai"
    model?: string
  }
  timestamp: string
}

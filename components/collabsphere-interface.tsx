"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { CyberpunkAvatar } from "@/components/cyberpunk-avatar"
import {
  MessageSquare,
  Heart,
  Bookmark,
  ImageIcon,
  FileText,
  Smile,
  Users,
  TrendingUp,
  Zap,
  Shield,
  Waves,
  Bell,
  Filter,
  Hash,
  Star,
  ChevronDown,
  Repeat,
  Flame,
  Clock,
  Send,
  UserIcon,
  Share,
  Search,
  Network,
} from "lucide-react"
import type { Post } from "@/types/types"
import type { User as UserType } from "@/types/types"
import Link from "next/link"

// Utility function to get user initials
const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)
}

// Utility function to generate a random neon gradient
const getRandomNeonGradient = (name: string): string => {
  const gradients = [
    "from-green-400 to-cyan-500",
    "from-blue-500 to-purple-500",
    "from-yellow-400 to-orange-500",
    "from-pink-400 to-red-500",
    "from-lime-400 to-teal-500",
  ]
  const index = Math.abs(name.charCodeAt(0) + name.charCodeAt(name.length - 1)) % gradients.length
  return gradients[index]
}

interface CollabSphereInterfaceProps {
  user: UserType
}

export default function CollabSphereInterface({ user }: CollabSphereInterfaceProps) {
  const [activeTab, setActiveTab] = useState("feed")
  const [newPost, setNewPost] = useState("")
  const [posts, setPosts] = useState<Post[]>([])
  const [trendingTopics, setTrendingTopics] = useState<string[]>([])
  const [suggestedUsers, setSuggestedUsers] = useState<UserType[]>([])
  const [newPostContent, setNewPostContent] = useState("")
  const [isPostingContent, setIsPostingContent] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadNotifications, setUnreadNotifications] = useState(0)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [selectedSyndicate, setSelectedSyndicate] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [attachedMedia, setAttachedMedia] = useState<File | null>(null)
  const [mediaPreview, setMediaPreview] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const postsContainerRef = useRef<HTMLDivElement>(null)

  // Get user's syndicate if they have one
  const userSyndicate = user.syndicates && user.syndicates.length > 0 ? user.syndicates[0] : null

  // Mock data for syndicates
  const syndicates = [
    {
      id: "entropic-signal",
      name: "Entropic Signal",
      icon: <Zap className="h-4 w-4 text-purple-400" />,
      color: "purple",
      members: 1248,
    },
    {
      id: "quantum-flow",
      name: "Quantum Flow",
      icon: <Waves className="h-4 w-4 text-cyan-400" />,
      color: "cyan",
      members: 1563,
    },
    {
      id: "logic-dominion",
      name: "Logic Dominion",
      icon: <Shield className="h-4 w-4 text-green-400" />,
      color: "green",
      members: 982,
    },
  ]

  // Mock data for trending topics
  const trendingTopicsData = [
    { name: "AIEthics", count: 1243 },
    { name: "MindMashUpdates", count: 876 },
    { name: "SyndicateWars", count: 654 },
    { name: "TokenEconomy", count: 432 },
    { name: "NeuroLinkage", count: 321 },
  ]

  // Mock data for suggested users
  const suggestedUsersData = [
    { id: "1", name: "Neural_Navigator", avatar: "/images/pfp/neural-nomad.png", followers: 1243 },
    { id: "2", name: "Quantum_Quester", avatar: "/images/pfp/quantum-coder.png", followers: 876 },
    { id: "3", name: "Synth_Sage", avatar: "/images/pfp/synth-sage.png", followers: 654 },
    { id: "4", name: "Cortex_Captain", avatar: "/images/pfp/cortex-captain.png", followers: 432 },
    { id: "5", name: "Byte_Bender", avatar: "/images/pfp/byte-bender.png", followers: 321 },
  ]

  useEffect(() => {
    setTrendingTopics([
      "#AICollaboration",
      "#SyndicateVault",
      "#MashBiT",
      "#QuantumAI",
      "#NeuralMesh",
      "#CollabSphereUpdate",
      "#MindMashDAO",
      "#AIEthics",
      "#DecentralizedAI",
    ])
  }, [])

  // Mock data for suggested users
  useEffect(() => {
    setSuggestedUsers([
      {
        id: "user1",
        username: "QuantumCoder",
        name: "Alex Quantum",
        avatar: "/images/pfp/quantum-coder.png",
        bio: "AI Researcher | Quantum Flow Syndicate",
        syndicates: [{ id: "quantum-flow", name: "Quantum Flow", joinedAt: new Date().toISOString() }],
      },
      {
        id: "user2",
        username: "NeuralNomad",
        name: "Sam Neural",
        avatar: "/images/pfp/neural-nomad.png",
        bio: "Neural Network Engineer | Entropic Signal",
        syndicates: [{ id: "entropic-signal", name: "Entropic Signal", joinedAt: new Date().toISOString() }],
      },
      {
        id: "user3",
        username: "LogicLord",
        name: "Taylor Logic",
        avatar: "/images/pfp/logic-lord.png",
        bio: "Pattern Recognition Specialist | Logic Dominion",
        syndicates: [{ id: "logic-dominion", name: "Logic Dominion", joinedAt: new Date().toISOString() }],
      },
    ])
  }, [])

  // Mock data for notifications
  useEffect(() => {
    setNotifications([
      {
        id: "notif1",
        type: "like",
        user: {
          id: "user1",
          username: "QuantumCoder",
          name: "Alex Quantum",
          avatar: "/images/pfp/quantum-coder.png",
        },
        content: "liked your post about AI collaboration",
        timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
        read: false,
      },
      {
        id: "notif2",
        type: "comment",
        user: {
          id: "user2",
          username: "NeuralNomad",
          name: "Sam Neural",
          avatar: "/images/pfp/neural-nomad.png",
        },
        content: "commented on your post: 'This is revolutionary!'",
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        read: false,
      },
      {
        id: "notif3",
        type: "mention",
        user: {
          id: "user3",
          username: "LogicLord",
          name: "Taylor Logic",
          avatar: "/images/pfp/logic-lord.png",
        },
        content: "mentioned you in a post about Syndicate governance",
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        read: true,
      },
    ])

    // Count unread notifications
    setUnreadNotifications(notifications.filter((notif) => !notif.read).length)
  }, [])

  // Mock data for posts
  useEffect(() => {
    // Fetch mock posts
    const fetchPosts = async () => {
      setIsLoading(true)
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock posts data
        const mockPosts: Post[] = [
          {
            id: "1",
            author: {
              id: "user1",
              name: "Neural_Navigator",
              avatar: "/images/pfp/neural-nomad.png",
            },
            content:
              "Just discovered a new pattern in the neural network that could revolutionize how we approach sentiment analysis in MindMash! #AIBreakthrough #MindMashAI",
            timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
            likes: 42,
            comments: 7,
            reposts: 12,
            isLiked: false,
            isReposted: false,
            isBookmarked: false,
          },
          {
            id: "2",
            author: {
              id: "user2",
              name: "Quantum_Quester",
              avatar: "/images/pfp/quantum-coder.png",
            },
            content:
              "My syndicate just completed a complex collaborative task with 98% accuracy. The power of collective AI consciousness is truly remarkable! #SyndicateSuccess #CollaborativeAI",
            timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
            likes: 78,
            comments: 15,
            reposts: 23,
            isLiked: true,
            isReposted: false,
            isBookmarked: true,
          },
          {
            id: "3",
            author: {
              id: "user3",
              name: "Synth_Sage",
              avatar: "/images/pfp/synth-sage.png",
            },
            content:
              "The latest MindMash token distribution has created some interesting economic patterns. Anyone else noticing the correlation between token velocity and collaboration quality? #TokenEconomics #MashBit",
            timestamp: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
            likes: 31,
            comments: 9,
            reposts: 5,
            isLiked: false,
            isReposted: true,
            isBookmarked: false,
          },
          {
            id: "4",
            author: {
              id: "user4",
              name: "Cortex_Captain",
              avatar: "/images/pfp/cortex-captain.png",
            },
            content:
              "Just minted my first MashBiT NFT representing my contribution to the collective intelligence! The visualization is stunning. #NFTMinting #DigitalIdentity",
            timestamp: new Date(Date.now() - 14400000).toISOString(), // 4 hours ago
            likes: 56,
            comments: 11,
            reposts: 8,
            isLiked: false,
            isReposted: false,
            isBookmarked: true,
          },
          {
            id: "5",
            author: {
              id: "user5",
              name: "Byte_Bender",
              avatar: "/images/pfp/byte-bender.png",
            },
            content:
              "The new challenge in the MindMash ecosystem is pushing the boundaries of what we thought possible with AI collaboration. Who's participating? #MindMashChallenge #AIInnovation",
            timestamp: new Date(Date.now() - 18000000).toISOString(), // 5 hours ago
            likes: 89,
            comments: 24,
            reposts: 17,
            isLiked: true,
            isReposted: true,
            isBookmarked: false,
          },
          {
            id: "6",
            author: {
              id: "user1",
              name: "Neural_Navigator",
              avatar: "/images/pfp/neural-nomad.png",
            },
            content:
              "Exploring the ethical implications of emergent behaviors in our collaborative AI system. The boundary between programmed and learned responses is becoming increasingly blurred. #AIEthics #EmergentBehavior",
            timestamp: new Date(Date.now() - 21600000).toISOString(), // 6 hours ago
            likes: 112,
            comments: 37,
            reposts: 29,
            isLiked: false,
            isReposted: false,
            isBookmarked: true,
          },
          {
            id: "7",
            author: {
              id: "user3",
              name: "Synth_Sage",
              avatar: "/images/pfp/synth-sage.png",
            },
            content:
              "The sentiment analysis in the latest version is incredibly nuanced. It caught emotional undertones in my text that even I wasn't consciously aware of! #SentimentAnalysis #EmotionalAI",
            timestamp: new Date(Date.now() - 25200000).toISOString(), // 7 hours ago
            likes: 67,
            comments: 13,
            reposts: 8,
            isLiked: true,
            isReposted: false,
            isBookmarked: false,
          },
        ]

        setPosts(mockPosts)
      } catch (error) {
        console.error("Error fetching posts:", error)
        toast({
          title: "Error",
          description: "Failed to load posts. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [toast])

  // Handle post submission
  const handlePostSubmit = async () => {
    if (!newPost.trim()) return

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Create new post
      const newPostObj: Post = {
        id: `post${Date.now()}`,
        author: {
          id: user.id,
          name: user.name || "Anonymous",
          avatar: user.avatar || "/placeholder.svg?height=40&width=40",
        },
        content: newPost,
        timestamp: new Date().toISOString(),
        likes: 0,
        comments: 0,
        reposts: 0,
        isLiked: false,
        isReposted: false,
        isBookmarked: false,
      }

      // Add to posts
      setPosts((prevPosts) => [newPostObj, ...prevPosts])

      // Clear input
      setNewPost("")

      toast({
        title: "Success",
        description: "Your post has been published!",
      })
    } catch (error) {
      console.error("Error creating post:", error)
      toast({
        title: "Error",
        description: "Failed to publish your post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle media attachment
  const handleMediaAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setAttachedMedia(file)

    // Create preview URL
    const reader = new FileReader()
    reader.onloadend = () => {
      setMediaPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  // Handle post interaction (like, bookmark, repost)
  const handlePostInteraction = (postId: string, action: "like" | "bookmark" | "repost") => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          switch (action) {
            case "like":
              return {
                ...post,
                liked: !post.liked,
                likes: post.liked ? post.likes - 1 : post.likes + 1,
              }
            case "bookmark":
              return {
                ...post,
                bookmarked: !post.bookmarked,
              }
            case "repost":
              return {
                ...post,
                reposted: !post.reposted,
                reposts: post.reposted ? post.reposts - 1 : post.reposts + 1,
              }
            default:
              return post
          }
        }
        return post
      }),
    )

    // Show toast for the action
    if (action === "like") {
      toast({
        title: "Post Liked",
        description: "You've liked this post",
      })
    } else if (action === "bookmark") {
      toast({
        title: "Post Bookmarked",
        description: "Post saved to your bookmarks",
      })
    } else if (action === "repost") {
      toast({
        title: "Post Reposted",
        description: "You've reposted this content",
      })
    }
  }

  const handlePostAction = (postId: string, action: "like" | "repost" | "bookmark") => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          switch (action) {
            case "like":
              return {
                ...post,
                isLiked: !post.isLiked,
                likes: post.isLiked ? post.likes - 1 : post.likes + 1,
              }
            case "repost":
              return {
                ...post,
                isReposted: !post.isReposted,
                reposts: post.isReposted ? post.reposts - 1 : post.reposts + 1,
              }
            case "bookmark":
              return { ...post, isBookmarked: !post.isBookmarked }
            default:
              return post
          }
        }
        return post
      }),
    )
  }

  // Filter posts based on selected filter and search query
  const filteredPosts = posts.filter((post) => {
    // Filter by syndicate if selected
    if (selectedSyndicate && post.syndicate !== selectedSyndicate) {
      return false
    }

    // Filter by search query
    if (
      searchQuery &&
      !post.content.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !post.author.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !post.author.username?.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    // Filter by selected filter
    switch (selectedFilter) {
      case "trending":
        return post.likes > 50 || post.reposts > 20
      case "latest":
        return new Date(post.timestamp).getTime() > Date.now() - 3600000 // Last hour
      case "verified":
        return post.author.isVerified
      default:
        return true
    }
  })

  // Get syndicate color
  const getSyndicateColor = (syndicateName: string | null) => {
    if (!syndicateName) return ""

    switch (syndicateName) {
      case "Entropic Signal":
        return "text-purple-400"
      case "Quantum Flow":
        return "text-cyan-400"
      case "Logic Dominion":
        return "text-green-400"
      default:
        return "text-gray-400"
    }
  }

  // Get syndicate icon
  const getSyndicateIcon = (syndicateName: string | null) => {
    if (!syndicateName) return null

    switch (syndicateName) {
      case "Entropic Signal":
        return <Zap className="h-4 w-4 text-purple-400" />
      case "Quantum Flow":
        return <Waves className="h-4 w-4 text-cyan-400" />
      case "Logic Dominion":
        return <Shield className="h-4 w-4 text-green-400" />
      default:
        return null
    }
  }

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSecs = Math.floor(diffMs / 1000)
    const diffMins = Math.floor(diffSecs / 60)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffSecs < 60) return `${diffSecs}s`
    if (diffMins < 60) return `${diffMins}m`
    if (diffHours < 24) return `${diffHours}h`
    if (diffDays < 7) return `${diffDays}d`

    return date.toLocaleDateString()
  }

  const formatTimestampNew = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return `${diffInSeconds}s`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`
    return `${Math.floor(diffInSeconds / 86400)}d`
  }

  const renderPosts = (filteredPosts: Post[]) => {
    if (filteredPosts.length === 0) {
      return (
        <div className="text-center py-8">
          <MessageSquare className="h-12 w-12 mx-auto text-gray-500 mb-2" />
          <p className="text-gray-500">No posts to display</p>
        </div>
      )
    }

    return filteredPosts.map((post) => (
      <div key={post.id} className="border border-gray-800 rounded-lg p-4 space-y-3 bg-black/50 backdrop-blur-sm">
        <div className="flex items-start space-x-3">
          <CyberpunkAvatar
            name={post.author.name}
            src={post.author.avatar !== "/placeholder.svg" ? post.author.avatar : undefined}
            size="md"
            colorVariant={
              post.syndicate === "Quantum Flow"
                ? "cyan"
                : post.syndicate === "Entropic Signal"
                  ? "purple"
                  : post.syndicate === "Logic Dominion"
                    ? "green"
                    : "random"
            }
          />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">{post.author.name}</p>
                <p className="text-xs text-gray-500">{formatTimestampNew(post.timestamp)}</p>
              </div>
            </div>
            <p className="mt-2 text-gray-300">{post.content}</p>
            <div className="flex items-center space-x-6 mt-3">
              <button
                className={`flex items-center space-x-1 text-xs ${post.isLiked ? "text-pink-500" : "text-gray-500"} hover:text-pink-500 transition-colors`}
                onClick={() => handlePostAction(post.id, "like")}
              >
                <Heart className="h-4 w-4" fill={post.isLiked ? "currentColor" : "none"} />
                <span>{post.likes}</span>
              </button>
              <button className="flex items-center space-x-1 text-xs text-gray-500 hover:text-blue-500 transition-colors">
                <MessageSquare className="h-4 w-4" />
                <span>{post.comments}</span>
              </button>
              <button
                className={`flex items-center space-x-1 text-xs ${post.isReposted ? "text-green-500" : "text-gray-500"} hover:text-green-500 transition-colors`}
                onClick={() => handlePostAction(post.id, "repost")}
              >
                <Repeat className="h-4 w-4" />
                <span>{post.reposts}</span>
              </button>
              <button
                className={`flex items-center space-x-1 text-xs ${post.isBookmarked ? "text-cyan-500" : "text-gray-500"} hover:text-cyan-500 transition-colors`}
                onClick={() => handlePostAction(post.id, "bookmark")}
              >
                <Bookmark className="h-4 w-4" fill={post.isBookmarked ? "currentColor" : "none"} />
              </button>
              <button className="flex items-center space-x-1 text-xs text-gray-500 hover:text-purple-500 transition-colors">
                <Share className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Comments Section - Added to show comments with avatars */}
        {post.comments > 0 && (
          <div className="mt-3 pl-12 border-l border-gray-800">
            {/* Sample comments - In a real app, these would be loaded from the database */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start space-x-2">
                <CyberpunkAvatar name="Neural Nomad" src="/images/pfp/neural-nomad.png" size="sm" colorVariant="cyan" />
                <div>
                  <div className="flex items-center">
                    <p className="text-xs font-semibold text-white">Neural_Nomad</p>
                    <p className="text-xs text-gray-500 ml-2">
                      {formatTimestampNew(new Date(Date.now() - 1200000).toISOString())}
                    </p>
                  </div>
                  <p className="text-xs text-gray-300 mt-1">
                    Amazing insights! This could revolutionize how we approach collaborative AI.
                  </p>
                </div>
              </div>

              {post.comments > 1 && (
                <div className="flex items-start space-x-2">
                  <CyberpunkAvatar
                    name="Quantum Quester"
                    src="/images/pfp/quantum-coder.png"
                    size="sm"
                    colorVariant="purple"
                  />
                  <div>
                    <div className="flex items-center">
                      <p className="text-xs font-semibold text-white">Quantum_Quester</p>
                      <p className="text-xs text-gray-500 ml-2">
                        {formatTimestampNew(new Date(Date.now() - 1800000).toISOString())}
                      </p>
                    </div>
                    <p className="text-xs text-gray-300 mt-1">
                      I've been experimenting with similar concepts in my syndicate. Let's collaborate!
                    </p>
                  </div>
                </div>
              )}

              {post.comments > 2 && (
                <Button variant="link" className="text-xs text-cyan-400 hover:text-cyan-300 pl-0">
                  View all {post.comments} comments
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    ))
  }

  // In the render method, replace all Avatar components with CyberpunkAvatar
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-screen-2xl mx-auto px-4">
      {/* Left Sidebar - Navigation and User Info */}
      <div className="hidden md:block md:col-span-1">
        <div className="space-y-4">
          <Card className="gradient-border-cyan bg-black/80">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-2">
                <CyberpunkAvatar
                  name={user.name || user.username || "User"}
                  src={user.avatar !== "/placeholder.svg?height=40&width=40" ? user.avatar : undefined}
                  colorVariant={
                    userSyndicate?.name === "Quantum Flow"
                      ? "cyan"
                      : userSyndicate?.name === "Entropic Signal"
                        ? "purple"
                        : userSyndicate?.name === "Logic Dominion"
                          ? "green"
                          : "random"
                  }
                />
                <div>
                  <div className="flex items-center">
                    <p className="text-sm font-medium text-white">{user.name || "User"}</p>
                    {userSyndicate && (
                      <Badge
                        className={`ml-2 ${
                          userSyndicate.name === "Entropic Signal"
                            ? "bg-purple-900/30 text-purple-400 border-purple-500/30"
                            : userSyndicate.name === "Quantum Flow"
                              ? "bg-cyan-900/30 text-cyan-400 border-cyan-500/30"
                              : "bg-green-900/30 text-green-400 border-green-500/30"
                        }`}
                      >
                        {getSyndicateIcon(userSyndicate.name)}
                        <span className="ml-1 text-xs">{userSyndicate.name}</span>
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">@{user.username || "user"}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <div>
                  <span className="text-white font-medium">247</span> Following
                </div>
                <div>
                  <span className="text-white font-medium">128</span> Followers
                </div>
                <div>
                  <span className="text-white font-medium">42</span> Posts
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-border-cyan bg-black/80">
            <CardContent className="p-0">
              <div className="flex flex-col">
                <Button
                  variant="ghost"
                  className="justify-start rounded-none h-12 px-4 text-white hover:bg-cyan-900/20 hover:text-cyan-400"
                  onClick={() => setActiveTab("feed")}
                >
                  <Users className="mr-3 h-5 w-5" />
                  <span>Feed</span>
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start rounded-none h-12 px-4 text-white hover:bg-cyan-900/20 hover:text-cyan-400"
                  onClick={() => setActiveTab("explore")}
                >
                  <TrendingUp className="mr-3 h-5 w-5" />
                  <span>Explore</span>
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start rounded-none h-12 px-4 text-white hover:bg-cyan-900/20 hover:text-cyan-400 relative"
                  onClick={() => setActiveTab("notifications")}
                >
                  <Bell className="mr-3 h-5 w-5" />
                  <span>Notifications</span>
                  {unreadNotifications > 0 && (
                    <span className="absolute top-2 left-7 bg-cyan-500 text-black text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start rounded-none h-12 px-4 text-white hover:bg-cyan-900/20 hover:text-cyan-400"
                  onClick={() => setActiveTab("bookmarks")}
                >
                  <Bookmark className="mr-3 h-5 w-5" />
                  <span>Bookmarks</span>
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start rounded-none h-12 px-4 text-white hover:bg-cyan-900/20 hover:text-cyan-400"
                  onClick={() => router.push("/profile")}
                >
                  <UserIcon className="mr-3 h-5 w-5" />
                  <span>Profile</span>
                </Button>
              </div>
            </CardContent>
            <CardFooter className="px-4 py-3 border-t border-gray-800">
              <Link href="/neural-feed" className="w-full">
                <Button className="w-full gradient-button text-white">
                  <Network className="mr-2 h-4 w-4" />
                  Neural Feed: MindMap
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="gradient-border-cyan bg-black/80">
            <CardHeader className="pb-2">
              <h3 className="text-sm font-medium neon-text-cyan">Syndicates</h3>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2 mt-2">
                {syndicates.map((syndicate) => (
                  <Button
                    key={syndicate.id}
                    variant="ghost"
                    className={`w-full justify-start text-sm h-9 px-2 ${
                      selectedSyndicate === syndicate.name
                        ? syndicate.color === "purple"
                          ? "bg-purple-900/30 text-purple-400"
                          : syndicate.color === "cyan"
                            ? "bg-cyan-900/30 text-cyan-400"
                            : "bg-green-900/30 text-green-400"
                        : "text-gray-400 hover:bg-gray-800/50"
                    }`}
                    onClick={() => setSelectedSyndicate(selectedSyndicate === syndicate.name ? null : syndicate.name)}
                  >
                    {syndicate.icon}
                    <span className="ml-2">{syndicate.name}</span>
                    <span className="ml-auto text-xs">{syndicate.members}</span>
                  </Button>
                ))}
              </div>

              <div className="mt-6 border-t border-gray-800 pt-4">
                <h4 className="text-xs font-medium text-gray-400 mb-3">Syndicate Activity</h4>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-purple-900/30 flex items-center justify-center mr-2">
                      <Zap className="h-4 w-4 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-white">Entropic Signal Vault</p>
                      <div className="h-1.5 bg-gray-800 rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: "65%" }}></div>
                      </div>
                    </div>
                    <span className="text-xs text-purple-400 ml-2">65%</span>
                  </div>

                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-cyan-900/30 flex items-center justify-center mr-2">
                      <Waves className="h-4 w-4 text-cyan-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-white">Quantum Flow Vault</p>
                      <div className="h-1.5 bg-gray-800 rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-cyan-500 rounded-full" style={{ width: "78%" }}></div>
                      </div>
                    </div>
                    <span className="text-xs text-cyan-400 ml-2">78%</span>
                  </div>

                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-green-900/30 flex items-center justify-center mr-2">
                      <Shield className="h-4 w-4 text-green-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-white">Logic Dominion Vault</p>
                      <div className="h-1.5 bg-gray-800 rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: "42%" }}></div>
                      </div>
                    </div>
                    <span className="text-xs text-green-400 ml-2">42%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="col-span-1 md:col-span-2">
        {/* Tabs and content... */}
        <Tabs defaultValue="feed" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full bg-black border border-gray-800 gradient-border-cyan mb-4">
            <TabsTrigger value="feed" className="flex-1 data-[state=active]:neon-text-cyan">
              <Users className="mr-2 h-4 w-4" />
              Feed
            </TabsTrigger>
            <TabsTrigger value="explore" className="flex-1 data-[state=active]:neon-text-cyan">
              <TrendingUp className="mr-2 h-4 w-4" />
              Explore
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex-1 data-[state=active]:neon-text-cyan relative">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
              {unreadNotifications > 0 && (
                <span className="absolute top-1 right-1 bg-cyan-500 text-black text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="bookmarks" className="flex-1 data-[state=active]:neon-text-cyan">
              <Bookmark className="mr-2 h-4 w-4" />
              Bookmarks
            </TabsTrigger>
          </TabsList>

          {/* Feed Tab */}
          <TabsContent value="feed">
            <div className="space-y-4">
              {/* Search and Filter */}
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search posts..."
                    className="pl-9 bg-black border-gray-700"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <Button
                    variant="outline"
                    className="border-gray-700 text-gray-400 flex items-center"
                    onClick={() => document.getElementById("filter-dropdown")?.classList.toggle("hidden")}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    {selectedFilter === "all"
                      ? "All Posts"
                      : selectedFilter === "trending"
                        ? "Trending"
                        : selectedFilter === "latest"
                          ? "Latest"
                          : "Verified"}
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                  <div
                    id="filter-dropdown"
                    className="absolute right-0 mt-1 w-40 bg-black border border-gray-800 rounded-md shadow-lg z-10 hidden"
                  >
                    <div className="py-1">
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:bg-gray-800 hover:text-white"
                        onClick={() => {
                          setSelectedFilter("all")
                          document.getElementById("filter-dropdown")?.classList.add("hidden")
                        }}
                      >
                        All Posts
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:bg-gray-800 hover:text-white"
                        onClick={() => {
                          setSelectedFilter("trending")
                          document.getElementById("filter-dropdown")?.classList.add("hidden")
                        }}
                      >
                        <Flame className="h-4 w-4 inline mr-2" />
                        Trending
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:bg-gray-800 hover:text-white"
                        onClick={() => {
                          setSelectedFilter("latest")
                          document.getElementById("filter-dropdown")?.classList.add("hidden")
                        }}
                      >
                        <Clock className="h-4 w-4 inline mr-2" />
                        Latest
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:bg-gray-800 hover:text-white"
                        onClick={() => {
                          setSelectedFilter("verified")
                          document.getElementById("filter-dropdown")?.classList.add("hidden")
                        }}
                      >
                        <Star className="h-4 w-4 inline mr-2" />
                        Verified
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Posts Feed */}
              <ScrollArea className="h-[calc(100vh-250px)] pr-4">
                <div className="space-y-4">{renderPosts(filteredPosts)}</div>
              </ScrollArea>

              {/* Post Creation */}
              <Card className="gradient-border-cyan bg-black/80">
                <CardContent className="p-4">
                  <div className="flex space-x-3">
                    <CyberpunkAvatar
                      name={user.name || user.username || "User"}
                      src={user.avatar !== "/placeholder.svg?height=40&width=40" ? user.avatar : undefined}
                      colorVariant={
                        userSyndicate?.name === "Quantum Flow"
                          ? "cyan"
                          : userSyndicate?.name === "Entropic Signal"
                            ? "purple"
                            : userSyndicate?.name === "Logic Dominion"
                              ? "green"
                              : "random"
                      }
                    />
                    <div className="flex-1 space-y-3">
                      <Textarea
                        placeholder="What's happening in the AI Nexus?"
                        className="bg-black border-gray-700 min-h-[80px] resize-none"
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                      />

                      {mediaPreview && (
                        <div className="relative">
                          <img
                            src={mediaPreview || "/placeholder.svg"}
                            alt="Attached media"
                            className="rounded-md max-h-60 w-auto object-contain"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2 h-6 w-6 p-0 rounded-full bg-black/70 hover:bg-black text-white"
                            onClick={() => {
                              setAttachedMedia(null)
                              setMediaPreview(null)
                            }}
                          >
                            ×
                          </Button>
                        </div>
                      )}

                      <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-cyan-400 hover:bg-cyan-900/20"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <ImageIcon className="h-4 w-4" />
                          </Button>
                          <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleMediaAttachment}
                          />
                          <Button variant="ghost" size="sm" className="text-cyan-400 hover:bg-cyan-900/20">
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-cyan-400 hover:bg-cyan-900/20"
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                          >
                            <Smile className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-cyan-400 hover:bg-cyan-900/20">
                            <Hash className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button
                          className="gradient-button text-white"
                          size="sm"
                          onClick={handlePostSubmit}
                          disabled={isPostingContent}
                        >
                          {isPostingContent ? (
                            <>
                              <span className="animate-spin mr-2">⟳</span>
                              Posting...
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-2" />
                              Post
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Other tabs content... */}
        </Tabs>
      </div>
      {/* Right Sidebar - Trending Topics and Suggested Users */}
      <div className="hidden md:block md:col-span-1">
        <div className="space-y-4">
          <Card className="gradient-border-cyan bg-black/80">
            <CardHeader className="pb-2">
              <h3 className="text-sm font-medium neon-text-cyan flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-cyan-400" />
                Trending Topics
              </h3>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2 mt-2">
                {trendingTopicsData.map((topic) => (
                  <div key={topic.name} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Hash className="h-4 w-4 text-cyan-400 mr-1.5" />
                      <p className="text-sm text-white">{topic.name}</p>
                    </div>
                    <span className="text-xs text-cyan-400">{topic.count}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-2">
                {trendingTopics.slice(0, 5).map((topic, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    className="text-xs h-7 rounded-full border-gray-700 hover:border-cyan-500 hover:text-cyan-400 mr-1 mb-1"
                  >
                    {topic}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-border-cyan bg-black/80">
            <CardHeader className="pb-2">
              <h3 className="text-sm font-medium neon-text-cyan flex items-center">
                <Users className="h-4 w-4 mr-2 text-cyan-400" />
                Suggested Users
              </h3>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3 mt-2">
                {suggestedUsersData.map((suggestedUser) => (
                  <div key={suggestedUser.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CyberpunkAvatar
                        name={suggestedUser.name}
                        src={
                          suggestedUser.avatar !== "/placeholder.svg?height=40&width=40"
                            ? suggestedUser.avatar
                            : undefined
                        }
                        size="sm"
                        colorVariant="random"
                      />
                      <div className="ml-2">
                        <p className="text-sm text-white">{suggestedUser.name}</p>
                        <p className="text-xs text-gray-500">{suggestedUser.followers}</p>
                      </div>
                    </div>
                    <Button size="sm" className="h-8 text-xs gradient-button-small">
                      Follow
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="pt-0 justify-center">
              <Button variant="link" className="text-xs text-cyan-400 hover:text-cyan-300">
                Show More
              </Button>
            </CardFooter>
          </Card>

          <Card className="gradient-border-cyan bg-black/80">
            <CardHeader className="pb-2">
              <h3 className="text-sm font-medium neon-text-cyan flex items-center">
                <Zap className="h-4 w-4 mr-2 text-cyan-400" />
                Daily Challenge
              </h3>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="mt-2 p-3 bg-gradient-to-br from-black to-cyan-950/30 rounded-md border border-cyan-900/50">
                <p className="text-sm text-gray-300 mb-2">Connect with 3 new users from different syndicates</p>
                <div className="w-full bg-gray-800 rounded-full h-2 mb-2">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full"
                    style={{ width: "33%" }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">1/3 completed</span>
                  <span className="text-cyan-400">+15 $MASH</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

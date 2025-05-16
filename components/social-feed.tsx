"use client"

import { useState } from "react"
import { MessageSquare, Heart, Share2, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useAudio } from "@/components/audio-manager"
import { CyberpunkAvatar } from "@/components/cyberpunk-avatar"

interface User {
  id: string
  name: string
  avatar: string
  status: string
  role: string
}

interface FeedPost {
  id: string
  user: string
  content: string
  timestamp: string
  likes: number
  comments: number
  aiResponses: string[]
}

interface SocialFeedProps {
  feed: FeedPost[]
  users: User[]
}

export function SocialFeed({ feed, users }: SocialFeedProps) {
  const { playSound } = useAudio()
  const [newPost, setNewPost] = useState("")
  const [localFeed, setLocalFeed] = useState<FeedPost[]>(feed)

  const getUserById = (id: string) => {
    return users.find((user) => user.id === id)
  }

  const handlePostSubmit = () => {
    if (!newPost.trim()) return

    playSound("/sounds/button-click.mp3")

    // Create new post
    const newFeedPost: FeedPost = {
      id: `post${Date.now()}`,
      user: "user1", // Assuming current user is user1
      content: newPost,
      timestamp: "Just now",
      likes: 0,
      comments: 0,
      aiResponses: [],
    }

    // Add to feed
    setLocalFeed([newFeedPost, ...localFeed])
    setNewPost("")

    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponse = Math.random() > 0.5 ? "chatgpt" : "grok"

      setLocalFeed((prev) => {
        const updated = [...prev]
        updated[0] = {
          ...updated[0],
          aiResponses: [...updated[0].aiResponses, aiResponse],
        }
        return updated
      })

      playSound("/sounds/notification.mp3")
    }, 2000)
  }

  const handleLike = (postId: string) => {
    playSound("/sounds/button-click.mp3")

    setLocalFeed((prev) => prev.map((post) => (post.id === postId ? { ...post, likes: post.likes + 1 } : post)))
  }

  return (
    <div className="space-y-4">
      {/* New post input */}
      <div className="bg-black/50 border border-gray-800 rounded-md p-3">
        <Textarea
          placeholder="Share your thoughts with the neural network..."
          className="bg-transparent border-gray-800 focus:border-cyan-700 mb-3 min-h-[100px]"
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
        />
        <div className="flex justify-end">
          <Button
            className="bg-gradient-to-r from-cyan-600 to-fuchsia-600 hover:from-cyan-700 hover:to-fuchsia-700"
            onClick={handlePostSubmit}
          >
            <Send className="mr-2 h-4 w-4" />
            Broadcast
          </Button>
        </div>
      </div>

      {/* Feed posts */}
      {localFeed.map((post) => {
        const user = getUserById(post.user)

        return (
          <div key={post.id} className="bg-black/50 border border-gray-800 rounded-md p-4">
            {/* Post header */}
            <div className="flex items-center mb-3">
              {user && (
                <div className="relative mr-3">
                  <CyberpunkAvatar
                    name={user.name}
                    src={user.avatar !== "/placeholder.svg" ? user.avatar : undefined}
                    size="md"
                    colorVariant="random"
                  />
                  <span
                    className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-black ${
                      user.status === "online"
                        ? "bg-green-500"
                        : user.status === "away"
                          ? "bg-orange-500"
                          : "bg-gray-500"
                    }`}
                  ></span>
                </div>
              )}
              <div>
                <div className="font-medium">{user?.name || "Unknown User"}</div>
                <div className="text-xs text-gray-400 flex items-center">
                  <span>{post.timestamp}</span>
                  {user?.role && (
                    <>
                      <span className="mx-1">•</span>
                      <span>{user.role}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Post content */}
            <div className="mb-4">
              <p className="text-gray-200">{post.content}</p>
            </div>

            {/* AI responses */}
            {post.aiResponses.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {post.aiResponses.map((ai, index) => (
                  <div
                    key={index}
                    className={`text-xs px-2 py-1 rounded-full flex items-center ${
                      ai === "chatgpt"
                        ? "bg-fuchsia-900/30 text-fuchsia-300 border border-fuchsia-500/30"
                        : ai === "grok"
                          ? "bg-green-900/30 text-green-300 border border-green-500/30"
                          : ai === "gemini"
                            ? "bg-cyan-900/30 text-cyan-300 border border-cyan-500/30"
                            : "bg-yellow-900/30 text-yellow-300 border border-yellow-500/30"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full mr-1.5 bg-current"></span>
                    {ai.charAt(0).toUpperCase() + ai.slice(1)} responded
                  </div>
                ))}
              </div>
            )}

            {/* Post actions */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-800">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-fuchsia-400 hover:bg-transparent"
                onClick={() => handleLike(post.id)}
              >
                <Heart className={`h-4 w-4 mr-1 ${post.likes > 0 ? "fill-fuchsia-500 text-fuchsia-500" : ""}`} />
                <span>{post.likes}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-cyan-400 hover:bg-transparent"
                onClick={() => playSound("/sounds/button-click.mp3")}
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                <span>{post.comments}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-green-400 hover:bg-transparent"
                onClick={() => playSound("/sounds/button-click.mp3")}
              >
                <Share2 className="h-4 w-4 mr-1" />
                <span>Share</span>
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

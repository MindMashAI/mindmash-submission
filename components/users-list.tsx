"use client"

import { useState, useEffect } from "react"
import { getAllUsers, type User } from "@/lib/db-utils"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import { useAudio } from "@/components/audio-manager"

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const { playSound } = useAudio()

  useEffect(() => {
    async function fetchUsers() {
      try {
        const allUsers = await getAllUsers(20)
        setUsers(allUsers)
      } catch (error) {
        console.error("Failed to fetch users:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  if (loading) {
    return (
      <div className="p-6 bg-gradient-to-br from-gray-900 to-black rounded-lg border border-cyan-900/30">
        <div className="flex justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent"></div>
        </div>
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="p-6 bg-gradient-to-br from-gray-900 to-black rounded-lg border border-cyan-900/30">
        <p className="text-gray-400">No users found in the system.</p>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gradient-to-br from-gray-900 to-black rounded-lg border border-cyan-900/30">
      <h3 className="text-lg font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
        Neural Network Members
      </h3>
      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between p-3 bg-black/30 rounded-md border border-cyan-900/20"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-900/50 rounded-full flex items-center justify-center mr-3">
                <span className="text-sm font-bold text-purple-400">{user.display_name.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-300">{user.display_name}</h4>
                <p className="text-xs text-gray-500">Joined {new Date(user.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                playSound("/sounds/button-click.mp3")
                window.open(`https://explorer.solana.com/address/${user.wallet_address}?cluster=devnet`, "_blank")
              }}
              className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-900/20"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

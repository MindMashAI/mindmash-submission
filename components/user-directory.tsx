"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface User {
  id: string
  name: string
  avatar: string
  status: string
  role: string
}

interface UserDirectoryProps {
  users: User[]
  activeNode: string
  onUserClick: (userId: string) => void
}

export function UserDirectory({ users, activeNode, onUserClick }: UserDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search users..."
          className="pl-8 bg-black/50 border-gray-800 focus:border-cyan-700 text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className={`flex items-center p-2 rounded-md cursor-pointer transition-all ${
                activeNode === user.id ? "bg-fuchsia-900/30 border border-fuchsia-500/50" : "hover:bg-gray-800/50"
              }`}
              onClick={() => onUserClick(user.id)}
            >
              <div className="relative">
                <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="w-8 h-8 rounded-full mr-2" />
                <span
                  className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border border-black ${
                    user.status === "online" ? "bg-green-500" : user.status === "away" ? "bg-orange-500" : "bg-gray-500"
                  }`}
                ></span>
              </div>
              <div>
                <div className="text-sm font-medium">{user.name}</div>
                <div className="text-xs text-gray-400">{user.role}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500 text-sm">No users found</div>
        )}
      </div>
    </div>
  )
}

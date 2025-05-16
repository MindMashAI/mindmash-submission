"use client"

import { useState } from "react"
import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAudio } from "@/components/audio-manager"
import ChatroomsList from "@/components/chatrooms/chatrooms-list"
import ChatroomView from "@/components/chatrooms/chatroom-view"

export default function ChatroomsPage() {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const router = useRouter()
  const { playSound } = useAudio()

  const handleBack = () => {
    playSound("/sounds/button-click.mp3")
    router.back()
  }

  const handleSelectRoom = (roomId: string) => {
    playSound("/sounds/feature-select.mp3")
    setSelectedRoom(roomId)
  }

  const handleBackToRooms = () => {
    playSound("/sounds/button-click.mp3")
    setSelectedRoom(null)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-gray-800 bg-black/80 backdrop-blur-sm p-4">
        <div className="container mx-auto flex items-center">
          <button
            onClick={handleBack}
            className="mr-4 p-2 rounded-full hover:bg-gray-800 transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold text-fuchsia-400">Chat Rooms</h1>
        </div>
      </header>

      <main className="container mx-auto p-4">
        {selectedRoom ? (
          <ChatroomView roomId={selectedRoom} onBack={handleBackToRooms} />
        ) : (
          <ChatroomsList onSelectRoom={handleSelectRoom} />
        )}
      </main>
    </div>
  )
}

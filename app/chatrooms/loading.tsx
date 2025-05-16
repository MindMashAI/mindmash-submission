import { Loader2 } from "lucide-react"

export default function ChatroomsLoading() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-fuchsia-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-fuchsia-400">Loading Chat Rooms...</h2>
        <p className="text-gray-400 mt-2">Connecting to the neural network</p>
      </div>
    </div>
  )
}

"use client"

export default function LoadingScreen() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-black">
      <div className="text-center">
        <div className="mb-6 flex items-center justify-center">
          <img
            src="https://jade-late-crow-559.mypinata.cloud/ipfs/bafybeia5skhvck24266qahayvxuhc5k3ez27xnmscrlwfjnwloeal5rdam"
            alt="MindMash.AI Logo"
            className="h-16 w-16 mr-2 animate-pulse"
          />
          <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
            MindMash.AI
          </h1>
        </div>
        <p className="text-cyan-400 animate-pulse">Loading interactive demo...</p>
        <div className="mt-8 w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 animate-[loading_2s_ease-in-out]"></div>
        </div>
        <div className="mt-4 font-mono text-xs text-gray-500">
          <p>Initializing AI models...</p>
          <p>Establishing neural connections...</p>
          <p>Preparing collaboration interface...</p>
        </div>
      </div>
    </div>
  )
}

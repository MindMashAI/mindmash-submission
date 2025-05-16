export default function SolflareLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="w-24 h-24 rounded-full border-4 border-t-purple-500 border-r-blue-500 border-b-cyan-500 border-l-green-500 animate-spin"></div>
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500">
            Loading Solflare Interface...
          </h2>
          <div className="w-full max-w-md bg-gray-800 rounded-lg overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 animate-pulse"></div>
          </div>
          <p className="text-gray-400 text-center max-w-md">
            Connecting to the Solana network and initializing your wallet interface...
          </p>
        </div>
      </div>
    </div>
  )
}

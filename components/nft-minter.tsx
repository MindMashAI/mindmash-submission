"use client"

import { Download, Award, Zap, Users, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAudio } from "@/components/audio-manager"
import Image from "next/image"

export default function NFTMinter() {
  const { playSound } = useAudio()

  return (
    <div className="h-full flex flex-col space-y-4">
      <h2 className="text-lg font-bold text-fuchsia-400">Mash.BiT Token Minter</h2>

      <div className="bg-black/40 p-4 rounded-md border border-purple-900/50">
        <div className="text-center mb-3">
          <Image
            src="/images/nft/soulsig-nft-1.png"
            alt="SoulSig NFT"
            width={300}
            height={300}
            className="rounded-lg shadow-glow mx-auto"
          />
          <div className="text-3xl font-bold text-fuchsia-400">0</div>
          <div className="text-xs text-gray-400">Available Tokens</div>
        </div>

        <Button
          className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white"
          onClick={() => playSound("/sounds/button-click.mp3")}
        >
          <Download className="mr-2 h-4 w-4" />
          MINT TOKENS
        </Button>
      </div>

      <div className="flex-1 flex flex-col">
        <h3 className="text-sm font-bold text-fuchsia-400 mb-3">Token Benefits</h3>
        <div className="space-y-3 flex-1 overflow-y-auto pr-1">
          <div className="bg-black/40 p-3 rounded-md border border-gray-800 flex items-start">
            <div className="bg-purple-900/30 p-1.5 rounded-full mr-3 mt-0.5">
              <Award className="h-4 w-4 text-fuchsia-400" />
            </div>
            <div>
              <div className="text-sm font-medium text-white">Premium AI Access</div>
              <div className="text-xs text-gray-400">Unlock advanced AI models and features</div>
            </div>
          </div>

          <div className="bg-black/40 p-3 rounded-md border border-gray-800 flex items-start">
            <div className="bg-purple-900/30 p-1.5 rounded-full mr-3 mt-0.5">
              <Users className="h-4 w-4 text-fuchsia-400" />
            </div>
            <div>
              <div className="text-sm font-medium text-white">Exclusive Syndicates</div>
              <div className="text-xs text-gray-400">Join specialized learning communities</div>
            </div>
          </div>

          <div className="bg-black/40 p-3 rounded-md border border-gray-800 flex items-start">
            <div className="bg-purple-900/30 p-1.5 rounded-full mr-3 mt-0.5">
              <Zap className="h-4 w-4 text-fuchsia-400" />
            </div>
            <div>
              <div className="text-sm font-medium text-white">Response Boost</div>
              <div className="text-xs text-gray-400">Enhance AI response quality and speed</div>
            </div>
          </div>

          <div className="bg-black/40 p-3 rounded-md border border-gray-800 flex items-start">
            <div className="bg-purple-900/30 p-1.5 rounded-full mr-3 mt-0.5">
              <RefreshCw className="h-4 w-4 text-fuchsia-400" />
            </div>
            <div>
              <div className="text-sm font-medium text-white">Knowledge Mapping</div>
              <div className="text-xs text-gray-400">Enhanced visualization and connections</div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-gray-800">
        <Button
          variant="outline"
          className="w-full border-fuchsia-900/50 bg-black/50 hover:bg-fuchsia-900/20 text-fuchsia-400"
          onClick={() => playSound("/sounds/button-click.mp3")}
        >
          View Token History
        </Button>
      </div>
    </div>
  )
}

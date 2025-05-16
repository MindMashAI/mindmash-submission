"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, X, ChevronDown, ChevronUp, ArrowRight } from "lucide-react"

interface SyndicateFeature {
  name: string
  description: string
  entropic: boolean | string
  quantum: boolean | string
  logic: boolean | string
}

export function SyndicateComparison() {
  const [isExpanded, setIsExpanded] = useState(false)

  const features: SyndicateFeature[] = [
    {
      name: "Voting Model",
      description: "How syndicate governance votes are weighted",
      entropic: "Disruption Weighted",
      quantum: "Consensus Quadratic",
      logic: "Quadratic Meritocracy",
    },
    {
      name: "SynBot Mode",
      description: "Specialized AI behavior for each syndicate",
      entropic: "Experimental Mode",
      quantum: "Fusion Mode",
      logic: "Hyper-Analytical Mode",
    },
    {
      name: "Badge Type",
      description: "Unique NFT badge earned through participation",
      entropic: "The Signal Core",
      quantum: "The Flow Sigil",
      logic: "The Logic Seal",
    },
    {
      name: "Vault Allocation",
      description: "How treasury funds are typically distributed",
      entropic: "Creative Projects",
      quantum: "Collaborative Tools",
      logic: "Strategic Development",
    },
    {
      name: "Chaos Tolerance",
      description: "Acceptance of unpredictable outcomes",
      entropic: true,
      quantum: "Moderate",
      logic: false,
    },
    {
      name: "Structure Focus",
      description: "Emphasis on organized systems",
      entropic: false,
      quantum: "Moderate",
      logic: true,
    },
    {
      name: "Cross-Syndicate Diplomacy",
      description: "Specialized tools for inter-syndicate collaboration",
      entropic: false,
      quantum: true,
      logic: "Moderate",
    },
    {
      name: "Analytics Dashboard",
      description: "Advanced metrics and performance tracking",
      entropic: false,
      quantum: "Basic",
      logic: true,
    },
    {
      name: "Prompt Engineering",
      description: "Advanced AI prompt creation and optimization",
      entropic: "Experimental",
      quantum: "Balanced",
      logic: true,
    },
    {
      name: "Emergent Pattern Recognition",
      description: "Ability to identify patterns in chaos",
      entropic: true,
      quantum: "Moderate",
      logic: "Algorithmic",
    },
  ]

  const displayedFeatures = isExpanded ? features : features.slice(0, 5)

  return (
    <Card className="border-gray-800 bg-black/80 backdrop-blur-sm text-white">
      <CardHeader className="border-b border-gray-800">
        <CardTitle className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
          Syndicate Comparison Matrix
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Feature</th>
                <th className="text-center py-3 px-4">
                  <div className="text-fuchsia-400 font-bold">Entropic Signal</div>
                  <div className="text-xs text-gray-500">Chaos Innovators</div>
                </th>
                <th className="text-center py-3 px-4">
                  <div className="text-cyan-400 font-bold">Quantum Flow</div>
                  <div className="text-xs text-gray-500">Balanced Collaborators</div>
                </th>
                <th className="text-center py-3 px-4">
                  <div className="text-amber-400 font-bold">Logic Dominion</div>
                  <div className="text-xs text-gray-500">Strategic Analysts</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {displayedFeatures.map((feature, index) => (
                <tr key={index} className="border-b border-gray-800/50">
                  <td className="py-3 px-4">
                    <div className="font-medium text-white">{feature.name}</div>
                    <div className="text-xs text-gray-500">{feature.description}</div>
                  </td>
                  <td className="text-center py-3 px-4">
                    {typeof feature.entropic === "boolean" ? (
                      feature.entropic ? (
                        <Check className="mx-auto text-green-400 h-5 w-5" />
                      ) : (
                        <X className="mx-auto text-red-400 h-5 w-5" />
                      )
                    ) : (
                      <span className="text-fuchsia-400">{feature.entropic}</span>
                    )}
                  </td>
                  <td className="text-center py-3 px-4">
                    {typeof feature.quantum === "boolean" ? (
                      feature.quantum ? (
                        <Check className="mx-auto text-green-400 h-5 w-5" />
                      ) : (
                        <X className="mx-auto text-red-400 h-5 w-5" />
                      )
                    ) : (
                      <span className="text-cyan-400">{feature.quantum}</span>
                    )}
                  </td>
                  <td className="text-center py-3 px-4">
                    {typeof feature.logic === "boolean" ? (
                      feature.logic ? (
                        <Check className="mx-auto text-green-400 h-5 w-5" />
                      ) : (
                        <X className="mx-auto text-red-400 h-5 w-5" />
                      )
                    ) : (
                      <span className="text-amber-400">{feature.logic}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Button
          variant="ghost"
          className="w-full mt-4 text-gray-400 hover:text-white border border-gray-800"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <span className="flex items-center">
              Show Less <ChevronUp className="ml-2 h-4 w-4" />
            </span>
          ) : (
            <span className="flex items-center">
              Show More Features <ChevronDown className="ml-2 h-4 w-4" />
            </span>
          )}
        </Button>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button className="bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-700 hover:to-purple-700 text-white">
            <span className="flex items-center">
              Join Entropic Signal <ArrowRight className="ml-2 h-4 w-4" />
            </span>
          </Button>
          <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white">
            <span className="flex items-center">
              Join Quantum Flow <ArrowRight className="ml-2 h-4 w-4" />
            </span>
          </Button>
          <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white">
            <span className="flex items-center">
              Join Logic Dominion <ArrowRight className="ml-2 h-4 w-4" />
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

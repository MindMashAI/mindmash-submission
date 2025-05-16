"use client"

import type React from "react"

import { useState } from "react"
import { useAudio } from "@/components/audio-manager"
import { Code, FileText, Lightbulb, BarChart, Briefcase, ChevronRight, GraduationCap } from "lucide-react"

interface Scenario {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  prompts: string[]
  color: string
}

interface DemoScenariosProps {
  onSelectPrompt: (prompt: string) => void
}

export default function DemoScenarios({ onSelectPrompt }: DemoScenariosProps) {
  const [expandedScenario, setExpandedScenario] = useState<string | null>(null)
  const { playSound } = useAudio()

  const scenarios: Scenario[] = [
    {
      id: "tech",
      title: "Technical Problem Solving",
      description: "See how multiple AI models collaborate to solve complex technical challenges",
      icon: <Code className="h-5 w-5" />,
      color: "from-blue-500 to-cyan-500",
      prompts: [
        "What's the most efficient way to implement a distributed cache system for a high-traffic web application?",
        "Compare microservices vs. monolith architecture for a fintech startup with regulatory requirements",
        "Explain quantum computing algorithms and their potential impact on cryptography",
      ],
    },
    {
      id: "creative",
      title: "Creative Collaboration",
      description: "Experience how AI models build on each other's creative ideas",
      icon: <Lightbulb className="h-5 w-5" />,
      color: "from-purple-500 to-pink-500",
      prompts: [
        "Brainstorm an innovative product that combines AR technology with sustainable living",
        "Create a cyberpunk short story set in a world where AI and humans have merged consciousness",
        "Design a new music genre that combines classical orchestration with electronic dance music",
      ],
    },
    {
      id: "analysis",
      title: "Data Analysis & Insights",
      description: "Watch AI models analyze complex data and extract meaningful insights",
      icon: <BarChart className="h-5 w-5" />,
      color: "from-green-500 to-emerald-500",
      prompts: [
        "Analyze the potential impact of climate change on global supply chains over the next decade",
        "What patterns can we identify in the adoption of cryptocurrency across different demographics?",
        "Compare the effectiveness of different remote work policies on productivity and employee satisfaction",
      ],
    },
    {
      id: "business",
      title: "Business Strategy",
      description: "See how AI collaboration can enhance business decision-making",
      icon: <Briefcase className="h-5 w-5" />,
      color: "from-amber-500 to-orange-500",
      prompts: [
        "Develop a go-to-market strategy for a new AI-powered health monitoring wearable device",
        "What are the key considerations for a US-based company expanding into Southeast Asian markets?",
        "Create a competitive analysis framework for a SaaS startup in the project management space",
      ],
    },
    {
      id: "research",
      title: "Research & Learning",
      description: "Experience how collaborative AI accelerates research and learning",
      icon: <FileText className="h-5 w-5" />,
      color: "from-red-500 to-rose-500",
      prompts: [
        "Summarize the latest research on mRNA technology applications beyond vaccines",
        "Create a learning pathway for someone wanting to transition from marketing to data science",
        "What are the most promising approaches to sustainable fusion energy, and what challenges remain?",
      ],
    },
    {
      id: "education",
      title: "Educational Applications",
      description: "Discover how AI collaboration enhances teaching and learning experiences",
      icon: <GraduationCap className="h-5 w-5" />,
      color: "from-indigo-500 to-blue-500",
      prompts: [
        "Design an adaptive learning curriculum for teaching quantum physics to high school students",
        "How can multiple AI models work together to provide personalized feedback on student essays?",
        "Create a framework for using collaborative AI to support students with different learning styles",
      ],
    },
  ]

  const handleScenarioToggle = (id: string) => {
    playSound("/sounds/button-click.mp3")
    setExpandedScenario(expandedScenario === id ? null : id)
  }

  // Update the handlePromptSelect function to make it more functional
  const handlePromptSelect = (prompt: string) => {
    playSound("/sounds/tech-select.mp3")

    console.log("PROMPT SELECTED:", prompt)

    onSelectPrompt(prompt)
  }

  return (
    <div className="border border-gray-800 bg-black/80 rounded-md p-4">
      <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-4">
        Demo Scenarios
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {scenarios.map((scenario) => (
          <div key={scenario.id} className="border border-gray-800 rounded-md overflow-hidden">
            <div
              className={`p-3 flex items-center justify-between cursor-pointer bg-gradient-to-r bg-opacity-10 hover:bg-opacity-20 ${
                expandedScenario === scenario.id ? "border-b border-gray-800" : ""
              }`}
              style={{
                backgroundImage: `linear-gradient(to right, rgba(${
                  scenario.id === "tech"
                    ? "59, 130, 246, 0.1"
                    : scenario.id === "creative"
                      ? "168, 85, 247, 0.1"
                      : scenario.id === "analysis"
                        ? "16, 185, 129, 0.1"
                        : scenario.id === "business"
                          ? "245, 158, 11, 0.1"
                          : "239, 68, 68, 0.1"
                }), rgba(${
                  scenario.id === "tech"
                    ? "14, 165, 233, 0.1"
                    : scenario.id === "creative"
                      ? "236, 72, 153, 0.1"
                      : scenario.id === "analysis"
                        ? "5, 150, 105, 0.1"
                        : scenario.id === "business"
                          ? "234, 88, 12, 0.1"
                          : "225, 29, 72, 0.1"
                }))`,
              }}
              onClick={() => handleScenarioToggle(scenario.id)}
            >
              <div className="flex items-center">
                <div className={`p-2 rounded-full bg-gradient-to-r ${scenario.color} mr-3`}>{scenario.icon}</div>
                <div>
                  <h3 className="font-medium">{scenario.title}</h3>
                  <p className="text-sm text-gray-400">{scenario.description}</p>
                </div>
              </div>
              <ChevronRight
                className={`h-5 w-5 text-gray-500 transition-transform ${
                  expandedScenario === scenario.id ? "rotate-90" : ""
                }`}
              />
            </div>

            {expandedScenario === scenario.id && (
              <div className="p-3 space-y-2 bg-black/50">
                {scenario.prompts.map((prompt, index) => (
                  <div
                    key={index}
                    className="p-3 border border-gray-700 rounded hover:border-cyan-600 cursor-pointer transition-colors hover:bg-gray-900/50 active:bg-gray-800/70"
                    onClick={() => handlePromptSelect(prompt)}
                  >
                    <p className="text-sm">{prompt}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

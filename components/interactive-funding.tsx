"use client"

import { useState, useEffect } from "react"
import { Sparkles, Zap, Rocket, Check, ArrowRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function InteractiveFunding() {
  const [step, setStep] = useState(0)
  const [selectedTier, setSelectedTier] = useState<number | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showThanks, setShowThanks] = useState(false)

  const fundingTiers = [
    {
      name: "Seed",
      amount: "$25K",
      icon: <Sparkles className="h-6 w-6 text-cyan-400" />,
      color: "from-cyan-500 to-blue-500",
      benefits: ["Early access to beta", "Team mentorship sessions", "Recognition in docs"],
    },
    {
      name: "Growth",
      amount: "$100K",
      icon: <Zap className="h-6 w-6 text-purple-400" />,
      color: "from-purple-500 to-pink-500",
      benefits: [
        "All Seed benefits",
        "Advisory board position",
        "Custom syndicate creation",
        "Co-marketing opportunities",
      ],
    },
    {
      name: "Accelerate",
      amount: "$500K+",
      icon: <Rocket className="h-6 w-6 text-amber-400" />,
      color: "from-amber-500 to-red-500",
      benefits: [
        "All Growth benefits",
        "Strategic partnership",
        "Custom integration pathway",
        "Equity stake options",
        "Dedicated support team",
      ],
    },
  ]

  const handleSelectTier = (index: number) => {
    setSelectedTier(index)
    setTimeout(() => {
      setStep(2)
    }, 500)
  }

  const handleSubmit = () => {
    setShowConfetti(true)
    setTimeout(() => {
      setShowThanks(true)
    }, 1500)
  }

  const resetDemo = () => {
    setStep(0)
    setSelectedTier(null)
    setShowConfetti(false)
    setShowThanks(false)
  }

  // Confetti effect
  useEffect(() => {
    if (!showConfetti) return

    const confettiCount = 150
    const container = document.getElementById("confetti-container")
    if (!container) return

    // Clear any existing confetti
    container.innerHTML = ""

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement("div")
      confetti.className = "absolute w-2 h-2 rounded-full"

      // Random position, color, and animation
      const left = Math.random() * 100
      const animationDuration = 1 + Math.random() * 2
      const animationDelay = Math.random()
      const colors = ["bg-cyan-500", "bg-purple-500", "bg-pink-500", "bg-amber-500", "bg-green-500"]
      const color = colors[Math.floor(Math.random() * colors.length)]

      confetti.classList.add(color)
      confetti.style.left = `${left}%`
      confetti.style.top = "0"
      confetti.style.animationDuration = `${animationDuration}s`
      confetti.style.animationDelay = `${animationDelay}s`
      confetti.style.animation = "confetti-fall linear forwards"

      container.appendChild(confetti)
    }

    return () => {
      if (container) container.innerHTML = ""
    }
  }, [showConfetti])

  if (showThanks) {
    return (
      <div className="relative bg-black/60 backdrop-blur-md rounded-lg border border-green-500 p-8 max-w-md mx-auto text-center">
        <div className="absolute -top-10 -left-10 -right-10 -bottom-10 bg-green-500/10 rounded-lg blur-xl z-0"></div>
        <div className="relative z-10">
          <div className="mx-auto w-16 h-16 bg-green-900/50 rounded-full flex items-center justify-center mb-4">
            <Check className="h-8 w-8 text-green-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Thank You!</h3>
          <p className="text-green-300 mb-6">
            Your interest has been recorded. Our team will contact you shortly to discuss next steps.
          </p>
          <Button onClick={resetDemo} className="bg-black border border-green-500 text-green-400 hover:bg-green-900/30">
            Start Over
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Confetti container */}
      <div id="confetti-container" className="absolute inset-0 overflow-hidden pointer-events-none"></div>

      {step === 0 && (
        <div className="relative group cursor-pointer" onClick={() => setStep(1)}>
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 via-red-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          <button className="relative px-8 py-6 bg-black rounded-lg leading-none flex items-center divide-x divide-gray-600">
            <span className="flex items-center space-x-3 pr-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-pink-600 -rotate-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                />
              </svg>
              <span className="text-xl font-semibold text-gray-100 group-hover:text-white transition duration-200">
                Fund Our Vision
              </span>
            </span>
            <span className="pl-6 text-orange-400 group-hover:text-gray-100 transition duration-200 flex items-center">
              <span className="pr-2">Explore options</span>
              <ArrowRight className="h-5 w-5" />
            </span>
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="bg-black/60 backdrop-blur-md rounded-lg border border-gray-800 p-6 max-w-3xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">Select Funding Tier</h3>
            <Button variant="ghost" size="icon" onClick={resetDemo} className="h-8 w-8 rounded-full">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {fundingTiers.map((tier, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 cursor-pointer transition-all duration-300 hover:scale-105 ${
                  selectedTier === index
                    ? `border-2 bg-gradient-to-br ${tier.color} bg-opacity-20`
                    : "border-gray-700 hover:border-gray-500"
                }`}
                onClick={() => handleSelectTier(index)}
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center">
                    {tier.icon}
                    <span className="ml-2 font-bold">{tier.name}</span>
                  </div>
                  <span className="text-lg font-bold">{tier.amount}</span>
                </div>

                <ul className="space-y-2 text-sm">
                  {tier.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-4 w-4 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center text-sm text-gray-400">
            All funding tiers include regular updates and access to our investor community
          </div>
        </div>
      )}

      {step === 2 && selectedTier !== null && (
        <div className="bg-black/60 backdrop-blur-md rounded-lg border border-gray-800 p-6 max-w-md">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">Contact Information</h3>
            <Button variant="ghost" size="icon" onClick={() => setStep(1)} className="h-8 w-8 rounded-full">
              <ArrowRight className="h-4 w-4 rotate-180" />
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
              <input
                type="text"
                className="w-full bg-gray-900/50 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
              <input
                type="email"
                className="w-full bg-gray-900/50 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Company</label>
              <input
                type="text"
                className="w-full bg-gray-900/50 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="Your company"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Message (Optional)</label>
              <textarea
                className="w-full bg-gray-900/50 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="Tell us more about your interest..."
                rows={3}
              />
            </div>
          </div>

          <div className="mt-6">
            <Button
              onClick={handleSubmit}
              className={`w-full py-2 rounded-md font-medium text-white bg-gradient-to-r ${fundingTiers[selectedTier].color}`}
            >
              Submit Interest
            </Button>
          </div>

          <div className="mt-4 text-center text-xs text-gray-500">
            Your information is secure and will only be used to contact you about MindMash.AI
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-10px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(400px) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}

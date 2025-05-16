"use client"

import { useState, useEffect } from "react"
import { MessageSquare, Lightbulb, Share2, Star, ArrowRight, X, Check, ThumbsUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function InteractiveFeedback() {
  const [step, setStep] = useState(0)
  const [selectedArea, setSelectedArea] = useState<number | null>(null)
  const [feedback, setFeedback] = useState("")
  const [rating, setRating] = useState<number | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showThanks, setShowThanks] = useState(false)

  const feedbackAreas = [
    {
      name: "Technical Innovation",
      icon: <Lightbulb className="h-6 w-6 text-yellow-400" />,
      color: "from-yellow-500 to-amber-500",
      description: "Share thoughts on our technical approach and architecture",
    },
    {
      name: "Market Potential",
      icon: <Share2 className="h-6 w-6 text-cyan-400" />,
      color: "from-cyan-500 to-blue-500",
      description: "Provide insights on market fit and growth potential",
    },
    {
      name: "User Experience",
      icon: <ThumbsUp className="h-6 w-6 text-green-400" />,
      color: "from-green-500 to-emerald-500",
      description: "Evaluate our interface design and user journey",
    },
    {
      name: "Overall Impression",
      icon: <Star className="h-6 w-6 text-purple-400" />,
      color: "from-purple-500 to-pink-500",
      description: "Share your general thoughts on our project",
    },
  ]

  const handleSelectArea = (index: number) => {
    setSelectedArea(index)
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
    setSelectedArea(null)
    setFeedback("")
    setRating(null)
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
            Your feedback is invaluable to us. We appreciate you taking the time to share your thoughts!
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
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 via-purple-600 to-blue-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          <button className="relative px-8 py-6 bg-black rounded-lg leading-none flex items-center divide-x divide-gray-600">
            <span className="flex items-center space-x-3 pr-6">
              <MessageSquare className="h-6 w-6 text-cyan-500 -rotate-6" />
              <span className="text-xl font-semibold text-gray-100 group-hover:text-white transition duration-200">
                Share Your Feedback
              </span>
            </span>
            <span className="pl-6 text-cyan-400 group-hover:text-gray-100 transition duration-200 flex items-center">
              <span className="pr-2">Help us improve</span>
              <ArrowRight className="h-5 w-5" />
            </span>
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="bg-black/60 backdrop-blur-md rounded-lg border border-gray-800 p-6 max-w-3xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">What would you like to provide feedback on?</h3>
            <Button variant="ghost" size="icon" onClick={resetDemo} className="h-8 w-8 rounded-full">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {feedbackAreas.map((area, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 cursor-pointer transition-all duration-300 hover:scale-105 ${
                  selectedArea === index
                    ? `border-2 bg-gradient-to-br ${area.color} bg-opacity-20`
                    : "border-gray-700 hover:border-gray-500"
                }`}
                onClick={() => handleSelectArea(index)}
              >
                <div className="flex items-center mb-3">
                  {area.icon}
                  <span className="ml-2 font-bold">{area.name}</span>
                </div>
                <p className="text-sm text-gray-300">{area.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center text-sm text-gray-400">
            Your feedback helps us refine our project and vision
          </div>
        </div>
      )}

      {step === 2 && selectedArea !== null && (
        <div className="bg-black/60 backdrop-blur-md rounded-lg border border-gray-800 p-6 max-w-md">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">{feedbackAreas[selectedArea].name} Feedback</h3>
            <Button variant="ghost" size="icon" onClick={() => setStep(1)} className="h-8 w-8 rounded-full">
              <ArrowRight className="h-4 w-4 rotate-180" />
            </Button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Your thoughts</label>
              <textarea
                className="w-full bg-gray-900/50 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="Share your feedback on our project..."
                rows={5}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-3">Rating</label>
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`h-10 w-10 rounded-full flex items-center justify-center transition-all ${
                      rating && star <= rating
                        ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white"
                        : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                    }`}
                  >
                    <Star className={`h-6 w-6 ${rating && star <= rating ? "fill-current" : ""}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Button
              onClick={handleSubmit}
              className={`w-full py-2 rounded-md font-medium text-white bg-gradient-to-r ${feedbackAreas[selectedArea].color}`}
              disabled={!feedback.trim() || rating === null}
            >
              Submit Feedback
            </Button>
          </div>

          <div className="mt-4 text-center text-xs text-gray-500">Your feedback will help us improve MindMash.AI</div>
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

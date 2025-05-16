"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Check, ChevronRight, Users, Zap, Lock } from "lucide-react"

export function SyndicateOnboarding() {
  const [step, setStep] = useState(1)
  const [selectedSyndicate, setSelectedSyndicate] = useState<string | null>(null)
  const [username, setUsername] = useState("")
  const [bio, setBio] = useState("")
  const [interests, setInterests] = useState<string[]>([])
  const [isComplete, setIsComplete] = useState(false)

  const totalSteps = 4
  const progress = (step / totalSteps) * 100

  const availableInterests = [
    "AI Development",
    "Prompt Engineering",
    "DAO Governance",
    "Web3",
    "Creative Coding",
    "Data Science",
    "Neural Networks",
    "Generative Art",
    "Cybersecurity",
    "Quantum Computing",
  ]

  const handleInterestToggle = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter((i) => i !== interest))
    } else {
      setInterests([...interests, interest])
    }
  }

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      setIsComplete(true)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const getSyndicateColor = (syndicate: string) => {
    switch (syndicate) {
      case "entropic":
        return "from-fuchsia-600 to-purple-600"
      case "quantum":
        return "from-cyan-600 to-blue-600"
      case "logic":
        return "from-amber-600 to-orange-600"
      default:
        return "from-gray-600 to-gray-700"
    }
  }

  return (
    <Card className="border-gray-800 bg-black/90 backdrop-blur-sm text-white w-full max-w-2xl mx-auto">
      <CardHeader className="border-b border-gray-800">
        <CardTitle className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
          Join a Syndicate
        </CardTitle>
        <Progress value={progress} className="h-1 bg-gray-800">
          <div
            className={`h-full bg-gradient-to-r ${
              selectedSyndicate ? getSyndicateColor(selectedSyndicate) : "from-purple-600 to-cyan-600"
            } rounded-full transition-all duration-500 ease-in-out`}
            style={{ width: `${progress}%` }}
          />
        </Progress>
      </CardHeader>

      <CardContent className="pt-6">
        {/* Step 1: Choose Syndicate */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white mb-4">Choose Your Syndicate</h2>
            <p className="text-gray-400 mb-6">
              Select the syndicate that best aligns with your collaboration style and philosophical approach.
            </p>

            <RadioGroup value={selectedSyndicate || ""} onValueChange={setSelectedSyndicate}>
              <div className="space-y-4">
                <div
                  className={`border rounded-lg p-4 ${selectedSyndicate === "entropic" ? "border-fuchsia-500 bg-fuchsia-900/20" : "border-gray-800 hover:border-fuchsia-500/50 hover:bg-fuchsia-900/10"} transition-all cursor-pointer`}
                >
                  <RadioGroupItem value="entropic" id="entropic" className="sr-only" />
                  <Label htmlFor="entropic" className="flex items-start cursor-pointer">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className="text-lg font-bold text-fuchsia-400">Entropic Signal</h3>
                        {selectedSyndicate === "entropic" && <Check className="ml-2 h-4 w-4 text-fuchsia-400" />}
                      </div>
                      <p className="text-gray-400 text-sm mt-1">
                        Unpredictable, decentralized creative bursts. Value edge-tech, boundary-pushing ideas, and
                        spontaneous breakthroughs.
                      </p>
                    </div>
                  </Label>
                </div>

                <div
                  className={`border rounded-lg p-4 ${selectedSyndicate === "quantum" ? "border-cyan-500 bg-cyan-900/20" : "border-gray-800 hover:border-cyan-500/50 hover:bg-cyan-900/10"} transition-all cursor-pointer`}
                >
                  <RadioGroupItem value="quantum" id="quantum" className="sr-only" />
                  <Label htmlFor="quantum" className="flex items-start cursor-pointer">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className="text-lg font-bold text-cyan-400">Quantum Flow</h3>
                        {selectedSyndicate === "quantum" && <Check className="ml-2 h-4 w-4 text-cyan-400" />}
                      </div>
                      <p className="text-gray-400 text-sm mt-1">
                        Balance between logic and inspiration. Prize adaptable teamwork, nuanced collaboration, and
                        collective resonance.
                      </p>
                    </div>
                  </Label>
                </div>

                <div
                  className={`border rounded-lg p-4 ${selectedSyndicate === "logic" ? "border-amber-500 bg-amber-900/20" : "border-gray-800 hover:border-amber-500/50 hover:bg-amber-900/10"} transition-all cursor-pointer`}
                >
                  <RadioGroupItem value="logic" id="logic" className="sr-only" />
                  <Label htmlFor="logic" className="flex items-start cursor-pointer">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className="text-lg font-bold text-amber-400">Logic Dominion</h3>
                        {selectedSyndicate === "logic" && <Check className="ml-2 h-4 w-4 text-amber-400" />}
                      </div>
                      <p className="text-gray-400 text-sm mt-1">
                        Tactical, ordered thinking. Leaders, DAO tacticians, and pattern-masters who engineer their
                        influence deliberately.
                      </p>
                    </div>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>
        )}

        {/* Step 2: Create Profile */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white mb-4">Create Your Syndicate Profile</h2>
            <p className="text-gray-400 mb-6">
              Set up your identity within the{" "}
              {selectedSyndicate === "entropic"
                ? "Entropic Signal"
                : selectedSyndicate === "quantum"
                  ? "Quantum Flow"
                  : "Logic Dominion"}{" "}
              syndicate.
            </p>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white">
                  Syndicate Username
                </Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a unique username"
                  className="bg-gray-900/50 border-gray-700 focus:border-purple-500 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-white">
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell other members about yourself..."
                  className="bg-gray-900/50 border-gray-700 focus:border-purple-500 text-white min-h-[100px]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Select Interests */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white mb-4">Select Your Interests</h2>
            <p className="text-gray-400 mb-6">
              Choose topics that interest you to help connect with like-minded syndicate members.
            </p>

            <div className="grid grid-cols-2 gap-2">
              {availableInterests.map((interest) => (
                <div
                  key={interest}
                  onClick={() => handleInterestToggle(interest)}
                  className={`border rounded-md p-2 cursor-pointer flex items-center justify-between ${
                    interests.includes(interest)
                      ? `border-${selectedSyndicate === "entropic" ? "fuchsia" : selectedSyndicate === "quantum" ? "cyan" : "amber"}-500 bg-${selectedSyndicate === "entropic" ? "fuchsia" : selectedSyndicate === "quantum" ? "cyan" : "amber"}-900/20`
                      : "border-gray-800 hover:bg-gray-800/50"
                  }`}
                >
                  <span className="text-sm">{interest}</span>
                  {interests.includes(interest) && (
                    <Check
                      className={`h-4 w-4 text-${selectedSyndicate === "entropic" ? "fuchsia" : selectedSyndicate === "quantum" ? "cyan" : "amber"}-400`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Confirm */}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white mb-4">Confirm Your Membership</h2>
            <p className="text-gray-400 mb-6">Review your syndicate selection and profile details before finalizing.</p>

            <div className="space-y-4">
              <div
                className={`border rounded-lg p-4 border-${selectedSyndicate === "entropic" ? "fuchsia" : selectedSyndicate === "quantum" ? "cyan" : "amber"}-500/30 bg-${selectedSyndicate === "entropic" ? "fuchsia" : selectedSyndicate === "quantum" ? "cyan" : "amber"}-900/10`}
              >
                <h3
                  className={`text-lg font-bold text-${selectedSyndicate === "entropic" ? "fuchsia" : selectedSyndicate === "quantum" ? "cyan" : "amber"}-400 mb-2`}
                >
                  {selectedSyndicate === "entropic"
                    ? "Entropic Signal"
                    : selectedSyndicate === "quantum"
                      ? "Quantum Flow"
                      : "Logic Dominion"}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                  <Users className="h-4 w-4" />
                  <span>Monthly dues: $3 USDC</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                  <Lock className="h-4 w-4" />
                  <span>6-month treasury lock period</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Zap className="h-4 w-4" />
                  <span>Specialized AI capabilities</span>
                </div>
              </div>

              <div className="border rounded-lg p-4 border-gray-800 bg-black/50">
                <h3 className="text-lg font-bold text-white mb-2">Your Profile</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-500 text-sm">Username:</span>
                    <span className="text-white ml-2">{username || "Not set"}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Bio:</span>
                    <p className="text-white text-sm mt-1">{bio || "Not set"}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Interests:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {interests.length > 0 ? (
                        interests.map((interest) => (
                          <span
                            key={interest}
                            className={`text-xs px-2 py-0.5 rounded-full bg-${selectedSyndicate === "entropic" ? "fuchsia" : selectedSyndicate === "quantum" ? "cyan" : "amber"}-900/20 border border-${selectedSyndicate === "entropic" ? "fuchsia" : selectedSyndicate === "quantum" ? "cyan" : "amber"}-500/30 text-${selectedSyndicate === "entropic" ? "fuchsia" : selectedSyndicate === "quantum" ? "cyan" : "amber"}-400`}
                          >
                            {interest}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500 text-sm">None selected</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Completion Screen */}
        {isComplete && (
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-green-900/30 flex items-center justify-center">
              <Check className="h-8 w-8 text-green-400" />
            </div>
            <h2 className="text-xl font-bold text-white">
              Welcome to{" "}
              {selectedSyndicate === "entropic"
                ? "Entropic Signal"
                : selectedSyndicate === "quantum"
                  ? "Quantum Flow"
                  : "Logic Dominion"}
              !
            </h2>
            <p className="text-gray-400">
              Your membership has been confirmed. You now have access to all syndicate features and benefits.
            </p>
            <div className="pt-4">
              <Button
                className={`bg-gradient-to-r ${getSyndicateColor(selectedSyndicate || "")} text-white`}
                onClick={() => window.location.reload()}
              >
                Explore Your Syndicate
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      {!isComplete && (
        <CardFooter className="border-t border-gray-800 flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
            className="border-gray-700 text-gray-300 hover:bg-gray-800/50"
          >
            Back
          </Button>

          <Button
            onClick={handleNext}
            disabled={step === 1 && !selectedSyndicate}
            className={`bg-gradient-to-r ${
              selectedSyndicate ? getSyndicateColor(selectedSyndicate) : "from-purple-600 to-cyan-600"
            } text-white`}
          >
            {step < totalSteps ? (
              <span className="flex items-center">
                Next <ChevronRight className="ml-1 h-4 w-4" />
              </span>
            ) : (
              "Confirm Membership"
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

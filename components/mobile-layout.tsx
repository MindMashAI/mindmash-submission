"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Menu, X, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAudio } from "@/components/audio-manager"

interface MobileLayoutProps {
  currentSlide: number
  totalSlides: number
  onNavigate: (slideIndex: number) => void
  children: React.ReactNode
  slideInfo: { title: string; description: string }
}

export default function MobileLayout({
  currentSlide,
  totalSlides,
  onNavigate,
  children,
  slideInfo,
}: MobileLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [infoOpen, setInfoOpen] = useState(false)
  const { playSound } = useAudio()

  // Close menu when changing slides
  useEffect(() => {
    setMenuOpen(false)
    setInfoOpen(false)
  }, [currentSlide])

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
    playSound("/sounds/button-click.mp3")
  }

  const toggleInfo = () => {
    setInfoOpen(!infoOpen)
    playSound("/sounds/button-click.mp3")
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-black text-white">
      {/* Main content */}
      <div className="h-full w-full overflow-y-auto pb-20">{children}</div>

      {/* Mobile navigation controls */}
      <div className="fixed bottom-4 left-0 right-0 flex justify-center items-center z-50 px-4">
        <div className="flex items-center space-x-2 bg-black/80 backdrop-blur-md rounded-full border border-cyan-900/50 p-1 shadow-lg">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate(currentSlide - 1)}
            disabled={currentSlide === 0}
            className="h-10 w-10 rounded-full bg-black/50 text-cyan-400 disabled:text-gray-600"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            className="h-10 w-10 rounded-full bg-black/50 text-purple-400"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleInfo}
            className="h-10 w-10 rounded-full bg-black/50 text-cyan-400"
            aria-label="Slide information"
          >
            <Info className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate(currentSlide + 1)}
            disabled={currentSlide === totalSlides - 1}
            className="h-10 w-10 rounded-full bg-black/50 text-cyan-400 disabled:text-gray-600"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Slide menu overlay */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col p-4 animate-fadeIn">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-cyan-400">Slides</h2>
            <Button variant="ghost" size="icon" onClick={toggleMenu} className="h-8 w-8 rounded-full">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="space-y-2">
              {[
                { num: 1, label: "INTRO" },
                { num: 2, label: "PROBLEM" },
                { num: 3, label: "SOLUTION" },
                { num: 4, label: "FEATURES" },
                { num: 5, label: "WHY" },
                { num: 6, label: "TECH" },
                { num: 7, label: "PROGRESS" },
                { num: 8, label: "ROADMAP" },
                { num: 9, label: "ASK" },
                { num: 10, label: "THANKS" },
              ].map((item) => (
                <button
                  key={item.num}
                  onClick={() => onNavigate(item.num - 1)}
                  className={`w-full text-left py-3 px-4 rounded-md transition-colors ${
                    currentSlide === item.num - 1
                      ? "bg-cyan-900/50 text-cyan-400"
                      : "hover:bg-gray-800/50 text-gray-400 hover:text-gray-300"
                  }`}
                >
                  {item.num}. {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Slide info overlay */}
      {infoOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col p-4 animate-fadeIn">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-cyan-400">Slide Information</h2>
            <Button variant="ghost" size="icon" onClick={toggleInfo} className="h-8 w-8 rounded-full">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="bg-gray-900/50 rounded-lg p-4 border border-cyan-900/50">
            <h3 className="text-2xl font-bold mb-2">{slideInfo.title}</h3>
            <p className="text-gray-300">{slideInfo.description}</p>

            <div className="mt-6 flex justify-between items-center">
              <div className="text-sm text-gray-400">
                Slide {currentSlide + 1} of {totalSlides}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNavigate(currentSlide - 1)}
                  disabled={currentSlide === 0}
                  className="h-8 border-cyan-900 text-cyan-400 disabled:opacity-50"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNavigate(currentSlide + 1)}
                  disabled={currentSlide === totalSlides - 1}
                  className="h-8 border-cyan-900 text-cyan-400 disabled:opacity-50"
                >
                  Next
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-gray-900/50 rounded-lg p-4 border border-cyan-900/50">
            <h3 className="text-lg font-bold mb-2">Navigation Tips</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start">
                <span className="bg-gray-800 rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                  1
                </span>
                <span>Swipe left/right to navigate between slides</span>
              </li>
              <li className="flex items-start">
                <span className="bg-gray-800 rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                  2
                </span>
                <span>Tap and hold interactive elements to explore them</span>
              </li>
              <li className="flex items-start">
                <span className="bg-gray-800 rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                  3
                </span>
                
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

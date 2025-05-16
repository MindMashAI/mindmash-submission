"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { useAudio } from "@/components/audio-manager"
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Music,
  Radio,
  Sparkles,
  Zap,
  Crown,
  Clock,
} from "lucide-react"

interface Track {
  id: string
  title: string
  artist: string
  file: string
  duration: string
  featured: boolean
  mashbits: number
  plays: number
}

export default function MashwavRadio() {
  const { playSound } = useAudio()
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showMintModal, setShowMintModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const isInitialMount = useRef(true)

  // Sample tracks
  const tracks: Track[] = [
    {
      id: "1",
      title: "Neural Drip",
      artist: "MindMash Collective",
      file: "/audio/neural-drip.mp3",
      duration: "2:45",
      featured: true,
      mashbits: 1250,
      plays: 3427,
    },
    {
      id: "2",
      title: "Outta Orbit",
      artist: "Quantum Beats",
      file: "/audio/outta-orbit.mp3",
      duration: "3:12",
      featured: false,
      mashbits: 780,
      plays: 1892,
    },
  ]

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio()
    audioRef.current = audio

    const handleCanPlay = () => {
      setIsLoading(false)
      setDuration(audio.duration || 0)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
      // Go to next track
      setCurrentTrackIndex((prev) => (prev + 1) % tracks.length)
    }

    const handleError = (e: Event) => {
      console.error("Audio error:", e)
      setIsLoading(false)
      setIsPlaying(false)
    }

    audio.addEventListener("canplay", handleCanPlay)
    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("error", handleError)
    audio.volume = volume

    // Load the initial track
    setIsLoading(true)
    audio.src = tracks[currentTrackIndex].file
    audio.load()

    return () => {
      audio.pause()
      audio.removeEventListener("canplay", handleCanPlay)
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("error", handleError)
      audio.src = ""
    }
  }, [])

  // Handle track changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    if (audioRef.current) {
      const wasPlaying = isPlaying

      // Always pause before changing track
      audioRef.current.pause()
      setIsPlaying(false)

      setIsLoading(true)
      audioRef.current.src = tracks[currentTrackIndex].file
      audioRef.current.load()

      // Only auto-play if we were already playing
      audioRef.current.oncanplay = () => {
        setIsLoading(false)
        setDuration(audioRef.current?.duration || 0)

        if (wasPlaying) {
          const playPromise = audioRef.current?.play()
          if (playPromise) {
            playPromise
              .then(() => {
                setIsPlaying(true)
              })
              .catch((e) => {
                console.error("Error auto-playing after track change:", e)
              })
          }
        }

        // Remove the oncanplay handler to avoid multiple calls
        if (audioRef.current) {
          audioRef.current.oncanplay = null
        }
      }
    }
  }, [currentTrackIndex])

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  const togglePlay = () => {
    if (!audioRef.current || isLoading) return

    playSound("/sounds/button-click.mp3")

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      const playPromise = audioRef.current.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true)
          })
          .catch((e) => {
            console.error("Error playing audio:", e)
            setIsPlaying(false)
          })
      }
    }
  }

  const nextTrack = () => {
    if (isLoading) return
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % tracks.length)
    playSound("/sounds/tech-select.mp3")
  }

  const prevTrack = () => {
    if (isLoading) return
    setCurrentTrackIndex((prevIndex) => (prevIndex - 1 + tracks.length) % tracks.length)
    playSound("/sounds/tech-select.mp3")
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    playSound("/sounds/button-click.mp3")
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0])
    if (isMuted && value[0] > 0) {
      setIsMuted(false)
    }
  }

  const handleSeek = (value: number[]) => {
    if (audioRef.current && !isLoading) {
      audioRef.current.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const handleMintClick = () => {
    setShowMintModal(true)
    playSound("/sounds/feature-select.mp3")
  }

  const currentTrack = tracks[currentTrackIndex]

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
          Mash.WAV Radio
        </h2>
        <div className="flex items-center">
          <Radio className="h-4 w-4 text-cyan-400 mr-1" />
          <span className="text-xs text-cyan-400">LIVE</span>
        </div>
      </div>

      {/* Now Playing */}
      <div className="bg-black/60 border border-gray-800 rounded-md p-4 mb-4">
        <div className="flex items-center mb-3">
          <div className="relative mr-3">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-md flex items-center justify-center">
              <Music className="h-8 w-8 text-white" />
            </div>
            {currentTrack.featured && (
              <div className="absolute -top-2 -right-2 bg-amber-500 rounded-full p-1">
                <Crown className="h-3 w-3 text-black" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-white">{currentTrack.title}</h3>
            <p className="text-sm text-gray-400">{currentTrack.artist}</p>
            <div className="flex items-center mt-1">
              <div className="flex items-center text-xs text-cyan-400 mr-3">
                <Zap className="h-3 w-3 mr-1" />
                <span>{currentTrack.mashbits} MashBits</span>
              </div>
              <div className="flex items-center text-xs text-gray-400">
                <Clock className="h-3 w-3 mr-1" />
                <span>{currentTrack.plays} plays</span>
              </div>
            </div>
          </div>
        </div>

        {/* Playback controls */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>{formatTime(currentTime)}</span>
            <span>{duration ? formatTime(duration) : "--:--"}</span>
          </div>
          <Slider
            value={[currentTime]}
            min={0}
            max={duration || 100}
            step={1}
            onValueChange={handleSeek}
            className="cursor-pointer"
            disabled={isLoading}
          />
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-gray-800"
                onClick={prevTrack}
                disabled={isLoading}
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button
                variant="default"
                size="icon"
                className={`h-10 w-10 rounded-full ${
                  isPlaying
                    ? "bg-cyan-600 hover:bg-cyan-700"
                    : "bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                }`}
                onClick={togglePlay}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4 ml-0.5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-gray-800"
                onClick={nextTrack}
                disabled={isLoading}
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center space-x-2 w-24">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-gray-800"
                onClick={toggleMute}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume]}
                min={0}
                max={1}
                step={0.01}
                onValueChange={handleVolumeChange}
                className="cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Featured Tracks - Increased height to stretch down */}
      <div className="flex-1 flex flex-col mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-300">Featured Tracks</h3>
          <Button variant="link" className="text-xs text-cyan-400 p-0 h-auto">
            View All
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto pr-1 min-h-[250px]">
          <div className="space-y-2">
            {tracks.map((track, index) => (
              <div
                key={track.id}
                className={`flex items-center p-2 rounded-md cursor-pointer ${
                  currentTrackIndex === index
                    ? "bg-gradient-to-r from-purple-900/30 to-cyan-900/30 border border-cyan-800/50"
                    : "hover:bg-gray-800/50"
                }`}
                onClick={() => {
                  if (isLoading) return
                  setCurrentTrackIndex(index)
                  playSound("/sounds/tech-select.mp3")
                }}
              >
                <div className="relative mr-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-md flex items-center justify-center">
                    <Music className="h-5 w-5 text-white" />
                  </div>
                  {track.featured && (
                    <div className="absolute -top-1 -right-1 bg-amber-500 rounded-full p-0.5">
                      <Crown className="h-2 w-2 text-black" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{track.title}</div>
                  <div className="text-xs text-gray-400 truncate">{track.artist}</div>
                </div>
                <div className="text-xs text-gray-400 ml-2">{track.duration}</div>
              </div>
            ))}

            {/* Add more dummy tracks to ensure scrolling and fill space */}
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={`dummy-${i}`}
                className="flex items-center p-2 rounded-md cursor-pointer hover:bg-gray-800/50"
                onClick={() => playSound("/sounds/tech-select.mp3")}
              >
                <div className="relative mr-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-md flex items-center justify-center">
                    <Music className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">Upcoming Track {i + 1}</div>
                  <div className="text-xs text-gray-400 truncate">Various Artists</div>
                </div>
                <div className="text-xs text-gray-400 ml-2">--:--</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mint Your Music */}
      <div className="mt-auto">
        <div className="bg-black/60 border border-gray-800 rounded-md p-4">
          <h3 className="text-sm font-semibold text-white mb-2">Mint Your Music</h3>
          <p className="text-xs text-gray-400 mb-3">
            Turn your tracks into NFTs and earn MashBits when they get played on Mash.WAV Radio.
          </p>
          <Button
            className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
            onClick={handleMintClick}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Mint Music NFT
          </Button>
        </div>
      </div>

      {/* Mint Modal */}
      {showMintModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setShowMintModal(false)}
        >
          <div
            className="bg-black/90 border border-cyan-800 rounded-lg p-6 max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-4">
              Mint Your Music as NFT
            </h3>
            <p className="text-sm text-gray-300 mb-4">
              Upload your track, set royalty preferences, and mint it as an NFT on the Solana blockchain.
            </p>

            <div className="space-y-4 mb-6">
              <div className="border-2 border-dashed border-gray-700 rounded-md p-6 text-center">
                <Music className="h-10 w-10 text-gray-500 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Drag & drop your audio file here</p>
                <p className="text-xs text-gray-500 mt-1">MP3, WAV, FLAC (max 50MB)</p>
                <Button variant="outline" size="sm" className="mt-3">
                  Browse Files
                </Button>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Track Title</label>
                <input
                  type="text"
                  className="w-full bg-black/60 border border-gray-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-cyan-500"
                  placeholder="Enter track title"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Artist Name</label>
                <input
                  type="text"
                  className="w-full bg-black/60 border border-gray-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-cyan-500"
                  placeholder="Your artist name"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Royalty Percentage</label>
                <div className="flex items-center">
                  <Slider defaultValue={[10]} min={0} max={25} step={1} className="flex-1 mr-3" />
                  <span className="text-sm text-white">10%</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800/50"
                onClick={() => setShowMintModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                onClick={() => {
                  setShowMintModal(false)
                  playSound("/sounds/feature-select.mp3")
                }}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Mint NFT
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

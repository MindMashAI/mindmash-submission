"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useAudio } from "@/components/audio-manager"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Bot,
  User,
  Send,
  Mic,
  MicOff,
  Wallet,
  Coins,
  Download,
  Copy,
  HelpCircle,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  MessageSquare,
  X,
  Cpu,
} from "lucide-react"

interface Message {
  id: number
  sender: "synbot" | "user" | "system"
  content: string
  timestamp: string
  isCommand?: boolean
  commandResult?: any
}

interface SynBotChatProps {
  synbot: any
  expanded: boolean
  onToggleExpand: () => void
  onEmotionChange?: (emotion: string) => void
}

const WALLET_COMMANDS = [
  { command: "/balance", description: "Check your wallet balance" },
  { command: "/send", description: "Send tokens to an address" },
  { command: "/stake", description: "Stake your SOL tokens" },
  { command: "/unstake", description: "Unstake your SOL tokens" },
  { command: "/rewards", description: "Check your staking rewards" },
  { command: "/nfts", description: "View your NFTs" },
  { command: "/history", description: "View transaction history" },
  { command: "/help", description: "Show available commands" },
]

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    sender: "synbot",
    content: "Hello! I'm your SynBot. How can I assist you today?",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 2,
    sender: "system",
    content: "💡 Try using wallet commands like /balance or /help to interact with your SynBot",
    timestamp: new Date(Date.now() - 3500000).toISOString(),
  },
]


const SYNBOT_RESPONSES = [
  "I've analyzed your request and can help with that. Let me process this for you.",
  "Based on your previous preferences, I'd recommend the following approach...",
  "I've detected an opportunity that aligns with your interests. Would you like me to proceed?",
  "I can handle this task autonomously within your set permissions. Should I proceed?",
  "This request requires additional permissions. Would you like to update my settings?",
  "I've collaborated with other SynBots on similar tasks. Here's what I've learned...",
  "Your SoulThread narrative suggests this might be a valuable direction. Thoughts?",
]

export function SynBotChat({ synbot, expanded, onToggleExpand, onEmotionChange }: SynBotChatProps) {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [voiceMode, setVoiceMode] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [showCommandHelp, setShowCommandHelp] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const { playSound } = useAudio()

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    if (audioEnabled) playSound("/sounds/button-click.mp3")
    toast({
      title: "Copied to clipboard",
      description: "Text has been copied to your clipboard",
    })
  }

  
  const processWalletCommand = (command: string): { response: string; result?: any } => {
    const commandLower = command.toLowerCase().trim()

    if (commandLower === "/balance") {
      return {
        response: `Your wallet currently holds ${synbot.wallet.balance} SOL (approx. $${synbot.wallet.tokens[0].value}), along with ${synbot.wallet.tokens[1].amount} USDC and ${synbot.wallet.tokens[2].amount} MINDMASH tokens.`,
        result: {
          sol: synbot.wallet.balance,
          usdc: synbot.wallet.tokens[1].amount,
          mindmash: synbot.wallet.tokens[2].amount,
          totalValue: synbot.wallet.tokens.reduce((acc: number, token: any) => acc + token.value, 0),
        },
      }
    } else if (commandLower === "/stake") {
      return {
        response:
          "I can help you stake your SOL tokens. Currently, you have 0.5 SOL delegated to Chorus One validator with an APY of approximately 7%. How much would you like to stake?",
        result: {
          currentlyStaked: synbot.solanaStats.delegatedSOL,
          validator: synbot.solanaStats.validator,
          apy: "7%",
        },
      }
    } else if (commandLower === "/rewards") {
      return {
        response: `You currently have ${synbot.solanaStats.stakingRewards} SOL in unclaimed staking rewards. Would you like me to claim these rewards for you?`,
        result: {
          rewards: synbot.solanaStats.stakingRewards,
          value: synbot.solanaStats.stakingRewards * 100, // Assuming 1 SOL = $100
        },
      }
    } else if (commandLower === "/nfts") {
      return {
        response: `You currently own ${synbot.wallet.nfts.length} NFTs: ${synbot.wallet.nfts.map((nft: any) => nft.name).join(", ")}. Would you like to view details for any of these NFTs?`,
        result: synbot.wallet.nfts,
      }
    } else if (commandLower === "/history") {
      return {
        response: `You have completed ${synbot.solanaStats.totalTransactions} transactions on the Solana blockchain. Your last transaction was ${synbot.solanaStats.lastTransaction}.`,
        result: {
          totalTransactions: synbot.solanaStats.totalTransactions,
          lastTransaction: synbot.solanaStats.lastTransaction,
        },
      }
    } else if (commandLower.startsWith("/send")) {
      return {
        response:
          "To send tokens, please use the format: /send [amount] [token] to [address]. For example: /send 0.1 SOL to 8xDy3LNm...",
      }
    } else if (commandLower === "/help") {
      setShowCommandHelp(true)
      return {
        response: "Here are the available wallet commands:",
        result: WALLET_COMMANDS,
      }
    } else {
      return {
        response: "I don't recognize that command. Type /help to see available commands.",
      }
    }
  }

  
  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    
    const isCommand = newMessage.startsWith("/")
    let commandResult = null

   
    const userMessage: Message = {
      id: Date.now(),
      sender: "user",
      content: newMessage,
      timestamp: new Date().toISOString(),
      isCommand,
    }

    setMessages((prev) => [...prev, userMessage])
    setNewMessage("")
    if (audioEnabled) playSound("/sounds/button-click.mp3")

    // Process command if applicable
    if (isCommand) {
      const { response, result } = processWalletCommand(newMessage)
      commandResult = result

      // Add system response immediately for commands
      setTimeout(() => {
        const commandResponse: Message = {
          id: Date.now() + 1,
          sender: "synbot",
          content: response,
          timestamp: new Date().toISOString(),
          isCommand: true,
          commandResult: commandResult,
        }

        setMessages((prev) => [...prev, commandResponse])
        if (audioEnabled) playSound("/sounds/feature-select.mp3")
      }, 500)

      return
    }

    // Simulate SynBot typing for regular messages
    setIsTyping(true)

    // Simulate SynBot response after a delay
    setTimeout(
      () => {
        const botResponse: Message = {
          id: Date.now() + 2,
          sender: "synbot",
          content: generateSynBotResponse(newMessage),
          timestamp: new Date().toISOString(),
        }

        setMessages((prev) => [...prev, botResponse])
        setIsTyping(false)
        if (audioEnabled) playSound("/sounds/feature-select.mp3")
      },
      1500 + Math.random() * 1500,
    )
  }

  // Generate a response based on user input
  const generateSynBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
      return `Hello! I'm ${synbot.name}, your personal SynBot. How can I assist you today?`
    } else if (lowerMessage.includes("wallet") || lowerMessage.includes("balance")) {
      return `Your wallet currently holds ${synbot.wallet.balance} SOL (approx. $${synbot.wallet.tokens[0].value}), along with ${synbot.wallet.tokens[1].amount} USDC and ${synbot.wallet.tokens[2].amount} MINDMASH tokens.`
    } else if (lowerMessage.includes("permission") || lowerMessage.includes("access")) {
      return `I currently have the following permissions: ${synbot.permissions.canVote ? "Vote in DAOs, " : ""}${synbot.permissions.canPost ? "Create posts, " : ""}${synbot.permissions.canTrade ? "Trade tokens, " : ""}${synbot.permissions.canSpend ? "Spend funds (up to $" + synbot.permissions.spendLimit + ")" : ""}`
    } else if (lowerMessage.includes("stake") || lowerMessage.includes("staking")) {
      return "I can help you stake your SOL tokens. Currently, you have 0.5 SOL delegated to Chorus One validator with an APY of approximately 7%. Would you like to stake more or change your validator?"
    } else if (lowerMessage.includes("nft") || lowerMessage.includes("token")) {
      return "You currently own 2 NFTs: SoulSig #5289 and MindMash Genesis. You also have 1500 MINDMASH tokens. Would you like me to help you manage these assets?"
    } else if (lowerMessage.includes("solana") || lowerMessage.includes("sol")) {
      return "Your Solana wallet address is 8xDy3LNmQdUgV7TcCVkS3bFbEJsWcPyTmTX9Nag7yVUc. You have 1.42 SOL (worth approximately $150) and have completed 147 transactions on the Solana blockchain."
    } else if (lowerMessage.includes("voice") || lowerMessage.includes("speak")) {
      return "Voice mode is available! Click the microphone icon to start speaking to me directly."
    } else {
      // Default responses
      return SYNBOT_RESPONSES[Math.floor(Math.random() * SYNBOT_RESPONSES.length)]
    }
  }

  // Toggle voice mode
  const toggleVoiceMode = () => {
    setVoiceMode(!voiceMode)
    if (audioEnabled) playSound("/sounds/button-click.mp3")

    if (!voiceMode) {
      // Starting voice mode
      toast({
        title: "Voice Mode Activated",
        description: "Speak clearly to interact with your SynBot",
      })

      // Simulate voice recognition
      setIsListening(true)
    } else {
      // Stopping voice mode
      setIsListening(false)
    }
  }

  // Simulate voice input
  const simulateVoiceInput = () => {
    if (!isListening) return

    // Simulate processing voice
    setTimeout(() => {
      const voiceCommands = [
        "What's my balance?",
        "Show me my NFTs",
        "How much SOL do I have staked?",
        "Check my staking rewards",
      ]

      const randomCommand = voiceCommands[Math.floor(Math.random() * voiceCommands.length)]
      setNewMessage(randomCommand)

      // Auto-send after a brief delay
      setTimeout(() => {
        sendMessage({ preventDefault: () => {} } as React.FormEvent)
        setIsListening(false)
      }, 500)
    }, 2000)
  }

  // Render command result
  const renderCommandResult = (result: any) => {
    if (!result) return null

    // Handle balance command result
    if (result.sol !== undefined) {
      return (
        <div className="mt-2 p-3 rounded-lg bg-black/30 border border-gray-800">
          <h4 className="text-sm font-medium mb-2">Wallet Balance</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-orange-600/30 flex items-center justify-center mr-2">
                  <span className="text-xs font-bold">S</span>
                </div>
                <span className="text-sm">SOL</span>
              </div>
              <span className="text-sm font-mono">{result.sol}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-blue-600/30 flex items-center justify-center mr-2">
                  <span className="text-xs font-bold">U</span>
                </div>
                <span className="text-sm">USDC</span>
              </div>
              <span className="text-sm font-mono">{result.usdc}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-purple-600/30 flex items-center justify-center mr-2">
                  <span className="text-xs font-bold">M</span>
                </div>
                <span className="text-sm">MINDMASH</span>
              </div>
              <span className="text-sm font-mono">{result.mindmash}</span>
            </div>
            <div className="border-t border-gray-800 pt-2 mt-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Value</span>
                <span className="text-sm font-mono font-bold">${result.totalValue}</span>
              </div>
            </div>
          </div>
        </div>
      )
    }

    // Handle staking command result
    if (result.currentlyStaked !== undefined) {
      return (
        <div className="mt-2 p-3 rounded-lg bg-black/30 border border-gray-800">
          <h4 className="text-sm font-medium mb-2">Staking Information</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Currently Staked</span>
              <span className="text-sm font-mono">{result.currentlyStaked} SOL</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Validator</span>
              <span className="text-sm">{result.validator}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">APY</span>
              <span className="text-sm font-mono">{result.apy}</span>
            </div>
          </div>
          <Button
            className="w-full mt-3 bg-purple-600 hover:bg-purple-700"
            size="sm"
            onClick={() => {
              if (audioEnabled) playSound("/sounds/button-click.mp3")
              toast({
                title: "Staking Interface Opened",
                description: "You can now stake additional SOL",
              })
            }}
          >
            <Coins className="h-4 w-4 mr-2" />
            Stake More SOL
          </Button>
        </div>
      )
    }

    // Handle rewards command result
    if (result.rewards !== undefined) {
      return (
        <div className="mt-2 p-3 rounded-lg bg-black/30 border border-gray-800">
          <h4 className="text-sm font-medium mb-2">Staking Rewards</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Unclaimed Rewards</span>
              <span className="text-sm font-mono">{result.rewards} SOL</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Value</span>
              <span className="text-sm font-mono">${result.value.toFixed(2)}</span>
            </div>
          </div>
          <Button
            className="w-full mt-3 bg-purple-600 hover:bg-purple-700"
            size="sm"
            onClick={() => {
              if (audioEnabled) playSound("/sounds/button-click.mp3")
              toast({
                title: "Rewards Claimed",
                description: `${result.rewards} SOL has been added to your wallet`,
              })
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Claim Rewards
          </Button>
        </div>
      )
    }

    // Handle NFTs command result
    if (Array.isArray(result) && result.length > 0 && result[0].name) {
      return (
        <div className="mt-2 p-3 rounded-lg bg-black/30 border border-gray-800">
          <h4 className="text-sm font-medium mb-2">Your NFTs</h4>
          <div className="grid grid-cols-2 gap-2">
            {result.map((nft: any, index: number) => (
              <div
                key={index}
                className="p-2 rounded-lg bg-black/50 border border-gray-800 flex flex-col items-center cursor-pointer hover:bg-black/70 transition-colors"
                onClick={() => {
                  if (audioEnabled) playSound("/sounds/button-click.mp3")
                  toast({
                    title: "NFT Selected",
                    description: `Viewing details for ${nft.name}`,
                  })
                }}
              >
                <img
                  src={nft.name.includes("SoulSig") ? "/images/soulsig-nft.svg" : "/images/mindmash-nft.svg"}
                  alt={nft.name}
                  className="w-16 h-16 rounded-lg mb-1"
                />
                <p className="text-xs text-center">{nft.name}</p>
              </div>
            ))}
          </div>
        </div>
      )
    }

    // Handle help command result
    if (Array.isArray(result) && result.length > 0 && result[0].command) {
      return (
        <div className="mt-2 p-3 rounded-lg bg-black/30 border border-gray-800">
          <h4 className="text-sm font-medium mb-2">Available Commands</h4>
          <div className="space-y-1">
            {result.map((cmd: any, index: number) => (
              <div
                key={index}
                className="flex justify-between items-center p-1 hover:bg-black/50 rounded cursor-pointer"
                onClick={() => {
                  setNewMessage(cmd.command)
                  if (audioEnabled) playSound("/sounds/button-click.mp3")
                }}
              >
                <span className="text-sm font-mono text-purple-400">{cmd.command}</span>
                <span className="text-xs text-gray-400">{cmd.description}</span>
              </div>
            ))}
          </div>
        </div>
      )
    }

    return null
  }

  return (
    <div className={`flex flex-col h-full ${expanded ? "h-[70vh]" : "h-[500px]"}`}>
      <div className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center">
          <MessageSquare className="h-5 w-5 mr-2 text-purple-400" />
          <div>
            <h3 className="text-lg font-medium">Chat with {synbot.name}</h3>
            <p className="text-sm text-gray-400">Your SynBot learns from your conversations</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => {
                    setAudioEnabled(!audioEnabled)
                    if (audioEnabled) playSound("/sounds/button-click.mp3")
                  }}
                >
                  {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{audioEnabled ? "Mute sounds" : "Unmute sounds"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => {
                    setShowCommandHelp(!showCommandHelp)
                    if (audioEnabled) playSound("/sounds/button-click.mp3")
                  }}
                >
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Show command help</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => {
                    onToggleExpand()
                    if (audioEnabled) playSound("/sounds/button-click.mp3")
                  }}
                >
                  {expanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{expanded ? "Minimize chat" : "Maximize chat"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {showCommandHelp && (
        <div className="mb-3 p-3 rounded-lg bg-black/30 border border-gray-800">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium flex items-center">
              <Wallet className="h-4 w-4 mr-2 text-purple-400" />
              Wallet Commands
            </h4>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => {
                setShowCommandHelp(false)
                if (audioEnabled) playSound("/sounds/button-click.mp3")
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-1">
            {WALLET_COMMANDS.map((cmd, index) => (
              <div
                key={index}
                className="flex items-center p-1 hover:bg-black/50 rounded cursor-pointer"
                onClick={() => {
                  setNewMessage(cmd.command)
                  if (audioEnabled) playSound("/sounds/button-click.mp3")
                }}
              >
                <span className="text-xs font-mono text-purple-400 mr-1">{cmd.command}</span>
                <span className="text-xs text-gray-400 truncate">{cmd.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <ScrollArea className="flex-1 pr-4 mb-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-lg p-3 ${
                  message.sender === "user"
                    ? "bg-purple-600/30 border border-purple-500/30"
                    : message.sender === "system"
                      ? "bg-blue-900/30 border border-blue-500/30"
                      : "bg-black/30 border border-gray-800"
                }`}
              >
                <div className="flex items-center mb-1">
                  {message.sender === "synbot" ? (
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarImage src="/images/synbot-avatar.svg" />
                      <AvatarFallback>
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  ) : message.sender === "system" ? (
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarFallback className="bg-blue-900">
                        <Cpu className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarImage src="/placeholder.svg?height=24&width=24" />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <span className="text-xs text-gray-400">
                    {message.sender === "synbot" ? synbot.name : message.sender === "system" ? "System" : "You"} •{" "}
                    {formatTime(message.timestamp)}
                  </span>

                  {message.isCommand && (
                    <Badge variant="outline" className="ml-2 bg-purple-900/30 border-purple-500/30 text-xs">
                      Command
                    </Badge>
                  )}

                  {message.sender !== "user" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 ml-auto"
                      onClick={() => copyToClipboard(message.content)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <p className="text-sm">{message.content}</p>

                {/* Render command results if any */}
                {message.commandResult && renderCommandResult(message.commandResult)}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-lg p-3 bg-black/30 border border-gray-800">
                <div className="flex items-center mb-1">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage src="/images/synbot-avatar.svg" />
                    <AvatarFallback>
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-gray-400">{synbot.name} • Typing...</span>
                </div>
                <div className="flex space-x-1">
                  <div className="h-2 w-2 rounded-full bg-purple-400 animate-bounce"></div>
                  <div className="h-2 w-2 rounded-full bg-purple-400 animate-bounce delay-100"></div>
                  <div className="h-2 w-2 rounded-full bg-purple-400 animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <form onSubmit={sendMessage} className="pt-2 border-t border-gray-800">
        <div className="flex items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant={voiceMode ? "default" : "ghost"}
                  size="icon"
                  className={`h-10 w-10 ${voiceMode ? "bg-purple-600 hover:bg-purple-700" : ""}`}
                  onClick={toggleVoiceMode}
                >
                  {voiceMode ? (
                    isListening ? (
                      <Mic className="h-5 w-5 animate-pulse" onClick={simulateVoiceInput} />
                    ) : (
                      <Mic className="h-5 w-5" />
                    )
                  ) : (
                    <MicOff className="h-5 w-5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{voiceMode ? "Disable voice mode" : "Enable voice mode"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {voiceMode && isListening ? (
            <div className="flex-1 mx-2 p-3 bg-black/30 border border-purple-500/50 rounded-md text-center">
              <span className="text-sm text-purple-300">Listening... Speak now</span>
              <div className="flex justify-center space-x-1 mt-1">
                <div className="h-1 w-1 rounded-full bg-purple-400 animate-bounce"></div>
                <div className="h-1 w-1 rounded-full bg-purple-400 animate-bounce delay-100"></div>
                <div className="h-1 w-1 rounded-full bg-purple-400 animate-bounce delay-200"></div>
                <div className="h-1 w-1 rounded-full bg-purple-400 animate-bounce delay-300"></div>
                <div className="h-1 w-1 rounded-full bg-purple-400 animate-bounce delay-400"></div>
              </div>
            </div>
          ) : (
            <Textarea
              placeholder={voiceMode ? "Voice mode active. Click mic to speak..." : "Message your SynBot..."}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 mx-2 bg-black/30 border-gray-800 resize-none"
              rows={1}
              disabled={voiceMode && isListening}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  sendMessage(e)
                }
              }}
            />
          )}

          <Button
            type="submit"
            size="icon"
            className="bg-purple-600 hover:bg-purple-700 h-10 w-10"
            disabled={(!newMessage.trim() && !voiceMode) || isTyping || (voiceMode && isListening)}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </form>
    </div>
  )
}

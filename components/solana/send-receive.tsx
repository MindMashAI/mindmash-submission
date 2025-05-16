"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpRight, Copy, Check, RefreshCw, AlertTriangle } from "lucide-react"
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js"
import { getSolBalance } from "@/lib/solana-helpers"
import { QRCodeSVG } from "qrcode.react"
import { toast } from "@/components/ui/use-toast"

export function SendReceiveInterface() {
  const { publicKey, connected, sendTransaction, wallet } = useWallet()
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [balance, setBalance] = useState<number | null>(null)
  const [fetchingBalance, setFetchingBalance] = useState(false)
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null)

  // Fetch balance when connected
  const fetchBalance = useCallback(async () => {
    if (!publicKey || !connected || !wallet?.adapter?.connection) return

    setFetchingBalance(true)
    try {
      const sol = await getSolBalance(publicKey, wallet.adapter.connection)
      setBalance(sol)
      setLastRefreshed(new Date())
    } catch (err) {
      console.error("Error fetching balance:", err)
      // Don't set an error message here, just show 0 balance
      setBalance(0)
    } finally {
      setFetchingBalance(false)
    }
  }, [publicKey, connected, wallet?.adapter?.connection])

  useEffect(() => {
    fetchBalance()
  }, [fetchBalance])

  // Copy wallet address to clipboard
  const copyToClipboard = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toString())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      })
    }
  }

  // Send SOL
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!publicKey || !connected || !sendTransaction || !wallet?.adapter?.connection) {
      setError("Wallet not connected")
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // Validate recipient address
      let recipientPubkey: PublicKey
      try {
        recipientPubkey = new PublicKey(recipient)
      } catch (err) {
        setError("Invalid recipient address")
        setLoading(false)
        return
      }

      // Validate amount
      const amountValue = Number.parseFloat(amount)
      if (isNaN(amountValue) || amountValue <= 0) {
        setError("Invalid amount")
        setLoading(false)
        return
      }

      // Check if sufficient balance
      if (balance !== null && amountValue > balance) {
        setError("Insufficient balance")
        setLoading(false)
        return
      }

      // Create transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPubkey,
          lamports: amountValue * LAMPORTS_PER_SOL,
        }),
      )

      // Send transaction
      const signature = await sendTransaction(transaction, wallet.adapter.connection)
      console.log("Transaction sent with signature:", signature)

      // Wait for confirmation
      try {
        const confirmation = await wallet.adapter.connection.confirmTransaction(signature, "confirmed")
        console.log("Transaction confirmed:", confirmation)

        if (confirmation.value.err) {
          throw new Error("Transaction failed on-chain")
        }

        setSuccess(true)
        setRecipient("")
        setAmount("")

        toast({
          title: "Transaction Successful",
          description: `Sent ${amountValue} SOL to ${recipientPubkey.toString().slice(0, 6)}...${recipientPubkey.toString().slice(-4)}`,
        })

        // Refresh balance after successful transaction
        const newBalance = await getSolBalance(publicKey, wallet.adapter.connection)
        setBalance(newBalance)
        setLastRefreshed(new Date())
      } catch (confirmErr) {
        console.error("Error confirming transaction:", confirmErr)
        setError("Transaction sent but confirmation failed. Check explorer for status.")
      }
    } catch (err: any) {
      console.error("Error sending transaction:", err)
      setError(err.message || "Failed to send transaction")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle>Send & Receive</CardTitle>
        <CardDescription className="text-gray-400">Transfer SOL and tokens</CardDescription>
      </CardHeader>
      <CardContent>
        {!connected ? (
          <div className="text-center py-12">
            <ArrowUpRight className="h-12 w-12 mx-auto text-gray-600 mb-2" />
            <p className="text-gray-400">Connect your wallet to send and receive</p>
          </div>
        ) : (
          <Tabs defaultValue="send" className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="send">Send</TabsTrigger>
              <TabsTrigger value="receive">Receive</TabsTrigger>
            </TabsList>

            <TabsContent value="send">
              <form onSubmit={handleSend} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="recipient">Recipient Address</Label>
                  <Input
                    id="recipient"
                    placeholder="Enter Solana address"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="amount">Amount (SOL)</Label>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-400">
                        Balance: {fetchingBalance ? "Loading..." : balance !== null ? balance.toFixed(4) : "0"} SOL
                      </span>
                      {!fetchingBalance && (
                        <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={fetchBalance}>
                          <RefreshCw className="h-3 w-3 text-gray-400" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <Input
                    id="amount"
                    type="number"
                    step="0.000001"
                    min="0"
                    placeholder="0.0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    required
                  />
                </div>

                {lastRefreshed && (
                  <div className="text-xs text-gray-400 text-right">
                    Last updated: {lastRefreshed.toLocaleTimeString()}
                  </div>
                )}

                {error && (
                  <div className="bg-red-900/20 border border-red-800/50 p-3 rounded-lg flex items-start">
                    <AlertTriangle className="text-red-400 mr-2 mt-0.5 h-4 w-4 flex-shrink-0" />
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="bg-green-900/20 border border-green-800/50 p-3 rounded-lg flex items-start">
                    <Check className="text-green-400 mr-2 mt-0.5 h-4 w-4 flex-shrink-0" />
                    <p className="text-green-400 text-sm">Transaction successful!</p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Processing...
                    </>
                  ) : (
                    <>
                      <ArrowUpRight className="mr-2 h-4 w-4" /> Send SOL
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="receive">
              <div className="space-y-4">
                <div className="bg-gray-800 p-4 rounded-lg flex flex-col items-center justify-center">
                  <div className="bg-white p-6 rounded-lg mb-4">
                    {publicKey && (
                      <QRCodeSVG value={publicKey.toString()} size={180} bgColor="#FFFFFF" fgColor="#000000" />
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mb-2">Your Wallet Address</p>
                  <div className="bg-gray-900 p-2 rounded border border-gray-700 break-all text-sm font-mono mb-2 w-full">
                    {publicKey?.toString()}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-amber-400 border-amber-700 hover:bg-amber-900/20"
                    onClick={copyToClipboard}
                  >
                    {copied ? (
                      <>
                        <Check className="mr-2 h-4 w-4" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" /> Copy Address
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}

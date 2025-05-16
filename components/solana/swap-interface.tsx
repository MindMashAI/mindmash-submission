"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowDownUp, RefreshCw, AlertTriangle, Check, ExternalLink } from "lucide-react"
import { getSolBalance } from "@/lib/solana-helpers"
import { PublicKey, Transaction } from "@solana/web3.js"

export function SwapInterface() {
  const { publicKey, connected, wallet, sendTransaction } = useWallet()
  const [fromToken, setFromToken] = useState("SOL")
  const [toToken, setToToken] = useState("MB")
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [txSignature, setTxSignature] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [balance, setBalance] = useState<number | null>(null)
  const [fetchingBalance, setFetchingBalance] = useState(false)

  // Fetch balance when connected
  useEffect(() => {
    const fetchBalance = async () => {
      if (!publicKey || !connected || !wallet?.adapter?.connection) return

      setFetchingBalance(true)
      try {
        const sol = await getSolBalance(publicKey, wallet.adapter.connection)
        setBalance(sol)
      } catch (err) {
        console.error("Error fetching balance:", err)
        setBalance(0)
      } finally {
        setFetchingBalance(false)
      }
    }

    fetchBalance()
  }, [publicKey, connected, wallet?.adapter?.connection])

  // Calculate swap rate
  useEffect(() => {
    if (!fromAmount || fromAmount === "0") {
      setToAmount("")
      return
    }

    // Mock exchange rates for demo
    const rates = {
      "SOL-MB": 300, // 1 SOL = 300 MB
      "MB-SOL": 0.0033, // 1 MB = 0.0033 SOL
    }

    const amount = Number.parseFloat(fromAmount)
    if (isNaN(amount)) return

    const pair = `${fromToken}-${toToken}`
    if (rates[pair as keyof typeof rates]) {
      const convertedAmount = amount * rates[pair as keyof typeof rates]
      setToAmount(convertedAmount.toFixed(toToken === "SOL" ? 4 : 0))
    }
  }, [fromAmount, fromToken, toToken])

  // Swap tokens
  const handleSwap = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!publicKey || !connected || !wallet?.adapter?.connection || !sendTransaction) {
      setError("Wallet not connected")
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(false)
    setTxSignature(null)

    try {
      // Validate amount
      const amount = Number.parseFloat(fromAmount)
      if (isNaN(amount) || amount <= 0) {
        setError("Invalid amount")
        setLoading(false)
        return
      }

      // Check if sufficient balance
      if (fromToken === "SOL" && balance && amount > balance) {
        setError("Insufficient SOL balance")
        setLoading(false)
        return
      }

      // In a real app, this would be a swap transaction using a DEX like Jupiter or Raydium
      const transaction = new Transaction()

      // Add a memo instruction to simulate a swap
      const memoInstruction = new Transaction().add({
        keys: [],
        programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
        data: Buffer.from(`Swap ${fromAmount} ${fromToken} to ${toAmount} ${toToken}`, "utf-8"),
      })

      transaction.add(memoInstruction.instructions[0])

      // Send transaction
      const signature = await sendTransaction(transaction, wallet.adapter.connection)
      console.log("Swap transaction sent with signature:", signature)
      setTxSignature(signature)

      // Wait for confirmation
      try {
        const confirmation = await wallet.adapter.connection.confirmTransaction(signature, "confirmed")
        console.log("Transaction confirmed:", confirmation)

        if (confirmation.value.err) {
          throw new Error("Transaction failed on-chain")
        }

        setSuccess(true)
        setFromAmount("")
        setToAmount("")

        // Refresh balance after successful transaction
        const newBalance = await getSolBalance(publicKey, wallet.adapter.connection)
        setBalance(newBalance)
      } catch (confirmErr) {
        console.error("Error confirming transaction:", confirmErr)
        setError("Transaction sent but confirmation failed. Check explorer for status.")
      }
    } catch (err: any) {
      console.error("Error performing swap:", err)
      setError(err.message || "Swap failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Swap token selection
  const handleSwapTokens = () => {
    const tempFromToken = fromToken
    const tempToToken = toToken
    setFromToken(tempToToken)
    setToToken(tempFromToken)
    setFromAmount("")
    setToAmount("")
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle>Swap Tokens</CardTitle>
        <CardDescription className="text-gray-400">Exchange tokens at the best rates</CardDescription>
      </CardHeader>
      <CardContent>
        {!connected ? (
          <div className="text-center py-12">
            <ArrowDownUp className="h-12 w-12 mx-auto text-gray-600 mb-2" />
            <p className="text-gray-400">Connect your wallet to swap tokens</p>
          </div>
        ) : (
          <form onSubmit={handleSwap} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="fromAmount">From</Label>
                  {fromToken === "SOL" && (
                    <span className="text-xs text-gray-400">
                      Balance: {fetchingBalance ? "Loading..." : balance !== null ? balance.toFixed(4) : "0"} SOL
                    </span>
                  )}
                  {fromToken === "MB" && <span className="text-xs text-gray-400">Balance: 1,250 MB</span>}
                </div>
                <div className="flex space-x-2">
                  <div className="w-2/3">
                    <Input
                      id="fromAmount"
                      type="number"
                      step="0.000001"
                      min="0"
                      placeholder="0.0"
                      value={fromAmount}
                      onChange={(e) => setFromAmount(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white"
                      required
                    />
                  </div>
                  <div className="w-1/3">
                    <Select value={fromToken} onValueChange={setFromToken}>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Select token" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        <SelectItem value="SOL">SOL</SelectItem>
                        <SelectItem value="MB">MB</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="rounded-full border-gray-700 text-gray-400 hover:text-amber-400 hover:border-amber-700"
                  onClick={handleSwapTokens}
                >
                  <ArrowDownUp className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="toAmount">To (Estimated)</Label>
                <div className="flex space-x-2">
                  <div className="w-2/3">
                    <Input
                      id="toAmount"
                      type="text"
                      placeholder="0.0"
                      value={toAmount}
                      readOnly
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div className="w-1/3">
                    <Select value={toToken} onValueChange={setToToken}>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Select token" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        <SelectItem value="SOL">SOL</SelectItem>
                        <SelectItem value="MB">MB</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-3 rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Exchange Rate</span>
                <span>{fromToken === "SOL" && toToken === "MB" ? "1 SOL = 300 MB" : "1 MB = 0.0033 SOL"}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-400">Fee</span>
                <span>0.5%</span>
              </div>
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-800/50 p-3 rounded-lg flex items-start">
                <AlertTriangle className="text-red-400 mr-2 mt-0.5 h-4 w-4 flex-shrink-0" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-900/20 border border-green-800/50 p-3 rounded-lg space-y-2">
                <div className="flex items-start">
                  <Check className="text-green-400 mr-2 mt-0.5 h-4 w-4 flex-shrink-0" />
                  <p className="text-green-400 text-sm">Swap successful!</p>
                </div>
                {txSignature && (
                  <div className="flex justify-end">
                    <Button
                      variant="link"
                      size="sm"
                      className="text-amber-400 p-0 h-auto"
                      onClick={() => window.open(`https://explorer.solana.com/tx/${txSignature}`, "_blank")}
                    >
                      View on Explorer <ExternalLink className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
              disabled={loading || !fromAmount || fromAmount === "0"}
            >
              {loading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Processing...
                </>
              ) : (
                "Swap Tokens"
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}

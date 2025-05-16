import { type Connection, type PublicKey, LAMPORTS_PER_SOL, type ParsedTransactionWithMeta } from "@solana/web3.js"
import { TOKEN_PROGRAM_ID } from "@solana/spl-token"

// Fetch SOL balance using the provided connection
export async function getSolBalance(publicKey: PublicKey, connection: Connection): Promise<number> {
  try {
    if (!publicKey || !connection) {
      throw new Error("Missing publicKey or connection")
    }

    const balance = await connection.getBalance(publicKey)
    return balance / LAMPORTS_PER_SOL
  } catch (error) {
    console.error("Error fetching SOL balance:", error)
    // For demo purposes, return a mock balance instead of throwing
    return 4.2069 // Mock balance for demo
  }
}

// Fetch SPL tokens (including Mash.BiT)
export async function getTokenAccounts(publicKey: PublicKey, connection: Connection) {
  try {
    if (!publicKey || !connection) {
      throw new Error("Missing publicKey or connection")
    }

    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
      programId: TOKEN_PROGRAM_ID,
    })

    return tokenAccounts.value.map((accountInfo) => {
      const parsedInfo = accountInfo.account.data.parsed.info
      const mintAddress = parsedInfo.mint
      const tokenBalance = parsedInfo.tokenAmount

      return {
        mint: mintAddress,
        balance: tokenBalance.uiAmount,
        decimals: tokenBalance.decimals,
        uiAmount: tokenBalance.uiAmount,
        address: accountInfo.pubkey.toString(),
      }
    })
  } catch (error) {
    console.error("Error fetching token accounts:", error)
    // Return empty array instead of throwing
    return []
  }
}

// Fetch NFTs using Metaplex-like approach
export async function getNFTs(publicKey: PublicKey, connection: Connection) {
  try {
    if (!publicKey || !connection) {
      throw new Error("Missing publicKey or connection")
    }

    // Get all token accounts owned by the wallet
    const tokenAccounts = await getTokenAccounts(publicKey, connection)

    // Filter for potential NFTs (tokens with 0 decimals and amount of 1)
    const potentialNFTs = tokenAccounts.filter((token) => token.decimals === 0 && token.uiAmount === 1)

    // For each potential NFT, we'd fetch metadata using Metaplex
    const nfts = await Promise.all(
      potentialNFTs.map(async (nft) => {
        try {
          // placeholder with the mint address
          return {
            ...nft,
            name: `NFT ${nft.mint.substring(0, 8)}`,
            image: `/placeholder.svg?height=150&width=150&text=NFT+${nft.mint.substring(0, 8)}`,
            attributes: [{ trait_type: "Mint", value: nft.mint }],
          }
        } catch (err) {
          console.error(`Error fetching metadata for NFT ${nft.mint}:`, err)
          return null
        }
      }),
    )

    return nfts.filter(Boolean)
  } catch (error) {
    console.error("Error fetching NFTs:", error)
    // Return mock NFTs instead of throwing
    return getMockData().nfts
  }
}

// Fetch recent transactions
export async function getRecentTransactions(
  publicKey: PublicKey,
  connection: Connection,
  limit = 10,
): Promise<ParsedTransactionWithMeta[]> {
  try {
    if (!publicKey || !connection) {
      throw new Error("Missing publicKey or connection")
    }

    const signatures = await connection.getSignaturesForAddress(publicKey, { limit })

    const transactions = await Promise.all(
      signatures.map(async (sig) => {
        try {
          return await connection.getParsedTransaction(sig.signature, "confirmed")
        } catch (e) {
          console.error(`Error fetching transaction ${sig.signature}:`, e)
          return null
        }
      }),
    )

    return transactions.filter(Boolean) as ParsedTransactionWithMeta[]
  } catch (error) {
    console.error("Error fetching recent transactions:", error)
    // Return empty array instead of throwing
    return []
  }
}

// Get token metadata (simplified)
export async function getTokenMetadata(mintAddress: string) {
  // In a real app, you'd fetch this from a token list or API
  // For now, we'll just handle a few known tokens
  const knownTokens: Record<string, { name: string; symbol: string; logo: string; decimals: number }> = {
    So11111111111111111111111111111111111111112: {
      name: "Wrapped SOL",
      symbol: "wSOL",
      logo: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
      decimals: 9,
    },
    // Add other known tokens here
  }

  return (
    knownTokens[mintAddress] || {
      name: `Token ${mintAddress.slice(0, 4)}...${mintAddress.slice(-4)}`,
      symbol: "???",
      logo: `/placeholder.svg?height=32&width=32&text=${mintAddress.slice(0, 2)}`,
      decimals: 0,
    }
  )
}

// Estimate value in USD (simplified)
export async function estimatePortfolioValue(solBalance: number, tokenAccounts: any[]) {
  try {
    // In a real app, you'd fetch actual prices from an API
    const mockPrices = {
      SOL: 150, // Example price in USD
      MB: 0.5, // Example price for Mash.BiT
    }

    const solValue = solBalance * mockPrices.SOL

    // Calculate token values
    let tokenValues = 0
    let breakdown = { SOL: solValue }

    tokenAccounts.forEach((token) => {
      if (token.mint === "MashBiTTokenMint123456789") {
        const mbValue = token.uiAmount * mockPrices.MB
        tokenValues += mbValue
        breakdown = { ...breakdown, MB: mbValue }
      }
    })

    const totalValue = solValue + tokenValues

    return {
      totalValue,
      breakdown,
    }
  } catch (error) {
    console.error("Error estimating portfolio value:", error)
    return {
      totalValue: 1255.69,
      breakdown: { SOL: 630.69, MB: 625 },
    }
  }
}

// Mock data for demonstration purposes (fallback)
export function getMockData() {
  return {
    solBalance: 4.2069,
    tokens: [
      {
        name: "Mash.BiT",
        symbol: "MB",
        balance: 1250,
        value: 625,
        color: "#8b5cf6",
      },
    ],
    nfts: [
      {
        mint: "NFT1",
        name: "MindMash #1",
        image: `/placeholder.svg?height=150&width=150&text=MindMash%20%231`,
        attributes: [{ trait_type: "Type", value: "Demo" }],
      },
      {
        mint: "NFT2",
        name: "MindMash #2",
        image: `/placeholder.svg?height=150&width=150&text=MindMash%20%232`,
        attributes: [{ trait_type: "Type", value: "Demo" }],
      },
      {
        mint: "NFT3",
        name: "MindMash #3",
        image: `/placeholder.svg?height=150&width=150&text=MindMash%20%233`,
        attributes: [{ trait_type: "Type", value: "Demo" }],
      },
    ],
    totalValue: 1255.69,
  }
}

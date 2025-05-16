import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

export async function POST(req: NextRequest) {
  try {
    const { user } = await req.json()

    if (!user || !user.wallet || !user.wallet.publicKey) {
      return NextResponse.json({ error: "Invalid user data" }, { status: 400 })
    }

    const walletAddress = user.wallet.publicKey
    const userId = user.email || user.id
    const displayName = user.email ? user.email.split("@")[0] : `user_${Math.random().toString(36).substring(2, 7)}`

    // Check if user exists
    const { data: existingUser } = await supabase.from("users").select("*").eq("user_id", userId).single()

    if (existingUser) {
      // Update existing user
      const { data, error } = await supabase
        .from("users")
        .update({
          wallet_address: walletAddress,
          last_login: new Date().toISOString(),
        })
        .eq("user_id", userId)
        .select()

      if (error) {
        console.error("Error updating user:", error)
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
      }

      return NextResponse.json({ user: data[0] })
    } else {
      // Create new user
      const { data, error } = await supabase
        .from("users")
        .insert({
          user_id: userId,
          wallet_address: walletAddress,
          display_name: displayName,
          created_at: new Date().toISOString(),
          last_login: new Date().toISOString(),
        })
        .select()

      if (error) {
        console.error("Error creating user:", error)
        return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
      }

      return NextResponse.json({ user: data[0] })
    }
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

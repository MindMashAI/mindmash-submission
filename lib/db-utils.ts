import { supabaseServer } from "./supabase-server"
import { getSupabase } from "./supabase-client"

export interface User {
  id: string
  user_id: string
  wallet_address: string
  display_name: string
  created_at: string
  last_login: string
}

// Server-side functions
export async function createOrUpdateUser(userData: {
  user_id: string
  wallet_address: string
  display_name: string
}) {
  const { user_id, wallet_address, display_name } = userData

  // Check if user exists
  const { data: existingUser } = await supabaseServer.from("users").select("*").eq("user_id", user_id).single()

  if (existingUser) {
    // Update existing user
    const { data, error } = await supabaseServer
      .from("users")
      .update({
        wallet_address,
        last_login: new Date().toISOString(),
      })
      .eq("user_id", user_id)
      .select()

    if (error) throw error
    return data[0]
  } else {
    // Create new user
    const { data, error } = await supabaseServer
      .from("users")
      .insert({
        user_id,
        wallet_address,
        display_name,
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
      })
      .select()

    if (error) throw error
    return data[0]
  }
}

// Client-side functions
export async function getUserProfile(userId: string): Promise<User | null> {
  const supabase = getSupabase()
  if (!supabase) return null

  const { data, error } = await supabase.from("users").select("*").eq("user_id", userId).single()

  if (error || !data) return null
  return data as User
}

export async function updateUserProfile(userId: string, updates: Partial<Omit<User, "id" | "user_id" | "created_at">>) {
  const supabase = getSupabase()
  if (!supabase) return null

  const { data, error } = await supabase.from("users").update(updates).eq("user_id", userId).select()

  if (error) throw error
  return data[0] as User
}

export async function getAllUsers(limit = 10): Promise<User[]> {
  const supabase = getSupabase()
  if (!supabase) return []

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) return []
  return data as User[]
}

import { NextRequest } from "next/server"
import { getServerUser } from "@/lib/firebase/server-auth"

export async function getCurrentUser(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    
    if (!token) {
      return null
    }

    return await getServerUser(token)
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

export async function requireAuth(request: NextRequest) {
  const user = await getCurrentUser(request)
  
  if (!user) {
    throw new Error("Unauthorized")
  }
  
  return user
}

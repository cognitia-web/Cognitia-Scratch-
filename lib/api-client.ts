"use client"

import { auth } from "@/lib/firebase/config"

export async function apiRequest(url: string, options: RequestInit = {}) {
  const user = auth.currentUser
  if (!user) {
    throw new Error("User not authenticated")
  }

  const token = await user.getIdToken()

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
    Authorization: `Bearer ${token}`,
  }

  // Only add Content-Type if it's not FormData
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json"
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }))
    throw new Error(error.error || `API request failed: ${response.statusText}`)
  }

  // Handle blob responses (for file downloads)
  const contentType = response.headers.get("content-type")
  if (contentType?.includes("application/octet-stream") || contentType?.includes("application/force-download")) {
    return response.blob()
  }

  // Default to JSON
  try {
    return await response.json()
  } catch {
    return response
  }
}

// Helper to get auth token for manual fetch calls
export async function getAuthToken(): Promise<string | null> {
  const user = auth.currentUser
  if (!user) {
    return null
  }
  return await user.getIdToken()
}


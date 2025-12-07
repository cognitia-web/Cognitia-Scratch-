// MediaPipe pose detection utilities
// This will be used on the client side for on-device pose detection

export interface PoseLandmark {
  x: number
  y: number
  z: number
  visibility?: number
}

export interface PoseData {
  landmarks: PoseLandmark[]
  timestamp: number
}

// Liveness prompts for randomized verification
const LIVENESS_PROMPTS = [
  "Raise your right hand",
  "Raise your left hand",
  "Touch your nose",
  "Wave your hand",
  "Turn your head left",
  "Turn your head right",
  "Smile",
  "Nod your head",
]

export function getRandomLivenessPrompt(): string {
  return LIVENESS_PROMPTS[Math.floor(Math.random() * LIVENESS_PROMPTS.length)]
}

// Initialize MediaPipe Pose (client-side only)
export async function initializePoseDetection(): Promise<any> {
  if (typeof window === "undefined") {
    return null
  }

  try {
    // Dynamic import for client-side only
    const { Pose } = await import("@mediapipe/pose")
    const { Camera } = await import("@mediapipe/camera_utils")

    const pose = new Pose({
      locateFile: (file: string) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
      },
    })

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      smoothSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    })

    return pose
  } catch (error) {
    console.error("Failed to initialize MediaPipe:", error)
    return null
  }
}

export function extractPoseLandmarks(results: any): PoseLandmark[] {
  if (!results?.poseLandmarks) {
    return []
  }

  return results.poseLandmarks.map((landmark: any) => ({
    x: landmark.x,
    y: landmark.y,
    z: landmark.z,
    visibility: landmark.visibility,
  }))
}


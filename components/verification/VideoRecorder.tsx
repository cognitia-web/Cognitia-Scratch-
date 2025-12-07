"use client"

import { useState, useRef, useEffect } from "react"
import GlassButton from "@/components/glass/GlassButton"
import { Camera, StopCircle, Check } from "lucide-react"
import { getRandomLivenessPrompt } from "@/lib/mediapipe/pose-detection"
import { hashVideo } from "@/lib/encryption/encrypt"

interface VideoRecorderProps {
  onRecordingComplete: (videoBlob: Blob, hash: string) => void
  maxDuration?: number // in seconds, default 30
}

export default function VideoRecorder({
  onRecordingComplete,
  maxDuration = 30,
}: VideoRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [livenessPrompt, setLivenessPrompt] = useState<string>("")
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null)
  const [videoHash, setVideoHash] = useState<string>("")
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  useEffect(() => {
    // Generate liveness prompt when component mounts
    setLivenessPrompt(getRandomLivenessPrompt())
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= maxDuration) {
            stopRecording()
            return maxDuration
          }
          return prev + 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRecording, maxDuration])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })

      mediaStreamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm;codecs=vp8,opus",
      })

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" })
        const hash = await hashVideo(blob)
        setVideoBlob(blob)
        setVideoHash(hash)
        chunksRef.current = []

        // Stop all tracks
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((track) => track.stop())
        }
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)
    } catch (error) {
      console.error("Error accessing camera:", error)
      alert("Failed to access camera. Please check permissions.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const handleSubmit = () => {
    if (videoBlob && videoHash) {
      onRecordingComplete(videoBlob, videoHash)
    }
  }

  const handleRetake = () => {
    setVideoBlob(null)
    setVideoHash("")
    setRecordingTime(0)
    chunksRef.current = []
  }

  return (
    <div className="space-y-4">
      {livenessPrompt && (
        <div className="p-4 bg-gradient-to-r from-softBlue/20 to-calmPurple/20 rounded-xl border border-white/20">
          <p className="text-center font-semibold text-white">
            Please: {livenessPrompt}
          </p>
        </div>
      )}

      <div className="relative bg-charcoal/50 rounded-xl overflow-hidden aspect-video border border-white/20">
        {videoBlob ? (
          <video
            src={URL.createObjectURL(videoBlob)}
            controls
            className="w-full h-full object-cover"
          />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        )}

        {isRecording && (
          <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-sm font-medium">
              {maxDuration - recordingTime}s
            </span>
          </div>
        )}
      </div>

      <div className="flex gap-3 justify-center">
        {!videoBlob ? (
          <>
            {!isRecording ? (
              <GlassButton onClick={startRecording}>
                <Camera className="w-4 h-4 mr-2" />
                Start Recording
              </GlassButton>
            ) : (
              <GlassButton onClick={stopRecording} variant="destructive">
                <StopCircle className="w-4 h-4 mr-2" />
                Stop Recording
              </GlassButton>
            )}
          </>
        ) : (
          <>
            <GlassButton onClick={handleRetake} variant="ghost">
              Retake
            </GlassButton>
            <GlassButton onClick={handleSubmit}>
              <Check className="w-4 h-4 mr-2" />
              Submit
            </GlassButton>
          </>
        )}
      </div>

      <p className="text-xs text-center text-white/50">
        Maximum recording time: {maxDuration} seconds
      </p>
    </div>
  )
}


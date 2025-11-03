"use client"

import { useState, useRef, useEffect } from "react"
import { Camera, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import Tesseract from "tesseract.js"

interface LicensePlateScannerProps {
  onPlateDetected: (plate: string) => void
  onClose: () => void
}

export function LicensePlateScanner({ onPlateDetected, onClose }: LicensePlateScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [detectedPlate, setDetectedPlate] = useState("")
  const [stream, setStream] = useState<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    startCamera()
    return () => {
      stopCamera()
    }
  }, [])

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (error) {
      console.error("[v0] Camera error:", error)
      alert("Não foi possível acessar a câmera")
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
    }
  }

  const captureAndRecognize = async () => {
    if (!videoRef.current || !canvasRef.current) return

    setIsScanning(true)
    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    if (!context) return

    // Set canvas size to video size
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Get image data
    const imageData = canvas.toDataURL("image/png")

    try {
      // Use Tesseract.js for OCR
      const result = await Tesseract.recognize(imageData, "eng", {
        logger: (m) => console.log("[v0] OCR:", m),
      })

      // Extract text and clean it
      const text = result.data.text.toUpperCase().replace(/[^A-Z0-9]/g, "")

      // Brazilian license plate patterns: ABC1234 or ABC1D23
      const platePattern = /[A-Z]{3}[0-9][A-Z0-9][0-9]{2}/
      const match = text.match(platePattern)

      if (match) {
        const plate = match[0]
        setDetectedPlate(plate)
      } else {
        alert("Não foi possível reconhecer a placa. Tente novamente.")
      }
    } catch (error) {
      console.error("[v0] OCR error:", error)
      alert("Erro ao reconhecer a placa. Tente novamente.")
    } finally {
      setIsScanning(false)
    }
  }

  const confirmPlate = () => {
    onPlateDetected(detectedPlate)
    stopCamera()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
        <button
          onClick={() => {
            stopCamera()
            onClose()
          }}
          className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-white font-semibold text-lg">Escanear Placa</h2>
        <div className="w-10" />
      </div>

      {/* Video */}
      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />

      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Overlay guide */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-80 h-32">
          <div className="absolute inset-0 border-4 border-white rounded-lg shadow-2xl" />
          <div className="absolute -top-8 left-0 right-0 text-center">
            <p className="text-white text-sm font-medium bg-black/50 px-4 py-2 rounded-full inline-block">
              Posicione a placa dentro do quadro
            </p>
          </div>
        </div>
      </div>

      {/* Bottom controls */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
        {detectedPlate ? (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 text-center">
              <p className="text-sm text-gray-600 mb-2">Placa detectada:</p>
              <p className="text-3xl font-bold text-ancora-blue tracking-wider">{detectedPlate}</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setDetectedPlate("")}
                variant="outline"
                className="flex-1 h-14 text-base bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Tentar Novamente
              </Button>
              <Button onClick={confirmPlate} className="flex-1 h-14 text-base bg-ancora-red hover:bg-ancora-red/90">
                <Check className="w-5 h-5 mr-2" />
                Confirmar
              </Button>
            </div>
          </div>
        ) : (
          <Button
            onClick={captureAndRecognize}
            disabled={isScanning}
            className="w-full h-16 text-lg bg-ancora-red hover:bg-ancora-red/90 disabled:opacity-50"
          >
            {isScanning ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Reconhecendo...
              </>
            ) : (
              <>
                <Camera className="w-6 h-6 mr-2" />
                Capturar Placa
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}

'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { formatLicensePlate, validateLicensePlate } from '../../utils/validation'

type CameraInputProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  disabled?: boolean
  className?: string
  autoFocus?: boolean
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

type DetectionResult = {
  text: string
  confidence: number
  boundingBox: { x: number; y: number; width: number; height: number }
}

export default function CameraInput({
  value,
  onChange,
  placeholder,
  label,
  disabled = false,
  className = "",
  autoFocus = false,
  onKeyDown
}: CameraInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [isCapturing, setIsCapturing] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [detectionConfidence, setDetectionConfidence] = useState(0)
  const [scanAttempts, setScanAttempts] = useState(0)
  const [lastDetection, setLastDetection] = useState<string>('')
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const detectionHistoryRef = useRef<string[]>([])

  const isValid = validateLicensePlate(value)
  const hasValue = value.trim().length > 0

  // License plate dimensions (typical Brazilian plate ratio ~2.4:1)
  const PLATE_ASPECT_RATIO = 2.4
  const SCANNING_AREA_WIDTH = 300
  const SCANNING_AREA_HEIGHT = Math.round(SCANNING_AREA_WIDTH / PLATE_ASPECT_RATIO)
  const CONFIDENCE_THRESHOLD = 0.8
  const DETECTION_CONSISTENCY_REQUIRED = 3

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatLicensePlate(e.target.value)
    onChange(formattedValue)
  }

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
  }

  const performAdvancedOCR = useCallback(async (imageData: ImageData): Promise<DetectionResult | null> => {
    // Simulate processing time for realistic experience
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200))
    
    // Enhanced mock OCR with confidence simulation
    const mockPlates = [
      'ABC-1234', 'DEF-5678', 'GHI-9012', 'JKL-3456', 'MNO-7890',
      'PQR-1357', 'STU-2468', 'VWX-9753', 'YZA-1597', 'BCD-8642',
      'EFG-2468', 'HIJ-1357', 'KLM-8024', 'NOP-5791', 'QRS-3146'
    ]
    
    // Simulate image quality analysis based on contrast and sharpness
    const imageQuality = analyzeImageQuality(imageData)
    
    // Higher chance of detection with better image quality
    const detectionProbability = Math.min(0.85, imageQuality * 0.6 + 0.1)
    
    if (Math.random() < detectionProbability) {
      const detectedText = mockPlates[Math.floor(Math.random() * mockPlates.length)]
      
      // Confidence based on image quality and consistency
      const baseConfidence = 0.4 + (imageQuality * 0.5)
      const randomVariation = (Math.random() - 0.5) * 0.2
      const confidence = Math.max(0.1, Math.min(0.95, baseConfidence + randomVariation))
      
      return {
        text: detectedText,
        confidence,
        boundingBox: {
          x: imageData.width * 0.1,
          y: imageData.height * 0.3,
          width: imageData.width * 0.8,
          height: imageData.height * 0.4
        }
      }
    }
    
    return null
  }, [])

  const analyzeImageQuality = (imageData: ImageData): number => {
    const data = imageData.data
    let totalContrast = 0
    let pixelCount = 0
    
    // Simple contrast analysis - in reality this would be more sophisticated
    for (let i = 0; i < data.length; i += 16) { // Sample every 4th pixel
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      
      const brightness = (r + g + b) / 3
      totalContrast += Math.abs(brightness - 128) // Distance from middle gray
      pixelCount++
    }
    
    const averageContrast = totalContrast / pixelCount
    return Math.min(1, averageContrast / 64) // Normalize to 0-1
  }

  const processDetectionResult = useCallback((result: DetectionResult) => {
    const detectedText = result.text.toUpperCase()
    
    // Add to detection history
    detectionHistoryRef.current.push(detectedText)
    if (detectionHistoryRef.current.length > 10) {  
      detectionHistoryRef.current.shift() // Keep only last 10 detections
    }
    
    // Check for consistency in recent detections
    const recentDetections = detectionHistoryRef.current.slice(-DETECTION_CONSISTENCY_REQUIRED)
    const consistentDetection = recentDetections.every(detection => detection === detectedText)
    
    setLastDetection(detectedText)
    setDetectionConfidence(result.confidence)
    
    // Only proceed if we have high confidence AND consistency
    if (result.confidence >= CONFIDENCE_THRESHOLD && 
        consistentDetection && 
        recentDetections.length >= DETECTION_CONSISTENCY_REQUIRED &&
        validateLicensePlate(detectedText)) {
      
      const formattedPlate = formatLicensePlate(detectedText)
      onChange(formattedPlate)
      closeCamera()
    }
  }, [onChange])

  const scanForText = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !isCapturing) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (!context || video.videoWidth === 0 || video.videoHeight === 0) return

    setScanAttempts(prev => prev + 1)

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw current video frame
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Calculate precise scanning area matching the overlay rectangle
    const displayWidth = canvas.width
    const displayHeight = canvas.height
    
    // Calculate the actual scanning rectangle coordinates
    const scanWidth = Math.min(SCANNING_AREA_WIDTH, displayWidth * 0.8)
    const scanHeight = Math.min(SCANNING_AREA_HEIGHT, displayHeight * 0.3)
    const scanX = (displayWidth - scanWidth) / 2
    const scanY = (displayHeight - scanHeight) / 2

    // Extract ONLY the scanning region for OCR
    const imageData = context.getImageData(scanX, scanY, scanWidth, scanHeight)
    
    try {
      const result = await performAdvancedOCR(imageData)
      if (result) {
        processDetectionResult(result)
      }
    } catch (error) {
      console.error('Error during OCR processing:', error)
    }
  }, [isCapturing, performAdvancedOCR, processDetectionResult, SCANNING_AREA_WIDTH, SCANNING_AREA_HEIGHT])

  // Start automatic scanning when video is ready
  useEffect(() => {
    if (isCapturing && videoRef.current) {
      const video = videoRef.current
      
      const handleVideoReady = () => {
        setIsScanning(true)
        setScanAttempts(0)
        setDetectionConfidence(0)
        setLastDetection('')
        detectionHistoryRef.current = []
        
        // Start more frequent scanning for better responsiveness
        scanIntervalRef.current = setInterval(scanForText, 800)
      }

      if (video.readyState >= 2) {
        handleVideoReady()
      } else {
        video.addEventListener('loadeddata', handleVideoReady)
      }

      return () => {
        video.removeEventListener('loadeddata', handleVideoReady)
      }
    }
  }, [isCapturing, scanForText])

  // Cleanup scanning interval
  useEffect(() => {
    return () => {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current)
        scanIntervalRef.current = null
      }
    }
  }, [])

  const handleManualConfirm = () => {
    if (lastDetection && validateLicensePlate(lastDetection)) {
      const formattedPlate = formatLicensePlate(lastDetection)
      onChange(formattedPlate)
      closeCamera()
    } else {
      // If no good detection, close camera for manual input
      closeCamera()
    }
  }

  const handleCameraClick = async () => {
    try {
      setIsCapturing(true)
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      })
      
      streamRef.current = stream
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      alert('Não foi possível acessar a câmera')
      setIsCapturing(false)
    }
  }

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current)
      scanIntervalRef.current = null
    }
    setIsCapturing(false)
    setIsScanning(false)
    setDetectionConfidence(0)
    setScanAttempts(0)
    setLastDetection('')
    detectionHistoryRef.current = []
  }

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block paragraph-small-medium text-[#474F56] mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={onKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          className={`w-full text-[32px] pb-[16px] pr-[60px] text-base focus:outline-none placeholder:text-[#C6C8CB] transition-all duration-300 ${
            hasValue 
              ? isValid 
                ? 'text-[#242424]' 
                : 'text-[#DC2626]'
              : 'text-[#C6C8CB]'
          } border-b-0`}
          aria-label={label || "Input de placa"}
        />
        
        {/* Camera Icon */}
        <button
          type="button"
          onClick={handleCameraClick}
          disabled={disabled}
          className="absolute right-0 top-[2px] p-2 hover:opacity-70 transition-opacity duration-200"
          aria-label="Capturar com câmera"
        >
          <Image
            src="/camera.svg"
            alt="Camera"
            width={32}
            height={32}
            className="w-8 h-8"
          />
        </button>
        
        {/* Animated border */}
        <div 
          className={`absolute bottom-0 left-0 h-[2px] w-full transition-all duration-300 ease-out ${
            isFocused || hasValue 
              ? hasValue && !isValid
                ? 'bg-[#DC2626] transform translate-y-[-4px]'
                : 'bg-black transform translate-y-[-4px]'
              : 'bg-[#E5E7EB] transform translate-y-0'
          }`}
        />
      </div>

      {/* Validation Message */}
      {hasValue && !isValid && (
        <div className="mt-2 animate-in fade-in duration-200">
          <p className="text-[12px] text-[#DC2626]">
            Formato inválido. Use ABC-1234 ou ABC-1D23
          </p>
        </div>
      )}

      {/* Enhanced Camera Modal */}
      {isCapturing && (
        <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
          <div className="relative w-full h-full max-w-sm mx-auto">
            {/* Header with Enhanced Status */}
            <div className="absolute top-4 left-4 right-4 z-10">
              <div className="bg-black/70 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white text-lg font-semibold">Scanner de Placa</h3>
                  <div className="text-white/60 text-sm">#{scanAttempts}</div>
                </div>
                
                <p className="text-white/80 text-sm mb-2">
                  {isScanning 
                    ? 'Alinhe a placa dentro do retângulo' 
                    : 'Aguardando câmera...'
                  }
                </p>

                {/* Detection Status */}
                {isScanning && (
                  <div className="space-y-2">
                    {/* Confidence Bar */}
                    <div className="flex items-center gap-2">
                      <span className="text-white/60 text-xs">Confiança:</span>
                      <div className="flex-1 bg-white/20 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            detectionConfidence >= CONFIDENCE_THRESHOLD 
                              ? 'bg-green-400' 
                              : detectionConfidence > 0.5 
                                ? 'bg-yellow-400' 
                                : 'bg-red-400'
                          }`}
                          style={{ width: `${detectionConfidence * 100}%` }}
                        />
                      </div>
                      <span className="text-white/60 text-xs min-w-[3rem]">
                        {Math.round(detectionConfidence * 100)}%
                      </span>
                    </div>

                    {/* Last Detection */}
                    {lastDetection && (
                      <div className="flex items-center gap-2">
                        <span className="text-white/60 text-xs">Detectado:</span>
                        <span className="text-white font-mono text-sm">{lastDetection}</span>
                        {detectionConfidence >= CONFIDENCE_THRESHOLD && (
                          <span className="text-green-400 text-xs">✓</span>
                        )}
                      </div>
                    )}

                    {/* Scanning Indicator */}
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-3 w-3 border-2 border-white/30 border-t-white"></div>
                      <span className="text-white/60 text-xs">
                        Escaneando continuamente...
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Video Container */}
            <div className="relative w-full h-full">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                muted
              />
              
              {/* Enhanced Scanning Overlay */}
              <div className="absolute inset-0">
                {/* Precise License Plate Rectangle */}
                <div 
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-2 border-white rounded-lg shadow-2xl"
                  style={{ 
                    width: `${SCANNING_AREA_WIDTH}px`, 
                    height: `${SCANNING_AREA_HEIGHT}px` 
                  }}
                >
                  {/* Enhanced Corner Indicators */}
                  <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-green-400 rounded-tl-lg"></div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 border-t-4 border-r-4 border-green-400 rounded-tr-lg"></div>
                  <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-4 border-l-4 border-green-400 rounded-bl-lg"></div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-green-400 rounded-br-lg"></div>
                  
                  {/* Dynamic Scanning Line */}
                  <div className="absolute inset-0 overflow-hidden rounded-lg">
                    <div className={`absolute top-0 left-0 w-full h-1 transition-all duration-300 ${
                      detectionConfidence >= CONFIDENCE_THRESHOLD 
                        ? 'bg-green-400 shadow-lg shadow-green-400/50' 
                        : 'bg-white animate-pulse'
                    }`}></div>
                  </div>
                  
                  {/* License Plate Guide */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`px-3 py-1 rounded text-xs font-medium backdrop-blur-sm transition-colors ${
                      detectionConfidence >= CONFIDENCE_THRESHOLD
                        ? 'bg-green-500/80 text-white'
                        : 'bg-black/60 text-white/80'
                    }`}>
                      {detectionConfidence >= CONFIDENCE_THRESHOLD ? 'DETECTADO!' : 'PLACA DO CARRO'}
                    </div>
                  </div>
                </div>

                {/* Precise SVG Mask for Blur Effect */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <defs>
                    <mask id="preciseScanningMask">
                      <rect x="0" y="0" width="100%" height="100%" fill="white"/>
                      <rect 
                        x="50%" 
                        y="50%" 
                        width={SCANNING_AREA_WIDTH} 
                        height={SCANNING_AREA_HEIGHT}
                        transform={`translate(-${SCANNING_AREA_WIDTH/2}, -${SCANNING_AREA_HEIGHT/2})`} 
                        fill="black" 
                        rx="8"
                      />
                    </mask>
                  </defs>
                  <rect 
                    x="0" 
                    y="0" 
                    width="100%" 
                    height="100%" 
                    fill="rgba(0,0,0,0.7)" 
                    mask="url(#preciseScanningMask)"
                  />
                </svg>
              </div>

              <canvas ref={canvasRef} className="hidden" />
            </div>
            
            {/* Enhanced Bottom Controls */}
            <div className="absolute bottom-4 left-4 right-4 safe-area-pb">
              <div className="bg-black/70 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                {/* Detection Actions */}
                {lastDetection && detectionConfidence > 0.3 ? (
                  <div className="space-y-3">
                    <button
                      onClick={handleManualConfirm}
                      className={`w-full py-4 px-6 rounded-lg font-medium transition-all text-base active:scale-95 ${
                        detectionConfidence >= CONFIDENCE_THRESHOLD
                          ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg'
                          : 'bg-yellow-500 hover:bg-yellow-600 text-black'
                      }`}
                    >
                      {detectionConfidence >= CONFIDENCE_THRESHOLD 
                        ? `Confirmar: ${lastDetection}` 
                        : `Usar Detecção: ${lastDetection}`
                      }
                    </button>
                    
                    <button
                      onClick={closeCamera}
                      className="w-full bg-white/20 text-white py-3 px-6 rounded-lg font-medium hover:bg-white/30 transition-colors text-sm active:scale-95"
                    >
                      Cancelar e Digitar Manualmente
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-center py-2">
                      <p className="text-white/80 text-sm">
                        Posicione a placa dentro do retângulo
                      </p>
                      <p className="text-white/60 text-xs mt-1">
                        A detecção será automática
                      </p>
                    </div>
                    
                    <button
                      onClick={closeCamera}
                      className="w-full bg-white/20 text-white py-3 px-6 rounded-lg font-medium hover:bg-white/30 transition-colors text-sm active:scale-95"
                    >
                      Cancelar e Digitar Manualmente
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
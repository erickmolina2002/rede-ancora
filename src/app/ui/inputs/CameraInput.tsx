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
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const isValid = validateLicensePlate(value)
  const hasValue = value.trim().length > 0

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const simulateOCR = async (_blob: Blob): Promise<string | null> => {
    // Simulate OCR processing time
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Mock license plates for demonstration
    const mockPlates = [
      'ABC-1234', 'DEF-5678', 'GHI-9012', 'JKL-3456', 'MNO-7890',
      'PQR-1357', 'STU-2468', 'VWX-9753', 'YZA-1597', 'BCD-8642'
    ]
    
    // Simulate successful detection with 30% probability
    if (Math.random() > 0.7) {
      return mockPlates[Math.floor(Math.random() * mockPlates.length)]
    }
    
    return null
  }

  const processImageForText = useCallback(async (blob: Blob) => {
    try {
      // Simple license plate pattern matching as fallback
      // In a real app, you would use Tesseract.js or a cloud OCR service
      const mockDetection = await simulateOCR(blob)
      
      if (mockDetection && validateLicensePlate(mockDetection)) {
        const formattedPlate = formatLicensePlate(mockDetection)
        onChange(formattedPlate)
        closeCamera()
      }
    } catch (error) {
      console.error('Error processing image for text:', error)
    }
  }, [onChange])

  const scanForText = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !isCapturing) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (!context || video.videoWidth === 0 || video.videoHeight === 0) return

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw current video frame
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Calculate scanning area (center rectangle)
    const scanWidth = canvas.width * 0.7
    const scanHeight = canvas.height * 0.3
    const scanX = (canvas.width - scanWidth) / 2
    const scanY = (canvas.height - scanHeight) / 2

    // Extract the scanning region
    const imageData = context.getImageData(scanX, scanY, scanWidth, scanHeight)
    
    // Create a temporary canvas for the cropped region
    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = scanWidth
    tempCanvas.height = scanHeight
    const tempContext = tempCanvas.getContext('2d')
    
    if (tempContext) {
      tempContext.putImageData(imageData, 0, 0)
      
      // Convert to blob and process with OCR
      tempCanvas.toBlob(async (blob) => {
        if (blob) {
          await processImageForText(blob)
        }
      }, 'image/jpeg', 0.8)
    }
  }, [isCapturing, processImageForText])

  // Start automatic scanning when video is ready
  useEffect(() => {
    if (isCapturing && videoRef.current) {
      const video = videoRef.current
      
      const handleVideoReady = () => {
        setIsScanning(true)
        // Start scanning every 1 second
        scanIntervalRef.current = setInterval(scanForText, 1000)
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

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      const context = canvas.getContext('2d')
      
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height)
        
        canvas.toBlob((blob) => {
          if (blob) {
            recognizeLicensePlate()
          }
        }, 'image/jpeg', 0.8)
      }
    }
  }

  const recognizeLicensePlate = async () => {
    try {
      // Simple OCR simulation - in a real app you'd use Tesseract.js or a cloud service
      // For now, we'll simulate license plate recognition
      const mockLicensePlates = [
        'ABC-1234', 'DEF-5678', 'GHI-9012', 'JKL-3456', 'MNO-7890',
        'PQR-1357', 'STU-2468', 'VWX-9753', 'YZA-1597', 'BCD-8642'
      ]
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Randomly select a license plate (in real app, this would be OCR result)
      const recognizedPlate = mockLicensePlates[Math.floor(Math.random() * mockLicensePlates.length)]
      
      // Format the recognized plate
      const formattedPlate = formatLicensePlate(recognizedPlate)
      onChange(formattedPlate)
      closeCamera()
      
    } catch (error) {
      console.error('Error recognizing license plate:', error)
      alert('Erro ao reconhecer a placa. Tente novamente.')
      closeCamera()
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

      {/* Camera Modal */}
      {isCapturing && (
        <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
          <div className="relative w-full h-full max-w-sm mx-auto">
            {/* Header */}
            <div className="absolute top-4 left-4 right-4 z-10">
              <div className="bg-black/60 backdrop-blur-sm rounded-lg p-4">
                <h3 className="text-white text-lg font-semibold mb-1">Scanner de Placa</h3>
                <p className="text-white/80 text-sm">
                  {isScanning ? 'Procurando por texto...' : 'Alinhe a placa dentro do quadrado'}
                </p>
                {isScanning && (
                  <div className="flex items-center gap-2 mt-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
                    <span className="text-white/60 text-xs">Escaneando automaticamente</span>
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
              
              {/* Blurred Overlay */}
              <div className="absolute inset-0 backdrop-blur-sm">
                {/* Clear Scanning Area - Responsive centered rectangle */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[280px] h-[120px] sm:w-64 sm:h-32">
                  {/* Clear area - this creates the "hole" in the blur */}
                  <div className="w-full h-full bg-transparent border-2 border-white rounded-lg shadow-lg">
                    {/* Corner indicators */}
                    <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-white rounded-tl-lg"></div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-white rounded-tr-lg"></div>
                    <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-white rounded-bl-lg"></div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-white rounded-br-lg"></div>
                    
                    {/* Scanning line animation */}
                    <div className="absolute inset-0 overflow-hidden rounded-lg">
                      <div className={`absolute top-0 left-0 w-full h-0.5 bg-white transition-opacity duration-1000 ${
                        isScanning ? 'animate-pulse opacity-100' : 'opacity-60'
                      }`}></div>
                    </div>
                    
                    {/* License plate guide text */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black/40 px-2 py-1 rounded text-white text-xs font-medium backdrop-blur-sm">
                        PLACA
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mask to create clear area effect - responsive */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                  <mask id="scanningMask">
                    <rect x="0" y="0" width="100%" height="100%" fill="white"/>
                    <rect x="50%" y="50%" width="280" height="120" 
                          transform="translate(-140, -60)" fill="black" rx="8"/>
                  </mask>
                </defs>
                <rect x="0" y="0" width="100%" height="100%" 
                      fill="rgba(0,0,0,0.6)" mask="url(#scanningMask)"/>
              </svg>

              <canvas ref={canvasRef} className="hidden" />
            </div>
            
            {/* Bottom Controls */}
            <div className="absolute bottom-4 left-4 right-4 safe-area-pb">
              <div className="bg-black/60 backdrop-blur-sm rounded-lg p-4">
                <div className="space-y-3">
                  {/* Primary Action Button */}
                  <button
                    onClick={capturePhoto}
                    className="w-full bg-white text-black py-4 px-6 rounded-lg font-medium hover:bg-gray-100 transition-colors text-base active:scale-95"
                    disabled={!isScanning}
                  >
                    {isScanning ? 'Capturar Agora' : 'Aguarde...'}
                  </button>
                  
                  {/* Secondary Action Button */}
                  <button
                    onClick={closeCamera}
                    className="w-full bg-white/20 text-white py-3 px-6 rounded-lg font-medium hover:bg-white/30 transition-colors text-sm active:scale-95"
                  >
                    Cancelar e Digitar Manualmente
                  </button>
                </div>
                
                {/* Scanning Status */}
                <div className="mt-3 text-center">
                  <p className="text-white/60 text-xs">
                    {isScanning 
                      ? 'Detecção automática ativada • Toque para capturar manualmente'
                      : 'Aguardando câmera...'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
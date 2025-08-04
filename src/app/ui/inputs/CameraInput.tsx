'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { createWorker } from 'tesseract.js'
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const workerRef = useRef<any>(null)

  const isValid = validateLicensePlate(value)
  const hasValue = value.trim().length > 0

  // License plate scanning area
  const SCANNING_AREA_WIDTH = 280
  const SCANNING_AREA_HEIGHT = 120

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

  const initializeOCRWorker = useCallback(async () => {
    if (!workerRef.current) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const worker: any = await createWorker()
        await worker.loadLanguage('eng')
        await worker.initialize('eng')
        await worker.setParameters({
          tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-',
          tessedit_pageseg_mode: '7', // Changed to treat image as single text line
          tessedit_char_blacklist: '!@#$%^&*()+=[]{}|;:,.<>?/~`',
        })
        workerRef.current = worker
        console.log('OCR Worker initialized successfully')
      } catch (error) {
        console.error('Failed to initialize OCR worker:', error)
      }
    }
  }, [])

  const performRealOCR = useCallback(async (canvas: HTMLCanvasElement): Promise<string | null> => {
    try {
      if (!workerRef.current) {
        console.log('Initializing OCR worker...')
        await initializeOCRWorker()
      }

      if (workerRef.current) {
        console.log('Starting OCR recognition...')
        
        // Add timeout for OCR recognition
        const ocrPromise = workerRef.current.recognize(canvas)
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('OCR timeout')), 10000)
        )
        
        const result = await Promise.race([ocrPromise, timeoutPromise])
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: { text, confidence } } = result as any
        
        console.log(`OCR Result: "${text.trim()}" (Confidence: ${confidence}%)`)
        
        if (confidence > 30) { // Lowered threshold for better detection
          return text.trim().toUpperCase()
        } else {
          console.log('OCR confidence too low:', confidence)
        }
      }
      
      return null
    } catch (error) {
      console.error('OCR Error:', error)
      return null
    }
  }, [initializeOCRWorker])

  const processLicensePlateText = (detectedText: string): string | null => {
    // Clean up the detected text
    const cleanText = detectedText.replace(/[^A-Z0-9]/g, '')
    
    // Try different license plate patterns
    const patterns = [
      /^([A-Z]{3})(\d{4})$/, // ABC1234
      /^([A-Z]{3})(\d{1})([A-Z]{1})(\d{2})$/, // ABC1D23 (Mercosul)
      /^([A-Z]{2})(\d{4})$/, // AB1234 (older format)
    ]

    for (const pattern of patterns) {
      const match = cleanText.match(pattern)
      if (match) {
        if (pattern.source.includes('([A-Z]{3})(\\d{1})([A-Z]{1})(\\d{2})')) {
          // Mercosul format: ABC1D23
          return `${match[1]}-${match[2]}${match[3]}${match[4]}`
        } else {
          // Standard format: ABC-1234
          return `${match[1]}-${match[2]}`
        }
      }
    }

    // Try to extract any sequence that looks like a plate
    const plateMatch = cleanText.match(/([A-Z]{2,3})(\d{3,4})|([A-Z]{3}\d[A-Z]\d{2})/)
    if (plateMatch) {
      const extracted = plateMatch[0]
      if (extracted.length >= 6) {
        // Format as standard plate
        if (extracted.length === 7 && /[A-Z]{3}\d[A-Z]\d{2}/.test(extracted)) {
          return `${extracted.slice(0,3)}-${extracted.slice(3)}`
        } else {
          const letters = extracted.match(/[A-Z]+/)?.[0] || ''
          const numbers = extracted.match(/\d+/)?.[0] || ''
          if (letters.length >= 2 && numbers.length >= 3) {
            return `${letters}-${numbers}`
          }
        }
      }
    }

    return null
  }

  const captureAndProcess = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !isCapturing) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (!context || video.videoWidth === 0 || video.videoHeight === 0) return

    console.log('Capturing frame for OCR...')

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw current video frame
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Calculate scanning area (center rectangle)
    const displayWidth = canvas.width
    const displayHeight = canvas.height
    const scanWidth = Math.min(SCANNING_AREA_WIDTH, displayWidth * 0.8)
    const scanHeight = Math.min(SCANNING_AREA_HEIGHT, displayHeight * 0.3)
    const scanX = (displayWidth - scanWidth) / 2
    const scanY = (displayHeight - scanHeight) / 2

    // Extract the scanning region
    const imageData = context.getImageData(scanX, scanY, scanWidth, scanHeight)
    
    // Create a temporary canvas for the cropped region
    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = scanWidth
    tempCanvas.height = scanHeight
    const tempContext = tempCanvas.getContext('2d')
    
    if (tempContext) {
      tempContext.putImageData(imageData, 0, 0)
      
      try {
        const detectedText = await performRealOCR(tempCanvas)
        
        if (detectedText) {
          console.log('Raw OCR text:', detectedText)
          const formattedPlate = processLicensePlateText(detectedText)
          
          if (formattedPlate && validateLicensePlate(formattedPlate)) {
            console.log('Valid license plate detected:', formattedPlate)
            onChange(formatLicensePlate(formattedPlate))
            closeCamera()
            return true
          } else {
            console.log('Detected text does not match license plate format:', detectedText)
          }
        }
      } catch (error) {
        console.error('Error during OCR processing:', error)
      }
    }
    return false
  }, [isCapturing, performRealOCR, onChange])

  const scanForText = useCallback(async () => {
    await captureAndProcess()
  }, [captureAndProcess])

  // Start automatic scanning when video is ready
  useEffect(() => {
    if (isCapturing && videoRef.current) {
      const video = videoRef.current
      
      const handleVideoReady = () => {
        setIsScanning(true)
        // Initialize OCR worker
        initializeOCRWorker()
        // Start scanning every 2 seconds for better OCR processing
        scanIntervalRef.current = setInterval(scanForText, 2000)
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
  }, [isCapturing, scanForText, initializeOCRWorker])

  // Cleanup scanning interval and OCR worker
  useEffect(() => {
    return () => {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current)
        scanIntervalRef.current = null
      }
      if (workerRef.current) {
        workerRef.current.terminate()
        workerRef.current = null
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

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current)
      scanIntervalRef.current = null
    }
    if (workerRef.current) {
      workerRef.current.terminate()
      workerRef.current = null
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

      {/* Camera Modal - Layout  Simples */}
      {isCapturing && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-sm w-full mx-4">
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Capturar Placa</h3>
              <p className="text-sm text-gray-600">
                {isScanning ? 'Escaneando automaticamente...' : 'Posicione a câmera sobre a placa do veículo'}
              </p>
            </div>
            
            <div className="relative mb-4">
              <video
                ref={videoRef}
                className="w-full h-48 object-cover rounded-lg bg-gray-200"
                playsInline
                muted
              />
              
              {/* Retângulo de Escaneamento Simples */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div 
                  className="border-2 border-white rounded-lg shadow-lg"
                  style={{ 
                    width: `${Math.min(SCANNING_AREA_WIDTH, 240)}px`, 
                    height: `${Math.min(SCANNING_AREA_HEIGHT, 100)}px` 
                  }}
                >
                  {/* Indicadores de canto */}
                  <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-white"></div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-white"></div>
                  <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-white"></div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-white"></div>
                  
                  {/* Linha de escaneamento */}
                  {isScanning && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-0.5 bg-white animate-pulse"></div>
                    </div>
                  )}
                </div>
              </div>
              
              <canvas ref={canvasRef} className="hidden" />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={captureAndProcess}
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                disabled={!isScanning}
              >
                Capturar
              </button>
              <button
                onClick={closeCamera}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
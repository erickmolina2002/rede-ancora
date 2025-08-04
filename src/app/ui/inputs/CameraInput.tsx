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
  const [scanProgress, setScanProgress] = useState(0)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null)

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

  // Simulação de detecção de placa para produção
  const simulatePlateDetection = useCallback(async (): Promise<string | null> => {
    // Simula tempo de processamento real
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000))
    
    // Banco de placas reais para simulação
    const mockPlates = [
      'ABC-1234', 'DEF-5678', 'GHI-9012', 'JKL-3456', 'MNO-7890',
      'PQR-1357', 'STU-2468', 'VWX-9753', 'YZA-1597', 'BCD-8642',
      'EFG-2468', 'HIJ-1357', 'KLM-8024', 'NOP-5791', 'QRS-3146',
      'TUV-4829', 'WXY-6051', 'ZAB-7384', 'CDE-9517', 'FGH-2850'
    ]
    
    // Simula detecção com 85% de sucesso
    if (Math.random() < 0.85) {
      return mockPlates[Math.floor(Math.random() * mockPlates.length)]
    }
    
    return null
  }, [])

  const captureAndProcess = useCallback(async () => {
    if (!isCapturing) return false

    console.log('Iniciando captura da placa...')
    setScanProgress(0)
    
    // Simula progresso de processamento
    const progressInterval = setInterval(() => {
      setScanProgress(prev => Math.min(prev + 10, 90))
    }, 150)

    try {
      const detectedPlate = await simulatePlateDetection()
      
      clearInterval(progressInterval)
      setScanProgress(100)
      
      if (detectedPlate && validateLicensePlate(detectedPlate)) {
        console.log('Placa detectada:', detectedPlate)
        // Pequeno delay para mostrar 100%
        setTimeout(() => {
          onChange(formatLicensePlate(detectedPlate))
          closeCamera()
        }, 500)
        return true
      } else {
        console.log('Nenhuma placa válida detectada')
        setScanProgress(0)
      }
    } catch (error) {
      clearInterval(progressInterval)
      setScanProgress(0)
      console.error('Erro na detecção:', error)
    }
    
    return false
  }, [isCapturing, simulatePlateDetection, onChange])

  const scanForText = useCallback(async () => {
    await captureAndProcess()
  }, [captureAndProcess])

  // Start automatic scanning when video is ready
  useEffect(() => {
    if (isCapturing && videoRef.current) {
      const video = videoRef.current
      
      const handleVideoReady = () => {
        setIsScanning(true)
        // Start scanning every 3 seconds
        scanIntervalRef.current = setInterval(scanForText, 3000)
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
    setScanProgress(0)
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
                {scanProgress > 0 
                  ? `Detectando placa... ${scanProgress}%` 
                  : isScanning 
                    ? 'Escaneando automaticamente...' 
                    : 'Posicione a câmera sobre a placa do veículo'
                }
              </p>
              
              {/* Barra de progresso */}
              {scanProgress > 0 && (
                <div className="mt-2 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
              )}
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
              
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={captureAndProcess}
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                disabled={!isScanning || scanProgress > 0}
              >
                {scanProgress > 0 ? 'Processando...' : 'Capturar'}
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
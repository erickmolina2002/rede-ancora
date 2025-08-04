'use client'

import React, { useState, useRef } from 'react'
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
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

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
            recognizeLicensePlate(blob)
          }
        }, 'image/jpeg', 0.8)
      }
    }
  }

  const recognizeLicensePlate = async (imageBlob: Blob) => {
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
    setIsCapturing(false)
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
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-sm w-full mx-4">
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Capturar Placa</h3>
              <p className="text-sm text-gray-600">Posicione a câmera sobre a placa do veículo</p>
            </div>
            
            <div className="relative mb-4">
              <video
                ref={videoRef}
                className="w-full h-48 object-cover rounded-lg bg-gray-200"
                playsInline
                muted
              />
              <canvas
                ref={canvasRef}
                className="hidden"
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={capturePhoto}
                className="flex-1 bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
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
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
  const [scanProgress, setScanProgress] = useState(0)
  const [ocrStatus, setOcrStatus] = useState('')
  
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

  // Inicializar OCR Worker otimizado para placas
  const initializeOCR = useCallback(async () => {
    if (workerRef.current) return workerRef.current

    try {
      setOcrStatus('Iniciando OCR...')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const worker: any = await createWorker()
      
      setOcrStatus('Carregando idiomas...')
      await worker.loadLanguage('eng')
      await worker.initialize('eng')
      
      setOcrStatus('Configurando para placas...')
      // Configurações específicas para placas brasileiras
      await worker.setParameters({
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
        tessedit_pageseg_mode: '8', // Palavra única
        tessedit_ocr_engine_mode: '1', // Neural network LSTM
        preserve_interword_spaces: '0',
        user_defined_dpi: '300',
        tessjs_create_hocr: '0',
        tessjs_create_tsv: '0',
      })

      workerRef.current = worker
      setOcrStatus('OCR pronto!')
      return worker
    } catch (error) {
      console.error('Erro ao inicializar OCR:', error)
      setOcrStatus('Erro no OCR')
      return null
    }
  }, [])

  // Processar imagem com OCR real
  const performRealOCR = useCallback(async (imageData: ImageData): Promise<string | null> => {
    try {
      const worker = await initializeOCR()
      if (!worker) return null

      setOcrStatus('Analisando imagem...')

      // Criar canvas temporário para pré-processamento
      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = imageData.width
      tempCanvas.height = imageData.height
      const ctx = tempCanvas.getContext('2d')
      
      if (!ctx) return null

      // Aplicar pré-processamento para melhor OCR
      ctx.putImageData(imageData, 0, 0)
      
      // Aumentar contraste e brilho
      ctx.filter = 'contrast(150%) brightness(110%) grayscale(100%)'
      ctx.drawImage(tempCanvas, 0, 0)
      
      setOcrStatus('Detectando texto...')
      
      // Executar OCR
      const { data: { text, confidence } } = await worker.recognize(tempCanvas)
      
      console.log(`OCR Raw: "${text}" (${confidence}% confiança)`)
      
      if (confidence > 70) { // Confiança mínima
        return text.trim().toUpperCase()
      }
      
      return null
    } catch (error) {
      console.error('Erro no OCR:', error)
      setOcrStatus('Erro na detecção')
      return null
    }
  }, [initializeOCR])

  // Processar texto detectado para extrair placa
  const extractLicensePlate = useCallback((rawText: string): string | null => {
    if (!rawText) return null
    
    // Limpar texto - apenas letras e números
    const cleanText = rawText.replace(/[^A-Z0-9]/g, '')
    console.log(`Texto limpo: "${cleanText}"`)
    
    // Padrões de placa brasileira
    const patterns = [
      /^([A-Z]{3})(\d{4})$/, // ABC1234 (padrão antigo)
      /^([A-Z]{3})(\d{1})([A-Z]{1})(\d{2})$/, // ABC1D23 (Mercosul)
    ]

    // Tentar extrair com padrões exatos
    for (const pattern of patterns) {
      const match = cleanText.match(pattern)
      if (match) {
        if (match[3]) {
          // Mercosul: ABC1D23 -> ABC-1D23
          return `${match[1]}-${match[2]}${match[3]}${match[4]}`
        } else {
          // Padrão: ABC1234 -> ABC-1234
          return `${match[1]}-${match[2]}`
        }
      }
    }

    // Tentar extrair sequências que parecem placas
    const plateMatches = [
      cleanText.match(/([A-Z]{3})(\d{4})/), // ABC1234
      cleanText.match(/([A-Z]{3})(\d{1}[A-Z]{1}\d{2})/), // ABC1D23
      cleanText.match(/([A-Z]{2,3})(\d{3,4})/) // Qualquer sequência similar
    ]

    for (const match of plateMatches) {
      if (match) {
        const letters = match[1]
        const numbers = match[2]
        
        if (letters.length >= 2 && numbers.length >= 3) {
          return `${letters}-${numbers}`
        }
      }
    }

    console.log('Nenhum padrão de placa encontrado')
    return null
  }, [])

  const captureAndProcess = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !isCapturing) return false

    console.log('Iniciando captura real da placa...')
    setScanProgress(0)
    setOcrStatus('Capturando imagem...')

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    if (!ctx || video.videoWidth === 0 || video.videoHeight === 0) return false

    try {
      // Definir dimensões do canvas
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Capturar frame atual
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Calcular área de escaneamento (retângulo central)
      const scanWidth = Math.min(SCANNING_AREA_WIDTH * 2, canvas.width * 0.8)
      const scanHeight = Math.min(SCANNING_AREA_HEIGHT * 2, canvas.height * 0.4)
      const scanX = (canvas.width - scanWidth) / 2
      const scanY = (canvas.height - scanHeight) / 2

      // Extrair apenas a região da placa
      const imageData = ctx.getImageData(scanX, scanY, scanWidth, scanHeight)
      
      setScanProgress(30)
      
      // Executar OCR na região extraída
      const rawText = await performRealOCR(imageData)
      setScanProgress(70)
      
      if (rawText) {
        console.log('Texto detectado pelo OCR:', rawText)
        
        // Extrair placa do texto detectado
        const extractedPlate = extractLicensePlate(rawText)
        setScanProgress(90)
        
        if (extractedPlate && validateLicensePlate(extractedPlate)) {
          console.log('✅ Placa válida encontrada:', extractedPlate)
          setScanProgress(100)
          setOcrStatus('Placa detectada!')
          
          // Delay para mostrar sucesso
          setTimeout(() => {
            onChange(formatLicensePlate(extractedPlate))
            closeCamera()
          }, 1000)
          
          return true
        } else {
          console.log('❌ Texto detectado não é uma placa válida:', rawText)
          setOcrStatus('Placa não reconhecida')
        }
      } else {
        console.log('❌ Nenhum texto detectado')
        setOcrStatus('Nenhum texto encontrado')
      }
      
      // Reset após falha
      setTimeout(() => {
        setScanProgress(0)
        setOcrStatus('')
      }, 2000)
      
    } catch (error) {
      console.error('Erro na captura:', error)
      setOcrStatus('Erro na captura')
      setScanProgress(0)
    }
    
    return false
  }, [isCapturing, performRealOCR, extractLicensePlate, onChange])

  const scanForText = useCallback(async () => {
    await captureAndProcess()
  }, [captureAndProcess])

  // Inicializar OCR quando captura inicia
  useEffect(() => {
    if (isCapturing && videoRef.current) {
      const video = videoRef.current
      
      const handleVideoReady = () => {
        setIsScanning(true)
        // Inicializar OCR em background
        initializeOCR()
        // Escanear automaticamente a cada 5 segundos
        scanIntervalRef.current = setInterval(scanForText, 5000)
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
  }, [isCapturing, scanForText, initializeOCR])

  // Cleanup
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
    setScanProgress(0)
    setOcrStatus('')
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
                {ocrStatus || (scanProgress > 0 
                  ? `Processando... ${scanProgress}%` 
                  : isScanning 
                    ? 'OCR ativo - Posicione a placa no retângulo' 
                    : 'Posicione a câmera sobre a placa do veículo'
                )}
              </p>
              
              {/* Barra de progresso */}
              {scanProgress > 0 && (
                <div className="mt-2 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      scanProgress === 100 ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
              )}
              
              {/* Status do OCR */}
              {ocrStatus && (
                <div className="mt-2 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  {ocrStatus}
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
              
              <canvas ref={canvasRef} className="hidden" />
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
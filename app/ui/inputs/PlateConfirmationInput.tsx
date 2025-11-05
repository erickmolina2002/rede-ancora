'use client'

import React, { useState, useEffect } from 'react'
import { useVehicle } from '../../contexts/VehicleContext'
import { apiService } from '../../services/apiService'

type PlateConfirmationInputProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  disabled?: boolean
  className?: string
  autoFocus?: boolean
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  stepData?: { [key: string]: string | number | boolean | unknown }
}

export default function PlateConfirmationInput({
  value,
  onChange,
  placeholder = "",
  className = "",
  stepData = {}
}: PlateConfirmationInputProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { vehicleInfo, setVehicleInfo } = useVehicle()

  // Função para buscar informações do veículo da API
  const fetchVehicleInfo = async (plate: string) => {
    setIsLoading(true)
    setError(null)

    try {
      // Remover caracteres especiais da placa
      const placaLimpa = plate.replace(/[^A-Z0-9]/gi, '').toUpperCase()

      const response = await apiService.buscarInformacaoVeiculo(placaLimpa)

      // Verificar se vehicle está em pageResult ou diretamente no response
      const vehicle = response?.pageResult?.vehicle || response?.vehicle

      if (vehicle) {
        setVehicleInfo({
          placa: plate.toUpperCase(),
          montadora: vehicle.montadora,
          modelo: vehicle.modelo,
          versao: vehicle.versao || '',
          chassi: vehicle.chassi,
          motor: vehicle.motor,
          combustivel: vehicle.combustivel,
          cambio: vehicle.cambio,
          carroceria: vehicle.carroceria,
          anoFabricacao: vehicle.anoFabricacao,
          anoModelo: vehicle.anoModelo,
          linha: vehicle.linha,
          eixos: vehicle.eixos || '',
          geracao: vehicle.geracao
        })
      } else {
        setError('Não foi possível encontrar informações para esta placa.')
      }
    } catch (err) {
      setError('Erro ao buscar informações do veículo. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  // Initialize with plate from previous step and load vehicle info from API
  useEffect(() => {
    if (!value && stepData.budgetDescription) {
      const plateValue = String(stepData.budgetDescription)
      onChange(plateValue)
      fetchVehicleInfo(plateValue)
    } else if (value && !vehicleInfo) {
      fetchVehicleInfo(value)
    }
  }, [value, stepData.budgetDescription, onChange, vehicleInfo])

  // Clear error when vehicleInfo is cleared (when going back)
  useEffect(() => {
    if (!vehicleInfo) {
      setError(null)
    }
  }, [vehicleInfo])

  const handleEdit = () => {
    setIsEditing(true)
    setEditValue(value)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditValue('')
  }

  const handleSave = async () => {
    if (editValue.trim()) {
      const newPlate = editValue.trim().toUpperCase()
      onChange(newPlate)
      setIsEditing(false)
      setEditValue('')

      // Buscar informações do veículo da API para a nova placa
      await fetchVehicleInfo(newPlate)
    }
  }

  const formatPlate = (plate: string) => {
    // Format as ABC-1234 or ABC1D23 (Mercosul)
    const cleaned = plate.replace(/[^A-Z0-9]/g, '')
    if (cleaned.length <= 3) return cleaned
    if (cleaned.length <= 7) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`
    }
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}`
  }

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPlate(e.target.value.toUpperCase())
    setEditValue(formatted)
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="space-y-6 animate-in fade-in duration-500">
        
        {/* Plate Display/Edit Section */}
        <div className="bg-white border-2 border-[#E5E7EB] rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[16px] font-medium text-[#242424]">Placa do Veículo</h3>
            {!isEditing && (
              <button
                onClick={handleEdit}
                className="text-[12px] px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center gap-1"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Editar
              </button>
            )}
          </div>
          
          {isEditing ? (
            <div className="space-y-3">
              <input
                type="text"
                value={editValue}
                onChange={handleEditInputChange}
                placeholder={placeholder}
                className="w-full h-[48px] px-4 text-[16px] font-mono font-bold text-center border border-[#D1D5DB] rounded-lg focus:outline-none focus:border-[#242424] bg-[#F9FAFB]"
                maxLength={8}
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={!editValue.trim()}
                  className="flex-1 h-[40px] bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  Confirmar
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 h-[40px] bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <span className="text-[24px] font-bold font-mono text-[#242424] bg-gray-100 px-4 py-2 rounded">
                {value || placeholder}
              </span>
            </div>
          )}
        </div>

        {/* Error State */}
        {error && !isEditing && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-in fade-in duration-300">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-[14px] font-medium text-red-900">{error}</p>
                <button
                  onClick={() => value && fetchVehicleInfo(value)}
                  className="text-[12px] text-red-600 hover:text-red-700 underline mt-1"
                >
                  Tentar novamente
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Vehicle Information Display */}
        {!isEditing && !error && value && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2 pl-[4px] pt-[2px]">
              <img src="/images/image.png" alt="Vehicle Info" className="w-7 h-7" />
              <h4 className="text-[16px] font-semibold text-[#242424]">Informações Encontradas</h4>
            </div>

            <div className="bg-white rounded-lg p-3 border border-blue-100">
              {isLoading ? (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] text-[#6B7280]">Marca</span>
                    <span className="text-[12px] text-[#9CA3AF] italic">Carregando...</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] text-[#6B7280]">Modelo</span>
                    <span className="text-[12px] text-[#9CA3AF] italic">Carregando...</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] text-[#6B7280]">Versão</span>
                    <span className="text-[12px] text-[#9CA3AF] italic">Carregando...</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] text-[#6B7280]">Ano Modelo</span>
                    <span className="text-[12px] text-[#9CA3AF] italic">Carregando...</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] text-[#6B7280]">Motor</span>
                    <span className="text-[12px] text-[#9CA3AF] italic">Carregando...</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] text-[#6B7280]">Combustível</span>
                    <span className="text-[12px] text-[#9CA3AF] italic">Carregando...</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] text-[#6B7280]">Câmbio</span>
                    <span className="text-[12px] text-[#9CA3AF] italic">Carregando...</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] text-[#6B7280]">Carroceria</span>
                    <span className="text-[12px] text-[#9CA3AF] italic">Carregando...</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] text-[#6B7280]">Eixos</span>
                    <span className="text-[12px] text-[#9CA3AF] italic">Carregando...</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {vehicleInfo?.montadora && (
                    <div className="flex justify-between items-center">
                      <span className="text-[12px] text-[#6B7280]">Marca</span>
                      <span className="text-[12px] font-medium text-[#242424]">
                        {vehicleInfo.montadora}
                      </span>
                    </div>
                  )}
                  {vehicleInfo?.modelo && (
                    <div className="flex justify-between items-center">
                      <span className="text-[12px] text-[#6B7280]">Modelo</span>
                      <span className="text-[12px] font-medium text-[#242424]">
                        {vehicleInfo.modelo}
                      </span>
                    </div>
                  )}
                  {vehicleInfo?.versao && (
                    <div className="flex justify-between items-center">
                      <span className="text-[12px] text-[#6B7280]">Versão</span>
                      <span className="text-[12px] font-medium text-[#242424]">
                        {vehicleInfo.versao}
                      </span>
                    </div>
                  )}
                  {vehicleInfo?.anoModelo && (
                    <div className="flex justify-between items-center">
                      <span className="text-[12px] text-[#6B7280]">Ano Modelo</span>
                      <span className="text-[12px] font-medium text-[#242424]">
                        {vehicleInfo.anoModelo}
                      </span>
                    </div>
                  )}
                  {vehicleInfo?.motor && (
                    <div className="flex justify-between items-center">
                      <span className="text-[12px] text-[#6B7280]">Motor</span>
                      <span className="text-[12px] font-medium text-[#242424]">
                        {vehicleInfo.motor}
                      </span>
                    </div>
                  )}
                  {vehicleInfo?.combustivel && (
                    <div className="flex justify-between items-center">
                      <span className="text-[12px] text-[#6B7280]">Combustível</span>
                      <span className="text-[12px] font-medium text-[#242424]">
                        {vehicleInfo.combustivel}
                      </span>
                    </div>
                  )}
                  {vehicleInfo?.cambio && (
                    <div className="flex justify-between items-center">
                      <span className="text-[12px] text-[#6B7280]">Câmbio</span>
                      <span className="text-[12px] font-medium text-[#242424]">
                        {vehicleInfo.cambio}
                      </span>
                    </div>
                  )}
                  {vehicleInfo?.carroceria && (
                    <div className="flex justify-between items-center">
                      <span className="text-[12px] text-[#6B7280]">Carroceria</span>
                      <span className="text-[12px] font-medium text-[#242424]">
                        {vehicleInfo.carroceria}
                      </span>
                    </div>
                  )}
                  {vehicleInfo?.eixos && (
                    <div className="flex justify-between items-center">
                      <span className="text-[12px] text-[#6B7280]">Eixos</span>
                      <span className="text-[12px] font-medium text-[#242424]">
                        {vehicleInfo.eixos}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}


      </div>

      {/* Hidden input for form validation */}
      <input
        type="hidden"
        value={value}
        onChange={() => {}}
        aria-label="Confirmação da placa"
      />
    </div>
  )
}
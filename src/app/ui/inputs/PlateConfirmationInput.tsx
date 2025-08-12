'use client'

import React, { useState, useEffect } from 'react'
import { useVehicle } from '../../contexts/VehicleContext'
import { useProductSearch } from '../../hooks/useProductSearch'

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
  const [isSearching, setIsSearching] = useState(false)
  const { vehicleInfo, setVehicleInfo, clearVehicleInfo } = useVehicle()
  const { buscarInformacoesVeiculo } = useProductSearch()

  // Initialize with plate from previous step
  useEffect(() => {
    if (!value && stepData.budgetDescription) {
      const plateValue = String(stepData.budgetDescription)
      onChange(plateValue)
    }
  }, [value, stepData.budgetDescription, onChange])

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
      setIsSearching(true)
      try {
        // Clear current vehicle info
        clearVehicleInfo()
        
        // Search for new vehicle info
        const newVehicleInfo = await buscarInformacoesVeiculo(editValue.trim().toUpperCase())
        if (newVehicleInfo) {
          setVehicleInfo({
            placa: editValue.trim().toUpperCase(),
            montadora: newVehicleInfo.montadora,
            modelo: newVehicleInfo.modelo,
            versao: newVehicleInfo.versao,
            chassi: newVehicleInfo.chassi,
            motor: newVehicleInfo.motor,
            combustivel: newVehicleInfo.combustivel,
            cambio: newVehicleInfo.cambio,
            carroceria: newVehicleInfo.carroceria,
            anoFabricacao: newVehicleInfo.anoFabricacao,
            anoModelo: newVehicleInfo.anoModelo,
            linha: newVehicleInfo.linha,
            eixos: newVehicleInfo.eixos,
            geracao: newVehicleInfo.geracao
          })
        }
        
        onChange(editValue.trim().toUpperCase())
        setIsEditing(false)
        setEditValue('')
      } catch (error) {
        console.log('Erro ao buscar informações do veículo:', error)
      } finally {
        setIsSearching(false)
      }
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
                  disabled={isSearching || !editValue.trim()}
                  className="flex-1 h-[40px] bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {isSearching ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Buscando...
                    </>
                  ) : (
                    'Confirmar'
                  )}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isSearching}
                  className="flex-1 h-[40px] bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50 transition-colors"
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

        {/* Vehicle Information Display */}
        {vehicleInfo && !isEditing && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M5 11l1.5-4.5h11L19 11M5 11v6h2v2h2v-2h6v2h2v-2h2v-6M5 11h14"/>
                  <circle cx="7" cy="14.5" r="1.5"/>
                  <circle cx="17" cy="14.5" r="1.5"/>
                  <path d="M8 6.5h8l-1-2H9l-1 2z" opacity="0.8"/>
                  <path d="M6 8h12" strokeWidth="0.5" opacity="0.6"/>
                </svg>
              </div>
              <h4 className="text-[16px] font-semibold text-[#242424]">Informações Encontradas</h4>
            </div>
            
            <div className="bg-white rounded-lg p-3 border border-blue-100">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[14px] text-[#6B7280]">Marca/Modelo</span>
                  <span className="text-[14px] font-medium text-[#242424]">
                    {vehicleInfo.montadora} {vehicleInfo.modelo}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[14px] text-[#6B7280]">Ano Fabricação</span>
                  <span className="text-[14px] font-medium text-[#242424]">
                    {vehicleInfo.anoFabricacao}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[14px] text-[#6B7280]">Câmbio</span>
                  <span className="text-[14px] font-medium text-[#242424]">
                    {vehicleInfo.cambio}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[14px] text-[#6B7280]">Carroceria</span>
                  <span className="text-[14px] font-medium text-[#242424]">
                    {vehicleInfo.carroceria}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No Vehicle Info Found */}
        {!vehicleInfo && value && !isEditing && !isSearching && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-yellow-800">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-[14px] font-medium">
                Informações do veículo não encontradas para esta placa
              </span>
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
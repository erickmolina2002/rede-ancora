'use client'

import React, { useEffect, useState } from 'react'
import { useProductsBudget } from '../../contexts/ProductsBudgetContext'
import { useVehicle } from '../../contexts/VehicleContext'

type BudgetConfirmationInputProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  disabled?: boolean
  className?: string
  autoFocus?: boolean
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  // Additional props to access previous step data
  stepData?: { [key: string]: string | number | boolean | unknown }
}

export default function BudgetConfirmationInput({
  value,
  onChange,
  className = "",
  stepData = {}
}: BudgetConfirmationInputProps) {
  const [editableServicePrice, setEditableServicePrice] = useState<string>('')
  const [isEditingService, setIsEditingService] = useState(false)
  const [deliveryDays, setDeliveryDays] = useState<string>('')
  const { products, getTotalAmount } = useProductsBudget()
  const { vehicleInfo } = useVehicle()

  // Convert products to selected services format
  // const getSelectedServices = () => {
  //   return products.map(product => ({
  //     id: product.id.toString(),
  //     name: product.name,
  //     price: product.totalPrice,
  //     unitPrice: product.unitPrice,
  //     quantity: product.quantity,
  //     type: 'parts' as const,
  //     brand: product.brand,
  //     code: product.code
  //   }))
  // }

  const getServicePrice = () => {
    const serviceValue = stepData.budgetValue as string || '0'
    const numValue = parseFloat(serviceValue.replace(/[^\d,]/g, '').replace(',', '.'))
    return isNaN(numValue) ? 0 : numValue
  }

  const getCurrentServicePrice = () => {
    if (editableServicePrice) {
      // Remover símbolo de moeda e espaços, manter dígitos e vírgula
      // Exemplo: "R$ 0,03" -> "0,03" -> "0.03" -> 0.03
      const cleanValue = editableServicePrice
        .replace(/[R$\s]/g, '')  // Remove R$, espaço: "0,03"
        .replace('.', '')         // Remove separador de milhar: "0,03"
        .replace(',', '.')        // Substitui vírgula por ponto: "0.03"

      const numValue = parseFloat(cleanValue)
      return isNaN(numValue) ? 0 : numValue
    }
    return getServicePrice()
  }

  // const selectedServices = getSelectedServices()
  const originalServicePrice = getServicePrice()
  const currentServicePrice = getCurrentServicePrice()
  
  const totalPartsPrice = getTotalAmount()
  const totalServicePrice = currentServicePrice
  const grandTotal = totalPartsPrice + totalServicePrice

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  // Initialize editable service price
  useEffect(() => {
    if (!editableServicePrice && originalServicePrice > 0 && !isEditingService) {
      setEditableServicePrice(formatPrice(originalServicePrice))
    }
  }, [originalServicePrice])

  const formatCurrencyInput = (value: string) => {
    // Remove non-digits
    const digits = value.replace(/\D/g, '')
    
    // Convert to cents and format
    const cents = parseInt(digits, 10) || 0
    const reais = cents / 100
    
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    }).format(reais)
  }

  const handleServicePriceChange = (newPrice: string) => {
    const formatted = formatCurrencyInput(newPrice)
    setEditableServicePrice(formatted)
  }

  const handleServicePriceEdit = () => {
    // Inicializar com o valor atual formatado se ainda não tiver
    if (!editableServicePrice) {
      setEditableServicePrice(formatPrice(currentServicePrice))
    }
    setIsEditingService(true)
  }

  const handleServicePriceSave = () => {
    setIsEditingService(false)
  }

  const handleServicePriceCancel = () => {
    // Restaurar o valor original
    setEditableServicePrice(formatPrice(originalServicePrice))
    setIsEditingService(false)
  }

  // Update the form value with confirmation and additional data
  useEffect(() => {
    const confirmationData = {
      confirmed: true,
      // Sempre enviar o valor atual (original ou editado)
      servicePrice: currentServicePrice,
      editedServicePrice: editableServicePrice ? currentServicePrice : null,
      deliveryDays: deliveryDays || null
    }
    onChange(JSON.stringify(confirmationData))
  }, [onChange, currentServicePrice, editableServicePrice, deliveryDays])

  return (
    <div className={`w-full ${className}`}>
      
      <div className="space-y-6 animate-in fade-in duration-500">
        {/* Budget Summary Header */}

        {/* Vehicle Info - Simplified Design */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-5">
          <div className="flex items-center gap-3 mb-2 pl-[4px] pt-[2px]">
           <img src="/images/image.png" alt="Vehicle Info" className="w-7 h-7" />
            <h4 className="text-[18px] font-semibold text-[#242424]">Informações do Veículo</h4>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[14px] text-[#6B7280]">Placa</span>
                <span className="text-[16px] font-bold text-[#242424] bg-gray-100 px-3 py-1 rounded font-mono">
                  {vehicleInfo?.placa || String(stepData.budgetDescription || stepData.budgetPlateConfirmation || 'ABC-1234')}
                </span>
              </div>
              {vehicleInfo?.montadora && (
                <div className="flex justify-between items-center">
                  <span className="text-[14px] text-[#6B7280]">Marca</span>
                  <span className="text-[14px] font-medium text-[#242424]">
                    {vehicleInfo.montadora}
                  </span>
                </div>
              )}
              {vehicleInfo?.modelo && (
                <div className="flex justify-between items-center">
                  <span className="text-[14px] text-[#6B7280]">Modelo</span>
                  <span className="text-[14px] font-medium text-[#242424]">
                    {vehicleInfo.modelo}
                  </span>
                </div>
              )}
              {vehicleInfo?.versao && (
                <div className="flex justify-between items-center">
                  <span className="text-[14px] text-[#6B7280]">Versão</span>
                  <span className="text-[14px] font-medium text-[#242424]">
                    {vehicleInfo.versao}
                  </span>
                </div>
              )}
              {vehicleInfo?.anoModelo && (
                <div className="flex justify-between items-center">
                  <span className="text-[14px] text-[#6B7280]">Ano Modelo</span>
                  <span className="text-[14px] font-medium text-[#242424]">
                    {vehicleInfo.anoModelo}
                  </span>
                </div>
              )}
              {vehicleInfo?.motor && (
                <div className="flex justify-between items-center">
                  <span className="text-[14px] text-[#6B7280]">Motor</span>
                  <span className="text-[14px] font-medium text-[#242424]">
                    {vehicleInfo.motor}
                  </span>
                </div>
              )}
              {vehicleInfo?.combustivel && (
                <div className="flex justify-between items-center">
                  <span className="text-[14px] text-[#6B7280]">Combustível</span>
                  <span className="text-[14px] font-medium text-[#242424]">
                    {vehicleInfo.combustivel}
                  </span>
                </div>
              )}
              {vehicleInfo?.cambio && (
                <div className="flex justify-between items-center">
                  <span className="text-[14px] text-[#6B7280]">Câmbio</span>
                  <span className="text-[14px] font-medium text-[#242424]">
                    {vehicleInfo.cambio}
                  </span>
                </div>
              )}
              {vehicleInfo?.carroceria && (
                <div className="flex justify-between items-center">
                  <span className="text-[14px] text-[#6B7280]">Carroceria</span>
                  <span className="text-[14px] font-medium text-[#242424]">
                    {vehicleInfo.carroceria}
                  </span>
                </div>
              )}
              {vehicleInfo?.eixos && (
                <div className="flex justify-between items-center">
                  <span className="text-[14px] text-[#6B7280]">Eixos</span>
                  <span className="text-[14px] font-medium text-[#242424]">
                    {vehicleInfo.eixos}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Selected Products from Budget Context */}
        {products.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-[16px] font-medium text-[#242424]">
              Produtos Selecionados ({products.length})
            </h4>
            <div className="space-y-2">
              {products.map((product) => (
                <div 
                  key={product.id} 
                  className="flex justify-between items-start p-3 bg-white border border-[#E5E7EB] rounded-lg animate-in slide-in-from-left duration-300"
                >
                  <div className="flex-1">
                    <div className="text-[14px] font-medium text-[#242424] mb-1">
                      {product.name}
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[12px] text-[#6B7280]">
                        {product.brand}
                      </span>
                      <span className="text-[12px] text-[#9CA3AF]">•</span>
                      <span className="text-[12px] text-[#6B7280]">
                        {product.code}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[12px] text-[#6B7280]">
                        {formatPrice(product.unitPrice)} × {product.quantity}
                      </span>
                    </div>
                    <span className="text-[12px] px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                      Peça
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[14px] font-medium text-[#242424]">
                      {formatPrice(product.totalPrice)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 5 Service - Editable */}
        {originalServicePrice > 0 && (
          <div className="space-y-3">
            <h4 className="text-[16px] font-medium text-[#242424]">Mão de Obra</h4>
            <div className="p-3 bg-white border-2 border-[#E5E7EB] rounded-lg">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <span className="text-[14px] text-[#242424]">Valor da Mão de Obra</span>
                  <span className="ml-2 text-[12px] px-2 py-1 rounded-full bg-green-100 text-green-800">
                    Serviço
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {isEditingService ? (
                    <>
                      <input
                        type="text"
                        value={editableServicePrice}
                        onChange={(e) => handleServicePriceChange(e.target.value)}
                        className="w-28 px-2 py-1 text-[14px] text-right border border-[#D1D5DB] rounded focus:outline-none focus:border-[#242424]"
                        placeholder="R$ 0,00"
                        autoFocus
                      />
                      <button
                        onClick={handleServicePriceSave}
                        className="text-[12px] px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                      >
                        ✓
                      </button>
                      <button
                        onClick={handleServicePriceCancel}
                        className="text-[12px] px-2 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                      >
                        ✕
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="text-[14px] font-medium text-[#242424]">
                        {formatPrice(currentServicePrice)}
                      </span>
                      <button
                        onClick={handleServicePriceEdit}
                        className="text-[12px] px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Price Breakdown */}
        <div className="bg-white border-2 border-[#E5E7EB] rounded-lg p-4 space-y-3">
          <h4 className="text-[16px] font-semibold text-[#242424] text-center mb-4">
            Resumo de Valores
          </h4>
          
          {/* Parts Total */}
          <div className="flex justify-between items-center py-2 border-b border-[#F3F4F6]">
            <div className="flex items-center">
              <span className="text-[14px] text-[#6B7280]">Total em Peças</span>
              <span className="ml-2 text-[12px] px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                Peças
              </span>
            </div>
            <span className="text-[16px] font-semibold text-[#242424]">
              {formatPrice(totalPartsPrice)}
            </span>
          </div>


          {/* Step 5 Service Total */}
          {currentServicePrice > 0 && (
            <div className="flex justify-between items-center py-2 border-b border-[#F3F4F6]">
              <div className="flex items-center">
                <span className="text-[14px] text-[#6B7280]">Mão de Obra</span>
                <span className="ml-2 text-[12px] px-2 py-1 rounded-full bg-green-100 text-green-800">
                  Serviço
                </span>
              </div>
              <span className="text-[16px] font-semibold text-[#242424]">
                {formatPrice(currentServicePrice)}
              </span>
            </div>
          )}

          {/* Grand Total */}
          <div className="flex justify-between items-center py-3 border-t-2 border-[#E5E7EB] bg-[#F8F9FA] -mx-4 px-4 rounded-b-lg">
            <span className="text-[18px] font-bold text-[#242424]">Total Geral</span>
            <span className="text-[20px] font-bold text-[#242424]">
              {formatPrice(grandTotal)}
            </span>
          </div>
        </div>

        {/* Delivery Days Card */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-5">
          <div className="flex items-center gap-3 mb-3">
            <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h4 className="text-[18px] font-semibold text-[#242424]">Prazo de Entrega (Opcional)</h4>
          </div>

          <div className="bg-white rounded-lg p-4 border border-purple-100">
            <p className="text-[13px] text-[#6B7280] mb-3">
              Informe quantos dias o serviço levará para ser concluído. Esta informação será incluída na mensagem do WhatsApp.
            </p>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={deliveryDays}
                onChange={(e) => setDeliveryDays(e.target.value)}
                min="1"
                max="365"
                placeholder="Ex: 3"
                className="flex-1 px-4 py-3 text-[16px] border border-[#D1D5DB] rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
              />
              <div className="flex items-center gap-2 text-[14px] text-[#6B7280]">
                <span>{deliveryDays === '1' ? 'dia' : 'dias'}</span>
              </div>
            </div>
            {deliveryDays && parseInt(deliveryDays) > 0 && (
              <div className="mt-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-[13px] text-purple-700 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Prazo estimado: {deliveryDays} {deliveryDays === '1' ? 'dia útil' : 'dias úteis'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Confirmation Note */}
        <div className="text-center p-4 bg-[#F0F9FF] border border-[#BAE6FD] rounded-lg">
          <p className="text-[14px] text-[#0369A1]">
            ✓ Orçamento pronto para ser enviado ao cliente
          </p>
        </div>
      </div>

      {/* Hidden input for form validation */}
      <input
        type="hidden"
        value={value}
        onChange={() => {}}
        aria-label="Confirmação do orçamento"
      />
    </div>
  )
}
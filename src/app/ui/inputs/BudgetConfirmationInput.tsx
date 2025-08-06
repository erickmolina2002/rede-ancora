'use client'

import React, { useEffect, useState } from 'react'
import { useCart } from '../../contexts/CartContext'

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
  stepData?: { [key: string]: string | number | boolean }
}

export default function BudgetConfirmationInput({
  value,
  onChange,
  className = "",
  stepData = {}
}: BudgetConfirmationInputProps) {
  const [editableServicePrice, setEditableServicePrice] = useState<string>('')
  const [isEditingService, setIsEditingService] = useState(false)
  const [productPrices, setProductPrices] = useState<{ [key: number]: number }>({})

  const { items: cartItems } = useCart()

  // Generate random price for products (60-300 reais, round values)
  const generateRandomPrice = () => {
    const min = 60
    const max = 300
    const randomValue = Math.floor(Math.random() * (max - min + 1)) + min
    // Round to nearest 10 for cleaner values
    return Math.round(randomValue / 10) * 10
  }

  // Initialize product prices
  useEffect(() => {
    const newPrices: { [key: number]: number } = {}
    cartItems.forEach(item => {
      if (!productPrices[item.id]) {
        newPrices[item.id] = generateRandomPrice()
      } else {
        newPrices[item.id] = productPrices[item.id]
      }
    })
    if (Object.keys(newPrices).length > 0) {
      setProductPrices(newPrices)
    }
  }, [cartItems])

  // Convert cart items to selected services format
  const getSelectedServices = () => {
    return cartItems.map(item => ({
      id: item.id.toString(),
      name: item.nomeProduto,
      price: productPrices[item.id] || generateRandomPrice(),
      type: 'parts' as const,
      brand: item.marca,
      code: item.codigoReferencia
    }))
  }

  const getServicePrice = () => {
    const serviceValue = stepData.budgetValue as string || '0'
    const numValue = parseFloat(serviceValue.replace(/[^\d,]/g, '').replace(',', '.'))
    return isNaN(numValue) ? 0 : numValue
  }

  const getCurrentServicePrice = () => {
    if (isEditingService && editableServicePrice) {
      const numValue = parseFloat(editableServicePrice.replace(/[^\d,]/g, '').replace(',', '.'))
      return isNaN(numValue) ? 0 : numValue
    }
    return getServicePrice()
  }

  const selectedServices = getSelectedServices()
  const originalServicePrice = getServicePrice()
  const currentServicePrice = getCurrentServicePrice()
  
  const partsPrice = selectedServices
    .filter(service => service.type === 'parts')
    .reduce((total, service) => total + service.price, 0)
  
  const totalPartsPrice = partsPrice
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
    if (!editableServicePrice && originalServicePrice > 0) {
      setEditableServicePrice(formatPrice(originalServicePrice))
    }
  }, [originalServicePrice, editableServicePrice])

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
    setIsEditingService(true)
  }

  const handleServicePriceSave = () => {
    setIsEditingService(false)
  }

  // Update the form value with confirmation
  useEffect(() => {
    onChange('confirmed')
  }, [onChange])

  return (
    <div className={`w-full ${className}`}>
      
      <div className="space-y-6 animate-in fade-in duration-500">
        {/* Budget Summary Header */}
        <div className="text-center">
          <h3 className="text-[20px] font-semibold text-[#242424] mb-2">
            Resumo do Orçamento
          </h3>
          <p className="text-[14px] text-[#6B7280]">
            Confira os valores antes de finalizar
          </p>
        </div>

        {/* Vehicle Info */}
        <div className="bg-[#F8F9FA] rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-[14px] text-[#6B7280]">Veículo</span>
            <span className="text-[16px] font-medium text-[#242424]">
              {stepData.budgetDescription || stepData.budgetPlateConfirmation || 'N/A'}
            </span>
          </div>
        </div>

        {/* Selected Products from Cart */}
        {selectedServices.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-[16px] font-medium text-[#242424]">
              Produtos Selecionados ({selectedServices.length})
            </h4>
            <div className="space-y-2">
              {selectedServices.map((product) => (
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
                        {(product as any).brand}
                      </span>
                      <span className="text-[12px] text-[#9CA3AF]">•</span>
                      <span className="text-[12px] text-[#6B7280]">
                        {(product as any).code}
                      </span>
                    </div>
                    <span className="text-[12px] px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                      Peça
                    </span>
                  </div>
                  <span className="text-[14px] font-medium text-[#242424]">
                    {formatPrice(product.price)}
                  </span>
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
                        className="w-24 px-2 py-1 text-[14px] text-right border border-[#D1D5DB] rounded focus:outline-none focus:border-[#242424]"
                        placeholder="R$ 0,00"
                      />
                      <button
                        onClick={handleServicePriceSave}
                        className="text-[12px] px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                      >
                        ✓
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
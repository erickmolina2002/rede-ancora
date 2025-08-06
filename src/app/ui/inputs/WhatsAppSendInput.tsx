'use client'

import React, { useState } from 'react'

type WhatsAppSendInputProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  disabled?: boolean
  className?: string
  autoFocus?: boolean
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  stepData?: { [key: string]: string | number | boolean }
  onSkip?: () => void
  onFinish?: () => void
}

export default function WhatsAppSendInput({
  value,
  onChange,
  placeholder = "(11) 99999-9999",
  label,
  disabled = false,
  className = "",
  autoFocus = false,
  onKeyDown,
  stepData = {},
  onSkip,
  onFinish
}: WhatsAppSendInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value
    
    // Format phone number as user types
    inputValue = inputValue.replace(/\D/g, '') // Remove non-digits
    
    if (inputValue.length <= 11) {
      // Format: (11) 99999-9999
      if (inputValue.length > 6) {
        inputValue = inputValue.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3')
      } else if (inputValue.length > 2) {
        inputValue = inputValue.replace(/(\d{2})(\d{0,5})/, '($1) $2')
      } else if (inputValue.length > 0) {
        inputValue = inputValue.replace(/(\d{0,2})/, '($1')
      }
    }
    
    onChange(inputValue)
  }

  const handleSendWhatsApp = async () => {
    if (!value.trim()) return
    
    setIsLoading(true)
    
    try {
      // Extract only numbers for WhatsApp
      const phoneNumber = value.replace(/\D/g, '')
      
      // Create detailed WhatsApp message with budget summary
      const budgetName = String(stepData.budgetName || 'Orçamento')
      const vehiclePlate = String(stepData.budgetDescription || stepData.budgetPlateConfirmation || 'N/A')
      const budgetValue = String(stepData.budgetValue || '0')
      
      // Get real selected products from stepData instead of mock data
      const selectedProducts = (stepData.selectedProducts as Array<{
        id: number;
        name?: string;
        nomeProduto?: string;
        totalPrice?: number;
        unitPrice?: number;
        quantity?: number;
      }>) || []
      
      // If no products in stepData, create from budget services text
      let realProducts = []
      if (selectedProducts.length > 0) {
        realProducts = selectedProducts.map((product, index) => ({
          id: product.id || index + 1,
          name: product.name || product.nomeProduto || `Produto ${index + 1}`,
          price: product.totalPrice || product.unitPrice || 0,
          quantity: product.quantity || 1,
          type: 'parts'
        }))
      } else {
        // Fallback: parse budget services text if available
        const budgetServices = String(stepData.budgetServices || '')
        if (budgetServices) {
          realProducts = [{
            id: 1,
            name: budgetServices,
            price: parseFloat(String(budgetValue).replace(/[^\d,]/g, '').replace(',', '.')) || 0,
            quantity: 1,
            type: 'service'
          }]
        }
      }
      
      const partsItems = realProducts.filter(item => item.type === 'parts')
      const serviceItems = realProducts.filter(item => item.type === 'service')
      const servicePrice = parseFloat(String(budgetValue).replace(/[^\d,]/g, '').replace(',', '.')) || 0
      
      const formatPrice = (price: number) => {
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(price)
      }
      
      // Calculate totals based on real products
      const partsTotal = partsItems.reduce((total, item) => total + item.price, 0)
      const servicesTotal = serviceItems.length > 0 
        ? serviceItems.reduce((total, item) => total + item.price, 0)
        : servicePrice
      const grandTotal = partsTotal + servicesTotal
      
      // Get current time for professional greeting
      const now = new Date()
      const hour = now.getHours()
      let greeting = 'Bom dia'
      if (hour >= 12 && hour < 18) {
        greeting = 'Boa tarde'
      } else if (hour >= 18) {
        greeting = 'Boa noite'
      }
      
      let message = `${greeting}!\n\n`
      message += `Esperamos que esteja tudo bem! Segue abaixo o orçamento solicitado para seu veículo:\n\n`
      message += `*ORÇAMENTO - ${budgetName.toUpperCase()}*\n`
      message += `*Veículo:* ${vehiclePlate}\n\n`
      
      // Show parts with quantities and individual prices
      if (partsItems.length > 0) {
        message += `*PEÇAS NECESSÁRIAS:*\n`
        partsItems.forEach(item => {
          if (item.quantity > 1) {
            const unitPrice = item.price / item.quantity
            message += `- ${item.name} (${item.quantity}x) - ${formatPrice(unitPrice)} cada = ${formatPrice(item.price)}\n`
          } else {
            message += `- ${item.name} - ${formatPrice(item.price)}\n`
          }
        })
        message += `*Subtotal Peças:* ${formatPrice(partsTotal)}\n\n`
      }
      
      // Show services or labor
      if (serviceItems.length > 0) {
        message += `*SERVIÇOS:*\n`
        serviceItems.forEach(item => {
          if (item.quantity > 1) {
            const unitPrice = item.price / item.quantity
            message += `- ${item.name} (${item.quantity}x) - ${formatPrice(unitPrice)} cada = ${formatPrice(item.price)}\n`
          } else {
            message += `- ${item.name} - ${formatPrice(item.price)}\n`
          }
        })
        message += `*Subtotal Serviços:* ${formatPrice(servicesTotal)}\n\n`
      } else if (servicePrice > 0) {
        message += `*MÃO DE OBRA:*\n`
        message += `- Serviço especializado - ${formatPrice(servicePrice)}\n\n`
      }
      
      message += `*VALOR TOTAL: ${formatPrice(grandTotal)}*\n\n`
      message += `*O QUE ESTÁ INCLUSO:*\n`
      message += `- Diagnóstico completo\n`
      message += `- Garantia dos serviços\n`
      message += `- Peças originais/equivalentes\n`
      message += `- Mão de obra especializada\n\n`
      message += `*REDE ÂNCORA - OFICINA ESPECIALIZADA*\n`
      message += `Seg-Sex: 8h às 18h | Sáb: 8h às 12h\n`
      message += `Entre em contato para agendar!\n`
      message += `Estamos prontos para atendê-lo!\n\n`
      message += `Agradecemos pela confiança!`
      
      const encodedMessage = encodeURIComponent(message)
      const whatsappURL = `https://wa.me/55${phoneNumber}?text=${encodedMessage}`
      
      // Open WhatsApp in new window/tab
      window.open(whatsappURL, '_blank')
      
      // Mark as sent
      onChange('sent')
      
      // Wait a moment for user to see the action
      setTimeout(() => {
        onFinish?.()
      }, 1500)
      
    } catch (error) {
      console.error('Erro ao enviar WhatsApp:', error)
      alert('Erro ao abrir o WhatsApp. Verifique o número e tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleNoThanks = () => {
    onChange('skipped')
    onSkip?.()
  }

  const isValidPhone = () => {
    const digitsOnly = value.replace(/\D/g, '')
    return digitsOnly.length >= 10
  }

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block paragraph-small-medium text-[#474F56] mb-2">
          {label}
        </label>
      )}
      
      <div className="space-y-6 animate-in fade-in duration-500">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-green-600">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.89 3.69" fill="currentColor"/>
            </svg>
          </div>
          
          <div>
            <h3 className="text-[20px] font-semibold text-[#242424] mb-2">
              Enviar Proposta no WhatsApp?
            </h3>
            <p className="text-[14px] text-[#6B7280]">
              Informe o número do cliente para enviar o orçamento diretamente
            </p>
          </div>
        </div>

        {/* Phone Input */}
        <div className="relative">
          <input
            type="tel"
            value={value}
            onChange={handleChange}
            onKeyDown={onKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            disabled={disabled || isLoading}
            autoFocus={autoFocus}
            className={`w-full text-[20px] pb-[16px] text-center text-base focus:outline-none placeholder:text-[#C6C8CB] transition-all duration-300 ${
              value ? 'text-[#242424]' : 'text-[#C6C8CB]'
            } border-b-0`}
            aria-label="Número do WhatsApp"
            maxLength={15}
          />
          
          {/* Animated border */}
          <div 
            className={`absolute bottom-0 left-0 h-[2px] w-full transition-all duration-300 ease-out ${
              isFocused || value ? 'bg-green-500 transform translate-y-[-4px]' : 'bg-[#E5E7EB] transform translate-y-0'
            }`}
          />
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Send to WhatsApp Button */}
          <button
            onClick={handleSendWhatsApp}
            disabled={!isValidPhone() || isLoading}
            className={`w-full py-4 px-6 rounded-lg font-medium text-[16px] transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
              isValidPhone() && !isLoading
                ? 'bg-green-500 text-white hover:bg-green-600 shadow-lg hover:shadow-xl'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            } flex items-center justify-center space-x-2`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Enviando...</span>
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-current">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.89 3.69" fill="currentColor"/>
                </svg>
                <span>Enviar no WhatsApp</span>
              </>
            )}
          </button>

          {/* No Thanks Button */}
          <button
            onClick={handleNoThanks}
            disabled={isLoading}
            className="w-full py-3 px-6 rounded-lg font-medium text-[14px] text-[#6B7280] hover:text-[#242424] transition-all duration-200 hover:bg-gray-50"
          >
            Não, obrigado
          </button>
        </div>

        {/* Helper Text */}
        <div className="text-center">
          <p className="text-[12px] text-[#9CA3AF]">
            O orçamento será enviado automaticamente via WhatsApp
            <br />
            Formato: (11) 99999-9999
          </p>
        </div>
      </div>
    </div>
  )
}
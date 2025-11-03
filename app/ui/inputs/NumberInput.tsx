'use client'

import React, { useState } from 'react'

type NumberInputProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  disabled?: boolean
  className?: string
  autoFocus?: boolean
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  currency?: boolean
}

export default function NumberInput({
  value,
  onChange,
  placeholder,
  label,
  disabled = false,
  className = "",
  autoFocus = false,
  onKeyDown,
  currency = false
}: NumberInputProps) {
  const [isFocused, setIsFocused] = useState(false)

  const formatCurrency = (value: string) => {
    // Remove tudo que não for dígito
    const numbers = value.replace(/\D/g, '')
    
    if (!numbers) return ''
    
    // Converte para número e divide por 100 para ter os centavos
    const amount = parseFloat(numbers) / 100
    
    // Formata como moeda brasileira
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value
    
    if (currency) {
      newValue = formatCurrency(newValue)
    }
    
    onChange(newValue)
  }

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
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
          className={`w-full text-[32px] pb-[16px] text-base focus:outline-none placeholder:text-[#C6C8CB] transition-all duration-300 ${value ? 'text-[#242424]' : 'text-[#C6C8CB]'} border-b-0`}
          aria-label={label || "Input numérico"}
        />
        
        {/* Barra animada */}
        <div 
          className={`absolute bottom-0 left-0 h-[2px] w-full transition-all duration-300 ease-out ${
            isFocused || value ? 'bg-black transform translate-y-[-4px]' : 'bg-[#E5E7EB] transform translate-y-0'
          }`}
        />
      </div>
    </div>
  )
}
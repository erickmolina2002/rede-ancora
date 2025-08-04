'use client'

import React, { useState } from 'react'
import { formatLicensePlate, validateLicensePlate } from '../../utils/validation'

type TextInputProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  disabled?: boolean
  className?: string
  inputType?: 'text' | 'number' | 'email' | 'tel'
  autoFocus?: boolean
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  isLicensePlate?: boolean
}

export default function TextInput({
  value,
  onChange,
  placeholder,
  label,
  disabled = false,
  className = "",
  inputType = "text",
  autoFocus = false,
  onKeyDown,
  isLicensePlate = false
}: TextInputProps) {
  const [isFocused, setIsFocused] = useState(false)

  const isValid = isLicensePlate ? validateLicensePlate(value) : true
  const hasValue = value.trim().length > 0

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    
    if (isLicensePlate) {
      const formattedValue = formatLicensePlate(inputValue)
      onChange(formattedValue)
    } else {
      onChange(inputValue)
    }
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
          type={inputType}
          value={value}
          onChange={handleChange}
          onKeyDown={onKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          className={`w-full text-[32px] pb-[16px] text-base focus:outline-none placeholder:text-[#C6C8CB] transition-all duration-300 ${
            hasValue 
              ? isLicensePlate && !isValid
                ? 'text-[#DC2626]'
                : 'text-[#242424]'
              : 'text-[#C6C8CB]'
          } border-b-0`}
          aria-label={label || "Input de texto"}
        />
        
        {/* Barra animada */}
        <div 
          className={`absolute bottom-0 left-0 h-[2px] w-full transition-all duration-300 ease-out ${
            isFocused || hasValue 
              ? isLicensePlate && hasValue && !isValid
                ? 'bg-[#DC2626] transform translate-y-[-4px]'
                : 'bg-black transform translate-y-[-4px]'
              : 'bg-[#E5E7EB] transform translate-y-0'
          }`}
        />
      </div>

      {/* Validation Message */}
      {isLicensePlate && hasValue && !isValid && (
        <div className="mt-2 animate-in fade-in duration-200">
          <p className="text-[12px] text-[#DC2626]">
            Formato inválido. Use ABC-1234 ou ABC-1D23
          </p>
        </div>
      )}
    </div>
  )
}
'use client'

import React, { useState } from 'react'

type DateInputProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  disabled?: boolean
  className?: string
  autoFocus?: boolean
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

export default function DateInput({
  value,
  onChange,
  placeholder,
  label,
  disabled = false,
  className = "",
  autoFocus = false,
  onKeyDown
}: DateInputProps) {
  const [isFocused, setIsFocused] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
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
          type="date"
          value={value}
          onChange={handleChange}
          onKeyDown={onKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          className={`w-full text-[32px] pb-[16px] text-base focus:outline-none placeholder:text-[#C6C8CB] transition-all duration-300 ${value ? 'text-[#242424]' : 'text-[#C6C8CB]'} border-b-0`}
          aria-label={label || "Input de data"}
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
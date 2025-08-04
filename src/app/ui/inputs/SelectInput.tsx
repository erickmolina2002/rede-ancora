'use client'

import React, { useState } from 'react'

type SelectInputProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  disabled?: boolean
  className?: string
  autoFocus?: boolean
  onKeyDown?: (e: React.KeyboardEvent<HTMLSelectElement>) => void
  options: string[]
}

export default function SelectInput({
  value,
  onChange,
  placeholder,
  label,
  disabled = false,
  className = "",
  autoFocus = false,
  onKeyDown,
  options = []
}: SelectInputProps) {
  const [isFocused, setIsFocused] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
        <select
          value={value}
          onChange={handleChange}
          onKeyDown={onKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          autoFocus={autoFocus}
          className={`w-full text-[32px] pb-[16px] text-base focus:outline-none transition-all duration-300 ${value ? 'text-[#242424]' : 'text-[#C6C8CB]'} border-b-0 bg-transparent appearance-none cursor-pointer`}
          aria-label={label || "Seleção"}
        >
          <option value="" disabled className="text-[#C6C8CB]">
            {placeholder || "Selecione uma opção"}
          </option>
          {options.map((option, index) => (
            <option key={index} value={option} className="text-[#242424] bg-white">
              {option}
            </option>
          ))}
        </select>
        
        {/* Ícone de seta */}
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#C6C8CB]">
            <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        
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
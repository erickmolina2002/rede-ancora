'use client'

import React, { useState } from 'react'
import Image from 'next/image'

type SearchInputProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  disabled?: boolean
  className?: string
  autoFocus?: boolean
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

export default function SearchInput({
  value,
  onChange,
  placeholder = "Buscar serviços...",
  label,
  disabled = false,
  className = "",
  autoFocus = false,
  onKeyDown
}: SearchInputProps) {
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
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={onKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          className={`w-full text-[18px] pb-[16px] pr-[50px] text-base focus:outline-none placeholder:text-[#C6C8CB] transition-all duration-300 ${value ? 'text-[#242424]' : 'text-[#C6C8CB]'} border-b-0`}
          aria-label={label || "Buscar"}
        />
        
        {/* Search Icon */}
        <div className="absolute right-0 top-0 p-2 pointer-events-none">
          <Image
            src="/search.svg"
            alt="Search"
            width={20}
            height={20}
            className="w-5 h-5 text-[#6B7280]"
          />
        </div>
        
        {/* Animated border */}
        <div 
          className={`absolute bottom-0 left-0 h-[2px] w-full transition-all duration-300 ease-out ${
            isFocused || value ? 'bg-black transform translate-y-[-4px]' : 'bg-[#E5E7EB] transform translate-y-0'
          }`}
        />
      </div>
    </div>
  )
}
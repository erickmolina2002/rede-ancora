'use client'

import React from 'react'

type BackButtonProps = {
  onClick?: () => void
  disabled?: boolean
  className?: string
  ariaLabel?: string
}

export default function BackButton({
  onClick,
  disabled = false,
  className = "",
  ariaLabel = "Voltar"
}: BackButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F5F5F5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      type="button"
      aria-label={ariaLabel}
    >
      <svg 
        width="20" 
        height="20" 
        viewBox="0 0 20 20" 
        fill="none" 
        className="text-[#32383D]"
      >
        <path 
          d="M12.5 15L7.5 10L12.5 5" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}
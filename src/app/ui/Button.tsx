'use client'

import React from 'react'

type ButtonProps = {
  onClick?: () => void
  disabled?: boolean
  className?: string
  children?: React.ReactNode
}

export default function Button({
  onClick,
  disabled = false,
  children = 'Continuar',
  className = 'w-[328px] h-[48px] rounded-[20px] bg-[#001B42] text-white disabled:bg-[#6c7278] disabled:text-[#E0E1E2]',
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {children}
    </button>
  )
}

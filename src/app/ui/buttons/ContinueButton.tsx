// app/ui/buttons/ContinueButton.tsx
'use client'

import React from 'react'

type ContinueButtonProps = {
  onClick?: () => void
  disabled?: boolean
  className?: string
  children?: React.ReactNode
}

export default function ContinueButton({
  onClick,
  disabled = false,
  children = 'Continuar',
  className = 'w-[328px] h-[48px] rounded-[20px] bg-[#6c7278] text-[#E0E1E2]',
}: ContinueButtonProps) {
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

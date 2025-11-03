'use client'

import React from 'react'
import BackButton from './BackButton'

type BudgetHeaderProps = {
  onClose?: () => void
  onBack?: () => void
  title?: string
  showTitle?: boolean
  showBackButton?: boolean
}

export default function BudgetHeader({
  onClose,
  onBack,
  title = "Criando conta",
  showTitle = false,
  showBackButton = false
}: BudgetHeaderProps) {
  return (
    <header className="relative flex items-center justify-between p-4">
      {showBackButton && onBack && (
        <div className="absolute left-4 top-[20px] -translate-y-1/2">
          <BackButton onClick={onBack} />
        </div>
      )}

      <div className="flex-1 text-center">
        {showTitle && (
          <h2 className="paragraph-small-medium text-[#32383D]">
            {title}
          </h2>
        )}
      </div>

      <button
        onClick={onClose}
      className="absolute right-4 top-[20px] -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F5F5F5] transition-colors"
        type="button"
        aria-label="Fechar"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          className="text-[#32383D]"
        >
          <path
            d="M15 5L5 15M5 5L15 15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </header>
  )
}

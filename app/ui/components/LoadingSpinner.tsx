'use client'

import React from 'react'

type LoadingSpinnerProps = {
  message?: string
  size?: 'small' | 'medium' | 'large'
  className?: string
}

export default function LoadingSpinner({ 
  message = "Carregando...", 
  size = 'medium',
  className = "" 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    small: 'h-6 w-6 border-b-2',
    medium: 'h-8 w-8 border-b-2', 
    large: 'h-12 w-12 border-b-4'
  }

  return (
    <div className={`flex items-center justify-center h-full ${className}`}>
      <div className="text-center">
        <div className={`inline-block animate-spin rounded-full ${sizeClasses[size]} border-[#059669] mb-4`}></div>
        <p className="text-[#6B7280] text-[14px]">{message}</p>
      </div>
    </div>
  )
}
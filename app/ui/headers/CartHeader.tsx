'use client'

import React from 'react'
import { useProductsBudget } from '../../contexts/ProductsBudgetContext'

export default function CartHeader() {
  const { getTotalItems } = useProductsBudget()
  const totalItems = getTotalItems()

  if (totalItems === 0) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-40">
      <div className="bg-[#059669] text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg">
        <div className="text-center">
          <div className="text-xs font-medium leading-none">
            {totalItems}
          </div>
          <div className="text-[10px] leading-none opacity-90">
            no orçamento
          </div>
        </div>
      </div>
    </div>
  )
}
'use client'

import React from 'react'
import { useCart } from '../../contexts/CartContext'
import { useRouter } from 'next/navigation'

export default function CartHeader() {
  const { getTotalItems } = useCart()
  const router = useRouter()
  const totalItems = getTotalItems()

  if (totalItems === 0) {
    return null
  }

  return (
    <div 
      onClick={() => router.push('/cart')}
      className="fixed top-4 right-4 z-40 cursor-pointer"
    >
      <div className="bg-[#059669] text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200">
        <div className="text-center">
          <div className="text-xs font-medium leading-none">
            {totalItems}
          </div>
          <div className="text-[10px] leading-none opacity-90">
            itens
          </div>
        </div>
      </div>
    </div>
  )
}
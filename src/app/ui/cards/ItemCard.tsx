'use client'

import React, { useState } from 'react'
import Image from 'next/image'

export type Item = {
  id: string
  name: string
  subtitle: string
  price: number
}

type ItemCardProps = {
  item: Item
  onAdd: (item: Item) => void
}

export default function ItemCard({ item, onAdd }: ItemCardProps) {
  const [isAdding, setIsAdding] = useState(false)

  const handleAdd = () => {
    setIsAdding(true)
    setTimeout(() => setIsAdding(false), 200)
    onAdd(item)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 mb-3 hover:border-[#D1D5DB] hover:shadow-sm transition-all duration-200 transform hover:scale-[1.01]">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-[16px] font-medium text-[#242424] mb-1 truncate">
            {item.name}
          </h3>
          <p className="text-[14px] text-[#6B7280] mb-2 line-clamp-2">
            {item.subtitle}
          </p>
          <p className="text-[18px] font-semibold text-[#242424]">
            {formatPrice(item.price)}
          </p>
        </div>
        
        <button
          onClick={handleAdd}
          className={`ml-3 flex-shrink-0 w-8 h-8 bg-[#242424] rounded-full flex items-center justify-center hover:bg-[#374151] transition-all duration-200 transform hover:scale-110 active:scale-95 ${
            isAdding ? 'animate-pulse scale-95' : ''
          }`}
          aria-label={`Adicionar ${item.name}`}
        >
          <Image
            src="/plus.svg"
            alt="Adicionar"
            width={16}
            height={16}
            className={`w-4 h-4 filter invert transition-transform duration-200 ${
              isAdding ? 'rotate-90' : ''
            }`}
          />
        </button>
      </div>
    </div>
  )
}
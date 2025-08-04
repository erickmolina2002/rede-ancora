'use client'

import React, { useState, useEffect } from 'react'
import { Item } from '../cards/ItemCard'

type SelectedItemsListProps = {
  items: Item[]
  onRemove?: (itemId: string) => void
  showRemoveButton?: boolean
}

export default function SelectedItemsList({ 
  items, 
  onRemove, 
  showRemoveButton = false 
}: SelectedItemsListProps) {
  const [animatedItems, setAnimatedItems] = useState<string[]>([])
  const [removingItems, setRemovingItems] = useState<string[]>([])

  const getTotalValue = () => {
    return items.reduce((total, item) => total + item.price, 0)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  // Track new items for animation
  useEffect(() => {
    const newItems = items.filter(item => !animatedItems.includes(item.id))
    if (newItems.length > 0) {
      setAnimatedItems(prev => [...prev, ...newItems.map(item => item.id)])
    }
  }, [items, animatedItems])

  const handleRemove = (itemId: string) => {
    if (onRemove) {
      setRemovingItems(prev => [...prev, itemId])
      // Wait for animation to complete before actually removing
      setTimeout(() => {
        onRemove(itemId)
        setRemovingItems(prev => prev.filter(id => id !== itemId))
        setAnimatedItems(prev => prev.filter(id => id !== itemId))
      }, 300)
    }
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div className="mt-4 space-y-3 animate-in fade-in duration-300">
      <p className="text-[14px] text-[#6B7280] font-medium">
        Serviços selecionados ({items.length}):
      </p>
      
      <div className="space-y-2">
        {items.map((item, index) => {
          const isRemoving = removingItems.includes(item.id)
          const isNew = !animatedItems.includes(item.id)
          
          return (
            <div 
              key={item.id} 
              className={`bg-white border border-[#E5E7EB] rounded-lg p-3 hover:border-[#D1D5DB] transition-all duration-300 transform ${
                isRemoving 
                  ? 'animate-out fade-out slide-out-to-right scale-95 duration-300'
                  : isNew 
                    ? 'animate-in fade-in slide-in-from-left-2 duration-500'
                    : ''
              }`}
              style={{
                animationDelay: isNew ? `${index * 100}ms` : '0ms'
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="text-[14px] font-medium text-[#242424] mb-1">
                    {item.name}
                  </h4>
                  <p className="text-[12px] text-[#6B7280] mb-2 line-clamp-1">
                    {item.subtitle}
                  </p>
                  <p className="text-[14px] font-semibold text-[#242424]">
                    {formatPrice(item.price)}
                  </p>
                </div>
                
                {showRemoveButton && onRemove && (
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="ml-3 flex-shrink-0 w-6 h-6 text-[#6B7280] hover:text-[#EF4444] hover:scale-110 transition-all duration-200 flex items-center justify-center"
                    aria-label={`Remover ${item.name}`}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          )
        })}
        
        {/* Total with animation */}
        <div className="border-t border-[#E5E7EB] pt-3 mt-3 animate-in fade-in slide-in-from-bottom duration-500">
          <div className="flex justify-between items-center">
            <span className="text-[16px] font-semibold text-[#242424]">Total</span>
            <span className="text-[18px] font-bold text-[#242424] transition-all duration-300">
              {formatPrice(getTotalValue())}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
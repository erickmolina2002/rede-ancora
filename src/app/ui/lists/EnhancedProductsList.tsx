'use client'

import React, { useState, useEffect } from 'react'
import { useProductsBudget } from '../../contexts/ProductsBudgetContext'

type EnhancedProductsListProps = {
  onTotalChange?: (total: number) => void
}

export default function EnhancedProductsList({ 
  onTotalChange 
}: EnhancedProductsListProps) {
  const [animatedItems, setAnimatedItems] = useState<string[]>([])
  
  const { 
    products, 
    updateQuantity: updateProductQuantity, 
    getTotalAmount 
  } = useProductsBudget()

  // Calculate grand total and notify parent
  useEffect(() => {
    const grandTotal = getTotalAmount()
    onTotalChange?.(grandTotal)
  }, [products, onTotalChange, getTotalAmount])

  // Track new items for animation
  useEffect(() => {
    const newItems = products.filter(product => !animatedItems.includes(product.id.toString()))
    if (newItems.length > 0) {
      setAnimatedItems(prev => [...prev, ...newItems.map(product => product.id.toString())])
    }
  }, [products, animatedItems])

  const handleUpdateQuantity = (productId: number, newQuantity: number) => {
    updateProductQuantity(productId, newQuantity)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  const grandTotal = getTotalAmount()

  if (products.length === 0) {
    return null
  }

  return (
    <div className="mt-6 space-y-4">
      <div className="text-[14px] text-[#6B7280] mb-4">
        {products.length} {products.length === 1 ? 'produto selecionado' : 'produtos selecionados'}
      </div>
      
      <div className="space-y-3">
        {products.map((product, index) => {
          const isNew = !animatedItems.includes(product.id.toString())
          
          return (
            <div 
              key={product.id} 
              className={`bg-white border border-[#E5E7EB] rounded-[12px] p-4 transition-all duration-300 ${
                isNew 
                  ? 'animate-in fade-in slide-in-from-left-2 duration-500'
                  : ''
              }`}
              style={{
                animationDelay: isNew ? `${index * 100}ms` : '0ms'
              }}
            >
              {/* Product Info */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="text-[16px] font-medium text-[#242424] mb-1">
                    {product.name}
                  </h4>
                  <p className="text-[14px] text-[#6B7280] mb-2">
                    {product.brand} • {product.code}
                  </p>
                  <div className="text-[14px] text-[#9CA3AF]">
                    {formatPrice(product.unitPrice)}
                  </div>
                </div>
              </div>

              {/* Quantity and Total */}
              <div className="flex items-center justify-between pt-3 border-t border-[#F3F4F6]">
                {/* Quantity Control */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpdateQuantity(product.id, product.quantity - 1)}
                    disabled={product.quantity <= 1}
                    className="w-8 h-8 flex items-center justify-center text-[#6B7280] hover:text-[#242424] hover:bg-[#F9FAFB] disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-[8px]"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14"/>
                    </svg>
                  </button>
                  
                  <div className="w-12 text-center">
                    <span className="text-[16px] font-medium text-[#242424]">
                      {product.quantity}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => handleUpdateQuantity(product.id, product.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center text-[#6B7280] hover:text-[#242424] hover:bg-[#F9FAFB] transition-colors rounded-[8px]"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 5v14m-7-7h14"/>
                    </svg>
                  </button>
                </div>

                {/* Total Price */}
                <div className="text-right">
                  <div className="text-[18px] font-semibold text-[#001B42]">
                    {formatPrice(product.totalPrice)}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
        
        {/* Grand Total */}
        <div className="mt-6 pt-4 border-t border-[#E5E7EB]">
          <div className="bg-[#001B42] rounded-[12px] p-4">
            <div className="flex justify-between items-center">
              <span className="text-[16px] font-medium text-white">
                Total dos produtos
              </span>
              <span className="text-[20px] font-semibold text-white">
                {formatPrice(grandTotal)}
              </span>
            </div>
            <div className="text-[12px] text-[#9CA3AF] mt-1">
              {products.reduce((sum, p) => sum + p.quantity, 0)} {products.reduce((sum, p) => sum + p.quantity, 0) === 1 ? 'item' : 'itens'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
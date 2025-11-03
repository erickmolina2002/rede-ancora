'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useProductsBudget } from '../../contexts/ProductsBudgetContext'

type EnhancedProductsListProps = {
  onTotalChange?: (total: number) => void
}

export default function EnhancedProductsList({ 
  onTotalChange 
}: EnhancedProductsListProps) {
  const [animatedItems, setAnimatedItems] = useState<string[]>([])
  const [imageErrors, setImageErrors] = useState<{[key: string]: boolean}>({})
  
  const { 
    products, 
    updateQuantity: updateProductQuantity, 
    removeProduct,
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

  const handleRemoveProduct = (productId: number) => {
    removeProduct(productId)
  }

  const getImageUrl = (imagePath: string | null) => {
    if (!imagePath || imagePath.trim() === '') return null

    // Se já for uma URL completa (http/https), usar como está
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath
    }

    // Se começar com /, é um caminho local (mock) - usar diretamente
    if (imagePath.startsWith('/')) {
      return imagePath
    }

    // Caso contrário, é um nome de arquivo do blob storage
    return `https://catalogopdtstorage.blob.core.windows.net/imagens-stg-v2/produto/${imagePath}`
  }

  const handleImageError = (productId: number) => {
    setImageErrors(prev => ({
      ...prev,
      [productId]: true
    }))
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
          const imageUrl = getImageUrl(product.imageUrl)
          const hasImageError = imageErrors[product.id]
          
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
              <div className="flex items-start gap-3 mb-2">
                {/* Product Image */}
                <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                  {imageUrl && !hasImageError ? (
                    <Image
                      src={imageUrl}
                      alt={product.name || 'Produto'}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                      onError={() => handleImageError(product.id)}
                      priority={false}
                      unoptimized={true}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <svg 
                        className="w-6 h-6 text-gray-400" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z" 
                        />
                      </svg>
                    </div>
                  )}
                </div>
                
                {/* Product Details */}
                <div className="flex-1 min-w-0">
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
              <div className="flex items-center justify-between border-t border-[#F3F4F6]">
                {/* Quantity Control */}
                <div className="flex items-center gap-2">
                  {product.quantity === 1 ? (
                    <button
                      onClick={() => handleRemoveProduct(product.id)}
                      className="w-8 h-8 flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors rounded-[8px] group"
                      title="Remover produto"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="m3 6 18 0"/>
                        <path d="m19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                        <path d="m8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                        <line x1="10" x2="10" y1="11" y2="17"/>
                        <line x1="14" x2="14" y1="11" y2="17"/>
                      </svg>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpdateQuantity(product.id, product.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center text-[#6B7280] hover:text-[#242424] hover:bg-[#F9FAFB] transition-colors rounded-[8px]"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14"/>
                      </svg>
                    </button>
                  )}
                  
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
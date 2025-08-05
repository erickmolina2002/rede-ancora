'use client'

import React from 'react'
import Image from 'next/image'
import { useCart } from '../contexts/CartContext'
import { ProductItem } from '../ui/cards/ProductCard'
import BackButton from '../ui/BackButton'
import Button from '../ui/Button'

type CartItemProps = {
  item: ProductItem
  imageUrl: string | null
  index: number
  onRemove: (id: number, name: string) => void
}

function CartItem({ item, imageUrl, index, onRemove }: CartItemProps) {
  const [imageError, setImageError] = React.useState(false)

  return (
    <div
      className="bg-white border border-[#E5E7EB] rounded-lg p-4 animate-in fade-in slide-in-from-bottom"
      style={{
        animationDelay: `${index * 50}ms`
      }}
    >
      <div className="flex items-start gap-3">
        {/* Imagem do Produto */}
        <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
          {imageUrl && !imageError ? (
            <Image
              src={imageUrl}
              alt={item.nomeProduto || 'Produto'}
              width={64}
              height={64}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
              onLoadingComplete={() => setImageError(false)}
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

        {/* Informações do Produto */}
        <div className="flex-1 min-w-0">
          <h3 className="text-[16px] font-medium text-[#242424] mb-1 line-clamp-2">
            {item.nomeProduto}
          </h3>
          
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[14px] font-medium text-[#6B7280]">
              {item.marca}
            </span>
            <span className="text-[12px] text-[#9CA3AF]">•</span>
            <span className="text-[14px] text-[#6B7280]">
              {item.codigoReferencia}
            </span>
          </div>

          {item.isSimilar && (
            <div className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium mt-1">
              Similar
            </div>
          )}
        </div>
        
        {/* Botão Remover */}
        <button
          onClick={() => onRemove(item.id, item.nomeProduto)}
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
          title="Remover item"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m18 6-12 12"/>
            <path d="m6 6 12 12"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

export default function CartPage() {
  const { items, removeItem, clearCart, getTotalItems } = useCart()
  
  const getImageUrl = (imagePath: string | null) => {
    if (!imagePath || imagePath.trim() === '') return null
    
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath
    }
    
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath
    return `https://catalogopdtstorage.blob.core.windows.net/imagens-stg-v2/produto/${cleanPath}`
  }

  const handleClearCart = () => {
    if (confirm('Deseja remover todos os itens?')) {
      clearCart()
    }
  }

  const handleRemoveItem = (id: number, name: string) => {
    if (confirm(`Deseja remover "${name}"?`)) {
      removeItem(id)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] max-w-[360px] mx-auto flex flex-col">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-[#E5E7EB]">
        <div className="flex items-center gap-4 mb-2">
          <BackButton />
          <h1 className="text-[20px] font-semibold text-[#242424]">
            Produtos Selecionados
          </h1>
        </div>
        
        {items.length > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-[14px] text-[#6B7280]">
              {getTotalItems()} {getTotalItems() === 1 ? 'item selecionado' : 'itens selecionados'}
            </p>
            <button
              onClick={handleClearCart}
              className="text-[12px] text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 transition-colors"
            >
              Limpar todos
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center px-6">
              <div className="text-[48px] mb-4">🛒</div>
              <h2 className="text-[18px] font-medium text-[#242424] mb-2">
                Nenhum produto selecionado
              </h2>
              <p className="text-[14px] text-[#6B7280] mb-6">
                Volte à busca para adicionar produtos à sua lista
              </p>
              <Button 
                onClick={() => window.history.back()}
                className="w-full max-w-[200px] h-[48px] rounded-[20px] bg-[#059669] text-white hover:bg-[#047857] transition-colors"
              >
                Buscar Produtos
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            {items.map((item, index) => {
              const imageUrl = getImageUrl(item.imagemReal)
              return <CartItem key={item.id} item={item} imageUrl={imageUrl} index={index} onRemove={handleRemoveItem} />
            })}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      {items.length > 0 && (
        <div className="bg-white border-t border-[#E5E7EB] p-6">
          <div className="flex gap-3">
            <Button 
              onClick={() => alert('Funcionalidade em desenvolvimento')}
              className="flex-1 h-[48px] rounded-[20px] bg-[#001B42] text-white hover:bg-[#002B52] transition-colors"
            >
              Gerar Orçamento
            </Button>
            <Button 
              onClick={() => alert('Funcionalidade em desenvolvimento')}
              className="flex-1 h-[48px] rounded-[20px] border border-[#E5E7EB] bg-white text-[#242424] hover:bg-[#F9FAFB] transition-colors"
            >
              Compartilhar
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
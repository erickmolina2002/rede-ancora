'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Produto } from '../../services/apiService'

export type ProductItem = {
  id: number
  nomeProduto: string
  marca: string
  codigoReferencia: string
  imagemReal: string | null
  isSimilar?: boolean
}

type ProductCardProps = {
  produto: Produto
  onAdd: (item: ProductItem) => void
  isSimilar?: boolean
  showAddButton?: boolean
  isAdded?: boolean
}

export default function ProductCard({ produto, onAdd, isSimilar = false, showAddButton = true, isAdded = false }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleAdd = () => {
    setIsAdding(true)
    setTimeout(() => setIsAdding(false), 200)
    onAdd({
      id: produto.id,
      nomeProduto: produto.nomeProduto,
      marca: produto.marca,
      codigoReferencia: produto.codigoReferencia,
      imagemReal: produto.imagemReal,
      isSimilar
    })
  }

  const getImageUrl = (imagePath: string | null) => {
    if (!imagePath || imagePath.trim() === '') return null
    
    // Se já for uma URL completa, usar como está
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath
    }
    
    // Se for apenas o nome do arquivo, construir a URL completa
    // Remove barras iniciais se existirem
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath
    return `https://catalogopdtstorage.blob.core.windows.net/imagens-stg-v2/produto/${cleanPath}`
  }

  const imageUrl = getImageUrl(produto.imagemReal)

  return (
    <div 
      onClick={showAddButton ? handleAdd : undefined}
      className={`bg-white border border-[#E5E7EB] rounded-lg p-4 hover:border-[#D1D5DB] hover:shadow-sm transition-all duration-200 transform hover:scale-[1.01] relative ${
        showAddButton ? 'cursor-pointer' : 'cursor-default'
      }`}
    >
      {/* Selo de Similar */}
      {isSimilar && (
        <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium z-10">
          Similar
        </div>
      )}

      <div className="flex items-start gap-3">
        {/* Imagem do Produto */}
        <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
          {imageUrl && !imageError ? (
            <Image
              src={imageUrl}
              alt={produto.nomeProduto || 'Produto'}
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
            {produto.nomeProduto}
          </h3>
          
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[14px] font-medium text-[#6B7280]">
              {produto.marca}
            </span>
            <span className="text-[12px] text-[#9CA3AF]">•</span>
            <span className="text-[14px] text-[#6B7280]">
              {produto.codigoReferencia}
            </span>
          </div>

          {produto.informacoesComplementares && (
            <p className="text-[12px] text-[#9CA3AF] line-clamp-1">
              {produto.informacoesComplementares}
            </p>
          )}
        </div>
        
        {/* Botão Adicionar/Remover */}
        {showAddButton && (
          <div
            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 transform ${
              isAdded 
                ? 'bg-green-500 hover:bg-red-500 hover:scale-110' 
                : isAdding ? 'animate-pulse scale-95' : 'hover:scale-110'
            }`}
          >
            {isAdded ? (
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="white" 
                strokeWidth="2"
                className="w-4 h-4 transition-all duration-200"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            ) : (
              <Image
                src="/plus.svg"
                alt="Adicionar"
                width={16}
                height={16}
                className={`w-4 h-4 transition-transform duration-200 ${
                  isAdding ? 'rotate-90' : ''
                }`}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
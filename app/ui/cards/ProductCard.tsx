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
  preco?: number
  isSimilar?: boolean
  tipoCompatibilidade?: 'original' | 'compativel'
}

type ProductCardProps = {
  produto: Produto
  onAdd: (item: ProductItem) => void
  onIncrement?: (id: number) => void
  onDecrement?: (id: number) => void
  onRemove?: (id: number) => void
  isSimilar?: boolean
  showAddButton?: boolean
  isAdded?: boolean
  quantity?: number
}

export default function ProductCard({
  produto,
  onAdd,
  onIncrement,
  onDecrement,
  onRemove,
  isSimilar = false,
  showAddButton = true,
  isAdded = false,
  quantity = 0
}: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleAdd = () => {
    if (produto.semEstoque) return // Não permitir adicionar se sem estoque

    // Se já está adicionado, remover (como se clicou na lixeira)
    if (isAdded && onRemove) {
      onRemove(produto.id)
      return
    }

    // Se não está adicionado, adicionar
    setIsAdding(true)
    setTimeout(() => setIsAdding(false), 200)
    onAdd({
      id: produto.id,
      nomeProduto: produto.nomeProduto,
      marca: produto.marca,
      codigoReferencia: produto.codigoReferencia,
      imagemReal: produto.imagemReal,
      preco: produto.preco,
      isSimilar,
      tipoCompatibilidade: produto.tipoCompatibilidade
    })
  }

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onIncrement) {
      onIncrement(produto.id)
    } else {
      // Fallback: chamar onAdd novamente para incrementar
      onAdd({
        id: produto.id,
        nomeProduto: produto.nomeProduto,
        marca: produto.marca,
        codigoReferencia: produto.codigoReferencia,
        imagemReal: produto.imagemReal,
        preco: produto.preco,
        isSimilar,
        tipoCompatibilidade: produto.tipoCompatibilidade
      })
    }
  }

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onDecrement) {
      onDecrement(produto.id)
    } else if (onRemove && (quantity || 1) === 1) {
      // Se qty = 1, remover
      onRemove(produto.id)
    } else {
      // Fallback: Se não tem callback, ao menos não quebra
      console.log('Decremento não implementado')
    }
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onRemove) {
      onRemove(produto.id)
    } else {
      // Fallback: Se não tem onRemove, tentar chamar onAdd com id negativo ou similar
      console.log('Remover não implementado')
    }
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

  const imageUrl = getImageUrl(produto.imagemReal)

  // Função para formatar preço
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  return (
    <div
      onClick={showAddButton && !produto.semEstoque ? handleAdd : undefined}
      className={`bg-white border border-[#E5E7EB] rounded-lg p-4 transition-all duration-200 relative h-[110px] ${
        produto.semEstoque
          ? 'opacity-75 cursor-not-allowed overflow-hidden'
          : showAddButton
          ? 'cursor-pointer hover:border-[#D1D5DB] hover:shadow-sm transform hover:scale-[1.01] overflow-visible'
          : 'cursor-default overflow-visible'
      }`}
    >
      {/* Indicador de Sem Estoque - Diagonal */}
      {produto.semEstoque && (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-20 overflow-hidden">
          <div className="absolute top-[50%] left-[-35%] w-[170%] bg-red-600 text-white text-center py-2 transform -translate-y-1/2 rotate-[-45deg] shadow-lg">
            <span className="text-[12px] font-bold uppercase tracking-wider">Sem Estoque</span>
          </div>
        </div>
      )}

      {/* Selo de Similar ou Original */}
      {!isSimilar && (
        <div className="absolute bottom-[10px] right-[10px] bg-green-600 text-white text-[10px] rounded font-semibold px-2 py-1 font-medium z-10">
          ORIGINAL
        </div>
      )}

      {/* Botão Adicionar/Contador - Posicionado Absolutamente no canto superior direito */}
      {showAddButton && !produto.semEstoque && (
        <div className="absolute top-2 right-2 z-30 pointer-events-auto">
          {isAdded ? (
            // Contador de quantidade
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 shadow-md">
              {/* Botão Decrementar ou Remover */}
              <button
                onClick={(quantity || 1) === 1 ? handleRemove : handleDecrement}
                className="w-7 h-7 rounded-md bg-white hover:bg-red-50 flex items-center justify-center transition-colors shadow-sm"
              >
                {(quantity || 1) === 1 ? (
                  // Ícone de Lixeira
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#DC2626"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                ) : (
                  // Ícone de Menos
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#6B7280"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                )}
              </button>

              {/* Quantidade */}
              <span className="min-w-[24px] text-center text-[14px] font-semibold text-gray-700">
                {quantity || 1}
              </span>

              {/* Botão Incrementar */}
              <button
                onClick={handleIncrement}
                className="w-7 h-7 rounded-md bg-white hover:bg-green-50 flex items-center justify-center transition-colors shadow-sm"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#16A34A"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
            </div>
          ) : (
            // Botão Adicionar
            <div
              className={`w-4 h-4 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center transition-all duration-200 transform ${
                isAdding ? 'animate-pulse scale-65' : 'hover:scale-85'
              }`}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className={`transition-transform duration-200 ${
                  isAdding ? 'rotate-90' : ''
                }`}
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </div>
          )}
        </div>
      )}

      <div className="flex items-start gap-3">
        {/* Conteúdo do Card com Opacidade */}
        <div className={`flex items-start gap-3 flex-1 transition-opacity duration-200 ${
          isAdded ? 'opacity-50' : 'opacity-100'
        }`}>
          {/* Imagem do Produto */}
          <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
            {imageUrl && !imageError ? (
              <Image
                src={imageUrl}
                alt={produto.nomeProduto || 'Produto'}
                width={64}
                height={64}
                className="w-full h-full object-contain"
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
            <h3 className="text-[16px] font-medium text-[#242424] line-clamp-2 break-words">
              {produto.nomeProduto}
            </h3>

            <div className="flex flex-col items-start ">
              <span className={`font-medium text-[#6B7280] break-words ${produto.marca.length > 12 ? 'text-[12px]' : 'text-[14px]'}`}>
                {produto.marca}
              </span>
              <span className={`text-[#6B7280] flex-shrink-0 ${produto.codigoReferencia.length > 1 ? 'text-[12px]' : 'text-[14px]'}`}>
                {produto.codigoReferencia}
              </span>
            </div>

            {/* Preço */}
            {produto.preco && (
              <div className="mt-2">
                <span className="text-[18px] font-bold text-green-700">
                  {formatPrice(produto.preco)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

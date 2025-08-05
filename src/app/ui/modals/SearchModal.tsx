'use client'

import React, { useState, useEffect } from 'react'
import Button from '../Button'
import { useProductSearch } from '../../hooks/useProductSearch'
import ProductsFoundModal from './ProductsFoundModal'

type SearchModalProps = {
  isOpen: boolean
  onClose: () => void
  onProductSelect: (nomeProduto: string) => void
  onItemAdd?: (item: any) => void
  placa?: string
}

export default function SearchModal({
  isOpen,
  onClose,
  onProductSelect,
  onItemAdd,
  placa
}: SearchModalProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<string>('')
  const [showProductsModal, setShowProductsModal] = useState(false)
  const [selectedProductName, setSelectedProductName] = useState<string>('')
  const [searchFilter, setSearchFilter] = useState<string>('')

  const {
    isLoading,
    error,
    nomesProdutos,
    produtosEncontrados,
    veiculoInfo,
    buscarProdutosFilho,
    buscarProdutos,
    resetSearch
  } = useProductSearch()

  // Filtrar produtos baseado no input de busca
  const produtosFiltrados = nomesProdutos.filter(nomeProduto =>
    nomeProduto.toLowerCase().includes(searchFilter.toLowerCase())
  )

  // Buscar produtos filhos automaticamente quando modal abrir com placa
  useEffect(() => {
    if (isOpen && placa && placa.trim()) {
      buscarProdutosFilho(placa.trim().toUpperCase())
    }
  }, [isOpen, placa, buscarProdutosFilho])

  // Selecionar produto e buscar produtos específicos
  const handleProductSelect = async (nomeProduto: string) => {
    if (!placa) return
    
    setSelectedProduct(nomeProduto)
    setSelectedProductName(nomeProduto)
    
    // Buscar produtos específicos para este nome
    await buscarProdutos(placa.trim().toUpperCase(), nomeProduto, 0, 20)
    
    // Abrir modal de produtos encontrados
    setShowProductsModal(true)
  }

  const handleClose = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setSelectedProduct('')
      setSelectedProductName('')
      setShowProductsModal(false)
      setSearchFilter('')
      setIsAnimating(false)
      resetSearch()
      onClose()
    }, 200)
  }

  // Fechar modal de produtos encontrados
  const handleProductsModalClose = () => {
    setShowProductsModal(false)
    setSelectedProductName('')
  }

  // Adicionar item do modal de produtos
  const handleItemAdd = (item: any) => {
    if (onItemAdd) {
      onItemAdd(item)
    }
    // Também chamar a função original se existir
    onProductSelect(selectedProductName)
  }

  // Reset search when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedProduct('')
      setSelectedProductName('')
      setShowProductsModal(false)
      setSearchFilter('')
      setIsAnimating(false)
      resetSearch()
    }
  }, [isOpen, resetSearch])

  if (!isOpen && !isAnimating) return null

  return (
    <div className={`fixed inset-0 bg-[#F5F5F5] z-50 transition-opacity duration-200 ${isAnimating ? 'animate-out fade-out' : 'animate-in fade-in'
      }`}>
      <div className={`flex flex-col h-full w-full max-w-[360px] mx-auto transition-transform duration-300 ${isAnimating
          ? 'animate-out slide-out-to-bottom'
          : 'animate-in slide-in-from-bottom'
        }`}>
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-2">

          <div className="mb-2 mt-2">
            <h3 className="text-[18px] font-semibold text-[#242424] mb-2">
              Produtos Disponíveis
            </h3>
            <p className="text-[14px] text-[#6B7280]">
              {produtosFiltrados.length} produtos {searchFilter ? 'encontrados' : 'disponíveis'} para a placa {placa}
            </p>
          </div>

        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Loading */}
          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#059669] mb-4"></div>
                <p className="text-[#6B7280] text-[14px]">Carregando produtos...</p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center justify-center h-full p-6">
              <div className="text-center">
                <p className="text-red-500 text-[16px] mb-2">⚠️</p>
                <p className="text-red-500 text-[14px]">{error}</p>
              </div>
            </div>
          )}

          {/* Lista de Produtos Disponíveis */}
          {!isLoading && !error && nomesProdutos.length > 0 && (
            <div className="h-full">


              <div className="space-y-3">
                {nomesProdutos.map((nomeProduto, index) => (
                  <div
                    key={index}
                    onClick={() => handleProductSelect(nomeProduto)}
                    className="bg-white border border-[#E5E7EB] rounded-[12px] p-4 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-md active:scale-[0.98]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-[16px] font-medium text-[#242424] mb-1">
                          {nomeProduto}
                        </h4>
                        <p className="text-[14px] text-[#6B7280]">
                          Toque para ver produtos disponíveis
                        </p>
                      </div>
                      <div className="text-[#059669]">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="m9 18 6-6-6-6" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty States */}
          {!isLoading && !error && nomesProdutos.length === 0 && !placa && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-[#6B7280] text-[16px]">
                  Placa do veículo não informada
                </p>
              </div>
            </div>
          )}

          {!isLoading && !error && nomesProdutos.length === 0 && placa && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-[#6B7280] text-[16px]">
                  Nenhum produto encontrado para esta placa
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-6">
          <div className="flex gap-3">
            <Button 
              onClick={handleClose} 
              className="w-full h-[48px] rounded-[20px] bg-[#001B42] text-white hover:bg-[#002B52] transition-colors"
            >
              Voltar
            </Button>
          </div>
        </div>
      </div>

      {/* Products Found Modal */}
      <ProductsFoundModal
        isOpen={showProductsModal}
        onClose={handleProductsModalClose}
        onItemAdd={handleItemAdd}
        produtos={produtosEncontrados}
        selectedProductName={selectedProductName}
        isLoading={isLoading}
        error={error}
        placa={placa}
        veiculoInfo={veiculoInfo}
      />
    </div>
  )
}
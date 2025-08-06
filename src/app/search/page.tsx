'use client'

import React, { useState, useCallback } from 'react'
// import Image from 'next/image'
import { useProductSearch } from '../hooks/useProductSearch'
// import { useCart } from '../contexts/CartContext'
import BackButton from '../ui/BackButton'
import CartHeader from '../ui/headers/CartHeader'
import SearchModal from '../ui/modals/SearchModal'
import ProductsFoundModal from '../ui/modals/ProductsFoundModal'

export default function SearchPage() {
  const [placa, setPlaca] = useState('')
  // const [searchTerm, setSearchTerm] = useState('')
  const [selectedProduct, setSelectedProduct] = useState('')
  // const [showResults, setShowResults] = useState(false)
  // const [currentPage, setCurrentPage] = useState(0)
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [showProductsModal, setShowProductsModal] = useState(false)
  // const [showDetailModal, setShowDetailModal] = useState(false)
  // const [selectedItems, setSelectedItems] = useState<Array<{
  //   id: number;
  //   nomeProduto: string;
  //   marca: string;
  //   codigoReferencia: string;
  //   similares?: Array<{
  //     nome: string;
  //     marca: string;
  //     preco: number;
  //   }>;
  // }>>([])

  // const { addItem } = useCart()

  const {
    isLoading,
    error,
    produtosEncontrados,
    nomesProdutos,
    veiculoInfo,
    // buscarProdutosFilho,
    buscarProdutos,
    // resetSearch
  } = useProductSearch()

  // const produtosPaginados = React.useMemo(() => {
  //   const startIndex = currentPage * 6
  //   return produtosEncontrados.slice(startIndex, startIndex + 6)
  // }, [produtosEncontrados, currentPage])

  // const totalPages = Math.ceil(produtosEncontrados.length / 6)

  const handlePlacaSubmit = useCallback(async () => {
    if (!placa.trim()) return
    setShowSearchModal(true)
  }, [placa])

  const handleProductSelect = useCallback(async (nomeProduto: string) => {
    setSelectedProduct(nomeProduto)
    // setSearchTerm(nomeProduto)
    
    if (!placa || !placa.trim() || !nomeProduto.trim()) return
    
    await buscarProdutos(placa.trim().toUpperCase(), nomeProduto, 0, 20)
    // setCurrentPage(0)
    setShowProductsModal(true)
  }, [placa, buscarProdutos])

  // const handleCardClick = (produto: {
  //   id: number;
  //   nomeProduto: string;
  //   marca: string;
  //   codigoReferencia: string;
  //   similares?: Array<{
  //     nome: string;
  //     marca: string;
  //     preco: number;
  //   }>;
  // }) => {
  //   setSelectedItems([produto])
  //   setShowDetailModal(true)
  // }


  const formatPlaca = (value: string) => {
    // Remove todos os caracteres não alfanuméricos
    const cleaned = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
    
    // Formato antigo (AAA-9999) ou novo (AAA9A99)
    if (cleaned.length <= 3) {
      return cleaned
    } else if (cleaned.length <= 7) {
      return cleaned.substring(0, 3) + '-' + cleaned.substring(3)
    } else {
      return cleaned.substring(0, 3) + '-' + cleaned.substring(3, 7)
    }
  }

  const handlePlacaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPlaca(e.target.value)
    setPlaca(formatted)
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] max-w-[360px] mx-auto flex flex-col relative">
      <CartHeader />
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-[#E5E7EB]">
        <div className="flex items-center gap-4 mb-4">
          <BackButton />
          <h1 className="text-[20px] font-semibold text-[#242424]">
            Buscar Produtos
          </h1>
        </div>

        {/* Input da Placa */}
        <div className="mb-4">
          <label className="block text-[14px] font-medium text-[#242424] mb-2">
            Placa do Veículo
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={placa}
              onChange={handlePlacaChange}
              placeholder="ABC-1234"
              className="flex-1 px-4 py-3 border border-[#E5E7EB] rounded-[12px] text-[16px] focus:border-[#059669] focus:ring-1 focus:ring-[#059669] focus:outline-none"
              maxLength={8}
            />
            <button
              onClick={handlePlacaSubmit}
              disabled={!placa.trim() || isLoading}
              className="px-6 py-3 bg-[#059669] text-white rounded-[12px] font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#047857] transition-colors"
            >
              {isLoading ? '...' : 'Buscar'}
            </button>
          </div>
        </div>


        {/* Informações do Veículo */}
        {veiculoInfo && (
          <div className="p-3 bg-blue-50 rounded-[8px]">
            <p className="text-[14px] font-medium text-blue-900">
              {veiculoInfo.montadora} {veiculoInfo.modelo} {veiculoInfo.versao}
            </p>
            <p className="text-[12px] text-blue-700">
              {veiculoInfo.anoFabricacao}/{veiculoInfo.anoModelo} - {veiculoInfo.motor} - {veiculoInfo.combustivel}
            </p>
          </div>
        )}
      </div>

      {/* Results Area */}
      <div className="flex-1 overflow-hidden">
        {/* Lista de Produtos Disponíveis - Ocupa a tela toda */}
        {nomesProdutos.length > 0 && (
          <div className="h-full p-6">
            <div className="mb-4">
              <h3 className="text-[18px] font-semibold text-[#242424] mb-2">
                Produtos Disponíveis
              </h3>
              <p className="text-[14px] text-[#6B7280]">
                {nomesProdutos.length} produtos encontrados para a placa {placa}
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-3 h-full overflow-y-auto pb-20">
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
                        <path d="m9 18 6-6-6-6"/>
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-red-500 text-[16px] mb-2">⚠️</p>
              <p className="text-red-500 text-[14px]">{error}</p>
            </div>
          </div>
        )}

        {/* Estados vazios */}
        {nomesProdutos.length === 0 && !isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-[48px] mb-4">🔍</div>
              <p className="text-[#6B7280] text-[16px] mb-2">
                Digite a placa do veículo
              </p>
              <p className="text-[#9CA3AF] text-[14px]">
                Para começar a buscar produtos
              </p>
            </div>
          </div>
        )}

        {!isLoading && !error && nomesProdutos.length === 0 && placa && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-[48px] mb-4">😔</div>
              <p className="text-[#6B7280] text-[16px]">
                Nenhum produto encontrado para esta placa
              </p>
            </div>
          </div>
        )}
      </div>


      {/* Search Modal */}
      <SearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onProductSelect={handleProductSelect}
        placa={placa}
      />

      {/* Products Found Modal */}
      <ProductsFoundModal
        isOpen={showProductsModal}
        onClose={() => {
          setShowProductsModal(false)
          setSelectedProduct('')
          // setCurrentPage(0)
        }}
        produtos={produtosEncontrados}
        selectedProductName={selectedProduct}
        isLoading={isLoading}
        error={error}
        placa={placa}
        veiculoInfo={veiculoInfo}
      />
    </div>
  )
}
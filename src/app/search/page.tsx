'use client'

import React, { useState, useCallback } from 'react'
import Image from 'next/image'
import ProductCard from '../ui/cards/ProductCard'
import { useProductSearch } from '../hooks/useProductSearch'
import BackButton from '../ui/BackButton'

export default function SearchPage() {
  const [placa, setPlaca] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProduct, setSelectedProduct] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [selectedItems, setSelectedItems] = useState<any[]>([])

  const {
    isLoading,
    error,
    produtosEncontrados,
    nomesProdutos,
    veiculoInfo,
    buscarProdutosFilho,
    buscarProdutos,
    resetSearch
  } = useProductSearch()

  const produtosPaginados = React.useMemo(() => {
    const startIndex = currentPage * 6
    return produtosEncontrados.slice(startIndex, startIndex + 6)
  }, [produtosEncontrados, currentPage])

  const totalPages = Math.ceil(produtosEncontrados.length / 6)

  const handlePlacaSubmit = useCallback(async () => {
    if (!placa.trim()) return
    
    await buscarProdutosFilho(placa.trim().toUpperCase())
    setShowResults(true)
  }, [placa, buscarProdutosFilho])

  const handleProductSelect = useCallback(async (nomeProduto: string) => {
    setSelectedProduct(nomeProduto)
    setSearchTerm(nomeProduto)
    
    if (!placa || !placa.trim() || !nomeProduto.trim()) return
    
    await buscarProdutos(placa.trim().toUpperCase(), nomeProduto, 0, 20)
    setCurrentPage(0)
  }, [placa, buscarProdutos])

  const handleCardClick = (produto: any) => {
    setSelectedItems([produto])
    setShowModal(true)
  }

  const handleModalClose = () => {
    setShowModal(false)
    setSelectedItems([])
  }

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
    <div className="min-h-screen bg-[#F5F5F5] max-w-[360px] mx-auto">
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

        {/* Lista de Produtos Disponíveis */}
        {nomesProdutos.length > 0 && (
          <div className="mb-4">
            <label className="block text-[14px] font-medium text-[#242424] mb-2">
              Produtos Disponíveis ({nomesProdutos.length})
            </label>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {nomesProdutos.slice(0, 10).map((nomeProduto, index) => (
                <button
                  key={index}
                  onClick={() => handleProductSelect(nomeProduto)}
                  className={`w-full text-left p-3 rounded-[8px] border text-[14px] transition-all ${
                    selectedProduct === nomeProduto 
                      ? 'bg-[#059669] border-[#059669] text-white' 
                      : 'bg-white border-[#E5E7EB] hover:border-[#059669] text-[#242424] hover:bg-[#F0FDF4]'
                  }`}
                >
                  {nomeProduto}
                </button>
              ))}
            </div>
          </div>
        )}

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
      <div className="flex-1 p-6">
        {error && (
          <div className="text-center py-12">
            <p className="text-red-500 text-[16px] mb-2">⚠️</p>
            <p className="text-red-500 text-[14px]">{error}</p>
          </div>
        )}

        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#059669]"></div>
            <p className="text-[#6B7280] text-[14px] mt-2">Carregando produtos...</p>
          </div>
        )}

        {!isLoading && !error && produtosPaginados.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[16px] font-medium text-[#242424]">
                Produtos Encontrados ({produtosEncontrados.length})
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {produtosPaginados.map((produto, index) => (
                <div 
                  key={produto.id} 
                  onClick={() => handleCardClick(produto)}
                  className="cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <ProductCard 
                    produto={produto} 
                    onAdd={() => {}} // Não usado aqui
                    showAddButton={false}
                  />
                </div>
              ))}
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                <button
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  className="px-4 py-2 text-[14px] border border-[#E5E7EB] rounded-[8px] disabled:opacity-50 disabled:cursor-not-allowed bg-white text-[#242424] hover:bg-[#F9FAFB]"
                >
                  Anterior
                </button>
                <span className="px-4 py-2 text-[14px] text-[#6B7280]">
                  {currentPage + 1} de {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                  disabled={currentPage === totalPages - 1}
                  className="px-4 py-2 text-[14px] border border-[#E5E7EB] rounded-[8px] disabled:opacity-50 disabled:cursor-not-allowed bg-white text-[#242424] hover:bg-[#F9FAFB]"
                >
                  Próxima
                </button>
              </div>
            )}
          </div>
        )}

        {/* Estados vazios */}
        {!showResults && !isLoading && (
          <div className="text-center py-12">
            <div className="text-[48px] mb-4">🔍</div>
            <p className="text-[#6B7280] text-[16px] mb-2">
              Digite a placa do veículo
            </p>
            <p className="text-[#9CA3AF] text-[14px]">
              Para começar a buscar produtos
            </p>
          </div>
        )}

        {showResults && !isLoading && !error && nomesProdutos.length === 0 && (
          <div className="text-center py-12">
            <div className="text-[48px] mb-4">😔</div>
            <p className="text-[#6B7280] text-[16px]">
              Nenhum produto encontrado para esta placa
            </p>
          </div>
        )}

        {nomesProdutos.length > 0 && !selectedProduct && !isLoading && (
          <div className="text-center py-12">
            <div className="text-[48px] mb-4">👆</div>
            <p className="text-[#6B7280] text-[16px]">
              Selecione um produto da lista acima
            </p>
          </div>
        )}

        {selectedProduct && !isLoading && !error && produtosEncontrados.length === 0 && (
          <div className="text-center py-12">
            <div className="text-[48px] mb-4">🔍</div>
            <p className="text-[#6B7280] text-[16px]">
              Nenhum produto encontrado para "{selectedProduct}"
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedItems.length > 0 && (
        <div className="fixed inset-0 bg-[#1E212472] z-50 flex items-center justify-center">
          <div className="bg-white m-6 rounded-[20px] max-w-[320px] w-full max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#E5E7EB]">
              <div className="flex items-center justify-between">
                <h2 className="text-[18px] font-semibold text-[#242424]">
                  Detalhes do Produto
                </h2>
                <button
                  onClick={handleModalClose}
                  className="w-8 h-8 flex items-center justify-center text-[#6B7280] hover:text-[#242424] transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {selectedItems.map((produto) => (
                <div key={produto.id} className="space-y-4">
                  {/* Imagem */}
                  {produto.imagemReal && (
                    <div className="w-full h-48 relative bg-gray-100 rounded-[12px] overflow-hidden">
                      <Image
                        src={produto.imagemReal}
                        alt={produto.nomeProduto}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  {/* Informações */}
                  <div>
                    <h3 className="text-[16px] font-semibold text-[#242424] mb-2">
                      {produto.nomeProduto}
                    </h3>
                    <div className="space-y-2 text-[14px]">
                      <div>
                        <span className="font-medium text-[#6B7280]">Marca: </span>
                        <span className="text-[#242424]">{produto.marca}</span>
                      </div>
                      <div>
                        <span className="font-medium text-[#6B7280]">Código: </span>
                        <span className="text-[#242424]">{produto.codigoReferencia}</span>
                      </div>
                      {produto.informacoesComplementares && (
                        <div>
                          <span className="font-medium text-[#6B7280]">Informações: </span>
                          <span className="text-[#242424]">{produto.informacoesComplementares}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Similares */}
                  {produto.similares && produto.similares.length > 0 && (
                    <div>
                      <h4 className="text-[14px] font-medium text-[#6B7280] mb-2">
                        Produtos Similares ({produto.similares.length})
                      </h4>
                      <div className="space-y-2">
                        {produto.similares.slice(0, 3).map((similar: any, index: number) => (
                          <div key={index} className="p-3 bg-[#F9FAFB] rounded-[8px]">
                            <p className="text-[13px] font-medium text-[#242424]">
                              {similar.marca}
                            </p>
                            <p className="text-[12px] text-[#6B7280]">
                              {similar.codigoReferencia}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-[#E5E7EB]">
              <button
                onClick={handleModalClose}
                className="w-full py-3 bg-[#059669] text-white rounded-[12px] font-medium hover:bg-[#047857] transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
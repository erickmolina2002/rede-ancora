'use client'

import React, { useState, useMemo, useEffect } from 'react'
import ItemCard, { Item } from '../cards/ItemCard'
import ProductCard, { ProductItem } from '../cards/ProductCard'
import Button from '../Button'
import { useProductSearch } from '../../hooks/useProductSearch'

type SearchModalProps = {
  isOpen: boolean
  onClose: () => void
  onItemAdd: (item: Item | ProductItem) => void
  items?: Item[]
  placa?: string
}

export default function SearchModal({ 
  isOpen, 
  onClose, 
  onItemAdd, 
  items = [],
  placa
}: SearchModalProps) {
  const [searchValue, setSearchValue] = useState('')
  const [addedItems, setAddedItems] = useState<string[]>([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [showSimilares, setShowSimilares] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<string>('')
  
  const {
    isLoading,
    error,
    produtosEncontrados,
    nomesProdutos,
    veiculoInfo,
    hasSearched,
    buscarProdutosFilho,
    buscarProdutos,
    resetSearch
  } = useProductSearch()

  // Produtos principais (5 por página)
  const produtosPaginados = useMemo(() => {
    const startIndex = currentPage * 5
    return produtosEncontrados.slice(startIndex, startIndex + 5)
  }, [produtosEncontrados, currentPage])

  // Produtos similares de todos os produtos encontrados
  const produtosSimilares = useMemo(() => {
    if (!showSimilares) return []
    
    const similares: Array<{
      id: number;
      nomeProduto: string;
      marca: string;
      codigoReferencia: string;
      imagemReal: string | null;
      informacoesComplementares: string;
    }> = []
    produtosEncontrados.forEach(produto => {
      if (produto.similares && produto.similares.length > 0) {
        produto.similares.slice(0, 5).forEach(similar => {
          similares.push({
            id: similar.id,
            nomeProduto: `${similar.marca} - Similar`,
            marca: similar.marca,
            codigoReferencia: similar.codigoReferencia,
            imagemReal: null,
            informacoesComplementares: similar.informacoesComplementares || ''
          })
        })
      }
    })
    return similares.slice(0, 5) // Limitar a 5 similares
  }, [produtosEncontrados, showSimilares])

  const totalPages = Math.ceil(produtosEncontrados.length / 5)

  // Buscar produtos filhos automaticamente quando modal abrir com placa
  useEffect(() => {
    if (isOpen && placa && placa.trim()) {
      buscarProdutosFilho(placa.trim().toUpperCase())
    }
  }, [isOpen, placa, buscarProdutosFilho])

  // Buscar produtos quando um produto for selecionado da lista
  const handleProductSelect = async (nomeProduto: string) => {
    setSelectedProduct(nomeProduto)
    
    if (!placa || !placa.trim() || !nomeProduto.trim()) return
    
    await buscarProdutos(placa.trim().toUpperCase(), nomeProduto, 0, 20)
    setCurrentPage(0)
  }

  // Filter legacy items based on search
  const filteredItems = useMemo(() => {
    if (!searchValue.trim()) {
      return items
    }
    
    const searchTerm = searchValue.toLowerCase().trim()
    return items.filter(item => 
      item.name.toLowerCase().includes(searchTerm) ||
      item.subtitle.toLowerCase().includes(searchTerm)
    )
  }, [items, searchValue])

  const handleItemAdd = (item: Item | ProductItem) => {
    // Check if item is already added to prevent duplicates
    const itemId = 'nomeProduto' in item ? item.id.toString() : item.id
    if (!addedItems.includes(itemId)) {
      onItemAdd(item)
      setAddedItems(prev => [...prev, itemId])
    }
  }

  const handleClose = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setSearchValue('')
      setAddedItems([])
      setCurrentPage(0)
      setShowSimilares(false)
      setSelectedProduct('')
      setIsAnimating(false)
      resetSearch()
      onClose()
    }, 200)
  }

  // Reset search when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearchValue('')
      setAddedItems([])
      setCurrentPage(0)
      setShowSimilares(false)
      setSelectedProduct('')
      setIsAnimating(false)
      resetSearch()
    }
  }, [isOpen, resetSearch])

  if (!isOpen && !isAnimating) return null

  return (
    <div className={`fixed inset-0 bg-[#1E212472] z-50 transition-opacity duration-200 ${
      isAnimating ? 'animate-out fade-out' : 'animate-in fade-in'
    }`}>
      <div className={`bg-[#F5F5F5] flex flex-col h-full transition-transform duration-300 ${
        isAnimating 
          ? 'animate-out slide-out-to-bottom' 
          : 'animate-in slide-in-from-bottom'
      }`}>
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-[#E5E7EB]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[20px] font-semibold text-[#242424]">
              Buscar Produtos {placa && `- ${placa}`}
            </h2>
            <button
              onClick={handleClose}
              className="w-8 h-8 flex items-center justify-center text-[#6B7280] hover:text-[#242424] transition-colors"
              aria-label="Fechar"
            >
              ✕
            </button>
          </div>

          {/* Lista de Produtos Disponíveis */}
          {nomesProdutos.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#242424] mb-2">
                Selecione um produto:
              </label>
              <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                {nomesProdutos.map((nomeProduto, index) => (
                  <button
                    key={index}
                    onClick={() => handleProductSelect(nomeProduto)}
                    className={`text-left p-4 rounded-lg border transition-all text-sm ${
                      selectedProduct === nomeProduto 
                        ? 'bg-blue-50 border-blue-300 text-blue-900 shadow-sm' 
                        : 'bg-white border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50 hover:shadow-sm'
                    }`}
                  >
                    <div className="font-medium">{nomeProduto}</div>
                    <div className="text-xs text-gray-500 mt-1">Clique para buscar produtos</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Informações do Veículo */}
          {veiculoInfo && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-900">
                {veiculoInfo.montadora} {veiculoInfo.modelo} {veiculoInfo.versao}
              </p>
              <p className="text-xs text-blue-700">
                {veiculoInfo.anoFabricacao}/{veiculoInfo.anoModelo} - {veiculoInfo.motor} - {veiculoInfo.combustivel}
              </p>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="flex-1 px-6 py-4 overflow-y-auto min-h-0">
          {error && (
            <div className="text-center py-8">
              <p className="text-red-500 text-[16px] mb-2">⚠️</p>
              <p className="text-red-500 text-[14px]">{error}</p>
            </div>
          )}

          {isLoading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-[#6B7280] text-[14px] mt-2">Carregando produtos...</p>
            </div>
          )}

          {!isLoading && !error && produtosPaginados.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[16px] font-medium text-[#242424]">
                  Produtos Encontrados ({produtosEncontrados.length})
                </h3>
                {produtosSimilares.length > 0 && (
                  <button
                    onClick={() => setShowSimilares(!showSimilares)}
                    className="text-blue-600 text-sm hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50"
                  >
                    {showSimilares ? 'Ocultar' : 'Ver'} Similares ({produtosSimilares.length})
                  </button>
                )}
              </div>

              {produtosPaginados.map((produto, index) => {
                const isAdded = addedItems.includes(produto.id.toString())
                return (
                  <div 
                    key={produto.id} 
                    className={`relative transition-all duration-300 transform ${
                      isAdded ? 'scale-98 opacity-70' : 'hover:scale-102'
                    } animate-in fade-in slide-in-from-bottom`}
                    style={{
                      animationDelay: `${index * 50}ms`
                    }}
                  >
                    <ProductCard 
                      produto={produto} 
                      onAdd={handleItemAdd}
                    />
                    {isAdded && (
                      <div className="absolute top-2 right-12 bg-green-500 text-white text-xs px-2 py-1 rounded-full animate-in zoom-in duration-300">
                        ✓ Adicionado
                      </div>
                    )}
                  </div>
                )
              })}

              {/* Produtos Similares */}
              {showSimilares && produtosSimilares.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-[14px] font-medium text-[#6B7280] mb-3">
                    Produtos Similares
                  </h4>
                  {produtosSimilares.map((similar, index) => {
                    const isAdded = addedItems.includes(similar.id.toString())
                    return (
                      <div 
                        key={`similar-${similar.id}`} 
                        className={`relative transition-all duration-300 transform ${
                          isAdded ? 'scale-98 opacity-70' : 'hover:scale-102'
                        } animate-in fade-in slide-in-from-bottom`}
                        style={{
                          animationDelay: `${index * 50}ms`
                        }}
                      >
                        <ProductCard 
                          produto={{
                            id: similar.id,
                            dataModificacao: new Date().toISOString(),
                            csa: '',
                            cna: '',
                            codigoReferencia: similar.codigoReferencia,
                            ean: null,
                            marca: similar.marca,
                            nomeProduto: similar.nomeProduto,
                            informacoesComplementares: similar.informacoesComplementares,
                            pontoCriticoAtencao: null,
                            dimensoes: null,
                            imagemReal: similar.imagemReal,
                            imagemIlustrativa: null,
                            similares: []
                          }}
                          onAdd={handleItemAdd}
                          isSimilar={true}
                        />
                        {isAdded && (
                          <div className="absolute top-2 right-12 bg-green-500 text-white text-xs px-2 py-1 rounded-full animate-in zoom-in duration-300">
                            ✓ Adicionado
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Paginação */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  <button
                    onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0}
                    className="px-3 py-1 text-sm border rounded disabled:opacity-50"
                  >
                    Anterior
                  </button>
                  <span className="px-3 py-1 text-sm text-gray-600">
                    {currentPage + 1} de {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                    disabled={currentPage === totalPages - 1}
                    className="px-3 py-1 text-sm border rounded disabled:opacity-50"
                  >
                    Próxima
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Fallback para itens legados */}
          {!hasSearched && filteredItems.length > 0 && (
            <div className="space-y-3">
              {filteredItems.map((item, index) => {
                const isAdded = addedItems.includes(item.id)
                return (
                  <div 
                    key={item.id} 
                    className={`relative transition-all duration-300 transform ${
                      isAdded ? 'scale-98 opacity-70' : 'hover:scale-102'
                    } animate-in fade-in slide-in-from-bottom`}
                    style={{
                      animationDelay: `${index * 50}ms`
                    }}
                  >
                    <ItemCard 
                      item={item} 
                      onAdd={handleItemAdd}
                    />
                    {isAdded && (
                      <div className="absolute top-2 right-12 bg-green-500 text-white text-xs px-2 py-1 rounded-full animate-in zoom-in duration-300">
                        ✓ Adicionado
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* Estado vazio */}
          {!isLoading && !error && nomesProdutos.length === 0 && !placa && (
            <div className="text-center py-12">
              <p className="text-[#6B7280] text-[16px]">
                Placa do veículo não informada
              </p>
            </div>
          )}

          {!isLoading && !error && nomesProdutos.length === 0 && placa && (
            <div className="text-center py-12">
              <p className="text-[#6B7280] text-[16px]">
                Carregando produtos disponíveis...
              </p>
            </div>
          )}

          {!isLoading && !error && nomesProdutos.length > 0 && !selectedProduct && (
            <div className="text-center py-12">
              <p className="text-[#6B7280] text-[16px]">
                Selecione um produto da lista acima para ver os resultados
              </p>
            </div>
          )}

          {hasSearched && !isLoading && !error && produtosEncontrados.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[#6B7280] text-[16px]">
                Nenhum produto encontrado para esta busca
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-6 border-t border-[#E5E7EB]">
          <div className="flex gap-3">
            <Button onClick={handleClose} className="flex-1">
              {addedItems.length > 0 ? 'Concluir' : 'Fechar'}
            </Button>
          </div>
          {addedItems.length > 0 && (
            <p className="text-center text-[12px] text-[#6B7280] mt-2">
              {addedItems.length} {addedItems.length === 1 ? 'item adicionado' : 'itens adicionados'}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
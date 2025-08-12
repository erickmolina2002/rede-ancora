'use client'

import React, { useState, useMemo } from 'react'
// import { useRouter } from 'next/navigation'
import ProductCard, { ProductItem } from '../cards/ProductCard'
import Button from '../Button'
import LoadingSpinner from '../components/LoadingSpinner'
import { useCart } from '../../contexts/CartContext'
import { useProductsBudget } from '../../contexts/ProductsBudgetContext'
import { useVehicle } from '../../contexts/VehicleContext'
import { Produto } from '../../services/apiService'

type ProductsFoundModalProps = {
  isOpen: boolean
  onClose: () => void
  produtos: Produto[]
  selectedProductName: string
  isLoading: boolean
  error: string | null
  placa?: string
  veiculoInfo?: {
    montadora: string;
    modelo: string;
    versao: string;
    chassi: string;
    motor: string;
    combustivel: string;
    cambio: string;
    carroceria: string;
    anoFabricacao: string;
    anoModelo: string;
    linha: string;
    eixos: string | null;
    geracao: string;
  } | null
}

export default function ProductsFoundModal({ 
  isOpen, 
  onClose, 
  produtos,
  selectedProductName,
  isLoading,
  error,
  placa,
  veiculoInfo
}: ProductsFoundModalProps) {
  const [addedItems, setAddedItems] = useState<string[]>([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [showSimilares, setShowSimilares] = useState(false)
  
  const { addItem } = useCart()
  const { addProduct } = useProductsBudget()
  const { setVehicleInfo } = useVehicle()
  // const router = useRouter()

  // Produtos principais (6 por página)
  const produtosPaginados = useMemo(() => {
    const startIndex = currentPage * 6
    return produtos.slice(startIndex, startIndex + 6)
  }, [produtos, currentPage])

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
    
    produtos.forEach(produto => {
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
    return similares.slice(0, 5)
  }, [produtos, showSimilares])

  const totalPages = Math.ceil(produtos.length / 6)

  const handleItemToggle = (item: ProductItem) => {
    const itemId = item.id.toString()
    if (!addedItems.includes(itemId)) {
      // Add to both contexts for compatibility
      addItem(item)
      addProduct(item)
      setAddedItems(prev => [...prev, itemId])
    } else {
      // Remove from contexts
      // Note: Assuming removeItem and removeProduct methods exist in contexts
      setAddedItems(prev => prev.filter(id => id !== itemId))
    }
  }

  const handleClose = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setAddedItems([])
      setCurrentPage(0)
      setShowSimilares(false)
      setIsAnimating(false)
      onClose()
    }, 200)
  }

  // Update VehicleContext when vehicle info is available
  React.useEffect(() => {
    if (isOpen && veiculoInfo && placa) {
      setVehicleInfo({
        placa: placa.trim().toUpperCase(),
        montadora: veiculoInfo.montadora,
        modelo: veiculoInfo.modelo,
        versao: veiculoInfo.versao,
        chassi: veiculoInfo.chassi || '',
        motor: veiculoInfo.motor,
        combustivel: veiculoInfo.combustivel,
        cambio: veiculoInfo.cambio,
        carroceria: veiculoInfo.carroceria,
        anoFabricacao: veiculoInfo.anoFabricacao,
        anoModelo: veiculoInfo.anoModelo,
        linha: veiculoInfo.linha,
        eixos: veiculoInfo.eixos,
        geracao: veiculoInfo.geracao || ''
      })
    }
  }, [isOpen, veiculoInfo, placa, setVehicleInfo])

  // Reset when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setAddedItems([])
      setCurrentPage(0)
      setShowSimilares(false)
      setIsAnimating(false)
    }
  }, [isOpen])

  if (!isOpen && !isAnimating) return null

  return (
    <div className={`fixed inset-0 bg-[#F5F5F5] z-50 transition-opacity duration-200 ${
      isAnimating ? 'animate-out fade-out' : 'animate-in fade-in'
    }`}>
      <div className={`flex flex-col h-full w-full max-w-[360px] mx-auto transition-transform duration-300 overflow-hidden ${
        isAnimating 
          ? 'animate-out slide-out-to-bottom' 
          : 'animate-in slide-in-from-bottom'
      }`}>
        {/* Header */}
        <div className="flex-shrink-0 py-2">
          <div className="flex items-center justify-between mb-2 mt-2 px-4">
            <button
              onClick={handleClose}
              className="w-8 h-8 flex items-center justify-center text-[#6B7280] hover:text-[#242424] hover:bg-[#F3F4F6] rounded-full transition-all duration-200"
              aria-label="Voltar"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>
            
            <div className="flex-1 text-center mx-4">
              <h2 className="text-[18px] font-semibold text-[#242424]">
                {selectedProductName}
              </h2>
              {placa && (
                <p className="text-[14px] text-[#6B7280]">
                  Placa: {placa}
                </p>
              )}
            </div>
            
            <div className="w-8 h-8"></div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {/* Loading */}
          {isLoading && (
            <LoadingSpinner message="Carregando produtos..." />
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

          {/* Products */}
          {!isLoading && !error && produtosPaginados.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[16px] font-medium text-[#242424]">
                  Produtos Encontrados ({produtos.length})
                </h3>
                {produtosSimilares.length > 0 && (
                  <button
                    onClick={() => setShowSimilares(!showSimilares)}
                    className="text-[#059669] text-sm hover:text-[#047857] px-2 py-1 rounded hover:bg-[#F0FDF4] transition-all"
                  >
                    {showSimilares ? 'Ocultar' : 'Ver'} Similares ({produtosSimilares.length})
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {produtosPaginados.map((produto, index) => {
                  const isAdded = addedItems.includes(produto.id.toString())
                  return (
                    <div 
                      key={produto.id} 
                      className={`relative transition-all duration-300 transform ${
                        isAdded ? 'scale-98 opacity-70' : 'hover:scale-[1.01]'
                      } animate-in fade-in slide-in-from-bottom`}
                      style={{
                        animationDelay: `${index * 50}ms`
                      }}
                    >
                      <ProductCard 
                        produto={produto} 
                        onAdd={handleItemToggle}
                        isAdded={isAdded}
                      />
                      
                    </div>
                  )
                })}
              </div>

              {/* Produtos Similares */}
              {showSimilares && produtosSimilares.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-[14px] font-medium text-[#6B7280] mb-3">
                    Produtos Similares
                  </h4>
                  <div className="space-y-3">
                    {produtosSimilares.map((similar, index) => {
                      const isAdded = addedItems.includes(similar.id.toString())
                      return (
                        <div 
                          key={`similar-${similar.id}`} 
                          className={`relative transition-all duration-300 transform ${
                            isAdded ? 'scale-98 opacity-70' : 'hover:scale-[1.01]'
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
                            onAdd={handleItemToggle}
                            isSimilar={true}
                            isAdded={isAdded}
                          />
                          
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Paginação */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  <button
                    onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0}
                    className="px-3 py-1 text-sm border border-[#E5E7EB] rounded disabled:opacity-50 bg-white hover:bg-[#F9FAFB] transition-colors"
                  >
                    Anterior
                  </button>
                  <span className="px-3 py-1 text-sm text-gray-600">
                    {currentPage + 1} de {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                    disabled={currentPage === totalPages - 1}
                    className="px-3 py-1 text-sm border border-[#E5E7EB] rounded disabled:opacity-50 bg-white hover:bg-[#F9FAFB] transition-colors"
                  >
                    Próxima
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        {addedItems.length > 0 && (
          <div className="flex-shrink-0 p-6">
            <div className="flex gap-3">
              <Button 
                onClick={handleClose} 
                className="w-full h-[48px] rounded-[20px] bg-[#001B42] text-white hover:bg-[#002B52] transition-colors"
              >
                Continuar ({addedItems.length} no orçamento)
              </Button>
            </div>
            <p className="text-center text-[12px] text-[#6B7280] mt-2">
              {addedItems.length} {addedItems.length === 1 ? 'item adicionado ao orçamento' : 'itens adicionados ao orçamento'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
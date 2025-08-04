'use client'

import React, { useState, useMemo, useEffect } from 'react'
import SearchInput from '../inputs/SearchInput'
import ItemCard, { Item } from '../cards/ItemCard'
import Button from '../Button'

type SearchModalProps = {
  isOpen: boolean
  onClose: () => void
  onItemAdd: (item: Item) => void
  items?: Item[]
}

// Mock data - in a real app this would come from props or API
const mockItems: Item[] = [
  {
    id: '1',
    name: 'Troca de Óleo',
    subtitle: 'Troca completa do óleo do motor com filtro',
    price: 89.90
  },
  {
    id: '2',
    name: 'Alinhamento e Balanceamento',
    subtitle: 'Alinhamento de direção e balanceamento das rodas',
    price: 120.00
  },
  {
    id: '3',
    name: 'Revisão Completa',
    subtitle: 'Revisão geral do veículo com checklist completo',
    price: 299.90
  },
  {
    id: '4',
    name: 'Troca de Pastilhas de Freio',
    subtitle: 'Substituição das pastilhas dianteiras e traseiras',
    price: 180.00
  },
  {
    id: '5',
    name: 'Limpeza de Ar Condicionado',
    subtitle: 'Higienização completa do sistema de ar condicionado',
    price: 95.50
  },
  {
    id: '6',
    name: 'Troca de Bateria',
    subtitle: 'Substituição da bateria do veículo',
    price: 220.00
  },
  {
    id: '7',
    name: 'Lavagem Completa',
    subtitle: 'Lavagem externa e interna do veículo',
    price: 35.00
  },
  {
    id: '8',
    name: 'Pintura de Para-choque',
    subtitle: 'Reparo e pintura de para-choque danificado',
    price: 450.00
  }
]

export default function SearchModal({ 
  isOpen, 
  onClose, 
  onItemAdd, 
  items = mockItems 
}: SearchModalProps) {
  const [searchValue, setSearchValue] = useState('')
  const [addedItems, setAddedItems] = useState<string[]>([])
  const [isAnimating, setIsAnimating] = useState(false)

  // Filter items based on search
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

  const handleItemAdd = (item: Item) => {
    // Check if item is already added to prevent duplicates
    if (!addedItems.includes(item.id)) {
      onItemAdd(item)
      setAddedItems(prev => [...prev, item.id])
    }
  }

  const handleClose = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setSearchValue('')
      setAddedItems([])
      setIsAnimating(false)
      onClose()
    }, 200)
  }

  // Reset search when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearchValue('')
      setAddedItems([])
      setIsAnimating(false)
    }
  }, [isOpen])

  if (!isOpen && !isAnimating) return null

  return (
    <div className={`fixed inset-0 bg-[#1E212472] pt-[14px] z-50 transition-opacity duration-200 ${
      isAnimating ? 'animate-out fade-out' : 'animate-in fade-in'
    }`}>
      <div className={`bg-[#F5F5F5] rounded-t-[20px] flex flex-col h-full transition-transform duration-300 ${
        isAnimating 
          ? 'animate-out slide-out-to-bottom' 
          : 'animate-in slide-in-from-bottom'
      }`}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E5E7EB]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[20px] font-semibold text-[#242424]">
              Buscar Serviços
            </h2>
            <button
              onClick={handleClose}
              className="w-8 h-8 flex items-center justify-center text-[#6B7280] hover:text-[#242424] transition-colors"
              aria-label="Fechar"
            >
              ✕
            </button>
          </div>
          
          <SearchInput
            value={searchValue}
            onChange={setSearchValue}
            placeholder="Digite o nome do serviço..."
            autoFocus
          />
        </div>

        {/* Results */}
        <div className="flex-1 px-6 py-4 overflow-y-auto">
          {filteredItems.length > 0 ? (
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
          ) : (
            <div className="text-center py-12">
              <p className="text-[#6B7280] text-[16px]">
                {searchValue.trim() 
                  ? 'Nenhum serviço encontrado'
                  : 'Digite para buscar serviços'
                }
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#E5E7EB]">
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
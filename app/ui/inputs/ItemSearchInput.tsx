'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import SearchModal from '../modals/SearchModal'
import SelectedItemsList from '../lists/SelectedItemsList'
import EnhancedProductsList from '../lists/EnhancedProductsList'
import { useProductsBudget } from '../../contexts/ProductsBudgetContext'
import { Item } from '../cards/ItemCard'
import { ProductItem } from '../cards/ProductCard'

type ItemSearchInputProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  disabled?: boolean
  className?: string
  autoFocus?: boolean
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | HTMLDivElement>) => void
  placa?: string
}

export default function ItemSearchInput({
  // value = '',
  onChange,
  placeholder = "Adicionar serviços...",
  label,
  className = "",
  onKeyDown,
  placa
}: ItemSearchInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedItems, setSelectedItems] = useState<Item[]>([])
  const [isClicked, setIsClicked] = useState(false)

  const { products, getTotalItems } = useProductsBudget()

  // Convert products to Item format for display
  const productsAsItems: Item[] = products.map(product => ({
    id: product.id.toString(),
    name: product.name,
    subtitle: `${product.brand} - ${product.code}`,
    price: product.unitPrice
  }))

  // Combine products with manually added items (avoiding duplicates)
  const allSelectedItems = [
    ...productsAsItems,
    ...selectedItems.filter(item => !productsAsItems.find(product => product.id === item.id))
  ]

  const hasItems = products.length > 0 || selectedItems.length > 0
  const totalItemCount = getTotalItems() + selectedItems.length

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
  }

  const handleClick = () => {
    setIsClicked(true)
    setTimeout(() => setIsClicked(false), 150)
    setIsModalOpen(true)
  }

  const handleItemAdd = (item: Item | ProductItem) => {
    // Convert ProductItem to Item format for compatibility
    const normalizedItem: Item = 'nomeProduto' in item ? {
      id: item.id.toString(),
      name: item.nomeProduto,
      subtitle: `${item.marca} - ${item.codigoReferencia}`,
      price: 0 // Products from API don't have price, setting to 0
    } : item as Item

    // Check if item is already added (including products)
    if (!allSelectedItems.find(selected => selected.id === normalizedItem.id)) {
      const newItems = [...selectedItems, normalizedItem]
      setSelectedItems(newItems)

      // Update the form value with total items count
      const totalItems = productsAsItems.length + newItems.length
      const itemsText = totalItems === 1
        ? `${totalItems} produto selecionado`
        : `${totalItems} produtos selecionados`
      onChange(itemsText)
    }
    // Don't close modal - let user continue adding items
  }

  const handleItemRemove = (itemId: string) => {
    // Only allow removing manually added items, not products from budget
    const isProductItem = productsAsItems.find(item => item.id === itemId)
    if (isProductItem) {
      // Don't remove products from here - they should be managed by the budget context
      return
    }

    const newItems = selectedItems.filter(item => item.id !== itemId)
    setSelectedItems(newItems)

    const totalItems = productsAsItems.length + newItems.length
    if (totalItems === 0) {
      onChange('')
    } else {
      const itemsText = totalItems === 1
        ? `${totalItems} produto selecionado`
        : `${totalItems} produtos selecionados`
      onChange(itemsText)
    }
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
  }

  // Update form value when products change
  useEffect(() => {
    const totalItems = allSelectedItems.length
    if (totalItems > 0) {
      const itemsText = totalItems === 1
        ? `${totalItems} produto selecionado`
        : `${totalItems} produtos selecionados`
      onChange(itemsText)
    } else if (products.length === 0 && selectedItems.length === 0) {
      onChange('')
    }
  }, [products, selectedItems, onChange, allSelectedItems.length])

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block paragraph-small-medium text-[#474F56] mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        <div
          onClick={handleClick}
          onFocus={handleFocus}
          onBlur={handleBlur}
          tabIndex={0}
          className={`w-full text-[18px] pb-[8px] pl-[40px] pr-4 text-base focus:outline-none cursor-pointer transition-all duration-300 transform hover:scale-[1.01] text-[#C6C8CB] ${
            isClicked ? 'scale-[0.99]' : ''
          } border-b-0`}
          aria-label={label || "Adicionar serviços"}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              handleClick()
            }
            onKeyDown?.(e)
          }}
        >
          {placeholder}
        </div>
        
        {/* Plus Icon with animation */}
        <div className={`absolute left-0 top-0 pt-[4px] pl-[8px] pointer-events-none transition-all duration-200 ${
          isClicked ? 'scale-110 rotate-90' : 'scale-100 rotate-0'
        }`}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="w-5 h-5 transition-colors duration-200"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </div>
        
        {/* Animated border */}
        <div
          className={`absolute bottom-0 left-0 h-[2px] w-full transition-all duration-300 ease-out ${
            isFocused
              ? 'bg-black transform translate-y-[-4px]'
              : 'bg-[#E5E7EB] transform translate-y-0'
          }`}
        />
      </div>

      {/* Validation Message */}
      {!hasItems && (
        <div className="mt-2 animate-in fade-in duration-200">
          <p className="text-[12px] text-[#6B7280]">
            Clique para adicionar pelo menos um serviço
          </p>
        </div>
      )}

      {/* Enhanced Products List - Shows products with quantity and pricing */}
      {products.length > 0 && (
        <EnhancedProductsList />
      )}

      {/* Selected Items List - Shows manually added items only */}
      {selectedItems.length > 0 && (
        <SelectedItemsList 
          items={selectedItems}
          onRemove={handleItemRemove}
          showRemoveButton={true}
        />
      )}

      {/* Search Modal */}
      <SearchModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onItemAdd={handleItemAdd}
        placa={placa}
      />
    </div>
  )
}
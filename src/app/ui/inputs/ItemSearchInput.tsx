'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import SearchModal from '../modals/SearchModal'
import SelectedItemsList from '../lists/SelectedItemsList'
import { Item } from '../cards/ItemCard'

type ItemSearchInputProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  disabled?: boolean
  className?: string
  autoFocus?: boolean
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

export default function ItemSearchInput({
  value = '',
  onChange,
  placeholder = "Adicionar serviços...",
  label,
  className = "",
  onKeyDown
}: ItemSearchInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedItems, setSelectedItems] = useState<Item[]>([])
  const [isClicked, setIsClicked] = useState(false)
  const hasItems = selectedItems.length > 0

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

  const handleItemAdd = (item: Item) => {
    // Check if item is already added
    if (!selectedItems.find(selected => selected.id === item.id)) {
      const newItems = [...selectedItems, item]
      setSelectedItems(newItems)
      
      // Update the form value with selected items summary
      const itemsText = newItems.length === 1 
        ? `${newItems.length} serviço selecionado`
        : `${newItems.length} serviços selecionados`
      onChange(itemsText)
    }
    // Don't close modal - let user continue adding items
  }

  const handleItemRemove = (itemId: string) => {
    const newItems = selectedItems.filter(item => item.id !== itemId)
    setSelectedItems(newItems)
    
    if (newItems.length === 0 || value === '') {
      onChange('')
    } else {
      const itemsText = newItems.length === 1 
        ? `${newItems.length} serviço selecionado`
        : `${newItems.length} serviços selecionados`
      onChange(itemsText)
    }
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
  }

  const getDisplayValue = () => {
    if (selectedItems.length === 0) return ''
    
    return selectedItems.length === 1 
      ? `${selectedItems.length} serviço selecionado`
      : `${selectedItems.length} serviços selecionados`
  }

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
          className={`w-full text-[18px] pb-[16px] pl-[50px] pr-4 text-base focus:outline-none cursor-pointer transition-all duration-300 transform hover:scale-[1.01] ${
            hasItems ? 'text-[#059669]' : 'text-[#C6C8CB]'
          } ${isClicked ? 'scale-[0.99]' : ''} border-b-0`}
          aria-label={label || "Adicionar serviços"}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              handleClick()
            }
            onKeyDown?.(e as React.KeyboardEvent<HTMLDivElement>)
          }}
        >
          {getDisplayValue() || placeholder}
        </div>
        
        {/* Plus Icon with animation */}
        <div className={`absolute left-0 top-0 p-2 pointer-events-none transition-all duration-200 ${
          isClicked ? 'scale-110 rotate-90' : 'scale-100 rotate-0'
        }`}>
          <Image
            src="/plus.svg"
            alt="Adicionar"
            width={20}
            height={20}
            className="w-5 h-5 text-[#242424] transition-colors duration-200"
          />
        </div>
        
        {/* Animated border */}
        <div 
          className={`absolute bottom-0 left-0 h-[2px] w-full transition-all duration-300 ease-out ${
            isFocused || hasItems 
              ? hasItems
                ? 'bg-[#059669] transform translate-y-[-4px]'
                : 'bg-black transform translate-y-[-4px]'
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

      {/* Selected Items List */}
      <SelectedItemsList 
        items={selectedItems}
        onRemove={handleItemRemove}
        showRemoveButton={true}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onItemAdd={handleItemAdd}
      />
    </div>
  )
}
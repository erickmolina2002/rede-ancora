'use client'

import React, { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import InputScreen from '../ui/InputScreen'
import { useStepFlow } from '../hooks/useStepFlow'
import { useCart } from '../contexts/CartContext'
import { budgetSteps } from '../config/budgetSteps'

export default function BudgetPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialStep = parseInt(searchParams.get('step') || '0')
  
  const { items: cartItems, getTotalItems } = useCart()
  
  const {
    currentStep,
    currentValue,
    isValid,
    canGoBack,
    updateCurrentStepData,
    nextStep,
    prevStep,
    stepData
  } = useStepFlow({
    steps: budgetSteps,
    initialStepIndex: initialStep,
    initialData: {
      selectedProducts: cartItems,
      totalProducts: getTotalItems()
    },
    onComplete: (data) => {
      console.log('Orçamento completo:', data)
      console.log('Produtos incluídos:', cartItems)
    }
  })

  const handleClose = () => {
    router.push('/')
  }

  const handleBack = () => {
    prevStep()
  }

  const handleContinue = () => {
    nextStep()
  }

  const handleSkip = () => {
    // Skip WhatsApp and go to completion
    console.log('Orçamento finalizado sem WhatsApp:', stepData)
    router.push('/')
  }

  const handleFinish = () => {
    // Complete the budget process
    console.log('Orçamento finalizado e enviado:', stepData)
    router.push('/')
  }

  // Automatically populate budgetServices step with cart items
  useEffect(() => {
    if (currentStep?.id === 'budgetServices' && cartItems.length > 0) {
      // Se estiver no step budgetServices e tiver produtos no carrinho, adicionar automaticamente
      const productsValue = cartItems.map(item => item.nomeProduto).join(', ')
      if (!currentValue || currentValue !== productsValue) {
        updateCurrentStepData(productsValue)
        console.log('Produtos adicionados automaticamente ao step budgetServices:', cartItems)
      }
    }
  }, [currentStep?.id, cartItems, currentValue, updateCurrentStepData])

  // Initialize step 3 with license plate from step 2
  useEffect(() => {
    if (currentStep?.id === 'budgetPlateConfirmation' && !currentValue && stepData.budgetDescription) {
      updateCurrentStepData(stepData.budgetDescription as string)
    }
  }, [currentStep?.id, currentValue, stepData.budgetDescription, updateCurrentStepData])

  if (!currentStep) {
    return <div>Carregando...</div>
  }

  // For confirmation step, use the license plate from step 2
  const getDisplayValue = (): string => {
    if (currentStep.id === 'budgetPlateConfirmation') {
      return currentValue || String(stepData.budgetDescription || '')
    }
    return currentValue
  }

  const getPlaceholder = (): string | undefined => {
    if (currentStep.id === 'budgetPlateConfirmation') {
      const value = stepData.budgetDescription || currentStep.placeholder
      return typeof value === 'string' ? value : value !== undefined ? String(value) : undefined
    }
    return typeof currentStep.placeholder === 'string' ? currentStep.placeholder : currentStep.placeholder !== undefined ? String(currentStep.placeholder) : undefined
  }

  return (
    <InputScreen
      title={currentStep.title}
      subtitle={currentStep.subtitle ?? undefined}
      placeholder={getPlaceholder()}
      value={getDisplayValue()}
      setValue={updateCurrentStepData}
      isValid={isValid}
      onBack={canGoBack ? handleBack : undefined}
      onClose={handleClose}
      onContinue={handleContinue}
      onSkip={handleSkip}
      onFinish={handleFinish}
      showBackButton={canGoBack}
      continueButtonText={currentStep.continueButtonText}
      inputType={currentStep.inputType}
      inputComponent={currentStep.inputComponent}
      options={currentStep.options}
      stepData={stepData}
      isLicensePlate={currentStep.id === 'budgetPlateConfirmation'}
    />
  )
}

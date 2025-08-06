'use client'

import React, { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import InputScreen from '../ui/InputScreen'
import { useStepFlow } from '../hooks/useStepFlow'
import { useProductsBudget } from '../contexts/ProductsBudgetContext'
import { budgetSteps } from '../config/budgetSteps'

function BudgetPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialStep = parseInt(searchParams.get('step') || '0')
  
  const { products, getTotalItems } = useProductsBudget()
  
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
      selectedProducts: products,
      totalProducts: getTotalItems(),
      totalAmount: products.reduce((sum, p) => sum + p.totalPrice, 0)
    },
    onComplete: (data) => {
      console.log('Orçamento completo:', data)
      console.log('Produtos incluídos:', products)
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

  // Automatically populate budgetServices step with products
  useEffect(() => {
    if (currentStep?.id === 'budgetServices' && products.length > 0) {
      // Se estiver no step budgetServices e tiver produtos no contexto, adicionar automaticamente
      const productsValue = products.map(product => product.name).join(', ')
      if (!currentValue || currentValue !== productsValue) {
        updateCurrentStepData(productsValue)
        console.log('Produtos adicionados automaticamente ao step budgetServices:', products)
      }
    }
  }, [currentStep?.id, products, currentValue, updateCurrentStepData])

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
      stepData={{
        ...stepData,
        selectedProducts: products,
        totalProducts: getTotalItems(),
        totalAmount: products.reduce((sum, p) => sum + p.totalPrice, 0)
      }}
      isLicensePlate={currentStep.id === 'budgetPlateConfirmation'}
    />
  )
}

export default function BudgetPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <BudgetPageContent />
    </Suspense>
  )
}

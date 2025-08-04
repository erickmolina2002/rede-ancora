'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import InputScreen from '../ui/InputScreen'
import { useStepFlow } from '../hooks/useStepFlow'
import { budgetSteps } from '../config/budgetSteps'

export default function BudgetPage() {
  const router = useRouter()
  
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
    onComplete: (data) => {
      console.log('Orçamento completo:', data)
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

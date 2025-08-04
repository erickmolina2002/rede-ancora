'use client'

import { useState, useCallback } from 'react'
import { StepConfig, StepData } from '../types/step'

export type UseStepFlowProps = {
  steps: StepConfig[]
  initialData?: StepData
  onComplete?: (data: StepData) => void
}

export function useStepFlow({ steps, initialData = {}, onComplete }: UseStepFlowProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [stepData, setStepData] = useState<StepData>(initialData)
  
  const currentStep = steps[currentStepIndex]
  const isFirstStep = currentStepIndex === 0
  const isLastStep = currentStepIndex === steps.length - 1
  
  const getCurrentValue = useCallback(() => {
    const value = stepData[currentStep?.id]
    return typeof value === 'string' ? value : String(value || '')
  }, [stepData, currentStep])
  
  const validateCurrentStep = useCallback(() => {
    const value = getCurrentValue()
    
    if (currentStep.required && !value.trim()) {
      return false
    }
    
    if (currentStep.validation) {
      return currentStep.validation(value)
    }
    
    return true
  }, [currentStep, getCurrentValue])
  
  const updateCurrentStepData = useCallback((value: string) => {
    setStepData(prev => ({
      ...prev,
      [currentStep.id]: value
    }))
  }, [currentStep])
  
  const nextStep = useCallback(() => {
    if (!validateCurrentStep()) {
      return false
    }
    
    if (isLastStep) {
      onComplete?.(stepData)
      return true
    }
    
    setCurrentStepIndex(prev => Math.min(prev + 1, steps.length - 1))
    return true
  }, [validateCurrentStep, isLastStep, onComplete, stepData, steps.length])
  
  const prevStep = useCallback(() => {
    if (isFirstStep) {
      return false
    }
    
    setCurrentStepIndex(prev => Math.max(prev - 1, 0))
    return true
  }, [isFirstStep])
  
  const goToStep = useCallback((stepId: string) => {
    const stepIndex = steps.findIndex(step => step.id === stepId)
    if (stepIndex !== -1) {
      setCurrentStepIndex(stepIndex)
      return true
    }
    return false
  }, [steps])
  
  const resetFlow = useCallback(() => {
    setCurrentStepIndex(0)
    setStepData(initialData)
  }, [initialData])
  
  const canGoBack = currentStep?.allowBack !== false && !isFirstStep
  const canContinue = validateCurrentStep()
  
  return {
    // Estado atual
    currentStep,
    currentStepIndex,
    totalSteps: steps.length,
    stepData,
    
    // Valores do step atual
    currentValue: getCurrentValue(),
    isValid: canContinue,
    
    // Navegação
    canGoBack,
    canContinue,
    isFirstStep,
    isLastStep,
    
    // Ações
    updateCurrentStepData,
    nextStep,
    prevStep,
    goToStep,
    resetFlow,
    
    // Progress
    progress: ((currentStepIndex + 1) / steps.length) * 100
  }
}
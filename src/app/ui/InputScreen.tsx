'use client'

import React from 'react'
import BudgetHeader from './BudgetHeader'
import TextInput from './inputs/TextInput'
import NumberInput from './inputs/NumberInput'
import SelectInput from './inputs/SelectInput'
import DateInput from './inputs/DateInput'
import CameraInput from './inputs/CameraInput'
import ItemSearchInput from './inputs/ItemSearchInput'
import BudgetConfirmationInput from './inputs/BudgetConfirmationInput'
import WhatsAppSendInput from './inputs/WhatsAppSendInput'
import Button from './Button'
import { InputComponentType } from '../types/step'

  

type InputScreenProps = {
  title: string
  subtitle?: string
  placeholder?: string
  value: string
  setValue: (value: string) => void

  isValid?: boolean

  onBack?: () => void
  onClose?: () => void
  onContinue: () => void
  onSkip?: () => void
  onFinish?: () => void

  headerTitle?: string
  showHeaderTitle?: boolean
  showBackButton?: boolean

  continueButtonText?: string

  inputType?: 'text' | 'number' | 'email' | 'tel'
  inputComponent?: InputComponentType
  options?: string[]
  autoFocus?: boolean
  stepData?: { [key: string]: string | number | boolean }
  isLicensePlate?: boolean
}

export default function InputScreen({
  title,
  subtitle,
  placeholder,
  value,
  setValue,
  isValid = true,
  onBack,
  onClose,
  onContinue,
  onSkip,
  onFinish,
  headerTitle,
  showHeaderTitle = false,
  showBackButton = false,
  continueButtonText = "Continuar",
  inputType = "text",
  inputComponent = "input",
  options = [],
  autoFocus = false,
  stepData = {},
  isLicensePlate = false
}: InputScreenProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (e.key === 'Enter' && isValid) {
      onContinue()
    }
  }

  const handleBack = () => {
    onBack?.()
  }

  const renderInputComponent = () => {
    const commonProps = {
      value,
      onChange: setValue,
      placeholder,
      autoFocus,
      onKeyDown: handleKeyDown
    }

    switch (inputComponent) {
      case 'number':
        return <NumberInput {...commonProps} currency={true} />
      
      case 'select':
        return <SelectInput {...commonProps} options={options} />
      
      case 'date':
        return <DateInput {...commonProps} />
      
      case 'camera':
        return <CameraInput {...commonProps} />
      
      case 'itemsearch':
        return <ItemSearchInput 
          value={value}
          onChange={setValue}
          placeholder={placeholder}
          autoFocus={autoFocus}
          placa={stepData?.budgetDescription as string}
        />
      
      case 'budgetconfirmation':
        return <BudgetConfirmationInput {...commonProps} stepData={stepData} />
      
      case 'whatsappsend':
        return <WhatsAppSendInput {...commonProps} stepData={stepData} onSkip={onSkip} onFinish={onFinish} />
      
      case 'input':
      default:
        return <TextInput {...commonProps} inputType={inputType} isLicensePlate={isLicensePlate} />
    }
  }

  return (
    <div className="flex flex-col h-screen bg-[#1E212472] pt-[14px]">
      <div className="bg-[#F5F5F5] rounded-t-[20px] flex flex-col flex-1">
        <BudgetHeader
          onClose={onClose}
          onBack={handleBack}
          title={headerTitle}
          showTitle={showHeaderTitle}
          showBackButton={showBackButton}
        />

        <div className="flex-1 px-6 py-8">
          <div className="space-y-6">
            <div className="text-left space-y-2">
              <h1 className="text-[32px] text-[#1E2124] leading-[38px]">{title}</h1>
              {subtitle !== null && (
                <p className={`text-[14px] text-[#1E2124] ${subtitle === '' ? 'min-h-[20px]' : ''}`}>
                  {subtitle}
                </p>
              )}
            </div>

            <div className="mt-8">
              {renderInputComponent()}
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex justify-center">
            <Button onClick={onContinue} disabled={!isValid}>
              {continueButtonText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

}
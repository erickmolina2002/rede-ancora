export type StepData = {
  [key: string]: string | number | boolean
}

export type InputComponentType = 'input' | 'number' | 'select' | 'date' | 'camera' | 'itemsearch' | 'budgetconfirmation' | 'whatsappsend' 

export type StepConfig = {
  id: string
  title: string
  subtitle?: string | null
  placeholder?: string
  inputType?: 'text' | 'number' | 'email' | 'tel'
  inputComponent?: InputComponentType
  validation?: (value: string) => boolean
  required?: boolean
  allowBack?: boolean
  continueButtonText?: string
  headerTitle?: string
  showHeaderTitle?: boolean
  options?: string[] // Para componente select
}

export type StepFlowConfig = {
  steps: StepConfig[]
  initialData?: StepData
  onComplete?: (data: StepData) => void
  onClose?: () => void
}
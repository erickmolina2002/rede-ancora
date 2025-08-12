export type StepData = {
  [key: string]: string | number | boolean | Array<{
    id: number;
    name?: string;
    nomeProduto?: string;
    totalPrice?: number;
    unitPrice?: number;
    quantity?: number;
    [key: string]: unknown;
  }> | unknown
}

export type InputComponentType = | 'input'
  | 'number'
  | 'select'
  | 'date'
  | 'camera'
  | 'itemsearch'
  | 'budgetconfirmation'
  | 'plateconfirmation'
  | 'whatsappsend'

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
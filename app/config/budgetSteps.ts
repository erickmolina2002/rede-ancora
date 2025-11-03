import { StepConfig } from '../types/step'
import { validateLicensePlate, validateMinimumItems } from '../utils/validation'

export const budgetSteps: StepConfig[] = [
  {
    id: 'budgetName',
    title: 'Insira o nome do seu novo orçamento',
    subtitle: '',
    placeholder: 'Cliente - Orçamento',
    inputType: 'text' as const,
    required: true,
    allowBack: false,
    continueButtonText: 'Continuar',
    validation: (value: string) => value.trim().length > 0
  },
  {
    id: 'budgetDescription',
    title: 'Insira a placa do veículo',
    subtitle: 'Digite ou capture com a câmera',
    placeholder: 'ABC-1234',
    inputComponent: 'camera' as const,
    required: true,
    allowBack: true,
    continueButtonText: 'Continuar',
    validation: validateLicensePlate
  },
  {
    id: 'budgetPlateConfirmation',
    title: 'Confirme a placa do veículo',
    subtitle: 'Verifique se a placa está correta e as informações do veículo',
    placeholder: 'ABC-1234',
    inputComponent: 'plateconfirmation' as const,
    required: true,
    allowBack: true,
    continueButtonText: 'Confirmar',
    validation: validateLicensePlate
  },
  {
    id: 'budgetServices',
    title: 'Adicione os produtos',
    subtitle: 'Selecione os serviços para este orçamento',
    placeholder: 'Clique para adicionar serviços',
    inputComponent: 'itemsearch' as const,
    required: true,
    allowBack: true,
    continueButtonText: 'Continuar',
    validation: validateMinimumItems
  },
  {
    id: 'budgetValue',
    title: 'O valor pelo serviço',
    subtitle: 'Adicione o valor da mão de obra',
    placeholder: 'R$ 0,00',
    inputComponent: 'number' as const,
    required: true,
    allowBack: true,
    continueButtonText: 'Continuar',
    validation: (value: string) => {
      const numValue = parseFloat(value.replace(/[^\d,]/g, '').replace(',', '.'))
      return !isNaN(numValue) && numValue > 0
    }
  },
  {
    id: 'budgetConfirmation',
    title: 'Confirmar Orçamento',
    subtitle: 'Revise os valores e finalize',
    placeholder: '',
    inputComponent: 'budgetconfirmation' as const,
    required: false,
    allowBack: true,
    continueButtonText: 'Continuar'
  },
  {
    id: 'whatsappSend',
    title: 'Enviar Proposta',
    subtitle: 'Deseja enviar o orçamento via WhatsApp?',
    placeholder: '(11) 99999-9999',
    inputComponent: 'whatsappsend' as const,
    required: false,
    allowBack: true,
    continueButtonText: 'Finalizar'
  }
]

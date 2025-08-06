/**
 * Validation utilities for the budget application
 */

/**
 * Brazilian license plate validation
 * Supports both old format (ABC-1234) and new Mercosul format (ABC1D23)
 * 
 * Pattern: ^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$
 * - 3 uppercase letters (AAA)
 * - 1 number (1)
 * - 1 letter or number (D for new format, number for old format)
 * - 2 numbers (23)
 */
export const validateLicensePlate = (plate: string): boolean => {
  if (!plate) return false
  
  // Remove any spaces, hyphens, or special characters and convert to uppercase
  const cleanPlate = plate.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
  
  // Check length
  if (cleanPlate.length !== 7) return false
  
  // Brazilian license plate regex pattern
  const licensePlateRegex = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/
  
  return licensePlateRegex.test(cleanPlate)
}

/**
 * Format license plate input as user types
 * Adds hyphen after 3rd character for readability: ABC-1234 or ABC-1D23
 */
export const formatLicensePlate = (input: string): string => {
  if (!input) return ''
  
  // Remove any non-alphanumeric characters and convert to uppercase
  let cleanInput = input.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
  
  // Limit to 7 characters maximum
  if (cleanInput.length > 7) {
    cleanInput = cleanInput.substring(0, 7)
  }
  
  // Add hyphen after 3rd character for formatting
  if (cleanInput.length > 3) {
    return `${cleanInput.substring(0, 3)}-${cleanInput.substring(3)}`
  }
  
  return cleanInput
}

/**
 * Get clean license plate without formatting characters
 */
export const getCleanLicensePlate = (plate: string): string => {
  return plate.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
}

/**
 * Validate if at least one item is selected (for step 4)
 */
export const validateMinimumItems = (value: string): boolean => {
  if (!value || value.trim() === '') return false
  
  // Check if the value indicates items were selected
  // The ItemSearchInput sets values like "2 produtos selecionados" or "2 serviços selecionados"
  const itemCountMatch = value.match(/(\d+)\s+(produtos?|serviços?)\s+selecionados?/i)
  if (itemCountMatch) {
    const count = parseInt(itemCountMatch[1], 10)
    return count >= 1
  }
  
  // Fallback: any non-empty string means items were selected
  return value.trim().length > 0
}

/**
 * Validation error messages
 */
export const ValidationMessages = {
  LICENSE_PLATE_INVALID: 'Placa deve ter formato ABC-1234 ou ABC-1D23',
  LICENSE_PLATE_REQUIRED: 'Placa é obrigatória',
  MINIMUM_ITEMS_REQUIRED: 'Selecione pelo menos um serviço',
  PHONE_INVALID: 'Número de telefone inválido',
  REQUIRED_FIELD: 'Campo obrigatório'
} as const
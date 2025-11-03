'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

export type VehicleInfo = {
  placa: string
  montadora: string
  modelo: string
  versao: string
  chassi: string
  motor: string
  combustivel: string
  cambio: string
  carroceria: string
  anoFabricacao: string
  anoModelo: string
  linha: string
  eixos: string | null
  geracao: string
}

type VehicleContextType = {
  vehicleInfo: VehicleInfo | null
  setVehicleInfo: (info: VehicleInfo | null) => void
  clearVehicleInfo: () => void
  hasVehicleInfo: () => boolean
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined)

export function VehicleProvider({ children }: { children: ReactNode }) {
  const [vehicleInfo, setVehicleInfoState] = useState<VehicleInfo | null>(null)

  const setVehicleInfo = (info: VehicleInfo | null) => {
    console.log('[VEHICLE CONTEXT] setVehicleInfo chamado com:', info)
    setVehicleInfoState(info)
  }

  const clearVehicleInfo = () => {
    console.log('[VEHICLE CONTEXT] clearVehicleInfo chamado')
    setVehicleInfoState(null)
  }

  const hasVehicleInfo = () => {
    return vehicleInfo !== null
  }

  return (
    <VehicleContext.Provider value={{
      vehicleInfo,
      setVehicleInfo,
      clearVehicleInfo,
      hasVehicleInfo
    }}>
      {children}
    </VehicleContext.Provider>
  )
}

export function useVehicle() {
  const context = useContext(VehicleContext)
  if (context === undefined) {
    throw new Error('useVehicle must be used within a VehicleProvider')
  }
  return context
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Eye, EyeOff, Check } from "lucide-react"

const steps = [
  { id: 1, title: "CPF/CNPJ", description: "Para começar, qual o seu CPF/CNPJ?" },
  { id: 2, title: "Nome", description: "Qual é o seu nome completo?" },
  { id: 3, title: "Telefone", description: "Qual o número do seu celular?" },
  { id: 4, title: "Senha", description: "Crie uma senha para entrar no aplicativo" },
]

export default function RegisterPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    document: "",
    name: "",
    phone: "",
    password: "",
  })

  const currentStepData = steps.find((s) => s.id === currentStep)!

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    } else {
      // Complete registration
      router.push("/home")
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else {
      router.back()
    }
  }

  const formatDocument = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
    }
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
  }

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
  }

  const passwordRequirements = [
    { label: "Mínimo 8 caracteres", met: formData.password.length >= 8 },
    { label: "Letras e números", met: /[a-zA-Z]/.test(formData.password) && /\d/.test(formData.password) },
    { label: "Pelo menos 1 maiúscula", met: /[A-Z]/.test(formData.password) },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-border p-4 flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={handleBack} className="rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1 mx-4">
          <div className="flex gap-1">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`h-1 flex-1 rounded-full transition-all ${
                  step.id <= currentStep ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="flex-1 p-6 flex flex-col animate-slide-up">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">{currentStepData.title}</h1>
          <p className="text-muted-foreground leading-relaxed">{currentStepData.description}</p>
        </div>

        <div className="flex-1">
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="document" className="text-sm font-medium">
                  CPF ou CNPJ
                </Label>
                <Input
                  id="document"
                  type="text"
                  placeholder="000.000.000-00"
                  value={formData.document}
                  onChange={(e) => setFormData({ ...formData, document: formatDocument(e.target.value) })}
                  className="h-14 text-lg mt-2"
                  maxLength={18}
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium">
                  Nome completo
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Digite seu nome completo"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-14 text-lg mt-2"
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="phone" className="text-sm font-medium">
                  Número do celular
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(00) 00000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: formatPhone(e.target.value) })}
                  className="h-14 text-lg mt-2"
                  maxLength={15}
                />
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="password" className="text-sm font-medium">
                  Senha do aplicativo
                </Label>
                <div className="relative mt-2">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="h-14 text-lg pr-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <Eye className="h-5 w-5 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="bg-muted/50 rounded-xl p-4 space-y-3">
                <p className="text-sm font-medium text-foreground">Senha de qualidade:</p>
                {passwordRequirements.map((req, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                        req.met ? "bg-green-500" : "bg-muted"
                      }`}
                    >
                      {req.met && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <span className={`text-sm ${req.met ? "text-foreground" : "text-muted-foreground"}`}>
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <Button
          size="lg"
          onClick={handleNext}
          className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 mt-6"
        >
          {currentStep === steps.length ? "Finalizar" : "Continuar"}
        </Button>
      </div>
    </div>
  )
}

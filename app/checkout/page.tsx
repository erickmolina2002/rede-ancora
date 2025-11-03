"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, CreditCard, Barcode, MapPin, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CheckoutPage() {
  const router = useRouter()
  const [step, setStep] = useState<"address" | "payment">("address")
  const [paymentMethod, setPaymentMethod] = useState<"credit" | "pix">("credit")

  const [addressData, setAddressData] = useState({
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
  })

  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvv: "",
  })

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    return numbers.replace(/(\d{5})(\d{3})/, "$1-$2")
  }

  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    return numbers.replace(/(\d{4})(?=\d)/g, "$1 ")
  }

  const formatExpiry = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    return numbers.replace(/(\d{2})(\d{2})/, "$1/$2")
  }

  const handleContinue = () => {
    if (step === "address") {
      setStep("payment")
    } else {
      router.push("/order-success")
    }
  }

  const orderTotal = 848.38

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-background pb-40">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-40">
        <div className="p-4 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => (step === "payment" ? setStep("address") : router.back())}
            className="rounded-full -ml-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg sm:text-xl font-bold text-foreground ml-2">Finalizar Compra</h1>
        </div>

        {/* Progress Steps */}
        <div className="px-4 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step === "address" ? "bg-primary text-white" : "bg-green-500 text-white"
                }`}
              >
                {step === "payment" ? <Check className="h-4 w-4" /> : "1"}
              </div>
              <span
                className={`text-xs sm:text-sm font-medium ${step === "address" ? "text-foreground" : "text-muted-foreground"}`}
              >
                Endereço
              </span>
            </div>
            <div className="h-0.5 flex-1 bg-border" />
            <div className="flex items-center gap-2 flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step === "payment" ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                }`}
              >
                2
              </div>
              <span
                className={`text-xs sm:text-sm font-medium ${step === "payment" ? "text-foreground" : "text-muted-foreground"}`}
              >
                Pagamento
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {step === "address" && (
          <div className="space-y-4 animate-slide-up">
            <div className="bg-white rounded-xl border border-border p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-base sm:text-lg font-bold text-foreground">Endereço de Entrega</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="cep" className="text-sm">
                    CEP
                  </Label>
                  <Input
                    id="cep"
                    type="text"
                    placeholder="00000-000"
                    value={addressData.cep}
                    onChange={(e) => setAddressData({ ...addressData, cep: formatCEP(e.target.value) })}
                    className="mt-2 h-11 text-base"
                    maxLength={9}
                  />
                </div>

                <div>
                  <Label htmlFor="street" className="text-sm">
                    Rua
                  </Label>
                  <Input
                    id="street"
                    type="text"
                    placeholder="Nome da rua"
                    value={addressData.street}
                    onChange={(e) => setAddressData({ ...addressData, street: e.target.value })}
                    className="mt-2 h-11 text-base"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label htmlFor="number" className="text-sm">
                      Número
                    </Label>
                    <Input
                      id="number"
                      type="text"
                      placeholder="123"
                      value={addressData.number}
                      onChange={(e) => setAddressData({ ...addressData, number: e.target.value })}
                      className="mt-2 h-11 text-base"
                    />
                  </div>
                  <div>
                    <Label htmlFor="complement" className="text-sm">
                      Complemento
                    </Label>
                    <Input
                      id="complement"
                      type="text"
                      placeholder="Apto..."
                      value={addressData.complement}
                      onChange={(e) => setAddressData({ ...addressData, complement: e.target.value })}
                      className="mt-2 h-11 text-base"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="neighborhood" className="text-sm">
                    Bairro
                  </Label>
                  <Input
                    id="neighborhood"
                    type="text"
                    placeholder="Nome do bairro"
                    value={addressData.neighborhood}
                    onChange={(e) => setAddressData({ ...addressData, neighborhood: e.target.value })}
                    className="mt-2 h-11 text-base"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label htmlFor="city" className="text-sm">
                      Cidade
                    </Label>
                    <Input
                      id="city"
                      type="text"
                      placeholder="Cidade"
                      value={addressData.city}
                      onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
                      className="mt-2 h-11 text-base"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state" className="text-sm">
                      Estado
                    </Label>
                    <Input
                      id="state"
                      type="text"
                      placeholder="UF"
                      value={addressData.state}
                      onChange={(e) => setAddressData({ ...addressData, state: e.target.value.toUpperCase() })}
                      className="mt-2 h-11 text-base"
                      maxLength={2}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === "payment" && (
          <div className="space-y-4 animate-slide-up">
            <div className="bg-white rounded-xl border border-border p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-bold text-foreground mb-6">Forma de Pagamento</h2>

              <Tabs value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as "credit" | "pix")}>
                <TabsList className="w-full grid grid-cols-2 mb-6 h-11">
                  <TabsTrigger value="credit" className="flex items-center gap-2 text-sm">
                    <CreditCard className="h-4 w-4" />
                    Cartão
                  </TabsTrigger>
                  <TabsTrigger value="pix" className="flex items-center gap-2 text-sm">
                    <Barcode className="h-4 w-4" />
                    PIX
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="credit" className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber" className="text-sm">
                      Número do Cartão
                    </Label>
                    <Input
                      id="cardNumber"
                      type="text"
                      placeholder="0000 0000 0000 0000"
                      value={paymentData.cardNumber}
                      onChange={(e) => setPaymentData({ ...paymentData, cardNumber: formatCardNumber(e.target.value) })}
                      className="mt-2 h-11 text-base"
                      maxLength={19}
                    />
                  </div>

                  <div>
                    <Label htmlFor="cardName" className="text-sm">
                      Nome no Cartão
                    </Label>
                    <Input
                      id="cardName"
                      type="text"
                      placeholder="Nome como está no cartão"
                      value={paymentData.cardName}
                      onChange={(e) => setPaymentData({ ...paymentData, cardName: e.target.value.toUpperCase() })}
                      className="mt-2 h-11 text-base"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label htmlFor="cardExpiry" className="text-sm">
                        Validade
                      </Label>
                      <Input
                        id="cardExpiry"
                        type="text"
                        placeholder="MM/AA"
                        value={paymentData.cardExpiry}
                        onChange={(e) => setPaymentData({ ...paymentData, cardExpiry: formatExpiry(e.target.value) })}
                        className="mt-2 h-11 text-base"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardCvv" className="text-sm">
                        CVV
                      </Label>
                      <Input
                        id="cardCvv"
                        type="text"
                        placeholder="000"
                        value={paymentData.cardCvv}
                        onChange={(e) => setPaymentData({ ...paymentData, cardCvv: e.target.value.replace(/\D/g, "") })}
                        className="mt-2 h-11 text-base"
                        maxLength={3}
                      />
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4 mt-4">
                    <p className="text-sm font-medium text-foreground mb-3">Parcelamento</p>
                    <RadioGroup defaultValue="1x">
                      <div className="flex items-center space-x-2 py-2">
                        <RadioGroupItem value="1x" id="1x" />
                        <Label htmlFor="1x" className="flex-1 cursor-pointer text-sm">
                          1x de {formatPrice(orderTotal)} sem juros
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 py-2">
                        <RadioGroupItem value="2x" id="2x" />
                        <Label htmlFor="2x" className="flex-1 cursor-pointer text-sm">
                          2x de {formatPrice(orderTotal / 2)} sem juros
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 py-2">
                        <RadioGroupItem value="3x" id="3x" />
                        <Label htmlFor="3x" className="flex-1 cursor-pointer text-sm">
                          3x de {formatPrice(orderTotal / 3)} sem juros
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </TabsContent>

                <TabsContent value="pix" className="space-y-4">
                  <div className="bg-muted/50 rounded-lg p-6 text-center">
                    <div className="w-40 h-40 sm:w-48 sm:h-48 bg-white rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <div className="text-5xl sm:text-6xl">📱</div>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                      Após confirmar, você receberá o QR Code para pagamento
                    </p>
                    <p className="text-lg sm:text-xl font-bold text-primary">{formatPrice(orderTotal)}</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border p-4 z-40 safe-area-bottom">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs sm:text-sm text-muted-foreground">Total a pagar</span>
            <span className="text-xl sm:text-2xl font-bold text-primary">{formatPrice(orderTotal)}</span>
          </div>
          <Button
            size="lg"
            className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold bg-primary hover:bg-primary/90"
            onClick={handleContinue}
          >
            {step === "address" ? "Continuar" : "Confirmar Pagamento"}
          </Button>
        </div>
      </div>
    </div>
  )
}

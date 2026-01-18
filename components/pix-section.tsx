"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { QrCode, Copy, Check, Heart } from "lucide-react"
import { generatePixPayload } from "@/lib/pix-generator"

export function PixSection() {
  const [pixAmount, setPixAmount] = useState("")
  const [copied, setCopied] = useState(false)
  const pixKey = "seuemail@exemplo.com"
  const recipientName = "Nome do Casal"

  const pixCode = pixAmount ? generatePixPayload(pixKey, recipientName, Number.parseFloat(pixAmount)) : ""

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-serif font-semibold mb-3 text-foreground">Contribuição via PIX</h2>
        <p className="text-muted-foreground text-pretty">
          Prefere fazer uma contribuição em dinheiro? Você pode nos enviar um PIX com o valor que desejar!
        </p>
      </div>

      <Card className="border-border/60 bg-card/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/20 border border-accent/30">
              <QrCode className="h-4 w-4 text-accent" />
            </div>
            Enviar PIX
          </CardTitle>
          <CardDescription>Insira o valor que deseja contribuir e copie o código PIX Copia e Cola</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="pix-amount">Valor da Contribuição (R$)</Label>
            <Input
              id="pix-amount"
              type="number"
              placeholder="0,00"
              value={pixAmount}
              onChange={(e) => setPixAmount(e.target.value)}
              min="0"
              step="0.01"
              className="bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <Label>Chave PIX</Label>
            <div className="flex gap-2">
              <Input value={pixKey} readOnly className="font-mono text-sm bg-background/50" />
              <Button variant="outline" size="icon" onClick={() => handleCopy(pixKey)} className="shrink-0">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {pixCode && (
            <div className="space-y-2">
              <Label>PIX Copia e Cola</Label>
              <div className="flex gap-2">
                <Input value={pixCode} readOnly className="font-mono text-xs bg-background/50" />
                <Button variant="outline" size="icon" onClick={() => handleCopy(pixCode)} className="shrink-0">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Copie este código e cole no seu aplicativo bancário para realizar o pagamento
              </p>
            </div>
          )}

          <Button
            className="w-full gap-2"
            size="lg"
            disabled={!pixAmount || Number.parseFloat(pixAmount) <= 0}
            onClick={() => handleCopy(pixCode)}
          >
            <Heart className="h-4 w-4" />
            {copied ? "Código Copiado!" : "Copiar Código PIX"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

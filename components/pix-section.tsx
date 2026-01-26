"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, Check, Heart, Smartphone, ExternalLink } from "lucide-react"
import { generatePixPayload } from "@/lib/pix-generator"

export function PixSection() {
  const [copied, setCopied] = useState(false)
  const [copiedPixCode, setCopiedPixCode] = useState(false)
  const [customAmount, setCustomAmount] = useState("")
  
  const pixKey = "mirian_sdf@hotmail.com"
  const recipientName = "Mirian"
  const recipientCity = "São Paulo"

  const handleCopyKey = () => {
    navigator.clipboard.writeText(pixKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCopyPixCode = () => {
    const amount = Number.parseFloat(customAmount) || 0
    if (amount <= 0) {
      alert("Por favor, insira um valor válido")
      return
    }

    const pixCode = generatePixPayload(pixKey, amount, recipientName, recipientCity)

    navigator.clipboard.writeText(pixCode)
    setCopiedPixCode(true)
    setTimeout(() => setCopiedPixCode(false), 2000)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-serif font-semibold mb-3 text-foreground">Contribuição via PIX</h2>
        <p className="text-muted-foreground text-pretty">
          Prefere fazer uma contribuição em dinheiro? Você pode nos enviar um PIX com o valor que desejar!
        </p>
      </div>

      <div className="space-y-4">
        {/* PIX Key Card */}
        <Card className="border-border/60 bg-card/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif text-lg">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 border border-accent/30">
                <Smartphone className="h-4 w-4 text-accent" />
              </div>
              Chave PIX
            </CardTitle>
            <CardDescription>Use a chave abaixo para fazer PIX diretamente pelo seu banco</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pix-amount">Valor da Contribuição (R$)</Label>
              <Input
                id="pix-amount"
                type="number"
                inputMode="decimal"
                pattern="[0-9]*"
                placeholder="0,00"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="bg-background/50"
              />
              <p className="text-xs text-muted-foreground">
                💝 Sugerimos contribuições a partir de R$ 50,00, mas qualquer valor será muito apreciado!
              </p>
            </div>

            <div className="space-y-2">
              <Label>Chave PIX (E-mail)</Label>
              <div className="flex gap-2">
                <Input value={pixKey} readOnly className="font-mono text-sm bg-background/50" />
                <Button variant="outline" size="icon" onClick={handleCopyKey} className="shrink-0">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Copie esta chave e faça o PIX pelo app do seu banco
              </p>
            </div>

            <div className="space-y-2">
              <Label>PIX Copia e Cola</Label>
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={handleCopyPixCode}
                disabled={!customAmount || Number.parseFloat(customAmount) <= 0}
              >
                {copiedPixCode ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Código Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Gerar e Copiar Código PIX
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground">
                Cole o código no seu app bancário para pagar com um clique
              </p>
            </div>

            {/* Instructions */}
            <div className="space-y-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
              <h4 className="font-medium text-sm text-foreground">Como funciona?</h4>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Defina o valor da contribuição</li>
                <li>Clique em "Gerar e Copiar Código PIX"</li>
                <li>Abra seu aplicativo bancário</li>
                <li>Cole o código PIX ou use a chave manualmente</li>
                <li>Confirme a transferência</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

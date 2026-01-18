"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, Check, Heart, Smartphone, ExternalLink } from "lucide-react"

export function PixSection() {
  const [copied, setCopied] = useState(false)
  
  const nubankLink = "https://nubank.com.br/cobrar/jx1qs/696d4df7-dc44-4d31-92e3-07d4b56fa81f"
  const pixKey = "41504964802"
  const recipientName = "Antonio Pires Felipe"
  const recipientCity = "São Paulo"

  const handleCopyKey = () => {
    navigator.clipboard.writeText(pixKey)
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

      <div className="space-y-4">
        {/* Nubank Link Card - Primary Option */}
        <Card className="border-border/60 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-500/20 border border-purple-500/30">
                <Heart className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              Opção Recomendada - Nubank
            </CardTitle>
            <CardDescription>Clique no botão para abrir a cobrança e inserir o valor desejado</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 p-4 bg-white/50 dark:bg-black/20 rounded-lg">
              <div>
                <p className="text-xs text-muted-foreground">Beneficiário</p>
                <p className="text-sm font-medium">{recipientName}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Cidade</p>
                <p className="text-sm font-medium">{recipientCity}</p>
              </div>
            </div>

            <a href={nubankLink} target="_blank" rel="noopener noreferrer" className="block">
              <Button className="w-full gap-2 bg-purple-600 hover:bg-purple-700" size="lg">
                <ExternalLink className="h-4 w-4" />
                Abrir Cobrança Nubank
              </Button>
            </a>

            <p className="text-xs text-center text-muted-foreground">
              Você será redirecionado para o Nubank onde poderá inserir qualquer valor
            </p>
          </CardContent>
        </Card>

        {/* Alternative PIX Key Card */}
        <Card className="border-border/60 bg-card/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif text-lg">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 border border-accent/30">
                <Smartphone className="h-4 w-4 text-accent" />
              </div>
              Opção Alternativa - Chave PIX
            </CardTitle>
            <CardDescription>Use esta opção se preferir fazer PIX diretamente pelo seu banco</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Chave PIX (CPF)</Label>
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

            {/* Instructions */}
            <div className="space-y-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
              <div className="flex items-start gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-xs font-bold shrink-0">
                  1
                </div>
                <p className="text-sm">Abra o app do seu banco e acesse a área PIX</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-xs font-bold shrink-0">
                  2
                </div>
                <p className="text-sm">Cole a chave PIX (CPF) copiada acima</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-xs font-bold shrink-0">
                  3
                </div>
                <p className="text-sm">Insira o valor desejado e confirme o pagamento</p>
              </div>
            </div>

            <Button
              className="w-full gap-2"
              size="lg"
              variant="outline"
              onClick={handleCopyKey}
            >
              <Copy className="h-4 w-4" />
              {copied ? "Chave Copiada!" : "Copiar Chave PIX"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

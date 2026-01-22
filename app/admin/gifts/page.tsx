"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Gift, Plus, Pencil, Trash2, Upload, Link as LinkIcon, ArrowLeft } from "lucide-react"
import { getGifts, createGift, updateGift, deleteGift, uploadGiftImage, type GiftData } from "@/lib/gifts-storage"
import type { Gift as GiftType } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import Image from "next/image"

const categories = ["Sala", "Cozinha", "Quarto", "Banheiro", "Limpeza", "Outros"]

export default function GiftsManagement() {
  const [gifts, setGifts] = useState<GiftType[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingGift, setEditingGift] = useState<GiftType | null>(null)
  const [imageMode, setImageMode] = useState<"url" | "upload">("url")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState<GiftData>({
    name: "",
    description: "",
    image: "",
    category: "Cozinha",
    price: 0,
    isOpenValue: false,
  })

  useEffect(() => {
    loadGifts()
  }, [])

  const loadGifts = async () => {
    setLoading(true)
    const data = await getGifts()
    setGifts(data)
    setLoading(false)
  }

  const handleOpenDialog = (gift?: GiftType) => {
    if (gift) {
      setEditingGift(gift)
      setFormData({
        name: gift.name,
        description: gift.description,
        image: gift.image,
        category: gift.category,
        price: gift.price,
        isOpenValue: gift.isOpenValue || false,
      })
    } else {
      setEditingGift(null)
      setFormData({
        name: "",
        description: "",
        image: "",
        category: "Cozinha",
        price: 0,
        isOpenValue: false,
      })
    }
    setImageFile(null)
    setImageMode("url")
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditingGift(null)
    setImageFile(null)
    setImageMode("url")
  }

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Arquivo muito grande",
          description: "A imagem deve ter no máximo 5MB",
          variant: "destructive",
        })
        return
      }
      setImageFile(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    try {
      let imageUrl = formData.image

      // Upload image if file is selected
      if (imageMode === "upload" && imageFile) {
        const tempId = editingGift?.id || crypto.randomUUID()
        const uploadResult = await uploadGiftImage(imageFile, tempId)
        
        if (!uploadResult.success || !uploadResult.url) {
          toast({
            title: "Erro ao fazer upload",
            description: uploadResult.error || "Tente novamente",
            variant: "destructive",
          })
          setUploading(false)
          return
        }
        
        imageUrl = uploadResult.url
      }

      const dataToSave = {
        ...formData,
        image: imageUrl,
        price: formData.isOpenValue ? undefined : formData.price,
      }

      let result
      if (editingGift) {
        result = await updateGift(editingGift.id, dataToSave)
      } else {
        result = await createGift(dataToSave)
      }

      if (result.success) {
        toast({
          title: editingGift ? "Presente atualizado!" : "Presente criado!",
          description: `${formData.name} foi ${editingGift ? "atualizado" : "adicionado"} com sucesso.`,
        })
        loadGifts()
        handleCloseDialog()
      } else {
        toast({
          title: "Erro",
          description: result.error || "Tente novamente",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro inesperado",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (gift: GiftType) => {
    if (!confirm(`Tem certeza que deseja excluir "${gift.name}"?`)) {
      return
    }

    const result = await deleteGift(gift.id)
    if (result.success) {
      toast({
        title: "Presente excluído",
        description: `${gift.name} foi removido com sucesso.`,
      })
      loadGifts()
    } else {
      toast({
        title: "Erro ao excluir",
        description: result.error || "Tente novamente",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Link href="/admin" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-2">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar ao Dashboard
          </Link>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Gift className="h-8 w-8 text-amber-500" />
            Gerenciar Presentes
          </h1>
          <p className="text-muted-foreground">
            Adicione, edite ou remova presentes da lista
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} size="lg">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Presente
        </Button>
      </div>

      {loading ? (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">Carregando presentes...</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {gifts.map((gift) => (
            <Card key={gift.id} className="overflow-hidden">
              <div className="relative h-48 bg-muted">
                <Image
                  src={gift.image}
                  alt={gift.name}
                  fill
                  className="object-cover"
                  unoptimized={gift.image.startsWith("http")}
                />
              </div>
              <CardHeader>
                <CardTitle className="flex items-start justify-between gap-2">
                  <span className="line-clamp-1">{gift.name}</span>
                  <Badge variant="outline">{gift.category}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">{gift.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">
                    {gift.isOpenValue ? "Valor livre" : `R$ ${gift.price?.toFixed(2)}`}
                  </span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleOpenDialog(gift)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(gift)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && gifts.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-2">
              <Gift className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground">Nenhum presente cadastrado ainda</p>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Primeiro Presente
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingGift ? "Editar Presente" : "Adicionar Presente"}</DialogTitle>
            <DialogDescription>
              {editingGift
                ? "Atualize as informações do presente"
                : "Preencha os dados do novo presente"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Liquidificador"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descreva o presente..."
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Imagem *</Label>
              <div className="flex gap-2 mb-2">
                <Button
                  type="button"
                  variant={imageMode === "url" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setImageMode("url")}
                >
                  <LinkIcon className="h-4 w-4 mr-2" />
                  URL
                </Button>
                <Button
                  type="button"
                  variant={imageMode === "upload" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setImageMode("upload")}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </div>

              {imageMode === "url" ? (
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://exemplo.com/imagem.jpg"
                  required={imageMode === "url"}
                />
              ) : (
                <div className="space-y-2">
                  <Input
                    id="imageFile"
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    required={imageMode === "upload" && !editingGift}
                  />
                  {imageFile && (
                    <p className="text-sm text-muted-foreground">
                      Arquivo selecionado: {imageFile.name}
                    </p>
                  )}
                  {editingGift && !imageFile && (
                    <p className="text-sm text-muted-foreground">
                      Imagem atual será mantida se nenhum arquivo for selecionado
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isOpenValue"
                checked={formData.isOpenValue}
                onChange={(e) => setFormData({ ...formData, isOpenValue: e.target.checked })}
                className="h-4 w-4"
              />
              <Label htmlFor="isOpenValue" className="cursor-pointer">
                Valor livre (contribuição)
              </Label>
            </div>

            {!formData.isOpenValue && (
              <div className="space-y-2">
                <Label htmlFor="price">Preço (R$) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  placeholder="0.00"
                  required={!formData.isOpenValue}
                />
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancelar
              </Button>
              <Button type="submit" disabled={uploading}>
                {uploading ? "Salvando..." : editingGift ? "Atualizar" : "Adicionar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

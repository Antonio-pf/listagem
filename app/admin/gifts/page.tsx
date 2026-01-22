"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Gift, Plus, Pencil, Trash2, Upload, Link as LinkIcon, ArrowLeft, Search } from "lucide-react"
import { getGifts, createGift, updateGift, deleteGift, uploadGiftImage, type GiftData } from "@/lib/gifts-storage"
import type { Gift as GiftType } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

const categories = ["Sala", "Cozinha", "Quarto", "Banheiro", "Limpeza", "Outros"]

export default function GiftsManagement() {
  const [gifts, setGifts] = useState<GiftType[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingGift, setEditingGift] = useState<GiftType | null>(null)
  const [imageMode, setImageMode] = useState<"url" | "upload">("url")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
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

  // Filter gifts based on search term
  const filteredGifts = useMemo(() => {
    if (!searchTerm.trim()) return gifts
    
    const lowerSearch = searchTerm.toLowerCase()
    return gifts.filter(gift => 
      gift.name.toLowerCase().includes(lowerSearch) ||
      gift.description.toLowerCase().includes(lowerSearch) ||
      gift.category.toLowerCase().includes(lowerSearch)
    )
  }, [gifts, searchTerm])

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
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1 w-full sm:w-auto">
          <Link href="/admin" className="flex items-center text-xs sm:text-sm text-muted-foreground hover:text-foreground mb-2">
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            Voltar ao Dashboard
          </Link>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Gift className="h-6 w-6 sm:h-8 sm:w-8 text-amber-500" />
            Gerenciar Presentes
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Adicione, edite ou remova presentes da lista
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} size="lg" className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          <span className="text-sm sm:text-base">Adicionar Presente</span>
        </Button>
      </div>

      {/* Search Filter */}
      <Card>
        <CardContent className="pt-4 sm:pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar por nome, descrição ou categoria..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-sm sm:text-base"
            />
          </div>
          {searchTerm && (
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
              {filteredGifts.length} {filteredGifts.length === 1 ? 'presente encontrado' : 'presentes encontrados'}
            </p>
          )}
        </CardContent>
      </Card>

      {loading ? (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground text-sm sm:text-base">Carregando presentes...</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredGifts.map((gift) => (
            <Card key={gift.id} className="overflow-hidden">
              <div className="relative h-40 sm:h-48 bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={gift.image}
                  alt={gift.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader className="p-3 sm:p-6">
                <CardTitle className="flex items-start justify-between gap-2 text-sm sm:text-base">
                  <span className="line-clamp-1">{gift.name}</span>
                  <Badge variant="outline" className="text-xs flex-shrink-0">{gift.category}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-3 sm:p-6 pt-0">
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{gift.description}</p>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm sm:text-lg font-bold">
                    {gift.isOpenValue ? "Valor livre" : `R$ ${gift.price?.toFixed(2)}`}
                  </span>
                  <div className="flex gap-1 sm:gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleOpenDialog(gift)} className="h-8 w-8 p-0">
                      <Pencil className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(gift)} className="h-8 w-8 p-0">
                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && searchTerm && filteredGifts.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-2">
              <Search className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-muted-foreground" />
              <p className="text-sm sm:text-base text-muted-foreground">Nenhum presente encontrado com "{searchTerm}"</p>
              <Button variant="outline" onClick={() => setSearchTerm("")} className="text-xs sm:text-sm">
                Limpar pesquisa
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!loading && !searchTerm && gifts.length === 0 && (
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
        <DialogContent className="max-w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">{editingGift ? "Editar Presente" : "Adicionar Presente"}</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              {editingGift
                ? "Atualize as informações do presente"
                : "Preencha os dados do novo presente"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs sm:text-sm">Nome *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Liquidificador"
                className="text-sm sm:text-base"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-xs sm:text-sm">Descrição *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descreva o presente..."
                className="text-sm sm:text-base"
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-xs sm:text-sm">Categoria *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger className="text-sm sm:text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat} className="text-sm sm:text-base">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs sm:text-sm">Imagem *</Label>
              <div className="flex gap-1 sm:gap-2 mb-2">
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
                  className="text-sm sm:text-base"
                  required={imageMode === "url"}
                />
              ) : (
                <div className="space-y-2">
                  <Input
                    id="imageFile"
                    type="file"
                    accept="image/*"
                    className="text-sm sm:text-base"
                    onChange={handleImageFileChange}
                    required={imageMode === "upload" && !editingGift}
                  />
                  {imageFile && (
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Arquivo selecionado: {imageFile.name}
                    </p>
                  )}
                  {editingGift && !imageFile && (
                    <p className="text-xs sm:text-sm text-muted-foreground">
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
              <Label htmlFor="isOpenValue" className="cursor-pointer text-xs sm:text-sm">
                Valor livre (contribuição)
              </Label>
            </div>

            {!formData.isOpenValue && (
              <div className="space-y-2">
                <Label htmlFor="price" className="text-xs sm:text-sm">Preço (R$) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  placeholder="0.00"
                  className="text-sm sm:text-base"
                  required={!formData.isOpenValue}
                />
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={handleCloseDialog} className="w-full sm:w-auto text-xs sm:text-sm">
                Cancelar
              </Button>
              <Button type="submit" disabled={uploading} className="w-full sm:w-auto text-xs sm:text-sm">
                {uploading ? "Salvando..." : editingGift ? "Atualizar" : "Adicionar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

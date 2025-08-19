import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Camera, Calendar, Mail, CheckCircle } from "lucide-react";
import { updateProfessionalImageUrl, type Professional } from "@/services/profissional/profissional.service";
import { formatDate } from "@/util";
import { uploadFile } from '@/services/api-client';
import toast from "react-hot-toast";

interface ProfileHeaderProps {
  user: Professional; 
  onImageUpdated: (newImageUrl: string) => void;
}

export default function ProfessionalHeader({ user, onImageUpdated }: ProfileHeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const defaultBanner = '/banner-profissional.png';
  const defaultAvatar = '/user.png';

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file && !file.type.startsWith('image/')) {
      toast.error("Por favor, selecione um arquivo de imagem válido (ex: .jpg, .png).");
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);

    try {
      const data = await uploadFile('/upload', selectedFile);
      if (data && data.url) {
        await updateProfessionalImageUrl(user.id, data.url);
        onImageUpdated(data.url);
        toast.success("Foto de perfil atualizada com sucesso!");
        console.log("Upload de foto concluído. A nova URL é:", data.url);
      } else {
        toast.error("Erro: Dados de upload inválidos.");
        console.error("Erro: Dados de upload inválidos.");
      }
    } catch (error) {
      toast.error("Erro durante o upload da foto.");
      console.error("Erro durante o upload:", error);
    } finally {
      setIsUploading(false);
      setIsModalOpen(false);
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };
  
  return (
    <Card className="overflow-hidden">
      <div
        className="relative h-48 rounded-t-lg bg-cover bg-center -mx-6 -mt-6"
        style={{
          backgroundImage: `url(${defaultBanner})`,
        }}
      >
        <div className="absolute inset-0 rounded-t-lg bg-black/40"></div>
      </div>
      
      <CardContent className="-mt-24 p-6 relative z-10">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
          <div className="relative">
            <Avatar className="h-24 w-24 border-4 border-white">
              <AvatarImage src={user.profileImage || defaultAvatar} alt="Profile" />
              <AvatarFallback className="text-2xl">
                {user.fullName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <Button
              size="icon"
              variant="outline"
              className="absolute -right-2 -bottom-2 h-8 w-8 rounded-full"
              onClick={() => setIsModalOpen(true)}
            >
              <Camera />
            </Button>
          </div>
       
          <div className="flex-1 space-y-2 mt-14">
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <h1 className="text-2xl font-bold text-white md:text-black">{user.fullName}</h1>
              <Badge
                variant="secondary"
                className="flex items-center gap-1 border border-blue-500 bg-blue-50 text-blue-600"
              >
                <CheckCircle className="h-4 w-4 text-blue-500" />
              </Badge>
            </div>
           
            <p className="text-muted-foreground">{user.desiredPosition?.label}</p>
            <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Mail className="size-4" />
                {user.email}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="size-4" />
                Criado em { formatDate(user.createdAt)}
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Atualizar foto de perfil</DialogTitle>
            <DialogDescription>
              Selecione uma nova imagem para seu perfil.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {previewUrl && (
              <div className="flex justify-center">
                <img src={previewUrl} alt="Pré-visualização do perfil" className="w-32 h-32 rounded-full object-cover" />
              </div>
            )}
            <input 
              type="file" 
              className="file:rounded-md file:border-0 file:bg-blue-500 file:text-white file:px-4 file:py-2 hover:file:bg-blue-600"
              // Adiciona o atributo 'accept' para restringir a seleção a imagens
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost" disabled={isUploading}>
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={!selectedFile || isUploading} onClick={handleUpload}>
              {isUploading ? "Enviando..." : "Salvar Foto"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

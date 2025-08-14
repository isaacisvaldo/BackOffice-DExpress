import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Calendar, Mail, CheckCircle } from "lucide-react";
import type { Professional } from "@/services/profissional/profissional.service";


interface ProfileHeaderProps {
  user: Professional; 
}

export default function ProfessionalHeader({ user }: ProfileHeaderProps) {
  const defaultBanner = '/banner-profissional.png';
  const defaultAvatar = '/user.png';
  
  return (
    <Card className="overflow-hidden">
      {/* Container com imagem de fundo */}
      <div
        className="relative h-48 rounded-t-lg bg-cover bg-center -mx-6 -mt-6"
        style={{
          // ✅ Caminho corrigido e fallback para a imagem padrão
          backgroundImage: `url(${ defaultBanner})`,
        }}
      >
        <div className="absolute inset-0 rounded-t-lg bg-black/40"></div>
      </div>
      
      <CardContent className="-mt-24 p-6 relative z-10">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
          <div className="relative">
            <Avatar className="h-24 w-24 border-4 border-white">
              {/* ✅ Caminho corrigido e fallback para a imagem padrão */}
              <AvatarImage src={user.profileImage || defaultAvatar} alt="Profile" />
              <AvatarFallback className="text-2xl">
                {user.fullName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              variant="outline"
              className="absolute -right-2 -bottom-2 h-8 w-8 rounded-full"
            >
              <Camera />
            </Button>
          </div>
          {/* ✅ Espaçamento ajustado no container principal */}
          <div className="flex-1 space-y-2 mt-14">
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <h1 className="text-2xl font-bold text-white md:text-black">{user.fullName}</h1>
              <Badge
                variant="secondary"
                className="flex items-center gap-1 border border-blue-500 bg-blue-50 text-blue-600"
              >
                <CheckCircle className="h-4 w-4 text-blue-500" />
                {/* ✅ A badge agora exibe o perfil do usuário */}
             
              </Badge>
            </div>
            {/* ✅ Adicionei a linha de descrição do perfil */}
            <p className="text-muted-foreground">{user.desiredPosition.label}</p>
            <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Mail className="size-4" />
                {user.email}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="size-4" />
                Criado em {new Date(user.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
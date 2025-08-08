import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Calendar, Mail, MapPin, CheckCircle } from "lucide-react";

// ✅ Importa as interfaces corretas
import { type AdminUser } from "@/services/admin/admin.service";

interface ProfileHeaderProps {
  user: AdminUser;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
          <div className="relative">
            <Avatar className="h-24 w-24">
              {/* O `user.avatar` pode ser usado aqui se a sua API o fornecer */}
              <AvatarImage src="https://bundui-images.netlify.app/avatars/08.png" alt="Profile" />
              <AvatarFallback className="text-2xl">
                {user.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              variant="outline"
              className="absolute -right-2 -bottom-2 h-8 w-8 rounded-full">
              <Camera />
            </Button>
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              {/* ✅ A badge agora exibe o label do perfil */}
              <Badge
                variant="secondary"
                className="flex items-center gap-1 border border-blue-500 bg-blue-50 text-blue-600"
              >
                <CheckCircle className="h-4 w-4 text-blue-500" />
                {user.profile.label}
              </Badge>
            </div>
            {/* ✅ A descrição agora exibe o nome do perfil */}
            <p className="text-muted-foreground">{user.profile.name}</p>
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

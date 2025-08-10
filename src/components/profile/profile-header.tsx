import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Calendar, Mail, CheckCircle } from "lucide-react";

import { type AdminUser } from "@/services/admin/admin.service";

interface ProfileHeaderProps {
  user: AdminUser;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <Card className="overflow-hidden">
      {/* Container com imagem de fundo, agora preenchendo o Card */}
      <div
        className="relative h-48 rounded-t-lg bg-cover bg-center -mx-6 -mt-6"
        style={{
          backgroundImage: "url('/banner.png')",
        }}
      >
        <div className="absolute inset-0 rounded-t-lg bg-black/40"></div>
      </div>
      
      <CardContent className="-mt-24 p-6 relative z-10">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
          <div className="relative">
            <Avatar className="h-24 w-24 border-4 border-white">
              <AvatarImage src="/user.png" alt="Profile" />
              <AvatarFallback className="text-2xl">
                {user.name.slice(0, 2).toUpperCase()}
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
          {/* ✅ O espaço agora é criado com 'mt-16' no container principal */}
          <div className="flex-1 space-y-2 mt-14">
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <h1 className="text-2xl font-bold text-white md:text-black">{user.name}</h1>
              <Badge
                variant="secondary"
                className="flex items-center gap-1 border border-blue-500 bg-blue-50 text-blue-600"
              >
                <CheckCircle className="h-4 w-4 text-blue-500" />
               
              </Badge>
            </div>
            <p className="text-muted-foreground " >{user.profile.label}</p>
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
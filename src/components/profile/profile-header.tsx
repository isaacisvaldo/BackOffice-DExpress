import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Calendar, Mail, MapPin, CheckCircle } from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  numberphone: string;
  isActive: boolean;
  identityNumber: string;
  gender: "MALE" | "FEMALE" | "OTHER"; // ou string, se preferir não fixar
  birthDate: Date | string;
  email: string;
  avatar?: string | null;
  role: string; // Pode ser mais restrito se você tiver enums de roles
  createdAt: Date | string;
  updatedAt: Date | string;

  // Relacionamentos
  permissions: string[];
  accountSettings: any[];         // pode tipar depois, ex.: AccountSettings[]
  notificationSettings: any[];    // idem
  securitySettings: any[];        // idem
}
interface ProfileHeaderProps {
  user: UserProfile;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src="https://bundui-images.netlify.app/avatars/08.png" alt="Profile" />
              <AvatarFallback className="text-2xl">JD</AvatarFallback>
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
              <Badge
                variant="secondary"
                className="flex items-center gap-1 border border-blue-500 bg-blue-50 text-blue-600"
              >
                <CheckCircle className="h-4 w-4 text-blue-500" />

              </Badge>
            </div>
            <p className="text-muted-foreground"> {user.role}</p>
            <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Mail className="size-4" />
                {user.email}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="size-4" />
                San Francisco, CA
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

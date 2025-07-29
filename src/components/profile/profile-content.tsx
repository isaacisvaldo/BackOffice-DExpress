import { useState } from "react";
import { Key, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";

interface UserProfile {
  id: string;
  name: string;
  numberphone: string;
  isActive: boolean;
  identityNumber: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  birthDate: Date | string;
  email: string;
  avatar?: string | null;
  role: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  permissions: string[];
  accountSettings: any[];
  notificationSettings: any[];
  securitySettings: any[];
}

export default function ProfileContent({ user }: { user: UserProfile }) {
  const formatDate = (date: Date | string): string => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toISOString().split("T")[0];
  };

  const [profile, setProfile] = useState({
    name: user.name,
    email: user.email,
    phone: user.numberphone,
    identityNumber: user.identityNumber,
    gender: user.gender,
    birthDate: formatDate(user.birthDate),
    role: user.role,
    bio: "",
    location: "",
  });

  const [permissions, setPermissions] = useState<string[]>(user.permissions || []);
  const [newPermission, setNewPermission] = useState<string>("");

  const [securitySettings, setSecuritySettings] = useState({
    loginNotifications: user.securitySettings?.[0]?.loginNotifications ?? false,
  });

  const [notifications, setNotifications] = useState({
    email: user.notificationSettings?.[0]?.email ?? true,
    push: user.notificationSettings?.[0]?.push ?? false,
    marketing: user.notificationSettings?.[0]?.marketing ?? false,
    weekly: user.notificationSettings?.[0]?.weekly ?? false,
  });

  // Funções de salvamento
  const handleProfileSubmit = () => {
    console.log("Salvar perfil", profile);
    
  };

  const handleAccountSubmit = () => {
    console.log("Salvar permissões", permissions);
   
  };

  const handleSecuritySubmit = () => {
    console.log("Salvar segurança", securitySettings);
  
  };

  const handleNotificationsSubmit = () => {
    console.log("Salvar notificações", notifications);
  
  };

  return (
    <Tabs defaultValue="personal" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="personal">Pessoal</TabsTrigger>
        <TabsTrigger value="account">Conta</TabsTrigger>
        <TabsTrigger value="security">Segurança</TabsTrigger>
        <TabsTrigger value="notifications">Notificações</TabsTrigger>
      </TabsList>

      {/* Aba Pessoal */}
      <TabsContent value="personal">
        <Card>
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>Atualize seus dados de perfil e identidade.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name" className="mb-2 block">Nome Completo</Label>
                <Input id="name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="email" className="mb-2 block">E-mail</Label>
                <Input id="email" type="email" value={profile.email} disabled />
              </div>
              <div>
                <Label htmlFor="phone" className="mb-2 block">Telefone</Label>
                <Input id="phone" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="identityNumber" className="mb-2 block">Número de Identidade</Label>
                <Input id="identityNumber" value={profile.identityNumber} disabled />
              </div>
              <div>
                <Label htmlFor="birthDate" className="mb-2 block">Data de Nascimento</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={profile.birthDate}
                  onChange={(e) => setProfile({ ...profile, birthDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="gender" className="mb-2 block">Gênero</Label>
               <Select
  value={profile.gender}
  onValueChange={(value) =>
    setProfile({ ...profile, gender: value as "MALE" | "FEMALE" | "OTHER" })
  }
>
  <SelectTrigger className="w-full border rounded-md px-2 py-2 bg-white">
    <SelectValue placeholder="Selecione o gênero" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Gênero</SelectLabel>
      <SelectItem value="MALE">Masculino</SelectItem>
      <SelectItem value="FEMALE">Feminino</SelectItem>
      <SelectItem value="OTHER">Outro</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>
              </div>
              <div>
                <Label htmlFor="role" className="mb-2 block">Função</Label>
                <Input id="role" value={profile.role} disabled />
              </div>
            </div>
            <div>
              <Label htmlFor="bio" className="mb-2 block">Biografia</Label>
              <Textarea id="bio" value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="location" className="mb-2 block">Localização</Label>
              <Input id="location" value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} />
            </div>
            <div className="flex flex-col md:flex-row justify-between text-sm text-muted-foreground">
              <span>Conta criada em: {new Date(user.createdAt).toLocaleDateString()}</span>
              <span>Última atualização: {new Date(user.updatedAt).toLocaleDateString()}</span>
            </div>
            <Button onClick={handleProfileSubmit}>Guardar Alterações</Button>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Aba Conta - Apenas Permissões */}
      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Permissões</CardTitle>
            <CardDescription>Gerencie as permissões do usuário.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {permissions.length > 0 ? (
                permissions.map((perm, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-2 py-1 px-2"
                  >
                    {perm}
                    <button
                      onClick={() => setPermissions((prev) => prev.filter((_, i) => i !== index))}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Nenhuma permissão atribuída</p>
              )}
            </div>

            {/* Adicionar nova permissão */}
            <div className="flex gap-2 mt-3">
              <Input
                placeholder="Nova permissão (ex.: EDIT_USERS)"
                value={newPermission}
                onChange={(e) => setNewPermission(e.target.value)}
              />
              <Button
                onClick={() => {
                  if (!newPermission.trim()) return;
                  setPermissions((prev) => [...prev, newPermission.trim()]);
                  setNewPermission("");
                }}
              >
                Adicionar
              </Button>
            </div>

            <Button onClick={handleAccountSubmit}>Salvar Alterações</Button>
          </CardContent>
        </Card>

        {/* Zona de Perigo */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Zona de Perigo</CardTitle>
            <CardDescription>Ações irreversíveis</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-between items-center">
            <div>
              <Label className="mb-2 block">Excluir Conta</Label>
              <p className="text-sm text-muted-foreground">Apaga tudo permanentemente</p>
            </div>
            <Button variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" /> Excluir Conta
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Aba Segurança */}
      <TabsContent value="security">
        <Card>
          <CardHeader>
            <CardTitle>Segurança</CardTitle>
            <CardDescription>Controle acessos e notificações.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-between">
              <div>
                <Label className="mb-2 block">Senha</Label>
                <p className="text-sm">Última alteração: 3 meses</p>
              </div>
              <Button variant="outline">
                <Key className="mr-2 h-4 w-4" /> Alterar Senha
              </Button>
            </div>
            <Separator />
            <div className="flex justify-between">
              <div>
                <Label className="mb-2 block">Notificações de Login</Label>
                <p className="text-sm">Receber alertas de login</p>
              </div>
              <Switch
                checked={securitySettings.loginNotifications}
                onCheckedChange={(v) => setSecuritySettings({ ...securitySettings, loginNotifications: v })}
              />
            </div>
            <Button onClick={handleSecuritySubmit}>Salvar</Button>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Aba Notificações */}
      <TabsContent value="notifications">
        <Card>
          <CardHeader>
            <CardTitle>Notificações</CardTitle>
            <CardDescription>Escolha os tipos de alerta.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { key: "email", label: "E-mail", desc: "Receba notificações por e-mail" },
              { key: "push", label: "Push", desc: "Alertas no navegador" },
              { key: "marketing", label: "Marketing", desc: "Ofertas e promoções" },
              { key: "weekly", label: "Resumo Semanal", desc: "Atividade semanal" },
            ].map((item) => (
              <div key={item.key} className="flex justify-between items-center">
                <div>
                  <Label className="mb-2 block">{item.label}</Label>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
                <Switch
                  checked={notifications[item.key as keyof typeof notifications]}
                  onCheckedChange={(v) => setNotifications({ ...notifications, [item.key]: v })}
                />
              </div>
            ))}
            <Button onClick={handleNotificationsSubmit}>Salvar</Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

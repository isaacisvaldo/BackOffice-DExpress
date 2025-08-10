import { useState, useEffect } from "react";
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
import { type AdminUser, type Permission } from "@/services/admin/admin.service";
import { getGendersList, type Gender } from "@/services/shared/gender/gender.service";

export default function ProfileContent({ user }: { user: AdminUser }) {
  const formatDate = (date: Date | string): string => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toISOString().split("T")[0];
  };

  const [profile, setProfile] = useState({
    name: user.name,
    email: user.email,
    phone: user.numberphone,
    identityNumber: user.identityNumber,
    // ✅ Inicializa o estado com o ID do gênero, que é a chave única
    genderId: user.gender.id,
    birthDate: formatDate(user.birthDate),
    profileLabel: user.profile.label,
    bio: "",
    location: "",
  });

  const [permissions] = useState<Permission[]>(user.profile.permissions || []);

  const [securitySettings, setSecuritySettings] = useState({
    loginNotifications: user.securitySettings?.loginNotifications ?? false,
  });

  const [notifications, setNotifications] = useState({
    email: user.notificationSettings?.email ?? true,
    push: user.notificationSettings?.push ?? false,
    marketing: user.notificationSettings?.marketing ?? false,
    weekly: user.notificationSettings?.weekly ?? false,
  });

  // ✅ Estado para armazenar a lista de gêneros da API
  const [availableGenders, setAvailableGenders] = useState<Gender[]>([]);

  // ✅ Efeito para buscar a lista de gêneros da API
  useEffect(() => {
    const fetchGenders = async () => {
      try {
        const gendersFromApi = await getGendersList();
        setAvailableGenders(gendersFromApi);
      } catch (error) {
        console.error("Erro ao buscar gêneros:", error);
      }
    };
    fetchGenders();
  }, []);

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
                  value={profile.genderId}
                  onValueChange={(value) => setProfile({ ...profile, genderId: value })}
                >
                  <SelectTrigger className="w-full border rounded-md px-2 py-2 bg-white">
                    <SelectValue placeholder="Selecione o gênero" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Gênero</SelectLabel>
                      {availableGenders.map((gender) => (
                        <SelectItem key={gender.id} value={gender.id}>
                          {gender.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="role" className="mb-2 block">Função</Label>
                <Input id="role" value={profile.profileLabel} disabled />
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
            <CardDescription>Permissões do usuário.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* ✅ Novo container com scroll para não estragar a UI */}
            <div className="max-h-48 overflow-y-auto flex flex-wrap gap-2 rounded-md border p-4">
              {permissions.length > 0 ? (
                permissions.map((perm, index) => (
                  <Badge key={index} variant="secondary">
                    {perm.label}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Nenhuma permissão atribuída</p>
              )}
            </div>
          
          </CardContent>
        </Card>
        <br />

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

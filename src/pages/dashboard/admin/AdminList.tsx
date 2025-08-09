// src/pages/dashboard/admin/AdminList.tsx

import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import { adminUserColumns } from '@/components/admin/adminUserColumns'; 
import { getAdminUsers, type AdminUser, createAdminUser, deleteAdminUser } from "@/services/admin/admin.service";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner"; // Verifique se 'sonner' está configurado ou use 'use-toast' do shadcn
import { getGendersList } from "@/services/gender/gender.service";
import { getProfilesList, type Profile } from "@/services/role/role.service";


const formSchema = z.object({
  name: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
  numberphone: z.string().min(8, { message: "Número de telefone inválido." }),
  identityNumber: z.string().min(6, { message: "Número de identidade inválido." }),
  genderId: z.string().uuid({ message: "Selecione um gênero válido." }),
  birthDate: z.string().refine(val => !isNaN(new Date(val).getTime()), { message: "Data de nascimento inválida." }),
  email: z.string().email({ message: "Email inválido." }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres." }).optional().or(z.literal("")),
  profileId: z.string().min(1, { message: "Selecione um perfil." }),
});

export default function AdminList() {
  const [data, setData] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [nameFilter, setNameFilter] = useState<string>("");
  const [debouncedNameFilter, setDebouncedNameFilter] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // Estado para controlar o carregamento da exclusão

  const [availableProfiles, setAvailableProfiles] = useState<Profile[]>([]);
  const [availableGenders, setAvailableGenders] = useState<Array<{ id: string; name: string ,label:string}>>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      numberphone: "",
      identityNumber: "",
      genderId: "",
      birthDate: "",
      email: "",
      password: "",
      profileId: "", 
    },
  });

  // Função para buscar os dados dos administradores
  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getAdminUsers({
        page,
        limit: limit === 0 ? undefined : limit,
        search: debouncedNameFilter || undefined,
      });
      setData(result.data);
      setTotalPages(result.totalPages || 1);
    } catch (error) {
      console.error("Erro ao carregar administradores", error);
      toast.error("Erro", {
        description: "Falha ao carregar a lista de administradores.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Função para lidar com a exclusão de um administrador
  const handleDelete = async (adminId: string) => {
    setIsDeleting(true); // Ativa o estado de carregamento da exclusão
    try {
      await deleteAdminUser(adminId);
      toast.success("Sucesso", {
        description: "Administrador excluído com sucesso!",
      });
      fetchData(); // Recarrega os dados da tabela para refletir a exclusão
    } catch (error) {
      console.error("Erro ao excluir admin:", error);
      toast.error("Erro", {
        description: "Falha ao excluir o administrador. Tente novamente.",
      });
    } finally {
      setIsDeleting(false); // Desativa o estado de carregamento
    }
  };

  // Função para lidar com a submissão do formulário de criação
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      await createAdminUser(values);
      toast.success("Sucesso", {
        description: "Administrador criado com sucesso!",
      });
      setIsModalOpen(false); // Fecha o modal após o sucesso
      form.reset(); // Limpa o formulário
      fetchData(); // Recarrega os dados da tabela
    } catch (error) {
      console.error("Erro ao criar admin:", error);
      toast.error("Erro", {
        description: "Falha ao criar o administrador. Tente novamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Efeito para debounce do filtro de nome
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedNameFilter(nameFilter);
    }, 500);
    return () => clearTimeout(timer);
  }, [nameFilter]);

  // Efeito para buscar dados quando a página, limite ou filtro de nome muda
  useEffect(() => {
    fetchData();
  }, [page, limit, debouncedNameFilter]);

  // Efeito para buscar a lista de perfis disponíveis
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const profilesFromApi = await getProfilesList();
        setAvailableProfiles(profilesFromApi);
      } catch (error) {
        console.error("Erro ao buscar perfis:", error);
      }
    };
    fetchProfiles();
  }, []);
  
  // Efeito para buscar a lista de gêneros disponíveis
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

  // Instancia as colunas, passando a função handleDelete e o estado isDeleting
  const columns = adminUserColumns(handleDelete, isDeleting);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Utilizadores</h1>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Novo Admin
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Administrador</DialogTitle>
              <DialogDescription>
                Preencha os dados para criar uma nova conta de administrador.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 py-4">
                {/* Campos do formulário para Nome Completo, Email, Perfil, Gênero, Telefone, Nº de Identidade, Data de Nascimento, Senha */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="João Silva" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="admin@dexpress.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="profileId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Perfil</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um perfil" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableProfiles.map(profile => (
                              <SelectItem key={profile.id} value={profile.id}>
                                {profile.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                        <FormDescription>
                          O perfil define o conjunto de permissões do administrador.
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="genderId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gênero</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um gênero" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableGenders.map(gender => (
                              <SelectItem key={gender.id} value={gender.id}>{gender.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="numberphone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                          <Input placeholder="+244912345678" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="identityNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nº de Identidade</FormLabel>
                        <FormControl>
                          <Input placeholder="123456789LA045" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="birthDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Nascimento</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha (opcional)</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="********" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="mt-4" disabled={isSubmitting}>
                  {isSubmitting ? "Criando..." : "Criar Administrador"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="container mx-auto py-6">
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <DataTable
            columns={columns} 
            data={data}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
            limit={limit}
            setLimit={setLimit}
            filters={[
              {
                type: "input",
                column: "name",
                placeholder: "Filtrar por nome ou email...",
                value: nameFilter,
                onChange: setNameFilter,
              },
            ]}
          />
        )}
      </div>
    </div>
  );
}
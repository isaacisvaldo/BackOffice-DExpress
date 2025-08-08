import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import { adminUserColumns } from "@/components/admin/adminUserColumns";
import { getAdminUsers, type AdminUser } from "@/services/admin/admin.service";
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
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

const INTERNAL_ROLES = [
  "GENERAL_ADMIN",
  "OPERATIONS_MANAGER",
  "SUPPORT_AGENT"
];

const formSchema = z.object({
  name: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
  numberphone: z.string().min(8, { message: "Número de telefone inválido." }),
  identityNumber: z.string().min(6, { message: "Número de identidade inválido." }),
  genderId: z.string().uuid({ message: "Selecione um gênero válido." }),
  birthDate: z.string().refine(val => !isNaN(new Date(val).getTime()), { message: "Data de nascimento inválida." }),
  email: z.string().email({ message: "Email inválido." }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres." }).optional().or(z.literal("")),
  role: z.enum(INTERNAL_ROLES as [string, ...string[]], { message: "Selecione um cargo válido." }),
  permissions: z.array(z.string()).optional(),
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
  const [availablePermissions, setAvailablePermissions] = useState<Array<{ id: string; name: string }>>([]);

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
      role: INTERNAL_ROLES[0],
      permissions: [],
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log("Valores do formulário:", values);
      // Aqui você chamaria o seu serviço de API para criar o admin
      // await createAdminUser(values); 

      toast.success("Sucesso!", {
        description: "Administrador criado com sucesso.",
      });

      setIsModalOpen(false);
      form.reset();
      fetchData();
    } catch (error) {
      console.error("Erro ao criar admin:", error);
      toast.error("Erro", {
        description: "Falha ao criar o administrador. Tente novamente.",
      });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedNameFilter(nameFilter);
    }, 500);
    return () => clearTimeout(timer);
  }, [nameFilter]);

  useEffect(() => {
    const fetchPermissions = async () => {
      const permissionsFromApi = [
        { id: "perm_1", name: "CREATE_USER" },
        { id: "perm_2", name: "VIEW_REPORTS" },
        { id: "perm_3", name: "EDIT_REPORTS" },
        { id: "perm_4", name: "DELETE_REPORTS" },
        { id: "perm_5", name: "MANAGE_SETTINGS" },
        { id: "perm_6", name: "MANAGE_ADMINS" },
        { id: "perm_7", name: "VIEW_LOGS" },
        { id: "perm_8", name: "ACCESS_AUDIT" },
        { id: "perm_9", name: "DOWNLOAD_DATA" },
        { id: "perm_10", name: "MANAGE_FINANCE" },
      ];
      setAvailablePermissions(permissionsFromApi);
    };
    fetchPermissions();
  }, []);

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, limit, debouncedNameFilter]);

  const genders = [
    { id: "uuid-genero-1", name: "Masculino" },
    { id: "uuid-genero-2", name: "Feminino" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Administradores</h1>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Novo Admin
            </Button>
          </DialogTrigger>
          {/* ✅ Modal com largura aumentada para telas pequenas e grandes */}
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Administrador</DialogTitle>
              <DialogDescription>
                Preencha os dados para criar uma nova conta de administrador.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 py-4">
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
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cargo</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um cargo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {INTERNAL_ROLES.map(role => (
                              <SelectItem key={role} value={role}>{role}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
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
                            {genders.map(gender => (
                              <SelectItem key={gender.id} value={gender.id}>{gender.name}</SelectItem>
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

                <FormField
                  control={form.control}
                  name="permissions"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel>Permissões</FormLabel>
                        <FormDescription>
                          Selecione as permissões que este administrador terá.
                        </FormDescription>
                      </div>
                      {/* ✅ Container com rolagem para a lista de permissões */}
                      <div className="max-h-[200px] overflow-y-auto rounded-md border p-4">
                        {availablePermissions.map((permission) => (
                          <FormField
                            key={permission.id}
                            control={form.control}
                            name="permissions"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={permission.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(permission.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...(field.value || []), permission.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== permission.id
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {permission.name}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="mt-4">
                  Criar Administrador
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
            columns={adminUserColumns}
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

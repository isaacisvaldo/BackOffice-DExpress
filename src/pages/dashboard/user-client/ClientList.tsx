import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import SwirlingEffectSpinner from "@/components/customized/spinner/spinner-06";
import {
  createClientProfileInternal,
  deleteClientProfile,
  getClientProfiles,
  type ClientProfile,
  type CreateClientProfileDto,
} from "@/services/client/client.service";
import { clientProfileColumns } from "@/components/shared/client-profile-column";
import { createUser, type CreateUserDto } from "@/services/users-client/user-client.service";

const formSchema = z.object({
  firstName: z.string().min(2, { message: "O primeiro nome é obrigatório." }),
  lastName: z.string().min(2, { message: "O sobrenome é obrigatório." }),
  email: z.string().email({ message: "Email inválido." }),
  identityNumber: z.string().optional(),
  phoneNumber: z.string().min(8, { message: "Número de telefone inválido." }),
  address: z.string().min(5, { message: "O endereço deve ter pelo menos 5 caracteres." }),
});

export default function ClientProfileList() {
  const [data, setData] = useState<ClientProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [debouncedSearchFilter, setDebouncedSearchFilter] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [optionalContacts, setOptionalContacts] = useState<string[]>([]);
 
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      identityNumber: "",
      phoneNumber: "",
      address: "",
    },
  });

  const handleAddContact = () => {
    if (optionalContacts.length < 4) {
      setOptionalContacts([...optionalContacts, ""]);
    } else {
      toast.info("Limite Atingido", {
        description: "Você pode adicionar no máximo 4 contatos opcionais.",
      });
    }
  };

  const handleRemoveContact = (index: number) => {
    const newContacts = [...optionalContacts];
    newContacts.splice(index, 1);
    setOptionalContacts(newContacts);
  };

  const handleContactChange = (index: number, value: string) => {
    const newContacts = [...optionalContacts];
    newContacts[index] = value;
    setOptionalContacts(newContacts);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getClientProfiles({
        page,
        limit: limit === 0 ? undefined : limit,
        search: debouncedSearchFilter || undefined,
      });
      setData(result.data);
      setTotalPages(result.totalPages || 1);
    } catch (error) {
      console.error("Erro ao carregar perfis de cliente", error);
      toast.error("Erro", {
        description: "Falha ao carregar a lista de perfis de cliente.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      await deleteClientProfile(id);
      toast.success("Sucesso", {
        description: "Perfil de cliente excluído com sucesso!",
      });
      fetchData();
    } catch (error) {
      console.error("Erro ao excluir perfil:", error);
      toast.error("Erro", {
        description: "Falha ao excluir o perfil. Tente novamente.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
   
      const createUserDto: CreateUserDto = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        type: "INDIVIDUAL",
      };
        const fullName = `${values.firstName} ${values.lastName}`;
      
      const processedOptionalContacts = optionalContacts.filter(contact => contact.trim().length > 0);

    
      const createProfileDto: CreateClientProfileDto = {
        fullName: fullName,
        email: values.email,
        identityNumber: values.identityNumber,
        phoneNumber: values.phoneNumber,
        optionalContacts: processedOptionalContacts, 
        address: values.address,
      };
      

     
      const newUser = await createUser(createUserDto);
   
      if (!newUser || !newUser.userId) {
        throw new Error("Falha ao criar o usuário. ID não retornado.");
      }
      
    
      await createClientProfileInternal(newUser.userId, createProfileDto);

     
      
      setIsModalOpen(false); 
      form.reset();
      setOptionalContacts([]);
      fetchData(); 
    } catch (error) {
      console.error("Erro ao criar perfil:", error);
      toast.error("Erro", {
        description: "Falha ao criar o usuário ou o perfil. Tente novamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchFilter(searchFilter);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchFilter]);

  useEffect(() => {
    fetchData();
  }, [page, limit, debouncedSearchFilter]);

  const columns = clientProfileColumns(handleDelete, isDeleting);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Clientes (Individual)</h1>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Cliente</DialogTitle>
              <DialogDescription>
                Preencha os dados para criar um novo usuário e seu perfil de cliente.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 py-4">
                {/* Campos do Usuário */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primeiro Nome</FormLabel>
                        <FormControl>
                          <Input placeholder="João" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sobrenome</FormLabel>
                        <FormControl>
                          <Input placeholder="Silva" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid w-full ">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input   placeholder="joao.silva@exemplo.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Campos do Perfil de Cliente */}
                <h3 className="text-lg font-semibold mt-4">Dados do Perfil</h3>
                <p className="text-sm text-gray-500">
                  O nome completo será gerado automaticamente a partir do primeiro e último nome.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone Principal</FormLabel>
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
                        <FormLabel>Nº de Identificação (BI)</FormLabel>
                        <FormControl>
                          <Input placeholder="123456789XA001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Campos de Contatos Opcionais (Dinâmicos) */}
                <div className="flex flex-col gap-2">
                  <FormLabel>Contatos Opcionais</FormLabel>
                  {optionalContacts.map((contact, index) => (
                    <div key={index} className="flex items-center gap-2 w-full">
                      <Input
                        className="w-full"
                        placeholder={`Contato opcional ${index + 1}`}
                        value={contact}
                        onChange={(e) => handleContactChange(index, e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => handleRemoveContact(index)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddContact}
                    className="mt-2 w-fit"
                    disabled={optionalContacts.length >= 4}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Adicionar Contato
                  </Button>
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endereço</FormLabel>
                      <FormControl>
                        <Input placeholder="Rua de Exemplo, 456" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="mt-4" disabled={isSubmitting}>
                  {isSubmitting ? "Criando..." : "Criar Cliente"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="container mx-auto py-6">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <SwirlingEffectSpinner />
          </div>
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
                column: "search",
                placeholder: "Filtrar por nome, email ou BI...",
                value: searchFilter,
                onChange: setSearchFilter,
              },
            ]}
          />
        )}
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table"; 
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { clientCompanyProfileColumns } from "@/components/shared/client-company-column";
import { createClientCompanyProfile, deleteClientCompanyProfile, getClientCompanyProfiles, type ClientCompanyProfile } from "@/services/client/client-company-profile.service";
import { getCitiesList, type City } from "@/services/location/cities.service";
import type { District } from "@/types/types";
import { getDistrictsByCityId } from "@/services/location/districts.service";
import { getSectorsList } from "@/services/shared/sector/sector.service";


const formSchema = z.object({
  companyName: z.string().min(3, { message: "O nome da empresa deve ter pelo menos 3 caracteres." }),
  nif: z.string().min(9, { message: "NIF inválido (mínimo 9 dígitos)." }),
  email: z.string().email({ message: "Email inválido." }),
  phoneNumber: z.string().min(8, { message: "Número de telefone inválido." }),
  optionalContact: z.string().optional(),
  address: z.string().min(5, { message: "O endereço deve ter pelo menos 5 caracteres." }),
  sectorId: z.string().uuid({ message: "Selecione um setor válido." }),

  districtId: z.string().uuid({ message: "Selecione um distrito válido." }), 
});

export default function ClientCompanyProfileList() {
  const [data, setData] = useState<ClientCompanyProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [debouncedSearchFilter, setDebouncedSearchFilter] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [availableSectors, setAvailableSectors] = useState<any[]>([]);
  // Mantemos o state para 'availableCities' porque ele é usado para popular o Select de distrito
  const [availableCities, setAvailableCities] = useState<City[]>([]);
  const [availableDistricts, setAvailableDistricts] = useState<District[]>([]);

  // Mantemos o state local para a cidade selecionada, pois ela controla os distritos
  const [selectedCityId, setSelectedCityId] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      nif: "",
      email: "",
      phoneNumber: "",
      optionalContact: "",
      address: "",
      sectorId: "", 
      districtId: "",
    },
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getClientCompanyProfiles({
        page,
        limit: limit === 0 ? undefined : limit,
        search: debouncedSearchFilter || undefined,
      });
      setData(result.data);
      setTotalPages(result.totalPages || 1);
    } catch (error) {
      console.error("Erro ao carregar perfis de empresa", error);
      toast.error("Erro", {
        description: "Falha ao carregar a lista de perfis de empresa.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true); 
    try {
      await deleteClientCompanyProfile(id);
      toast.success("Sucesso", {
        description: "Perfil de empresa excluído com sucesso!",
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
      await createClientCompanyProfile(values);
      toast.success("Sucesso", {
        description: "Perfil de empresa criado com sucesso!",
      });
      setIsModalOpen(false);
      form.reset(); 
      fetchData(); 
    } catch (error) {
      console.error("Erro ao criar perfil:", error);
      toast.error("Erro", {
        description: "Falha ao criar o perfil. Tente novamente.",
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


  useEffect(() => {
    const fetchSectors = async () => {
      try {
        const sectorsFromApi = await getSectorsList();
       setAvailableSectors(sectorsFromApi);
      } catch (error) {
        console.error("Erro ao buscar setores:", error);
        toast.error("Erro", {
            description: "Falha ao carregar a lista de setores."
        });
      }
    };
    fetchSectors();
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const citiesFromApi = await getCitiesList();
    
        setAvailableCities(citiesFromApi);
      } catch (error) {
        console.error("Erro ao buscar cidades:", error);
        toast.error("Erro", {
            description: "Falha ao carregar a lista de cidades."
        });
      }
    };
    fetchCities();
  }, []);


  // useEffect para buscar distritos
  useEffect(() => {
    if (selectedCityId) { // Usa o state local
      const fetchDistricts = async () => {
        try {
          const districtsFromApi = await getDistrictsByCityId(selectedCityId);
          setAvailableDistricts(districtsFromApi);
          form.setValue("districtId", ""); 
        } catch (error) {
          console.error("Erro ao buscar distritos:", error);
          toast.error("Erro", {
              description: "Falha ao carregar a lista de distritos."
          });
        }
      };
      fetchDistricts();
    } else {
      setAvailableDistricts([]);
      form.setValue("districtId", "");
    }
  }, [selectedCityId]); 

  const columns = clientCompanyProfileColumns(handleDelete, isDeleting);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Clientes (Empresa)*</h1>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Nova Empresa
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Adicionar Nova Empresa</DialogTitle>
              <DialogDescription>
                Preencha os dados para criar uma nova empresa .
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 py-4">
                {/* Campos do formulário */}
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Empresa</FormLabel>
                      <FormControl>
                        <Input placeholder="Tech Solutions Ltda" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="nif"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>NIF</FormLabel>
                        <FormControl>
                          <Input placeholder="123456789" {...field} />
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
                          <Input placeholder="contato@techsolutions.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="phoneNumber"
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
                    name="optionalContact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contato Opcional</FormLabel>
                        <FormControl>
                          <Input placeholder="+244923456789" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Endereço</FormLabel>
                        <FormControl>
                          <Input placeholder="Rua da Empresa, 123" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                 <FormField
                  control={form.control}
                  name="sectorId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Setor</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um setor" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableSectors.map(sector => (
                            <SelectItem key={sector.id} value={sector.id}>
                              {sector.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Campo de Cidade não está mais no form, mas ainda é usado para buscar distritos */}
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    <Select onValueChange={setSelectedCityId} value={selectedCityId}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma cidade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableCities.map(city => (
                          <SelectItem key={city.id} value={city.id}>
                            {city.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>

                  <FormField
                    control={form.control}
                    name="districtId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Distrito</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} disabled={!selectedCityId}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um distrito" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableDistricts.map(district => (
                              <SelectItem key={district.id} value={district.id}>
                                {district.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Button type="submit" className="mt-4" disabled={isSubmitting}>
                  {isSubmitting ? "Criando..." : "Criar Empresa"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="container mx-auto py-6">
        {loading ? (
         <div className="flex justify-center items-center py-10">
           <SwirlingEffectSpinner></SwirlingEffectSpinner>
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
                placeholder: "Filtrar por nome, email ou NIF...",
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
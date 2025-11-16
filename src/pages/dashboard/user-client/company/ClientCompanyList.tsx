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
import { getCitiesList, type City } from "@/services/location/cities.service";
import type { District } from "@/types/types";
import { getDistrictsByCityId } from "@/services/location/districts.service";
import { getSectorsList } from "@/services/shared/sector/sector.service";

import { formatDate } from "@/util";
import { createClientCompanyProfile, deleteClientCompanyProfile, getClientCompanyProfiles, updateClientCompanyProfile, type ClientCompanyProfile, type UpdateCompanyProfileDto } from "@/services/client/company/client-company-profile.service";


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

type FormValues = z.infer<typeof formSchema>; 

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
  const [availableCities, setAvailableCities] = useState<City[]>([]);
  const [availableDistricts, setAvailableDistricts] = useState<District[]>([]);

  const [selectedCityId, setSelectedCityId] = useState<string>("");
  const [editingCompany, setEditingCompany] = useState<ClientCompanyProfile | null>(null); 

  const form = useForm<FormValues>({ 
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

  const handleEdit = (company: ClientCompanyProfile) => {
    setEditingCompany(company); 
    
    // 1. Reseta e preenche todos os campos, incluindo districtId
    form.reset({
      companyName: company.companyName,
      nif: company.nif,
      email: company.email,
      phoneNumber: company.phoneNumber,
      optionalContact: company.optionalContact || "",
      address: company.address,
      sectorId: company.sectorId,
      districtId: company.districtId, // Manter aqui, pois é o valor final correto
    });
    
    // 2. Define a cidade (Isto irá disparar o useEffect para carregar a lista de distritos)
    if (company.district?.cityId) {
        setSelectedCityId(company.district.cityId); 
    } else {
        setSelectedCityId("");
    }

    setIsModalOpen(true); 
  };
  
  const handleOpenCreateModal = () => {
    setEditingCompany(null);
    form.reset();
    setSelectedCityId("");
    setIsModalOpen(true);
  };


  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getClientCompanyProfiles({
        page,
        limit: limit === 0 ? undefined : limit,
        search: debouncedSearchFilter || undefined,
      });
       const mappedData = result.data.map((item) => ({
              ...item,
             createdAt: formatDate(item.createdAt),
              updatedAt: formatDate(item.updatedAt),
            }));
      setData(mappedData);
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

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
        if (editingCompany) {
            // --- MODO DE EDIÇÃO ---
            const updateDto: UpdateCompanyProfileDto = {
                companyName: values.companyName,
                nif: values.nif,
                email: values.email,
                phoneNumber: values.phoneNumber,
                optionalContact: values.optionalContact || undefined,
                address: values.address,
                sectorId: values.sectorId,
                districtId: values.districtId,
            };
            await updateClientCompanyProfile(editingCompany.id, updateDto);

            toast.success("Sucesso", {
              description: "Perfil de empresa atualizado com sucesso!",
            });
        } else {
            // --- MODO DE CRIAÇÃO ---
            await createClientCompanyProfile(values);
            toast.success("Sucesso", {
              description: "Perfil de empresa criado com sucesso!",
            });
        }
        
      setIsModalOpen(false);
      setEditingCompany(null); 
      form.reset(); 
      setSelectedCityId(""); 
      fetchData(); 
    } catch (error) {
      console.error("Erro ao processar perfil:", error);
      toast.error("Erro", {
        description: `Falha ao ${editingCompany ? "atualizar" : "criar"} o perfil. Tente novamente.`,
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


  useEffect(() => {
    if (editingCompany && selectedCityId && editingCompany.district?.cityId === selectedCityId) {
        const setInitialDistrict = async () => {
            try {
               
                const districtsFromApi = await getDistrictsByCityId(selectedCityId);
                setAvailableDistricts(districtsFromApi);
                
              
                form.setValue("districtId", editingCompany.districtId); 
            } catch (error) {
                 console.error("Erro ao carregar distritos para edição:", error);
            }
        };
        setInitialDistrict();
    }
  }, [editingCompany, selectedCityId, form.setValue]);

  useEffect(() => {
    if (selectedCityId) {
      const fetchDistricts = async () => {
        try {
          const districtsFromApi = await getDistrictsByCityId(selectedCityId);
          setAvailableDistricts(districtsFromApi);
          const isCreating = !editingCompany;
          const isChangingCityInEdit = editingCompany && editingCompany.district?.cityId !== selectedCityId;
          
          if (isCreating || isChangingCityInEdit) {
         
            form.setValue("districtId", ""); 
          }

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
  }, [selectedCityId, editingCompany, form.setValue]); 
  
  const columns = clientCompanyProfileColumns(handleDelete, isDeleting, handleEdit);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Clientes (Empresa)</h1>
     
        <Button onClick={handleOpenCreateModal}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Nova Empresa
        </Button>
      </div>

      <Dialog 
        open={isModalOpen} 
        onOpenChange={(open) => {
            setIsModalOpen(open);
            if (!open) {
                setEditingCompany(null);
                form.reset();
                setSelectedCityId("");
            }
        }}
      >
       <DialogContent className="sm:max-w-[900px]">
          <DialogHeader>
            <DialogTitle>{editingCompany ? "Editar Empresa" : "Adicionar Nova Empresa"}</DialogTitle>
            <DialogDescription>
               {editingCompany 
                ? "Atualize os dados da empresa." 
                : "Preencha os dados para criar uma nova empresa."
              }
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 py-4">
              
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
                    <Select onValueChange={field.onChange} value={field.value}> 
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
                {/* Campo de Cidade - value={selectedCityId} para edição */}
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

                {/* Campo de Distrito - value={field.value} para edição */}
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
                {isSubmitting 
                  ? (editingCompany ? "Atualizando..." : "Criando...") 
                  : (editingCompany ? "Atualizar Empresa" : "Criar Empresa")
                }
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

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
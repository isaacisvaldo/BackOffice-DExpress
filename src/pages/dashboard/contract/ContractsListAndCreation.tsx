// contracts/ContractsListAndCreation.tsx

import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import SwirlingEffectSpinner from "@/components/customized/spinner/spinner-06";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MultiSelectSearch from "@/components/ui/multi-select-search";

import {
  createContract,
  deleteContract,
  getContracts,
  type Contract,
  // IMPORTA A NOVA INTERFACE
  type CreateContractDto,
} from "@/services/contract/contract.service";

import { UserType } from "@/services/serviceRequest/service-request.service";
import { contractsColumns } from "@/components/contract/contract-column";
import { fetchCompanyClients, type ClientCompanyProfile } from "@/services/client/company/client-company-profile.service";
import { fetchIndividualClients, type ClientProfile } from "@/services/client/client.service";
import { getAllPackages, type Package } from "@/services";
import { dropdownProfessionals, type Professional } from "@/services/profissional/profissional.service";
import type { DesiredPosition, District } from "@/types/types";
import { getDesiredPositionsList } from "@/services/desired-positions/desired-positions.service";
import type { City } from "@/components/location/citiesColunn";
import { getDistrictsByCityId } from "@/services/location/districts.service";
import { getCitiesList } from "@/services/location/cities.service";


export default function ContractsListAndCreation() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [contractType, setContractType] = useState<'company' | 'individual'>('company');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false); 
  // NOVO ESTADO COM O CAMPO 'location' ANINHADO
  const [newContract, setNewContract] = useState<CreateContractDto>({
    title: '',
    description: '',
    clientType: UserType.CORPORATE,
    startDate: '',
    endDate: '',
    agreedValue: 0,
    finalValue: 0,
   // serviceFrequency: '',
   // status: '',
    location: { cityId: '', districtId: '', street: '' },
    companyClientId: '',
    individualClientId: '',
    packageId: '',
    professionalId: '',
    professionalIds: [],
    desiredPositionId: '',
  });

  const [companyClients, setCompanyClients] = useState<ClientCompanyProfile[]>([]);
  const [individualClients, setIndividualClients] = useState<ClientProfile[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [desiredPositions, setDesiredPositions] = useState<DesiredPosition[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [
        contractsData,
        companyClientsData,
        individualClientsData,
        packagesData,
        professionalsData,
        desiredPositionsData
      ] = await Promise.all([
        getContracts({ page, limit }),
        fetchCompanyClients(),
        fetchIndividualClients(),
        getAllPackages(),
        dropdownProfessionals(),
        getDesiredPositionsList(),
      ]);

      setContracts(contractsData.data);
      setTotalPages(contractsData.totalPages);

      setCompanyClients(companyClientsData);
      setIndividualClients(individualClientsData);
      setPackages(packagesData);
      setProfessionals(professionalsData);
      setDesiredPositions(desiredPositionsData);
    } catch (error: any) {
      console.error("Erro ao carregar dados", error);
      toast.error(error.message || "Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const citiesFromApi = await getCitiesList();
        setCities(citiesFromApi);
      } catch (error) {
        console.error("Erro ao buscar cidades:", error);
        toast.error("Erro", {
            description: "Falha ao carregar a lista de cidades."
        });
      }
    };
    fetchCities();
  }, []);

  // O useEffect agora depende de 'newContract.location.cityId'
  useEffect(() => {
    if (newContract.location.cityId) {
      const fetchDistricts = async () => {
        try {
          const districtsFromApi = await getDistrictsByCityId(newContract.location.cityId);
          setDistricts(districtsFromApi);
          setNewContract(prev => ({ 
              ...prev, 
              location: { ...prev.location, districtId: "" } // Atualiza o distrito dentro de 'location'
          }));
        } catch (error) {
          console.error("Erro ao buscar distritos:", error);
          toast.error("Erro", {
              description: "Falha ao carregar a lista de distritos."
          });
        }
      };
      fetchDistricts();
    } else {
      setDistricts([]);
      setNewContract(prev => ({ 
          ...prev, 
          location: { ...prev.location, districtId: "" } // Limpa o distrito
      }));
    }
  }, [newContract.location.cityId]);


  useEffect(() => {
    fetchData();
  }, [page, limit]);

 const handleCreateContract = async () => {
  setIsCreating(true);
  try {
    const payload: CreateContractDto = {
      ...newContract,
      agreedValue: Number(newContract.agreedValue) || 0,
      finalValue: Number(newContract.finalValue) || 0,
      desiredPositionId: newContract.desiredPositionId || undefined,
    };

    await createContract(payload);
    toast.success("Contrato criado com sucesso!");
    setIsModalOpen(false);
    fetchData();

    // ✅ Limpa o formulário
    setNewContract({
      title: '',
      description: '',
      clientType: UserType.CORPORATE,
      startDate: '',
      endDate: '',
      agreedValue: 0,
      finalValue: 0,
      location: { cityId: '', districtId: '', street: '' },
      companyClientId: '',
      individualClientId: '',
      packageId: '',
      professionalId: '',
      professionalIds: [],
      desiredPositionId: '',
    });

    // ✅ Volta o tipo de contrato para 'company'
    setContractType('company');

  } catch (error: any) {
    console.error("Erro ao criar contrato", error);
    toast.error(error.message || "Erro ao criar contrato.");
  } finally {
    setIsCreating(false);
  }
};


  const handleDeleteContract = async (id: string) => {
     setIsDeleting(true);
    try {
      await deleteContract(id);
      toast.success("Contrato excluído com sucesso!");
      fetchData();
    } catch (error: any) {
      console.error("Erro ao excluir contrato", error);
      toast.error(error.message || "Erro ao excluir contrato.");
    }finally{
       setIsDeleting(false);
    }
  };

  const columns = contractsColumns(handleDeleteContract,isDeleting);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold mb-4">Gestão de Contratos</h1>

      <div className="flex justify-end mb-4">
        <Button onClick={() => setIsModalOpen(true)}>Criar Novo Contrato</Button>
      </div>

      <div className="container mx-auto py-6">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <SwirlingEffectSpinner />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={contracts}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
            limit={limit}
            setLimit={setLimit}
            filters={[]}
          />
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Criar Novo Contrato</DialogTitle>
            <DialogDescription>Preencha os dados do contrato.</DialogDescription>
          </DialogHeader>

          <form className="grid gap-4 py-4">
            {/* Tipo de Contrato */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Tipo de Contrato</Label>
              <div className="col-span-3">
                <Select
                  value={contractType}
                  onValueChange={(value: 'company' | 'individual') => {
                    setContractType(value);
                    setNewContract(prev => ({
                      ...prev,
                      clientType: value === 'company' ? UserType.CORPORATE : UserType.INDIVIDUAL,
                      title: '',
                      description: '',
                      startDate: '',
                      endDate: '',
                      agreedValue: 0,
                      finalValue: 0,
                   //   serviceFrequency: '',
                     // status: '',
                      location: { cityId: '', districtId: '', street: '' }, // Limpa a localização completa
                      companyClientId: '',
                      individualClientId: '',
                      packageId: '',
                      professionalId: '',
                      professionalIds: [],
                      desiredPositionId: '',
                    }));
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="company">Empresa</SelectItem>
                    <SelectItem value="individual">Pessoa Singular</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Título e Descrição */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">Título do Contrato</Label>
              <Input
                id="title"
                value={newContract.title}
                onChange={e => setNewContract(prev => ({ ...prev, title: e.target.value }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Descrição</Label>
              <Input
                id="description"
                value={newContract.description}
                onChange={e => setNewContract(prev => ({ ...prev, description: e.target.value }))}
                className="col-span-3"
              />
            </div>

            {/* Cliente Individual */}
            {contractType === 'individual' && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Pessoa Singular</Label>
                  <Select
                    value={newContract.individualClientId}
                    onValueChange={value => setNewContract(prev => ({ ...prev, individualClientId: value }))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione a pessoa" />
                    </SelectTrigger>
                    <SelectContent>
                      {individualClients.map(c => <SelectItem key={c.id} value={c.id}>{c.fullName}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Posição Desejada</Label>
                  <Select
                    value={newContract.desiredPositionId}
                    onValueChange={value => setNewContract(prev => ({ ...prev, desiredPositionId: value }))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione a posição" />
                    </SelectTrigger>
                    <SelectContent>
                      {desiredPositions.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Profissional</Label>
                  <Select
                    value={newContract.professionalId}
                    onValueChange={value => setNewContract(prev => ({ ...prev, professionalId: value }))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o profissional" />
                    </SelectTrigger>
                    <SelectContent>
                      {professionals.map(p => <SelectItem key={p.id} value={p.id}>{p.fullName}</SelectItem>)}
                    </SelectContent>
                    </Select>
                  </div>
                </>
            )}

            {/* Empresa */}
            {contractType === 'company' && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Empresa</Label>
                  <Select
                    value={newContract.companyClientId}
                    onValueChange={value => setNewContract(prev => ({ ...prev, companyClientId: value }))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione a empresa" />
                    </SelectTrigger>
                    <SelectContent>
                      {companyClients.map(c => <SelectItem key={c.id} value={c.id}>{c.companyName}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Pacote de Serviço</Label>
                  <Select
                    value={newContract.packageId}
                    onValueChange={value => {
                      const selectedPackage = packages.find(p => p.id === value);
                      setNewContract(prev => ({
                        ...prev,
                        packageId: value,
                        agreedValue: selectedPackage ? selectedPackage.price : prev.agreedValue,
                        finalValue: selectedPackage ? selectedPackage.price : prev.finalValue,
                      }));
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o pacote" />
                    </SelectTrigger>
                    <SelectContent>
                      {packages.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
               <div className="grid grid-cols-4 items-center gap-4">
    <Label className="text-right">Profissionais</Label>
    <MultiSelectSearch
        options={professionals.map(p => ({ value: p.id, label: p.fullName }))}
        selectedValues={newContract.professionalIds || []} 
        onSelectChange={selected => setNewContract(prev => ({ ...prev, professionalIds: selected }))}
    />
</div>
              </>
            )}

            {/* CAMPOS DE LOCALIZAÇÃO (AGORA DENTRO DE 'location') */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cityId" className="text-right">Cidade</Label>
              <Select
                // Acessa o valor dentro de 'location'
                value={newContract.location.cityId}
                onValueChange={value => setNewContract(prev => ({
                  ...prev,
                  // Atualiza apenas a 'cityId' dentro do objeto 'location'
                  location: { ...prev.location, cityId: value }
                }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione a cidade" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="districtId" className="text-right">Distrito</Label>
              <Select
                // Acessa o valor dentro de 'location'
                value={newContract.location.districtId}
                onValueChange={value => setNewContract(prev => ({
                  ...prev,
                  // Atualiza apenas a 'districtId' dentro do objeto 'location'
                  location: { ...prev.location, districtId: value }
                }))}
                // A dependência agora é 'newContract.location.cityId'
                disabled={!newContract.location.cityId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o distrito" />
                </SelectTrigger>
                <SelectContent>
                  {districts.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="street" className="text-right">Rua</Label>
              <Input
                id="street"
                // Acessa o valor dentro de 'location'
                value={newContract.location.street}
                onChange={e => setNewContract(prev => ({
                  ...prev,
                  // Atualiza apenas a 'street' dentro do objeto 'location'
                  location: { ...prev.location, street: e.target.value }
                }))}
                className="col-span-3"
              />
            </div>
            
            {/* Datas e valores */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startDate" className="text-right">Data de Início</Label>
              <Input
                id="startDate"
                type="date"
                value={newContract.startDate}
                onChange={e => setNewContract(prev => ({ ...prev, startDate: e.target.value }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endDate" className="text-right">Data de Fim</Label>
              <Input
                id="endDate"
                type="date"
                value={newContract.endDate}
                onChange={e => setNewContract(prev => ({ ...prev, endDate: e.target.value }))}
                className="col-span-3"
              />
            </div>
            {/* Frequência do Serviço 
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="serviceFrequency" className="text-right">Frequência do Serviço</Label>
              <Input
                id="serviceFrequency"
                value={newContract.serviceFrequency}
                onChange={e => setNewContract(prev => ({ ...prev, serviceFrequency: e.target.value }))}
                className="col-span-3"
              />
            </div>
            */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="agreedValue" className="text-right">Valor Acordado</Label>
              <Input
                id="agreedValue"
                value={newContract.agreedValue}
                onChange={contractType === 'company' ? undefined : e => setNewContract(prev => ({ ...prev, agreedValue: Number(e.target.value) }))}
                className={`col-span-3 ${contractType === 'company' ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
                readOnly={contractType === 'company'}
              />
            </div>

            {/* Novo Campo: Final Value */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="finalValue" className="text-right">Valor Final</Label>
              <Input
                id="finalValue"
                type="number"
                value={newContract.finalValue}
                onChange={e => setNewContract(prev => ({ ...prev, finalValue: Number(e.target.value) }))}
                className="col-span-3"
              />
            </div>

            {/* Status 
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Status</Label>
              <Select
                value={newContract.status}
                onValueChange={value => setNewContract(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Rascunho">Rascunho</SelectItem>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Concluido">Concluído</SelectItem>
                  <SelectItem value="Cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            */}
          </form>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreateContract} disabled={isCreating}>
              {isCreating ? "Criando..." : "Criar Contrato"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
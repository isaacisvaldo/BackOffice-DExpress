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
import {
  createContract,
  deleteContract,
  getContracts,
  type Contract,
  type CreateContractDto,
} from "@/services/contract/contract.service";

import { UserType } from "@/services/serviceRequest/service-request.service";
import { contractsColumns } from "@/components/contract/contract-column";
import MultiSelectSearch from "@/components/ui/multi-select-search";
import type { ClientCompanyProfile } from "@/services/client/company/client-company-profile.service";
import type { ClientProfile } from "@/services/client/client.service";
import type { Package } from "@/services";
import type { Professional } from "@/services/profissional/profissional.service";
import type { DesiredPosition } from "@/types/types";

export default function ContractsListAndCreation() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [contractType, setContractType] = useState<'company' | 'individual'>('company');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const [newContract, setNewContract] = useState<CreateContractDto>({
    title: '',
    description: '',
    clientType: UserType.CORPORATE,
    startDate: '',
    endDate: '',
    agreedValue: '',
    serviceFrequency: '',
    status: '',
    locationId: '',
  });

  // Estados para os dados dos dropdowns
  const [companyClients, setCompanyClients] = useState<ClientCompanyProfile[]>([]);
  const [individualClients, setIndividualClients] = useState<ClientProfile[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [desiredPositions, setDesiredPositions] = useState<DesiredPosition[]>([]);

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
        fetchPackages(),
        fetchProfessionals(),
        fetchDesiredPositions(),
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
    fetchData();
  }, [page, limit]);

  const handleCreateContract = async () => {
    setIsCreating(true);
    try {
      await createContract(newContract);
      toast.success("Contrato criado com sucesso!");
      setIsModalOpen(false);
      fetchData();
    } catch (error: any) {
      console.error("Erro ao criar contrato", error);
      toast.error(error.message || "Erro ao criar contrato.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteContract = async (id: string) => {
    try {
      await deleteContract(id);
      toast.success("Contrato excluído com sucesso!");
      fetchData();
    } catch (error: any) {
      console.error("Erro ao excluir contrato", error);
      toast.error(error.message || "Erro ao excluir contrato.");
    }
  };

  const columns = contractsColumns(handleDeleteContract);

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
            <DialogDescription>
              Preencha os dados do contrato.
            </DialogDescription>
          </DialogHeader>

          <form className="grid gap-4 py-4">
            {/* Campo para Tipo de Contrato */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Tipo de Contrato</Label>
              <div className="col-span-3">
                <Select value={contractType} onValueChange={(value: 'company' | 'individual') => {
                  setContractType(value);
                  setNewContract({
                    title: '',
                    description: '',
                    clientType: value === 'company' ? UserType.CORPORATE : UserType.INDIVIDUAL,
                    startDate: '',
                    endDate: '',
                    agreedValue: '',
                    serviceFrequency: '',
                    status: '',
                    locationId: '',
                  });
                }}>
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

            {/* Campos de Título e Descrição */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">Título do Contrato</Label>
              <Input id="title" value={newContract.title} onChange={e => setNewContract(prev => ({ ...prev, title: e.target.value }))} className="col-span-3" />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Descrição</Label>
              <Input id="description" value={newContract.description} onChange={e => setNewContract(prev => ({ ...prev, description: e.target.value }))} className="col-span-3" />
            </div>

            {/* Bloco de campos para Pessoa Singular */}
            {contractType === 'individual' ? (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="individualClientId" className="text-right">Pessoa Singular</Label>
                  <Select value={newContract.individualClientId} onValueChange={(value) => setNewContract(prev => ({ ...prev, individualClientId: value }))}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione a pessoa" />
                    </SelectTrigger>
                    <SelectContent>
                      {individualClients.map(c => <SelectItem key={c.id} value={c.id}>{c.fullName}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                {/* Posição Desejada agora vem antes do Profissional */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="desiredPositionId" className="text-right">Posição Desejada</Label>
                  <Select value={newContract.desiredPositionId} onValueChange={(value) => setNewContract(prev => ({ ...prev, desiredPositionId: value }))}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione a posição" />
                    </SelectTrigger>
                    <SelectContent>
                      {desiredPositions.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="professionalId" className="text-right">Profissional</Label>
                  <Select value={newContract.professionalId} onValueChange={(value) => setNewContract(prev => ({ ...prev, professionalId: value }))}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o profissional" />
                    </SelectTrigger>
                    <SelectContent>
                      {professionals.map(p => <SelectItem key={p.id} value={p.id}>{p.fullName}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="companyClientId" className="text-right">Empresa</Label>
                  <Select value={newContract.companyClientId} onValueChange={(value) => setNewContract(prev => ({ ...prev, companyClientId: value }))}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione a empresa" />
                    </SelectTrigger>
                    <SelectContent>
                      {companyClients.map(c => <SelectItem key={c.id} value={c.id}>{c.companyName}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                {/* Pacote de Serviço é exclusivo para empresas */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="packageId" className="text-right">Pacote de Serviço</Label>
                  <Select value={newContract.packageId} onValueChange={(value) => {
                    const selectedPackage = packages.find(p => p.id === value);
                    setNewContract(prev => ({ ...prev, packageId: value }));
                    if (selectedPackage) {
                      setNewContract(prev => ({
                        ...prev,
                        agreedValue: String(selectedPackage.expectedSalary),
                      }));
                    }
                  }}>
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
                  <div className="col-span-3">
                    <MultiSelectSearch
                      options={professionals.map(p => ({ value: p.id, label: p.fullName }))}
                      selectedValues={newContract.professionalIds || []}
                      onSelectChange={(selected: string[]) => setNewContract(prev => ({ ...prev, professionalIds: selected }))}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Campo de Localização */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="locationId" className="text-right">Localização</Label>
              <Input id="locationId" value={newContract.title} placeholder="Luanda - Maianga" disabled className="col-span-3" />
            </div>

            {/* Campos de Data, Frequência e Valor */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startDate" className="text-right">Data de Início</Label>
              <Input id="startDate" type="date" value={newContract.startDate} onChange={e => setNewContract(prev => ({ ...prev, startDate: e.target.value }))} className="col-span-3" />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endDate" className="text-right">Data de Fim</Label>
              <Input id="endDate" type="date" value={newContract.endDate} onChange={e => setNewContract(prev => ({ ...prev, endDate: e.target.value }))} className="col-span-3" />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="serviceFrequency" className="text-right">Frequência do Serviço</Label>
              <Input id="serviceFrequency" value={newContract.serviceFrequency} onChange={e => setNewContract(prev => ({ ...prev, serviceFrequency: e.target.value }))} className="col-span-3" />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="agreedValue" className="text-right">Valor Acordado</Label>
              {contractType === 'company' ? (
                <Input
                  id="agreedValue"
                  value={newContract.agreedValue}
                  className="col-span-3 bg-gray-100 dark:bg-gray-800"
                  readOnly
                />
              ) : (
                <Input
                  id="agreedValue"
                  value={newContract.agreedValue}
                  onChange={e => setNewContract(prev => ({ ...prev, agreedValue: e.target.value }))}
                  className="col-span-3"
                  type="text"
                />
              )}
            </div>

            {/* Campo de Status como Select */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">Status</Label>
              <Select value={newContract.status} onValueChange={(value) => setNewContract(prev => ({ ...prev, status: value }))}>
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
import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table"; // Assumindo este caminho para seu DataTable

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
import { toast } from "sonner"; // Assumindo sonner para notificações
import SwirlingEffectSpinner from "@/components/customized/spinner/spinner-06"; // Assumindo seu spinner
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { contractsColumns } from "@/components/shared";

// --- INTERFACES MOCKADAS PARA ESTE EXEMPLO ---
// Em um projeto real, estas viriam de src/services/index.ts ou arquivos específicos.

interface CompanyProfile {
  id: string;
  companyName: string;
}

interface ClientProfile {
  id: string;
  fullName: string;
}

interface Package {
  id: string;
  name: string;
}

interface Employee {
  id: string;
  fullName: string;
}

interface CompanyPackage { // Corresponde ao seu CompanyPackage do backend
  id: string;
  clientCompanyProfileId: string;
  packageId: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Propriedades adicionais para exibição na tabela (opcional)
  companyName?: string;
  packageName?: string;
}

interface IndividualContract { // Novo modelo para contrato individual
  id: string;
  clientProfileId: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  agreedHours: number;
  isActive: boolean;
  createdAt: string;
  // Propriedades adicionais para exibição na tabela (opcional)
  clientName?: string;
  employeeName?: string;
}

// DTOs
interface CreateCompanyPackageDto {
  clientCompanyProfileId: string;
  packageId: string;
  startDate: string;
  endDate: string;
}

interface CreateIndividualContractDto {
  clientProfileId: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  agreedHours: number;
}
// --- FIM DAS INTERFACES MOCKADAS ---


export default function ContractsListAndCreation() {
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  const [contractType, setContractType] = useState<'company' | 'individual'>('company');
  
  // Estados para os dados dos formulários
  const [newCompanyContract, setNewCompanyContract] = useState<CreateCompanyPackageDto>({
    clientCompanyProfileId: '',
    packageId: '',
    startDate: '',
    endDate: '',
  });

  const [newIndividualContract, setNewIndividualContract] = useState<CreateIndividualContractDto>({
    clientProfileId: '',
    employeeId: '',
    startDate: '',
    endDate: '',
    agreedHours: 0,
  });

  // Estados para os dados dos dropdowns (mockados)
  const [companyProfiles, setCompanyProfiles] = useState<CompanyProfile[]>([]);
  const [clientProfiles, setClientProfiles] = useState<ClientProfile[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  // Funções de serviço mockadas
  const mockFetchInitialData = async () => {
    // Simula uma chamada API com um pequeno delay
    await new Promise(resolve => setTimeout(resolve, 500)); 
    setCompanyProfiles([
      { id: 'comp1', companyName: 'Tech Solutions Ltda.' },
      { id: 'comp2', companyName: 'Global Innovations S.A.' },
    ]);
    setClientProfiles([
      { id: 'clt1', fullName: 'Ana Paula Silva' },
      { id: 'clt2', fullName: 'Carlos Eduardo Souza' },
    ]);
    setPackages([
      { id: 'pack1', name: 'Pacote Essencial' },
      { id: 'pack2', name: 'Pacote Premium' },
    ]);
    setEmployees([
      { id: 'emp1', fullName: 'Mário Fernandes' },
      { id: 'emp2', fullName: 'Sofia Ramos' },
      { id: 'emp3', fullName: 'Bruno Costa' },
    ]);
  };

  const mockFetchContracts = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800)); // Simula delay da API

    const mockCompanyContracts: CompanyPackage[] = [
      { id: 'co_c1', clientCompanyProfileId: 'comp1', packageId: 'pack1', startDate: '2023-01-15', endDate: '2024-01-15', isActive: true, createdAt: '2023-01-10T00:00:00Z', updatedAt: '2023-01-10T00:00:00Z', companyName: 'Tech Solutions Ltda.', packageName: 'Pacote Essencial' },
      { id: 'co_c2', clientCompanyProfileId: 'comp2', packageId: 'pack2', startDate: '2024-03-01', endDate: '2025-03-01', isActive: true, createdAt: '2024-02-20T00:00:00Z', updatedAt: '2024-02-20T00:00:00Z', companyName: 'Global Innovations S.A.', packageName: 'Pacote Premium' },
    ];

    const mockIndividualContracts: IndividualContract[] = [
      { id: 'ind_c1', clientProfileId: 'clt1', employeeId: 'emp1', startDate: '2023-06-01', endDate: '2024-06-01', agreedHours: 160, isActive: true, createdAt: '2023-05-25T00:00:00Z', clientName: 'Ana Paula Silva', employeeName: 'Mário Fernandes' },
      { id: 'ind_c2', clientProfileId: 'clt2', employeeId: 'emp3', startDate: '2024-01-01', endDate: '2025-01-01', agreedHours: 80, isActive: true, createdAt: '2023-12-20T00:00:00Z', clientName: 'Carlos Eduardo Souza', employeeName: 'Bruno Costa' },
    ];
    
    // Combina e mapeia os contratos para uma estrutura unificada para a tabela
    const allContracts = [
      ...mockCompanyContracts.map(c => ({ ...c, type: 'company' })),
      ...mockIndividualContracts.map(c => ({ ...c, type: 'individual' })),
    ];

    setContracts(allContracts);
    setLoading(false);
  };

  const mockCreateContract = async (data: CreateCompanyPackageDto | CreateIndividualContractDto) => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simula delay de criação
    console.log("Simulando criação de contrato:", data);
    // Em um ambiente real, você faria a chamada API aqui e atualizaria a lista
    return true; // Sucesso simulado
  };


  useEffect(() => {
    mockFetchInitialData();
    mockFetchContracts();
  }, []);

  const handleCreateContract = async () => {
    setIsCreating(true);
    try {
      if (contractType === 'company') {
        if (!newCompanyContract.clientCompanyProfileId || !newCompanyContract.packageId || !newCompanyContract.startDate || !newCompanyContract.endDate) {
            toast.error("Por favor, preencha todos os campos para o contrato de empresa.");
            return;
        }
        await mockCreateContract(newCompanyContract);
        toast.success("Contrato de empresa criado com sucesso!");
      } else {
        if (!newIndividualContract.clientProfileId || !newIndividualContract.employeeId || !newIndividualContract.startDate || !newIndividualContract.endDate || newIndividualContract.agreedHours <= 0) {
            toast.error("Por favor, preencha todos os campos para o contrato individual.");
            return;
        }
        await mockCreateContract(newIndividualContract);
        toast.success("Contrato individual criado com sucesso!");
      }
      setIsModalOpen(false);
      // Resetar formulários
      setNewCompanyContract({ clientCompanyProfileId: '', packageId: '', startDate: '', endDate: '' });
      setNewIndividualContract({ clientProfileId: '', employeeId: '', startDate: '', endDate: '', agreedHours: 0 });
      mockFetchContracts(); // Recarrega a lista de contratos
    } catch (error: any) {
      console.error("Erro ao criar contrato", error);
      toast.error(error.message || "Erro ao criar contrato.");
    } finally {
      setIsCreating(false);
    }
  };

  // Funções mock para exclusão (apenas para exemplo na coluna)
  const handleDeleteContract = (id: string) => {
    toast.info(`Simulando exclusão do contrato: ${id}`);
    // Em um projeto real, você faria a chamada API e recarregaria os dados
    setContracts(prev => prev.filter(c => c.id !== id));
  };


  const columns = contractsColumns(handleDeleteContract); // Passa a função de exclusão
  
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
             page={0}
            setPage={() => 0}
            totalPages={0}
            limit={0}
            setLimit={() => 0}
            filters={[
           ]}
          />
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Criar Novo Contrato</DialogTitle>
            <DialogDescription>
              Selecione o tipo de contrato e preencha os dados.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Tipo de Contrato</Label>
              <div className="col-span-3">
                <Select value={contractType} onValueChange={(value: 'company' | 'individual') => {
                  setContractType(value);
                  // Opcional: Resetar formulários ao mudar o tipo
                  setNewCompanyContract({ clientCompanyProfileId: '', packageId: '', startDate: '', endDate: '' });
                  setNewIndividualContract({ clientProfileId: '', employeeId: '', startDate: '', endDate: '', agreedHours: 0 });
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="company">Contrato com Empresa</SelectItem>
                    <SelectItem value="individual">Contrato com Pessoa Singular</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {/* Formulário Condicional */}
          {contractType === 'company' ? (
            <form className="grid gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="companyProfile" className="text-right">Empresa</Label>
                <Select value={newCompanyContract.clientCompanyProfileId} onValueChange={(value) => setNewCompanyContract(prev => ({ ...prev, clientCompanyProfileId: value }))}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione a empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    {companyProfiles.map(p => <SelectItem key={p.id} value={p.id}>{p.companyName}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="package" className="text-right">Pacote de Serviço</Label>
                <Select value={newCompanyContract.packageId} onValueChange={(value) => setNewCompanyContract(prev => ({ ...prev, packageId: value }))}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione o pacote" />
                  </SelectTrigger>
                  <SelectContent>
                    {packages.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startDateCompany" className="text-right">Data de Início</Label>
                <Input id="startDateCompany" type="date" value={newCompanyContract.startDate} onChange={e => setNewCompanyContract(prev => ({ ...prev, startDate: e.target.value }))} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endDateCompany" className="text-right">Data de Fim</Label>
                <Input id="endDateCompany" type="date" value={newCompanyContract.endDate} onChange={e => setNewCompanyContract(prev => ({ ...prev, endDate: e.target.value }))} className="col-span-3" />
              </div>
            </form>
          ) : (
            <form className="grid gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="clientProfile" className="text-right">Pessoa Singular</Label>
                <Select value={newIndividualContract.clientProfileId} onValueChange={(value) => setNewIndividualContract(prev => ({ ...prev, clientProfileId: value }))}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione a pessoa" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientProfiles.map(p => <SelectItem key={p.id} value={p.id}>{p.fullName}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="employee" className="text-right">Funcionário</Label>
                <Select value={newIndividualContract.employeeId} onValueChange={(value) => setNewIndividualContract(prev => ({ ...prev, employeeId: value }))}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione o funcionário" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map(e => <SelectItem key={e.id} value={e.id}>{e.fullName}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startDateIndividual" className="text-right">Data de Início</Label>
                <Input id="startDateIndividual" type="date" value={newIndividualContract.startDate} onChange={e => setNewIndividualContract(prev => ({ ...prev, startDate: e.target.value }))} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endDateIndividual" className="text-right">Data de Fim</Label>
                <Input id="endDateIndividual" type="date" value={newIndividualContract.endDate} onChange={e => setNewIndividualContract(prev => ({ ...prev, endDate: e.target.value }))} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="agreedHours" className="text-right">Horas Acordadas</Label>
                <Input id="agreedHours" type="number" value={newIndividualContract.agreedHours} onChange={e => setNewIndividualContract(prev => ({ ...prev, agreedHours: Number(e.target.value) }))} className="col-span-3" min={1} />
              </div>
            </form>
          )}

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
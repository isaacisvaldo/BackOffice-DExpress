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
import { Textarea } from "@/components/ui/textarea";
import { createPackage, deletePackage, getPackages, type CreatePackageDto, type Package, type PaginatedPackagesResponse } from "@/services";
import { packageColumns } from "@/components/shared";
import { formatDate } from "@/util";

export default function PackagesList() {
  const [data, setData] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [isDeleting, setIsDeleting] = useState(false);
  const [nameFilter, setNameFilter] = useState<string>("");
  const [debouncedNameFilter, setDebouncedNameFilter] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newPackage, setNewPackage] = useState<CreatePackageDto>({
    name: "",
    description: "",
    employees: 1,
    hours: 1,
    cost: 0,
    percentage: 0,
    equivalent: 0,
    baseSalary: 0,
    totalBalance: 0,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedNameFilter(nameFilter);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [nameFilter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result: PaginatedPackagesResponse = await getPackages({
        page,
        limit: limit === 0 ? undefined : limit,
        search: debouncedNameFilter || undefined,
      });

const mappedData = result.data.map((item) => ({
  ...item,
 createdAt: formatDate(item.createdAt),
  updatedAt: formatDate(item.updatedAt),
}));
    
      

      setData(mappedData);
      setTotalPages(result.totalPages || 1);
    } catch (error) {
      console.error("Erro ao carregar pacotes", error);
      toast.error("Erro ao carregar pacotes.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      await deletePackage(id);
      toast.success("Sucesso", {
        description: "Pacote excluído com sucesso!",
      });
      fetchData();
    } catch (error) {
      console.error("Erro ao excluir pacote:", error);
      toast.error("Erro", {
        description: "Falha ao excluir o pacote. Tente novamente.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, limit, debouncedNameFilter]);

  const handleCreatePackage = async () => {
    if (!newPackage.name.trim()) {
      toast.error("O nome do pacote não pode ser vazio.");
      return;
    }

    setIsCreating(true);
    try {
      await createPackage(newPackage);
      toast.success("Pacote cadastrado com sucesso!");
      setIsModalOpen(false);
      setNewPackage({
        name: "",
        description: "",
        employees: 1,
        hours: 1,
        cost: 0,
        percentage: 0,
        equivalent: 0,
        baseSalary: 0,
        totalBalance: 0,
      });
      fetchData();
    } catch (error: any) {
      console.error("Erro ao cadastrar pacote", error);
      toast.error(error.message || "Erro ao cadastrar pacote.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    
    // Converte o valor para o tipo correto (número ou string)
    const newValue = id === 'employees' || id === 'hours' || id === 'cost' || id === 'percentage' || id === 'equivalent' || id === 'baseSalary' || id === 'totalBalance' ? Number(value) : value;

    setNewPackage(prev => {
      const updatedPackage = { ...prev, [id]: newValue };

      // Lógica de cálculo automático
      const { employees, hours, equivalent, cost } = updatedPackage;

      // Cálculo do Salário Base
      updatedPackage.baseSalary = employees * hours * equivalent;

      // Cálculo do Saldo Total
      updatedPackage.totalBalance = cost - updatedPackage.baseSalary;

      // Cálculo da Percentagem (com verificação para evitar divisão por zero)
      updatedPackage.percentage = cost > 0 ? (updatedPackage.totalBalance / cost) : 0;
 console.log({ 
      employees,
      hours,
      equivalent,
      cost,
      baseSalary: updatedPackage.baseSalary,
      totalBalance: updatedPackage.totalBalance,
      percentage: updatedPackage.percentage,
    });
      return updatedPackage;
    });
  };

  const columns = packageColumns(handleDelete, isDeleting);
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold mb-4">Pacotes de Serviço</h1>

      <div className="flex justify-end mb-4">
        <Button onClick={() => setIsModalOpen(true)}>Cadastrar Novo Pacote</Button>
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
                column: "name",
                placeholder: "Filtrar por nome...",
                value: nameFilter,
                onChange: setNameFilter,
              },
            ]}
          />
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[700px]"> {/* Modal aumentado */}
          <DialogHeader>
            <DialogTitle>Cadastrar Novo Pacote</DialogTitle>
            <DialogDescription>
              Preencha os dados para cadastrar um novo pacote de serviço.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Nome</Label>
              <Input id="name" value={newPackage.name} onChange={handleChange} className="col-span-3" placeholder="Nome do pacote" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Descrição</Label>
              <Textarea id="description" value={newPackage.description || ''} onChange={handleChange as any} className="col-span-3" placeholder="Descrição do pacote" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="employees" className="text-right">Nº Funcionários</Label>
              <Input id="employees" type="number" value={newPackage.employees} onChange={handleChange} className="col-span-3" min={1} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="hours" className="text-right">Horas</Label>
              <Input id="hours" type="number" value={newPackage.hours} onChange={handleChange} className="col-span-3" min={1} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="equivalent" className="text-right">Salário p/ Func. (Kz/h)</Label>
              <Input id="equivalent" type="number" value={newPackage.equivalent} onChange={handleChange} className="col-span-3" min={0} step="0.01" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cost" className="text-right">Custo Total (Kz)</Label>
              <Input id="cost" type="number" value={newPackage.cost} onChange={handleChange} className="col-span-3" min={0} step="0.01" />
            </div>
            
            {/* Campos Calculados e Read-only */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="baseSalary" className="text-right">Salário Base (Kz)</Label>
              <Input id="baseSalary" type="number" value={newPackage.baseSalary} readOnly className="col-span-3 bg-gray-100 dark:bg-gray-800 cursor-not-allowed" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="totalBalance" className="text-right">Saldo Total (Kz)</Label>
              <Input id="totalBalance" type="number" value={newPackage.totalBalance} readOnly className="col-span-3 bg-gray-100 dark:bg-gray-800 cursor-not-allowed" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="percentage" className="text-right">Percentagem (%)</Label>
              <Input id="percentage" type="number" value={(newPackage.percentage * 100).toFixed(2)} readOnly className="col-span-3 bg-gray-100 dark:bg-gray-800 cursor-not-allowed" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreatePackage} disabled={isCreating}>
              {isCreating ? "Cadastrando..." : "Cadastrar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
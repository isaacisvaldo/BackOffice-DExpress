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
import {
  createPackage,
  deletePackage,
  getPackages,
  updatePackage, // <-- Importar a nova função
  type CreatePackageDto,
  type Package,
  type PaginatedPackagesResponse,
} from "@/services";
import { packageColumns } from "@/components/shared";
import { formatDate } from "@/util";
import { MinusCircle, PlusCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

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
    price: 0,
    details: [],
  });
  
  // Adiciona o estado para o pacote que está sendo editado
  const [editingPackage, setEditingPackage] = useState<Package | null>(null); 
  const [newDetailItem, setNewDetailItem] = useState("");

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

  // Nova função para lidar com a edição
  const handleEdit = (pkg: Package) => {
    setEditingPackage(pkg);
    setNewPackage({
      name: pkg.name,
      description: pkg.description,
      employees: pkg.employees,
      price: pkg.price,
      details: pkg.details,
    });
    setIsModalOpen(true);
  };

  const handleModalOpenChange = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      // Limpa os estados quando o modal é fechado
      setEditingPackage(null);
      setNewPackage({
        name: "",
        description: "",
        employees: 1,
        price: 0,
        details: [],
      });
      setNewDetailItem("");
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, limit, debouncedNameFilter]);

  const handleUpsertPackage = async () => {
    if (!newPackage.name.trim() || newPackage.price <= 0) {
      toast.error("O nome e o preço do pacote são obrigatórios.");
      return;
    }

    setIsCreating(true);
    try {
      if (editingPackage) {
        // Lógica de edição
        await updatePackage(editingPackage.id, newPackage);
        toast.success("Pacote atualizado com sucesso!");
      } else {
        // Lógica de criação
        await createPackage(newPackage);
        toast.success("Pacote cadastrado com sucesso!");
      }

      handleModalOpenChange(false);
      fetchData();
    } catch (error: any) {
      console.error("Erro ao salvar pacote", error);
      toast.error(error.message || "Erro ao salvar pacote.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    const newValue = id === 'price' || id === 'employees' ? Number(value) : value;
    setNewPackage(prev => ({ ...prev, [id]: newValue }));
  };

  const handleAddDetail = () => {
    if (newDetailItem.trim() !== "") {
      setNewPackage(prev => ({ ...prev, details: [...prev.details!, newDetailItem.trim()] }));
      setNewDetailItem("");
    }
  };

  const handleRemoveDetail = (indexToRemove: number) => {
    setNewPackage(prev => ({
      ...prev,
      details: prev.details!.filter((_, index) => index !== indexToRemove)
    }));
  };

  const columns = packageColumns(handleDelete, isDeleting, handleEdit);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold mb-4">Pacotes de Serviço</h1>

      <div className="flex justify-end mb-4">
        <Button onClick={() => handleModalOpenChange(true)}>Cadastrar Novo Pacote</Button>
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

      <Dialog open={isModalOpen} onOpenChange={handleModalOpenChange}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>{editingPackage ? "Editar Pacote" : "Cadastrar Novo Pacote"}</DialogTitle>
            <DialogDescription>
              {editingPackage ? "Atualize os dados do pacote de serviço." : "Preencha os dados para cadastrar um novo pacote de serviço."}
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
              <Label htmlFor="price" className="text-right">Preço (Kz)</Label>
              <Input id="price" type="number" value={newPackage.price} onChange={handleChange} className="col-span-3" min={0} step="0.01" />
            </div>
            
            {/* Seção de Adição Dinâmica */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="details" className="text-right">O que está incluído</Label>
              <div className="col-span-3 flex flex-col gap-2">
                {/* Inputs Dinâmicos para os detalhes */}
                {newPackage.details && newPackage.details.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input value={item} readOnly className="flex-1" />
                    <Button type="button" variant="ghost" onClick={() => handleRemoveDetail(index)}>
                      <MinusCircle className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}

                {/* Input e Botão para Adicionar */}
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Adicionar item"
                    value={newDetailItem}
                    onChange={(e) => setNewDetailItem(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddDetail();
                      }
                    }}
                    className="flex-1"
                  />
                  <Button type="button" onClick={handleAddDetail}>
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => handleModalOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpsertPackage} disabled={isCreating}>
              {isCreating ? (editingPackage ? "Atualizando..." : "Cadastrando...") : (editingPackage ? "Atualizar" : "Cadastrar")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
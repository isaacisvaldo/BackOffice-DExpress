// src/components/marital-statuses/MaritalStatusList.tsx

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

import { maritalStatusColumns, type MaritalStatus } from "@/components/shared/marital-status-columns";
import { createMaritalStatus, deleteMaritalStatus, getMaritalStatuses } from "@/services/shared/marital-statuses/marital-statuses.service";
import SwirlingEffectSpinner from "@/components/customized/spinner/spinner-06";

export default function MaritalStatusList() {
  const [data, setData] = useState<MaritalStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [isDeleting, setIsDeleting] = useState(false);

  const [nameFilter, setNameFilter] = useState<string>("");
  const [debouncedNameFilter, setDebouncedNameFilter] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMaritalStatusName, setNewMaritalStatusName] = useState<string>("");
  const [newMaritalStatusLabel, setNewMaritalStatusLabel] = useState<string>("");
  const [isCreatingMaritalStatus, setIsCreatingMaritalStatus] = useState(false);

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
      const result = await getMaritalStatuses({
        page,
        limit: limit === 0 ? undefined : limit,
        search: debouncedNameFilter || undefined,
      });

      const mappedData: MaritalStatus[] = result.data.map((item: any) => ({
        id: item.id,
        name: item.name,
        label: item.label,
        createdAt: new Date(item.createdAt).toLocaleDateString("pt-PT"),
        updatedAt: new Date(item.updatedAt).toLocaleDateString("pt-PT"),
      }));

      setData(mappedData);
      setTotalPages(result.totalPages || 1);
    } catch (error) {
      console.error("Erro ao carregar estados civis", error);
      toast.error("Erro ao carregar estados civis.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      await deleteMaritalStatus(id);
      toast.success("Sucesso", {
        description: "Estado civil excluído com sucesso!",
      });
      fetchData();
    } catch (error) {
      console.error("Erro ao excluir estado civil:", error);
      toast.error("Erro", {
        description: "Falha ao excluir o estado civil. Tente novamente.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, limit, debouncedNameFilter]);

  const handleCreateMaritalStatus = async () => {
    if (!newMaritalStatusName.trim() || !newMaritalStatusLabel.trim()) {
      toast.error("Nome e rótulo do estado civil não podem ser vazios.");
      return;
    }

    setIsCreatingMaritalStatus(true);
    try {
      await createMaritalStatus({
        name: newMaritalStatusName,
        label: newMaritalStatusLabel,
      });
      toast.success("Estado civil cadastrado com sucesso!");
      setIsModalOpen(false);
      setNewMaritalStatusName("");
      setNewMaritalStatusLabel("");
      fetchData();
    } catch (error: any) {
      console.error("Erro ao cadastrar estado civil", error);
      toast.error(error.message || "Erro ao cadastrar estado civil.");
    } finally {
      setIsCreatingMaritalStatus(false);
    }
  };

  const columns = maritalStatusColumns(handleDelete, isDeleting);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold mb-4">Estados Civis</h1>

      <div className="flex justify-end mb-4">
        <Button onClick={() => setIsModalOpen(true)}>Cadastrar Novo Estado Civil</Button>
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
                column: "name",
                placeholder: "Filtrar por Nome...",
                value: nameFilter,
                onChange: setNameFilter,
              },
            ]}
          />
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Cadastrar Novo Estado Civil</DialogTitle>
            <DialogDescription>
              Preencha os dados para cadastrar um novo estado civil.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="maritalStatusName" className="text-right">
                Nome
              </Label>
              <Input
                id="maritalStatusName"
                value={newMaritalStatusName}
                onChange={(e) => setNewMaritalStatusName(e.target.value)}
                className="col-span-3"
                placeholder="Ex: CASADO"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="maritalStatusLabel" className="text-right">
                Rótulo
              </Label>
              <Input
                id="maritalStatusLabel"
                value={newMaritalStatusLabel}
                onChange={(e) => setNewMaritalStatusLabel(e.target.value)}
                className="col-span-3"
                placeholder="Ex: married"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateMaritalStatus} disabled={isCreatingMaritalStatus}>
              {isCreatingMaritalStatus ? "Cadastrando..." : "Cadastrar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
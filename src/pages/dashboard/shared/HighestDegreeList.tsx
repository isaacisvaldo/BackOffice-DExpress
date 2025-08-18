// src/components/highest-degrees/HighestDegreeList.tsx

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

import { highestDegreeColumns, type HighestDegree } from "@/components/shared/highest-degree-column";
import { createHighestDegree, deleteHighestDegree, getHighestDegrees } from "@/services/shared/highest-degrees/highest-degree.service"; // Ensure correct path for service
import SwirlingEffectSpinner from "@/components/customized/spinner/spinner-06";

export default function HighestDegreeList() {
  const [data, setData] = useState<HighestDegree[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [isDeleting, setIsDeleting] = useState(false);

  const [nameFilter, setNameFilter] = useState<string>("");
  const [debouncedNameFilter, setDebouncedNameFilter] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newHighestDegreeName, setNewHighestDegreeName] = useState<string>("");
  const [newHighestDegreeLabel, setNewHighestDegreeLabel] = useState<string>("");
  const [newHighestDegreeLevel, setNewHighestDegreeLevel] = useState<number>(0); // New state for level, initialized to 0
  const [isCreatingHighestDegree, setIsCreatingHighestDegree] = useState(false);

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
      const result = await getHighestDegrees({
        page,
        limit: limit === 0 ? undefined : limit,
        search: debouncedNameFilter || undefined,
      });

      const mappedData: HighestDegree[] = result.data.map((item: any) => ({
        id: item.id,
        name: item.name, // Ensure 'name' is mapped if it exists in your API response
        label: item.label,
        level: item.level, // Map the new 'level' field
        createdAt: new Date(item.createdAt).toLocaleDateString("pt-PT"),
        updatedAt: new Date(item.updatedAt).toLocaleDateString("pt-PT"),
      }));

      setData(mappedData);
      setTotalPages(result.totalPages || 1);
    } catch (error) {
      console.error("Erro ao carregar níveis de escolaridade", error);
      toast.error("Erro ao carregar níveis de escolaridade.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      await deleteHighestDegree(id);
      toast.success("Sucesso", {
        description: "Nível de escolaridade excluído com sucesso!",
      });
      fetchData();
    } catch (error) {
      console.error("Erro ao excluir nível de escolaridade:", error);
      toast.error("Erro", {
        description: "Falha ao excluir o nível de escolaridade. Tente novamente.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, limit, debouncedNameFilter]);

  const handleCreateHighestDegree = async () => {
    if (!newHighestDegreeName.trim() || !newHighestDegreeLabel.trim()) {
      toast.error("Nome e rótulo não podem ser vazios.");
      return;
    }
    // Basic validation for level to ensure it's a number
    if (isNaN(newHighestDegreeLevel) || newHighestDegreeLevel < 0) {
        toast.error("O nível deve ser um número válido e não negativo.");
        return;
    }

    setIsCreatingHighestDegree(true);
    try {
      await createHighestDegree({
        name: newHighestDegreeName,
        label: newHighestDegreeLabel,
        level: newHighestDegreeLevel, // Pass the new level field
      });
      toast.success("Nível de escolaridade cadastrado com sucesso!");
      setIsModalOpen(false);
      setNewHighestDegreeName("");
      setNewHighestDegreeLabel("");
      setNewHighestDegreeLevel(0); // Reset level after creation
      fetchData();
    } catch (error: any) {
      console.error("Erro ao cadastrar nível de escolaridade", error);
      toast.error(error.message || "Erro ao cadastrar nível de escolaridade.");
    } finally {
      setIsCreatingHighestDegree(false);
    }
  };

  const columns = highestDegreeColumns(handleDelete, isDeleting);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold mb-4">Níveis de Escolaridade</h1>

      <div className="flex justify-end mb-4">
        <Button onClick={() => setIsModalOpen(true)}>Cadastrar Novo Nível</Button>
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
            <DialogTitle>Cadastrar Novo Nível</DialogTitle>
            <DialogDescription>
              Preencha os dados para cadastrar um novo nível de escolaridade.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="highestDegreeName" className="text-right">
                Nome
              </Label>
              <Input
                id="highestDegreeName"
                value={newHighestDegreeName}
                onChange={(e) => setNewHighestDegreeName(e.target.value)}
                className="col-span-3"
                placeholder="Ex: ENSINO SECUNDÁRIO"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="highestDegreeLabel" className="text-right">
                Rótulo
              </Label>
              <Input
                id="highestDegreeLabel"
                value={newHighestDegreeLabel}
                onChange={(e) => setNewHighestDegreeLabel(e.target.value)}
                className="col-span-3"
                placeholder="Ex: high_school"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="highestDegreeLevel" className="text-right">
                Nível
              </Label>
              <Input
                id="highestDegreeLevel"
                type="number" // Set input type to number
                value={newHighestDegreeLevel}
                onChange={(e) => setNewHighestDegreeLevel(Number(e.target.value))} // Convert to number
                className="col-span-3"
                placeholder="Ex: 3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateHighestDegree} disabled={isCreatingHighestDegree}>
              {isCreatingHighestDegree ? "Cadastrando..." : "Cadastrar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
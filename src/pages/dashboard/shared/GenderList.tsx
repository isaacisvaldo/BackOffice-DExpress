// src/components/gender/GenderList.tsx

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
import { genderColumns, type Gender } from "@/components/shared/gender-columns";
import { createGender, deleteGender, getGenders } from "@/services/shared/gender/gender.service";
import SwirlingEffectSpinner from "@/components/customized/spinner/spinner-06";

export default function GenderList() {
  const [data, setData] = useState<Gender[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [isDeleting, setIsDeleting] = useState(false);

  const [nameFilter, setNameFilter] = useState<string>("");
  const [debouncedNameFilter, setDebouncedNameFilter] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGenderName, setNewGenderName] = useState<string>("");
  const [newGenderLabel, setNewGenderLabel] = useState<string>(""); // Added for consistency with other entities, though not in your CreateGenderDto
  const [isCreatingGender, setIsCreatingGender] = useState(false);

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
      const result = await getGenders({
        page,
        limit: limit === 0 ? undefined : limit,
        name: debouncedNameFilter || undefined,
      });

      const mappedData: Gender[] = result.data.map((item: any) => ({
        id: item.id,
        name: item.name,
        label: item.label, // Map 'label' if it exists in your API response
        createdAt: new Date(item.createdAt).toLocaleDateString("pt-PT"),
        updatedAt: new Date(item.updatedAt).toLocaleDateString("pt-PT"),
      }));

      setData(mappedData);
      setTotalPages(result.totalPages || 1);
    } catch (error) {
      console.error("Erro ao carregar gêneros", error);
      toast.error("Erro ao carregar gêneros.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      await deleteGender(id);
      toast.success("Sucesso", {
        description: "Gênero excluído com sucesso!",
      });
      fetchData();
    } catch (error) {
      console.error("Erro ao excluir gênero:", error);
      toast.error("Erro", {
        description: "Falha ao excluir o gênero. Tente novamente.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, limit, debouncedNameFilter]);

  const handleCreateGender = async () => {
    if (!newGenderName.trim()) { // Only check 'name' as per CreateGenderDto
      toast.error("O nome do gênero não pode ser vazio.");
      return;
    }

    setIsCreatingGender(true);
    try {
      // Note: Your CreateGenderDto only has 'name'. If 'label' is also needed by the backend,
      // you'll need to update CreateGenderDto in gender.service.ts
      await createGender({
        name: newGenderName,
        label: newGenderLabel,
      });
      toast.success("Gênero cadastrado com sucesso!");
      setIsModalOpen(false);
      setNewGenderName("");
      setNewGenderLabel(""); // Clear label field as well
      fetchData();
    } catch (error: any) {
      console.error("Erro ao cadastrar gênero", error);
      toast.error(error.message || "Erro ao cadastrar gênero.");
    } finally {
      setIsCreatingGender(false);
    }
  };

  const columns = genderColumns(handleDelete, isDeleting);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold mb-4">Gêneros</h1>

      <div className="flex justify-end mb-4">
        <Button onClick={() => setIsModalOpen(true)}>Cadastrar Novo Gênero</Button>
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
            <DialogTitle>Cadastrar Novo Gênero</DialogTitle>
            <DialogDescription>
              Preencha os dados para cadastrar um novo gênero.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="genderName" className="text-right">
                Nome
              </Label>
              <Input
                id="genderName"
                value={newGenderName}
                onChange={(e) => setNewGenderName(e.target.value)}
                className="col-span-3"
                placeholder="Ex: MASCULINO"
              />
            </div>
            {/* The 'label' field is included here for consistency, but
                your CreateGenderDto only expects 'name'. If your API
                actually requires 'label' for creation, you'll need to
                update CreateGenderDto in your service file. */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="genderLabel" className="text-right">
                Rótulo
              </Label>
              <Input
                id="genderLabel"
                value={newGenderLabel}
                onChange={(e) => setNewGenderLabel(e.target.value)}
                className="col-span-3"
                placeholder="Ex: male"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateGender} disabled={isCreatingGender}>
              {isCreatingGender ? "Cadastrando..." : "Cadastrar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
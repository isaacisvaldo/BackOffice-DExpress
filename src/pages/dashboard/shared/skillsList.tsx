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
import { skillColumns, type Skill } from "@/components/shared/skill-columns";
import { createSkill, deleteSkill, getSkills } from "@/services/shared/skills/skills.service";
import SwirlingEffectSpinner from "@/components/customized/spinner/spinner-06";

export default function SkillList() {
  const [data, setData] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [isDeleting, setIsDeleting] = useState(false);

  const [nameFilter, setNameFilter] = useState<string>("");
  const [debouncedNameFilter, setDebouncedNameFilter] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSkillName, setNewSkillName] = useState<string>("");
  const [newSkillLabel, setNewSkillLabel] = useState<string>("");
  const [isCreatingSkill, setIsCreatingSkill] = useState(false);

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
      const result = await getSkills({
        page,
        limit: limit === 0 ? undefined : limit,
        search: debouncedNameFilter || undefined,
      });

      const mappedData: Skill[] = result.data.map((item: any) => ({
        id: item.id,
        name: item.name,
        label: item.label,
        createdAt: new Date(item.createdAt).toLocaleDateString("pt-PT"),
        updatedAt: new Date(item.updatedAt).toLocaleDateString("pt-PT"),
      }));

      setData(mappedData);
      setTotalPages(result.totalPages || 1);
    } catch (error) {
      console.error("Erro ao carregar habilidades", error);
      toast.error("Erro ao carregar habilidades.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      await deleteSkill(id);
      toast.success("Sucesso", {
        description: "Habilidade excluída com sucesso!",
      });
      fetchData();
    } catch (error) {
      console.error("Erro ao excluir habilidade:", error);
      toast.error("Erro", {
        description: "Falha ao excluir a habilidade. Tente novamente.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, limit, debouncedNameFilter]);

  const handleCreateSkill = async () => {
    if (!newSkillName.trim() || !newSkillLabel.trim()) {
      toast.error("Nome e rótulo da habilidade não podem ser vazios.");
      return;
    }

    setIsCreatingSkill(true);
    try {
      await createSkill({
        name: newSkillName,
        label: newSkillLabel,
      });
      toast.success("Habilidade cadastrada com sucesso!");
      setIsModalOpen(false);
      setNewSkillName("");
      setNewSkillLabel("");
      fetchData();
    } catch (error: any) {
      console.error("Erro ao cadastrar habilidade", error);
      toast.error(error.message || "Erro ao cadastrar habilidade.");
    } finally {
      setIsCreatingSkill(false);
    }
  };

  const columns = skillColumns(handleDelete, isDeleting);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold mb-4">Habilidades</h1>

      <div className="flex justify-end mb-4">
        <Button onClick={() => setIsModalOpen(true)}>Cadastrar Nova Habilidade</Button>
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
                column: "label",
                placeholder: "Filtrar por Rótulo...",
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
            <DialogTitle>Cadastrar Nova Habilidade</DialogTitle>
            <DialogDescription>
              Preencha os dados para cadastrar uma nova habilidade.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="skillName" className="text-right">
                Nome
              </Label>
              <Input
                id="skillName"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                className="col-span-3"
                placeholder="Ex: PROGRAMAÇÃO"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="skillLabel" className="text-right">
                Rótulo
              </Label>
              <Input
                id="skillLabel"
                value={newSkillLabel}
                onChange={(e) => setNewSkillLabel(e.target.value)}
                className="col-span-3"
                placeholder="Ex: programming"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateSkill} disabled={isCreatingSkill}>
              {isCreatingSkill ? "Cadastrando..." : "Cadastrar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
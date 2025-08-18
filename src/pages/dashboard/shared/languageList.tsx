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
import { createLanguage, deleteLanguage, getLanguages } from "@/services/shared/language/language.service";
import { languageColumns, type Language } from "@/components/shared/language-column";
import SwirlingEffectSpinner from "@/components/customized/spinner/spinner-06";

export default function LanguageList() {
  const [data, setData] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [isDeleting, setIsDeleting] = useState(false);

  const [nameFilter, setNameFilter] = useState<string>("");
  const [debouncedNameFilter, setDebouncedNameFilter] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLanguageName, setNewLanguageName] = useState<string>("");
  const [newLanguageLabel, setNewLanguageLabel] = useState<string>("");
  const [isCreatingLanguage, setIsCreatingLanguage] = useState(false);

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
      const result = await getLanguages({
        page,
        limit: limit === 0 ? undefined : limit,
        search: debouncedNameFilter || undefined, // Filter by 'label' for languages
      });

      const mappedData: Language[] = result.data.map((item: any) => ({
        id: item.id,
        name: item.name,
        label: item.label,
        createdAt: new Date(item.createdAt).toLocaleDateString("pt-PT"),
        updatedAt: new Date(item.updatedAt).toLocaleDateString("pt-PT"),
      }));

      setData(mappedData);
      setTotalPages(result.totalPages || 1);
    } catch (error) {
      console.error("Erro ao carregar idiomas", error);
      toast.error("Erro ao carregar idiomas.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      await deleteLanguage(id);
      toast.success("Sucesso", {
        description: "Idioma excluído com sucesso!",
      });
      fetchData();
    } catch (error) {
      console.error("Erro ao excluir idioma:", error);
      toast.error("Erro", {
        description: "Falha ao excluir o Idioma. Tente novamente.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, limit, debouncedNameFilter]);

  const handleCreateLanguage = async () => {
    if (!newLanguageName.trim() || !newLanguageLabel.trim()) {
      toast.error("Nome e rótulo do idioma não podem ser vazios.");
      return;
    }

    setIsCreatingLanguage(true);
    try {
      await createLanguage({
        name: newLanguageName,
        label: newLanguageLabel,
      });
      toast.success("Idioma cadastrado com sucesso!");
      setIsModalOpen(false);
      setNewLanguageName("");
      setNewLanguageLabel("");
      fetchData();
    } catch (error: any) {
      console.error("Erro ao cadastrar idioma", error);
      toast.error(error.message || "Erro ao cadastrar idioma.");
    } finally {
      setIsCreatingLanguage(false);
    }
  };

  const columns = languageColumns(handleDelete, isDeleting); 

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold mb-4">Idiomas</h1>

      <div className="flex justify-end mb-4">
        <Button onClick={() => setIsModalOpen(true)}>Cadastrar Novo Idioma</Button>
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
                placeholder: "Filtrar por Rotulo...",
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
            <DialogTitle>Cadastrar Novo Idioma</DialogTitle>
            <DialogDescription>
              Preencha os dados para cadastrar um novo idioma.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="languageName" className="text-right">
                Nome
              </Label>
              <Input
                id="languageName"
                value={newLanguageName}
                onChange={(e) => setNewLanguageName(e.target.value)}
                className="col-span-3"
                placeholder="Ex: PORTUGUESE"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="languageLabel" className="text-right">
                Rótulo
              </Label>
              <Input
                id="languageLabel"
                value={newLanguageLabel}
                onChange={(e) => setNewLanguageLabel(e.target.value)}
                className="col-span-3"
                placeholder="Ex: pt-PT"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateLanguage} disabled={isCreatingLanguage}>
              {isCreatingLanguage ? "Cadastrando..." : "Cadastrar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import { cityColumns, type City } from "@/components/location/citiesColunn";
import { deleteCity, getCities } from "@/services/location/cities.service";
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
import { createCity as createCityService } from "@/services/location/cities.service";
import { toast } from "sonner";
import SwirlingEffectSpinner from "@/components/customized/spinner/spinner-06";

export default function CitiesList() {
  const [data, setData] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
const [isDeleting, setIsDeleting] = useState(false);
  const [nameFilter, setNameFilter] = useState<string>("");
  const [debouncedNameFilter, setDebouncedNameFilter] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCityName, setNewCityName] = useState<string>("");
  const [isCreatingCity, setIsCreatingCity] = useState(false);

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
      const result = await getCities({
        page,
        limit: limit === 0 ? undefined : limit,
        search: debouncedNameFilter || undefined,
      });

      const mappedData: City[] = result.data.map((item: any) => ({
        id: item.id,
        name: item.name,
        createdAt: new Date(item.createdAt).toLocaleDateString("pt-PT"),
        updatedAt: new Date(item.updatedAt).toLocaleDateString("pt-PT"),
      }));

      setData(mappedData);
      setTotalPages(result.totalPages || 1);
    } catch (error) {
      console.error("Erro ao carregar cidades", error);
      toast.error("Erro ao carregar cidades.");
    } finally {
      setLoading(false);
    }
  };
 const handleDelete = async (id: string) => {
    setIsDeleting(true); 
    try {
      await deleteCity(id);
      toast.success("Sucesso", {
        description: "Cidade excluído com sucesso!",
      });
      fetchData(); 
    } catch (error) {
      console.error("Erro ao excluir admin:", error);
      toast.error("Erro", {
        description: "Falha ao excluir o Cidade. Tente novamente.",
      });
    } finally {
      setIsDeleting(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [page, limit, debouncedNameFilter]);

  const handleCreateCity = async () => {
    if (!newCityName.trim()) {
      toast.error("O nome da cidade não pode ser vazio.");
      return;
    }

    setIsCreatingCity(true);
    try {
      await createCityService({ name: newCityName });
      toast.success("Cidade cadastrada com sucesso!");
      setIsModalOpen(false);
      setNewCityName("");
      fetchData();
    } catch (error: any) {
      console.error("Erro ao cadastrar cidade", error);
      toast.error(error.message || "Erro ao cadastrar cidade.");
    } finally {
      setIsCreatingCity(false);
    }
  };
  const columns = cityColumns(handleDelete, isDeleting);
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold mb-4"> Cidades</h1>

      <div className="flex justify-end mb-4">
        <Button onClick={() => setIsModalOpen(true)}>Cadastrar Nova Cidade</Button>
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
                placeholder: "Filtrar por nome...",
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
            <DialogTitle>Cadastrar Nova Cidade</DialogTitle>
            <DialogDescription>
              Preencha os dados para cadastrar uma nova cidade.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cityName" className="text-right">
                Nome
              </Label>
              <Input
                id="cityName"
                value={newCityName}
                onChange={(e) => setNewCityName(e.target.value)}
                className="col-span-3"
                placeholder="Nome da cidade"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateCity} disabled={isCreatingCity}>
              {isCreatingCity ? "Cadastrando..." : "Cadastrar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
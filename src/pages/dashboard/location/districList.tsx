import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import { deleteDistrict, getDistricts } from "@/services/location/districts.service";
import type { DistrictWithCity } from "@/services/location/districts.service";
import { districtColumns } from "@/components/location/districtsColunn";
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
import { createDistrict as createDistrictService } from "@/services/location/districts.service";
import { toast } from "sonner";
import {  getCitiesList } from "@/services/location/cities.service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SwirlingEffectSpinner from "@/components/customized/spinner/spinner-06";

type City = {
  id: string;
  name: string;
};

export default function DistrictList() {
  const [data, setData] = useState<DistrictWithCity[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [isDeleting, setIsDeleting] = useState(false);
  const [nameFilter, setNameFilter] = useState<string>("");
  const [debouncedNameFilter, setDebouncedNameFilter] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDistrictName, setNewDistrictName] = useState<string>("");
  const [selectedCityId, setSelectedCityId] = useState<string>("");
  const [cities, setCities] = useState<City[]>([]);
  const [isCreatingDistrict, setIsCreatingDistrict] = useState(false);

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
      const result = await getDistricts({
        page,
        limit: limit === 0 ? undefined : limit,
        search: debouncedNameFilter || undefined,
      });

      const mappedData: DistrictWithCity[] = result.data.map((item) => ({
        ...item,
        createdAt: new Date(item.createdAt).toLocaleDateString("pt-PT"),
        updatedAt: new Date(item.updatedAt).toLocaleDateString("pt-PT"),
      }));

      setData(mappedData);
      setTotalPages(result.totalPages || 1);
    } catch (error) {
      console.error("Erro ao carregar distritos", error);
      toast.error("Erro ao carregar distritos.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCities = async () => {
    try {
      const result = await getCitiesList();
      setCities(result);
    } catch (error) {
      console.error("Erro ao carregar cidades para o select", error);
      toast.error("Erro ao carregar cidades.");
    }
  };
 const handleDelete = async (id: string) => {
    setIsDeleting(true); 
    try {
      await deleteDistrict(id);
     
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

  const handleOpenModal = () => {
    fetchCities();
    setIsModalOpen(true);
  };

  const handleCreateDistrict = async () => {
    if (!newDistrictName.trim() || !selectedCityId) {
      toast.error("O nome do distrito e a cidade não podem ser vazios.");
      return;
    }

    setIsCreatingDistrict(true);
    try {
      await createDistrictService({
        name: newDistrictName,
        cityId: selectedCityId,
      });
      toast.success("Distrito cadastrado com sucesso!");
      setIsModalOpen(false);
      setNewDistrictName("");
      setSelectedCityId("");
      fetchData();
    } catch (error: any) {
      console.error("Erro ao cadastrar distrito", error);
      toast.error(error.message || "Erro ao cadastrar distrito.");
    } finally {
      setIsCreatingDistrict(false);
    }
  };
 const columns = districtColumns(handleDelete, isDeleting);
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold mb-4">Lista de Distritos</h1>

      <div className="flex justify-end mb-4">
        <Button onClick={handleOpenModal}>Cadastrar Novo Distrito</Button>
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
            <DialogTitle>Cadastrar Novo Distrito</DialogTitle>
            <DialogDescription>
              Preencha os dados para cadastrar um novo distrito.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="districtName" className="text-right">
                Nome
              </Label>
              <Input
                id="districtName"
                value={newDistrictName}
                onChange={(e) => setNewDistrictName(e.target.value)}
                className="col-span-3"
                placeholder="Nome do distrito"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="city" className="text-right">
                Cidade
              </Label>
              <Select onValueChange={setSelectedCityId} value={selectedCityId}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione uma cidade" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.id} value={city.id}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateDistrict} disabled={isCreatingDistrict}>
              {isCreatingDistrict ? "Cadastrando..." : "Cadastrar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
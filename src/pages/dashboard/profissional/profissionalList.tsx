import { DataTable } from "@/components/data-table";
import { professionalColumns, type MappedProfessional } from "@/components/profissional/professionals-columns";
import { deleteProfessional, getProfessionals, updateProfessionalAvailability, type Professional } from "@/services/profissional/profissional.service";
import { getDesiredPositionsList } from "@/services/shared/desired-positions/desired-positions.service";
import { getExperienceLevelsList } from "@/services/shared/experience-levels/experience-levels.service";
import { getGeneralAvailabilitiesList } from "@/services/shared/general-availabilities/general-availability.service";
import type { DesiredPosition, GeneralAvailability, ExperienceLevel } from "@/types/types";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

export default function ProfessionalsList() {
  const [loading, setLoading] = useState(true);
  const [professionals, setProfessionals] = useState<MappedProfessional[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const [desiredPositions, setDesiredPositions] = useState<DesiredPosition[]>([]);
  const [availabilities, setAvailabilities] = useState<GeneralAvailability[]>([]);
  const [experienceLevels, setExperienceLevels] = useState<ExperienceLevel[]>([]);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [nameFilter, setNameFilter] = useState("");
  const [availabilityTypeIdFilter, setAvailabilityTypeIdFilter] = useState("all");
  const [experienceLevelIdFilter, setExperienceLevelIdFilter] = useState("all");
  const [desiredPositionIdFilter, setDesiredPositionIdFilter] = useState("all");

  useEffect(() => {
    async function fetchFilterOptions() {
      try {
        const [positionsResult, availabilitiesResult, experienceLevelsResult] = await Promise.all([
          getDesiredPositionsList(),
          getGeneralAvailabilitiesList(),
          getExperienceLevelsList(),
        ]);
        setDesiredPositions(positionsResult);
        setAvailabilities(availabilitiesResult);
        setExperienceLevels(experienceLevelsResult);
      } catch (error) {
        console.error("Erro ao carregar opções de filtro:", error);
        toast.error("Erro", { description: "Não foi possível carregar as opções de filtro." });
      }
    }
    fetchFilterOptions();
  }, []);

  const fetchProfessionals = useCallback(async () => {
    setLoading(true);
    try {
      const filters = {
        name: nameFilter,
        availabilityTypeId: availabilityTypeIdFilter !== "all" ? availabilityTypeIdFilter : undefined,
        experienceLevelId: experienceLevelIdFilter !== "all" ? experienceLevelIdFilter : undefined,
        desiredPositionId: desiredPositionIdFilter !== "all" ? desiredPositionIdFilter : undefined,
        page,
        limit,
      };
      const result = await getProfessionals(filters);

      const mappedData: MappedProfessional[] = result.data.map((item: Professional) => ({
        id: item.id,
        fullName: item.fullName,
        email: item.email,
        phoneNumber: item.phoneNumber,
        isAvailable: item.isAvailable,
        availabilityType: availabilities.find(a => a.id === item.availabilityTypeId)?.label || "N/A",
        experienceLevel: experienceLevels.find(e => e.id === item.experienceLevelId)?.label || "N/A",
        desiredPosition: desiredPositions.find(p => p.id === item.desiredPositionId)?.label || "N/A",
        location: `${item.location?.city?.name ?? ""} - ${item.location?.district?.name ?? ""}`,
      }));
      setProfessionals(mappedData);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error("Erro ao carregar profissionais:", error);
      toast.error("Erro", { description: "Não foi possível carregar a lista de profissionais." });
    } finally {
      setLoading(false);
    }
  }, [
    nameFilter,
    availabilityTypeIdFilter,
    experienceLevelIdFilter,
    desiredPositionIdFilter,
    page,
    limit,
    availabilities,
    desiredPositions,
    experienceLevels,
  ]);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      fetchProfessionals();
    }, 500);

    return () => clearTimeout(debounceTimeout);
  }, [fetchProfessionals]);

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      await deleteProfessional(id);
      toast.success("Sucesso", { description: "Profissional excluído com sucesso!" });
      fetchProfessionals();
    } catch (error) {
      console.error("Erro ao excluir profissional:", error);
      toast.error("Erro", { description: "Falha ao excluir o profissional. Tente novamente." });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAvailabilityChange = async (id: string, newAvailability: boolean) => {
    try {
      setProfessionals(prevProfessionals =>
        prevProfessionals.map(prof =>
          prof.id === id ? { ...prof, isAvailable: newAvailability } : prof
        )
      );
      await updateProfessionalAvailability(id, newAvailability);
      toast.success("Sucesso", {
        description: "Disponibilidade do profissional atualizada com sucesso.",
      });

    } catch (error) {
      console.error("Erro ao atualizar disponibilidade:", error);
      toast.error("Erro", {
        description: "Não foi possível atualizar a disponibilidade. Tente novamente.",
      });
      setProfessionals(prevProfessionals =>
        prevProfessionals.map(prof =>
          prof.id === id ? { ...prof, isAvailable: !newAvailability } : prof
        )
      );
    }
  };
  const desiredPositionOptions = [
    { label: "Todas", value: "all" },
    ...desiredPositions.map(p => ({ label: p.label || 'N/A', value: p.id })),
  ];
  const availabilityOptions = [
    { label: "Todas", value: "all" },
    ...availabilities.map(a => ({ label: a.label || 'N/A', value: a.id })),
  ];
  const experienceLevelOptions = [
    { label: "Todos", value: "all" },
    ...experienceLevels.map(e => ({ label: e.label || 'N/A', value: e.id })),
  ];

  return (
    <div className="flex flex-col gap-4 p-6">
      <h1 className="text-2xl font-bold mb-4">Profissionais</h1>
      <div className="container mx-auto py-6">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <span className="text-blue-500 text-lg">Carregando...</span>
          </div>
        ) : (
          <DataTable
            columns={professionalColumns(handleDelete, isDeleting, handleAvailabilityChange)}
            data={professionals}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
            limit={limit}
            setLimit={setLimit}
            filters={[
              { type: "input", column: "fullName", placeholder: "Filtrar por nome...", value: nameFilter, onChange: setNameFilter },
              { type: "select", placeholder: "Filtrar por disponibilidade", value: availabilityTypeIdFilter, onChange: setAvailabilityTypeIdFilter, options: availabilityOptions },
              { type: "select", placeholder: "Filtrar por experiência", value: experienceLevelIdFilter, onChange: setExperienceLevelIdFilter, options: experienceLevelOptions },
              { type: "select", placeholder: "Filtrar por Posição", value: desiredPositionIdFilter, onChange: setDesiredPositionIdFilter, options: desiredPositionOptions },
            ]}
          />
        )}
      </div>
    </div>
  );
}
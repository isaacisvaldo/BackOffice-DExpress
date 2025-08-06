import { DataTable } from "@/components/data-table";
import { columns, type Professional } from "@/components/profissional/professionals-columns";
import { listAll } from "@/services/profissional/profissionalService";
import { useState, useEffect } from "react";


export default function ProfessionalsList() {
  const [loading, setLoading] = useState(true);
  const [professionals, setProfessionals] = useState<Professional[]>([]);

  // Estados de Paginação
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);


  const [nameFilter, setNameFilter] = useState("");
  const [availabilityTypeFilter, setAvailabilityTypeFilter] = useState("all");
  const [experienceLevelFilter, setExperienceLevelFilter] = useState("all");
   const [specialtyIdsFilter, setSpecialtyIdsFilter] = useState("all");

  useEffect(() => {
    async function fetchProfessionals() {
      setLoading(true);
      try {
      
     const filters = {
  name: nameFilter,
  availabilityType: availabilityTypeFilter !== "all" ? availabilityTypeFilter : undefined,
  experienceLevel: experienceLevelFilter !== "all" ? experienceLevelFilter : undefined,
  specialtyIds: Array.isArray(specialtyIdsFilter) && specialtyIdsFilter.length > 0 ? specialtyIdsFilter : undefined,
  page,
  limit,
};

        // Chama a função de serviço com os filtros
        const result = await listAll(filters);
        
        // Atualiza os estados com base na resposta da API
        setProfessionals(result.data);
        setTotalPages(result.totalPages);
      } catch (error) {
        console.error("Erro ao carregar profissionais:", error);
      } finally {
        setLoading(false);
      }
    }

    // Usando debounce para otimizar as requisições de rede
    const debounceTimeout = setTimeout(() => {
      fetchProfessionals();
    }, 500);

    return () => clearTimeout(debounceTimeout);
  }, [nameFilter, availabilityTypeFilter, experienceLevelFilter, page, limit]);

  return (
    <div className="flex flex-col gap-4 p-6">
      <h1 className="text-2xl font-bold mb-4">Profissionais </h1>
      <div className="container mx-auto py-6">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <span className="text-blue-500 text-lg">Carregando...</span>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={professionals}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
            limit={limit}
            setLimit={setLimit}
            filters={[
              {
                type: "input",
                column: "fullName", 
                placeholder: "Filtrar por nome...",
                value: nameFilter,
                onChange: setNameFilter,
              },

              {
                type: "select",
                placeholder: "Filtrar por disponibilidade",
                value: availabilityTypeFilter,
                onChange: (val) => setAvailabilityTypeFilter(val),
                options: [
                  { label: "Todas", value: "all" },
                
                  { label: "Tempo integral", value: "FULL_TIME" },
                  { label: "Tempo parcial", value: "PART_TIME" },
                  { label: "Diário", value: "DAILY" },
                  { label: "Fins de Semana", value: "WEEKENDS" },
                ],
              },
              {
                type: "select",
                placeholder: "Filtrar por experiência",
                value: experienceLevelFilter,
                onChange: (val) => setExperienceLevelFilter(val),
                options: [
                  { label: "Todos", value: "all" },
                
                  { label: "Menos de 1 ano", value: "LESS_THAN_1" },
                  { label: "1-3 anos", value: "ONE_TO_THREE" },
                  { label: "3 - 5 anos", value: "THREE_TO_FIVE" },
                  { label: "Mais de 5 anos", value: "MORE_THAN_FIVE" },
                ],
              },
               {
                type: "select",
                placeholder: "Filtrar por Expecialidade",
                value: specialtyIdsFilter,
                onChange: (val) => setSpecialtyIdsFilter(val),
                options: [
                  { label: "Todos", value: "all" },
                
                  { label: "Medicina", value: "medicina_id_1" },
                    { label: "Enfermagem", value: "enfermagem_id_2" },
                    { label: "Fisioterapia", value: "fisioterapia_id_3" },
                ],
              },
               
            ]}
          />
        )}
      </div>
    </div>
  );
}
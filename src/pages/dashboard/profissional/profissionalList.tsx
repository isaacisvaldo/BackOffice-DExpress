import { DataTable } from "@/components/data-table";
import { columns, type Professional } from "@/components/profissional/professionals-columns";
import { getSpecialtiesList } from "@/services/especialities/especiality.service";

import { listAll } from "@/services/profissional/profissionalService";

import { useState, useEffect } from "react";


export default function ProfessionalsList() {
  const [loading, setLoading] = useState(true);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [specialties, setSpecialties] = useState<{ id: string; name: string }[]>([]);

  // Estados de Paginação
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Estados de Filtro
  const [nameFilter, setNameFilter] = useState("");
  const [availabilityTypeFilter, setAvailabilityTypeFilter] = useState("all");
  const [experienceLevelFilter, setExperienceLevelFilter] = useState("all");
  const [specialtyIdFilter, setSpecialtyIdFilter] = useState("all");
  
  // NOVO ESTADO para o filtro de Cargo/Posição
  const [desiredPositionFilter, setDesiredPositionFilter] = useState("all");


 


  useEffect(() => {
    async function fetchProfessionals() {
      setLoading(true);
      try {
        const filters = {
          name: nameFilter,
          availabilityType: availabilityTypeFilter !== "all" ? availabilityTypeFilter : undefined,
          experienceLevel: experienceLevelFilter !== "all" ? experienceLevelFilter : undefined,
          specialtyId: specialtyIdFilter !== "all" ? specialtyIdFilter : undefined,
          
          // NOVO FILTRO adicionado ao objeto
          desiredPosition: desiredPositionFilter !== "all" ? desiredPositionFilter : undefined,

          page,
          limit,
        };
        const result = await listAll(filters);
        setProfessionals(result.data);
        setTotalPages(result.totalPages);
        const esp = await getSpecialtiesList();
        setSpecialties(esp);
      } catch (error) {
        console.error("Erro ao carregar profissionais:", error);
      } finally {
        setLoading(false);
      }
    }

    const debounceTimeout = setTimeout(() => {
      fetchProfessionals();
    }, 500);

    return () => clearTimeout(debounceTimeout);
  }, [
    nameFilter, 
    availabilityTypeFilter, 
    experienceLevelFilter, 
    specialtyIdFilter, 
    desiredPositionFilter, // NOVO: Adicionado ao array de dependências
    page, 
    limit
  ]);

  const specialtyOptions = [
    { label: "Todas", value: "all" },
    ...specialties.map(specialty => ({
      label: specialty.name,
      value: specialty.id,
    }))
  ];

  // Opções para o novo filtro de Cargo/Posição
  const desiredPositionOptions = [
    { label: "Todas", value: "all" },
    { label: "Babá", value: "BABYSITTER" },
    { label: "Diarista / Empregada doméstica", value: "HOUSEKEEPER" },
    { label: "Cozinheira", value: "COOK" },
    { label: "Cuidadora de idosos ou pessoas especiais", value: "CAREGIVER" },
    { label: "Jardineiro", value: "GARDENER" },
    { label: "Passadeira", value: "IRONING" },
    { label: "Auxiliar de limpeza", value: "CLEANING_ASSISTANT" },
    { label: "Outro", value: "OTHER" },
  ];


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
                placeholder: "Filtrar por Especialidade",
                value: specialtyIdFilter,
                onChange: (val) => setSpecialtyIdFilter(val),
                options: specialtyOptions,
              },
              
              // NOVO FILTRO: Adicionado na lista de filtros da DataTable
              {
                type: "select",
                placeholder: "Filtrar por Posição",
                value: desiredPositionFilter,
                onChange: (val) => setDesiredPositionFilter(val),
                options: desiredPositionOptions,
              },
            ]}
          />
        )}
      </div>
    </div>
  );
}
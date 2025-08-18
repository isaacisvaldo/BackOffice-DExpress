// src/pages/profiles/ProfilesList.tsx

import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import { getProfiles, type Profile } from "@/services/shared/role/role.service";
import { roleColumns } from "@/components/role/roleColumns";
import ProfileDetailsModal from "@/components/role/roleDetailModal";
import SwirlingEffectSpinner from "@/components/customized/spinner/spinner-06";

export default function RoleList() {
  const [data, setData] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Estados para o modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

  // Função para abrir o modal com o perfil selecionado
  const onViewDetails = (profile: Profile) => {
    setSelectedProfile(profile);
    setIsModalOpen(true);
  };

  // Estados para o filtro de busca
  const [nameFilter, setNameFilter] = useState<string>("");
  const [debouncedNameFilter, setDebouncedNameFilter] = useState<string>("");

  // 1. Debounce e Reset da Paginação
  useEffect(() => {
    // Reseta a página para 1 quando o filtro de nome muda.
    if (page !== 1) {
      setPage(1);
    }
    const timer = setTimeout(() => {
      setDebouncedNameFilter(nameFilter);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [nameFilter, page]);

  // 2. Chamada da API
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const result = await getProfiles({
          page,
          limit: limit === 0 ? undefined : limit,
          search: debouncedNameFilter || undefined,
        });

        // Mapeia os dados da API para o formato da interface Profile
        const mappedData: Profile[] = result.data.map((item: any) => ({
          id: item.id,
          name: item.name,
          label: item.label,
          description: item.description,
          permissions: item.permissions,
          createdAt: new Date(item.createdAt).toLocaleDateString("pt-PT"),
          updatedAt: new Date(item.updatedAt).toLocaleDateString("pt-PT"),
        }));

        setData(mappedData);
        setTotalPages(result.totalPages || 1);
      } catch (error) {
        console.error("Erro ao carregar perfis", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [page, limit, debouncedNameFilter]);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold mb-4">Lista de Perfis</h1>
      <div className="container mx-auto py-6">
        {loading ? (
        <div className="flex justify-center items-center py-10">
           <SwirlingEffectSpinner></SwirlingEffectSpinner>
          </div>
        ) : (
          <DataTable
            columns={roleColumns}
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
                placeholder: "Filtrar por Rótulo...",
                value: nameFilter,
                onChange: setNameFilter,
              },
            ]}
            // ✅ Passa a função onViewDetails para as colunas via 'meta'
            meta={{ onViewDetails }}
          />
        )}
      </div>
      {/* ✅ Renderiza o modal se estiver aberto */}
      <ProfileDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        profile={selectedProfile}
      />
    </div>
  );
}

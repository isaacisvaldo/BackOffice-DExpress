// src/components/service-request/service-request-list.tsx

import SwirlingEffectSpinner from "@/components/customized/spinner/spinner-06";
import { DataTable } from "@/components/data-table";
import { serviceRequestColumns, type MappedServiceRequest } from "@/components/shared/service-requests-columns";
import { deleteServiceRequest, getServiceRequests, StatusRequest, UserType, type ServiceRequest } from "@/services/serviceRequest/service-request.service";
import { formatDate } from "@/util";

import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function ServiceRequestList() {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<MappedServiceRequest[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Estados dos filtros
  const [emailFilter, setEmailFilter] = useState("");
  const [requesterTypeFilter, setRequesterTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const fetchServiceRequests = async () => {
      setLoading(true);
      try {
        const filters = {
          search: emailFilter,
          requesterType:
            requesterTypeFilter !== "all"
              ? (requesterTypeFilter as UserType)
              : undefined,
          status:
            statusFilter !== "all" ? (statusFilter as StatusRequest) : undefined,
          page,
          limit,
        };
        const result = await getServiceRequests(filters);

        const mappedData: MappedServiceRequest[] = result.data.map(
          (item: ServiceRequest) => ({
            id: item.id,
            requesterEmail: item.requesterEmail,
            requesterType: item.requesterType === UserType.INDIVIDUAL ? "Pessoa Singular" : "Empresa",
            name:item.requesterType === UserType.INDIVIDUAL ? item.individualRequesterName: item.companyRequesterName,
            nif:item.requesterType === UserType.INDIVIDUAL ? item.individualIdentityNumber: item.companyNif,
            status: item.status,
            description: item.description,
            createdAt: formatDate(item.createdAt),
            startDate: item.startDate,
            endDate: item.endDate,
          })
        );
        setRequests(mappedData);
        setTotalPages(result.totalPages);
      } catch (error) {
        console.error("Erro ao carregar solicitações:", error);
        toast.error("Erro", { description: "Não foi possível carregar as solicitações." });
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    // Aplica um debounce para evitar múltiplas requisições ao digitar.
    // A requisição só é feita 500ms após a última mudança nas dependências.
    const debounceTimeout = setTimeout(() => {
      fetchServiceRequests();
    }, 500);

    return () => clearTimeout(debounceTimeout);
  }, [
    emailFilter,
    requesterTypeFilter,
    statusFilter,
    page,
    limit,
  ]);

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      await deleteServiceRequest(id);
      toast.success("Sucesso", {
        description: "Solicitação excluída com sucesso!",
      });
     fetchServiceRequests()
    } catch (error) {
      console.error("Erro ao excluir solicitação:", error);
      toast.error("Erro", {
        description: "Falha ao excluir a solicitação. Tente novamente.",
      });
    } finally {
      setIsDeleting(false);
    }
  };



  // Opções para os filtros de select
  const requesterTypeOptions = [
    { label: "Todos", value: "all" },
    { label: "Pessoa Normal", value: UserType.INDIVIDUAL },
    { label: "Empresa", value: UserType.CORPORATE },
  ];

const statusLabels: Record<StatusRequest, string> = {
  PENDING: "Pendente",
  IN_REVIEW: "Em Análise",
  PLAN_OFFERED: "Entrevista",
  CONTRACT_GENERATED: "Aprovado",
  COMPLETED: "Concluído",
  REJECTED: "Rejeitado",
};

// ... no seu componente ...

  const statusOptions = [
    { label: "Todos", value: "all" },
    ...Object.values(StatusRequest).map((status) => ({
      // Use o mapeamento para obter a label correta
      label: statusLabels[status],
      // O valor continua sendo a chave do enum
      value: status,
    })),
  ];

  return (
    <div className="flex flex-col gap-4 p-6">
      <h1 className="text-2xl font-bold mb-4">Solicitações de Contratação</h1>
      <div className="container mx-auto py-6">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <SwirlingEffectSpinner />
          </div>
        ) : (
          <DataTable
            columns={serviceRequestColumns(handleDelete, isDeleting)}
            data={requests}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
            limit={limit}
            setLimit={setLimit}
            filters={[
              { type: "input", column: "requesterEmail", placeholder: "Filtrar por email...", value: emailFilter, onChange: setEmailFilter },
              { type: "select", placeholder: "Filtrar por tipo de solicitante", value: requesterTypeFilter, onChange: setRequesterTypeFilter, options: requesterTypeOptions },
              { type: "select", placeholder: "Filtrar por status", value: statusFilter, onChange: setStatusFilter, options: statusOptions },
            ]}
          />
        )}
      </div>
    </div>
  );
}
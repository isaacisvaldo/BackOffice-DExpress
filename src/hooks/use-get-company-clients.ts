import { useQuery } from "@tanstack/react-query";
import { fetchCompanyClients } from "@/services/client/company/client-company-profile.service";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/constants/query";

type UseGetCompanyClientsOptions = {
  staleTime?: number;
};
export function useGetCompanyClients({
  staleTime,
}: UseGetCompanyClientsOptions = {}) {
  const {
    data: companyClients,
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: [QUERY_KEYS.companyClients],
    queryFn: async () => {
      try {
        return await fetchCompanyClients();
      } catch (error) {
        toast.error("Erro", {
          description:
            error instanceof Error
              ? error.message
              : "Falha ao carregar a lista de empresas.",
        });
        throw error;
      }
    },
    staleTime,
  });

  return {
    companyClients: companyClients || [],
    isLoading,
    isFetching,
    isError,
    error,
  };
}

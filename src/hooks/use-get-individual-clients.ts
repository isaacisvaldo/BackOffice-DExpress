import { QUERY_KEYS } from "@/constants/query";
import { fetchIndividualClients } from "@/services/client/client.service";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
type UseGetIndividualClientsOptions = {
  staleTime?: number;
};
export function useGetIndividualClients({
  staleTime,
}: UseGetIndividualClientsOptions = {}) {
  const {
    data: individualClients,
    isLoading,

    error,
    isError,
  } = useQuery({
    queryKey: [QUERY_KEYS.individualClients],
    queryFn: async () => {
      try {
        return fetchIndividualClients();
      } catch (error) {
        toast.error("Erro", {
          description:
            error instanceof Error &&
            error.message ===
              "Falha ao carregar a lista de clientes individuais.",
        });
      }
    },
    staleTime,
  });

  return {
    individualClients: individualClients || [],
    isLoading: isLoading,
    error,
    isError,
  };
}

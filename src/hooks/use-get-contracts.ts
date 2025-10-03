import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/constants/query";
import { getContracts } from "@/services/contract/contract.service";

type UseContractsProps = {
  page: number;
  limit: number;
};

type UseGetContractsOptions = {
  staleTime?: number;
};

export function useGetContracts(
  { page, limit }: UseContractsProps,
  { staleTime }: UseGetContractsOptions = {},
) {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, isFetching, isPending } = useQuery({
    queryKey: [QUERY_KEYS.contracts, page, limit],
    queryFn: async () => {
      try {
        return getContracts({ page, limit });
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Erro ao carregar contratos",
        );
        throw error;
      }
    },
    placeholderData: () =>
      // aqui pegamos os dados da página anterior (se existirem no cache)
      queryClient.getQueryData([QUERY_KEYS.contracts, page - 1, limit]),
    staleTime: staleTime ?? 1000 * 60 * 2,
  });

  return { data, isLoading, isError, error, isFetching, isPending };
}

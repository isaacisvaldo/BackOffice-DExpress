import { useQuery } from "@tanstack/react-query";
import { getDesiredPositionsList } from "@/services/desired-positions/desired-positions.service";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/constants/query";
type UseGetDesiredPositionsOptions = {
  staleTime?: number;
};

export function useGetDesiredPositions({
  staleTime,
}: UseGetDesiredPositionsOptions = {}) {
  const {
    data: desiredPositions,
    isLoading,
    isError,

    error,
  } = useQuery({
    queryKey: [QUERY_KEYS.desiredPositions],
    queryFn: async () => {
      try {
        return await getDesiredPositionsList();
      } catch (error) {
        toast.error("Erro", {
          description:
            error instanceof Error
              ? error.message
              : "Falha ao carregar a lista de posições desejadas.",
        });
        throw error;
      }
    },
    staleTime,
  });

  return {
    desiredPositions: desiredPositions || [],
    isLoading: isLoading,
    isError,
    error,
  };
}

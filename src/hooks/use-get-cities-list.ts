import { QUERY_KEYS } from "@/constants/query";
import { getCitiesList } from "@/services/location/cities.service";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
type UseGetCitiesOptions = {
  staleTime?: number;
};
export function useGetCitiesList({ staleTime }: UseGetCitiesOptions = {}) {
  const {
    data: cities,
    isLoading,
    isFetching,
    error,
    isError,
  } = useQuery({
    queryKey: [QUERY_KEYS.cities],
    queryFn: async () => {
      try {
        return getCitiesList();
      } catch (error) {
        toast.error("Erro", {
          description:
            error instanceof Error &&
            error.message === "Falha ao carregar a lista de cidades.",
        });
      }
    },
    staleTime,
  });
  return {
    cities: cities ?? [],
    isLoading: isLoading,
    isFetching,
    error,
    isError,
  };
}

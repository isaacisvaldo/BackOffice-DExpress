import { QUERY_KEYS } from "@/constants/query";
import { getDistrictsByCityId } from "@/services/location/districts.service";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
type UseGetDistrictsByCityIdOptions = {
  staleTime?: number;
};
export function useGetDistrictsByCityId(
  cityId: string,
  { staleTime }: UseGetDistrictsByCityIdOptions = {},
) {
  const {
    data: districts,
    isLoading,

    error,
    isError,
  } = useQuery({
    queryKey: [QUERY_KEYS.districts, cityId],
    queryFn: async () => {
      try {
        return getDistrictsByCityId(cityId);
      } catch (error) {
        toast.error("Erro", {
          description:
            error instanceof Error &&
            error.message ===
              "Falha ao carregar a lista de distritos da cidade.",
        });
        throw error;
      }
    },

    enabled: !!cityId,
    staleTime,
  });

  return {
    districts: districts || [],
    isLoading: isLoading,
    error,
    isError,
  };
}

import { useQuery } from "@tanstack/react-query";
import { getAllPackages } from "@/services";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/constants/query";
type UseGetPackagesOptions = {
  staleTime?: number;
};
export function useGetPackages({ staleTime }: UseGetPackagesOptions = {}) {
  const {
    data: packages,
    isLoading,

    isError,
    error,
  } = useQuery({
    queryKey: [QUERY_KEYS.packages],
    queryFn: async () => {
      try {
        return await getAllPackages();
      } catch (error) {
        toast.error("Erro", {
          description:
            error instanceof Error
              ? error.message
              : "Falha ao carregar a lista de pacotes.",
        });
        throw error;
      }
    },
    staleTime,
  });

  return {
    packages: packages || [],
    isLoading: isLoading,
    isError,
    error,
  };
}

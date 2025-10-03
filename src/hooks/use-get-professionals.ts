import { useQuery } from "@tanstack/react-query";
import { dropdownProfessionals } from "@/services/profissional/profissional.service";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/constants/query";
type UseGetProfessionalsOptions = {
  staleTime?: number;
};
export function useGetProfessionals({
  staleTime,
}: UseGetProfessionalsOptions = {}) {
  const {
    data: professionals,
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: [QUERY_KEYS.professionals],
    queryFn: async () => {
      try {
        return await dropdownProfessionals();
      } catch (error) {
        toast.error("Erro", {
          description:
            error instanceof Error
              ? error.message
              : "Falha ao carregar a lista de profissionais.",
        });
        throw error;
      }
    },
    staleTime,
  });

  return {
    professionals: professionals || [],
    isLoading: isFetching || isLoading,
    isError,
    error,
  };
}

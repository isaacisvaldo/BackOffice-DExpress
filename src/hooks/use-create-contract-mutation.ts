import { createContract } from "@/services/contract/contract.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCreateContractMutation() {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: createContract,
    onSuccess: () => {
      toast.success("Contrato criado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
    },
    onError: (error) => {
      console.error("Erro ao criar contrato", error);
      toast.error(
        error instanceof Error ? error.message : "Erro ao criar contrato",
      );
    },
  });

  return { create: mutate, createAsync: mutateAsync, isPending };
}

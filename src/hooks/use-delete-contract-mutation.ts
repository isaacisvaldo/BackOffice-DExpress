import { deleteContract } from "@/services/contract/contract.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useDeleteContractMutation() {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: deleteContract,
    onSuccess: () => {
      toast.success("Contrato excluído com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Erro ao excluir contrato.",
      );
    },
  });

  return { deleteContact: mutate, deleteContactAsync: mutateAsync, isPending };
}

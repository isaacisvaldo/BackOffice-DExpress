import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { CreateContractsForm } from "../create-contract-form";
import { useManagementContracts } from "../../hooks/use-management-contracts";

export function CreateContractModal() {
  const { changeModalState, isModalOpen, openModal } = useManagementContracts();

  return (
    <Dialog open={isModalOpen} onOpenChange={changeModalState}>
      <Button className="cursor-pointer" onClick={openModal}>
        Criar Novo Contrato
      </Button>
      <DialogContent
        onInteractOutside={(event) => event.preventDefault()}
        className="sm:max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle>Criar Novo Contrato</DialogTitle>
          <DialogDescription>Preencha os dados do contrato.</DialogDescription>
        </DialogHeader>
        <CreateContractsForm />
      </DialogContent>
    </Dialog>
  );
}

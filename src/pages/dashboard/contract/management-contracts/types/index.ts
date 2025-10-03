import type z from "zod";

import type { UseFormReturn } from "react-hook-form";
import type { contractSchema } from "../schema/schema";

export type ContractForm = UseFormReturn<z.infer<typeof contractSchema>>;
export type ContractFormValues = z.infer<typeof contractSchema>;
export type ManagementContractsContextType = {
  openModal: () => void;
  closeModal: () => void;
  isModalOpen: boolean;
  changeModalState: (isOpen: boolean) => void;
  createContract: (data: ContractFormValues) => Promise<void>;
};

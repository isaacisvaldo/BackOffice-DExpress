import { useCallback, useMemo, useState } from "react";
import { ManagementContractsContext } from "./management-contracts.context";
import { useCreateContractMutation } from "@/hooks/use-create-contract-mutation";
import type { CreateContractDto } from "@/services/contract/contract.service";
import type { ContractFormValues } from "../types";

const buildContractDto = (values: ContractFormValues): CreateContractDto => {
  const base = {
    agreedValue: values.agreedValue,
    startDate: values.startDate,
    endDate: values.endDate,
    description: values.description,
    finalValue: values.finalValue,
    location: {
      cityId: values.cityId,
      districtId: values.districtId,
      street: values.street,
    },
    notes: values.notes,
    paymentTerms: values.paymentTerms,
    title: values.title,
  };

  if (values.clientType === "CORPORATE") {
    return {
      ...base,
      clientType: values.clientType,
      companyClientId: values.companyClientId,
      packageId: values.packageId,
      professionalIds: values.professionalIds.map((p) => p.value),
    };
  }

  return {
    ...base,
    clientType: values.clientType,
    individualClientId: values.individualClientId,
    desiredPositionId: values.desiredPositionId,
    professionalId: values.professionalId,
  };
};

export const ManagementContractsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { createAsync } = useCreateContractMutation();

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);
  const setModalOpen = useCallback(
    (isOpen: boolean) => setIsModalOpen(isOpen),
    [],
  );
  const changeModalState = useCallback((isOpen: boolean) => {
    setIsModalOpen(isOpen);
  }, []);

  const createContract = useCallback(
    async (data: ContractFormValues) => {
      try {
        const dto = buildContractDto(data);
        await createAsync(dto);
        closeModal();
      } catch (error) {
        console.error(error);
      }
    },
    [createAsync, closeModal],
  );

  const value = useMemo(
    () => ({
      openModal,
      closeModal,
      isModalOpen,
      setModalOpen,
      createContract,
      changeModalState,
    }),
    [
      openModal,
      closeModal,
      isModalOpen,
      setModalOpen,
      createContract,
      changeModalState,
    ],
  );

  return (
    <ManagementContractsContext.Provider value={value}>
      {children}
    </ManagementContractsContext.Provider>
  );
};

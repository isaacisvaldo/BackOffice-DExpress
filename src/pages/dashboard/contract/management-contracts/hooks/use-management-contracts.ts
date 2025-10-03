import { useContext } from "react";
import { ManagementContractsContext } from "../context/management-contracts.context";

export const useManagementContracts = () => {
  const context = useContext(ManagementContractsContext);

  if (!context) {
    throw new Error(
      "useManagementContracts must be used within a ManagementContractsProvider",
    );
  }

  return context;
};

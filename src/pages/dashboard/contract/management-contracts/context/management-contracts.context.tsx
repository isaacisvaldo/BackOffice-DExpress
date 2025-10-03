import { createContext } from "react";
import type { ManagementContractsContextType } from "../types";

export const ManagementContractsContext =
  createContext<ManagementContractsContextType | null>(null);

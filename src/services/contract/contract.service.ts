import type { UserType } from "@/enums/user-type";
import {
    type FilterParams,
    fetchDataWithFilter,
    fetchData,
    sendData,
    deleteData,
} from "../api-client";
import type { Professional } from "../profissional/profissional.service";
import type { Package } from "../client/company/package/package.service";
import type { DesiredPosition } from "@/components/desired-positions/desiredPositionsColumns";
import type { City } from "@/components/location/citiesColunn";
import type { District } from "@/types/types";
import type { ClientProfile } from "../client/client.service";
import type { ClientCompanyProfile } from "../client/company/client-company-profile.service";

export const ContractStatus = {
  DRAFT: "DRAFT",
  PENDING_SIGNATURE: "PENDING_SIGNATURE",
  EXPIRED: "EXPIRED",
  ACTIVE: "ACTIVE",
  TERMINATED: "TERMINATED",
  CANCELED: "CANCELED",
  PAUSED: "PAUSED",
  COMPLETED: "COMPLETED",
} as const;

export type ContractStatus = (typeof ContractStatus)[keyof typeof ContractStatus];

export const statusLabels: Record<ContractStatus, string> = {
  [ContractStatus.DRAFT]: "Rascunho",
  [ContractStatus.PENDING_SIGNATURE]: "Pendente de assinatura",
  [ContractStatus.EXPIRED]: "Expirado",
  [ContractStatus.ACTIVE]: "Ativo",
  [ContractStatus.TERMINATED]: "Terminado",
  [ContractStatus.CANCELED]: "Cancelado",
  [ContractStatus.PAUSED]: "Pausado",
  [ContractStatus.COMPLETED]: "Completo",
};


export interface ContractPackageProfessional {
    professionalId: string;
    contractId: string;
    createdAt: string;
    updatedAt: string;
    professional: Professional;
}
export type Document = {
  id: string;
  name: string;
  description: string;
  url: string;

};

export type ContractDoc = {
  id: string;
  contractId: string;
  documentId: string;
  document: Document;
};

export interface Contract {
    id: string;
    title: string;
    contractNumber:string
    description: string;
    clientType: UserType;
    startDate: string;
    endDate: string;
    serviceFrequency: string;
    agreedValue: number;
    status: string;
    professionalId?: string | null;
    individualClientId?: string | null;
    companyClientId?: string | null;
    packageId?: string | null;
    desiredPositionId?: string | null;
    locationId: string;
    createdAt: string;
    updatedAt: string;
   finalValue: number,
    paymentTerms: string,
    notes: string,
    // Relações incluídas
    professional: Professional ;
    individualClient: ClientProfile ;
    companyClient: ClientCompanyProfile ;
    package: Package ;
     contractDoc: ContractDoc[];
    desiredPosition: DesiredPosition ;
    location: Location & { city: City; district: District };
    contractPackegeProfissional: ContractPackageProfessional[];
}

export interface CreateContractDto {
    title: string;
    description: string;
    clientType: UserType;
    startDate: string;
    endDate: string;
    finalValue: number;
    //serviceFrequency: string;
    agreedValue: number;
    //status: string;
    professionalId?: string;
    professionalIds?: string[];
    individualClientId?: string;
    companyClientId?: string;
    packageId?: string;
    desiredPositionId?: string;
    location: {
        cityId: string;
        districtId: string;
        street: string;
    }
}


export interface UpdateContractDto {
    title?: string;
    description?: string;
    clientType?: UserType;
    startDate?: string;
    endDate?: string;
    serviceFrequency?: string;
    agreedValue?: number;
    status?: string;
    professionalId?: string;
    professionalIds?: string[];
    individualClientId?: string;
    companyClientId?: string;
    packageId?: string;
    desiredPositionId?: string;
    locationId?: string;
}

export interface FilterContractDto extends FilterParams {
    title?: string;
    clientType?: UserType;
    locationId?: string;
    packageId?: string;
    serviceFrequency?: string;
    status?: string;
    professionalIds?: string[];
}

export interface PaginatedContractsResponse {
    data: Contract[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface createDocument {
     name: string;
  description: string;
  url: string;
}
export async function createContract(
    data: CreateContractDto,
): Promise<Contract> {
    return sendData("/contracts", "POST", data);
}

export async function createContractDoc(id:string,doc:createDocument):Promise<Document> {
    return sendData(`/contracts/${id}/documents`, "POST", doc);
    
}

export async function getContracts(
    params: FilterContractDto = {},
): Promise<PaginatedContractsResponse> {
    return fetchDataWithFilter("/contracts", params);
}

export async function getContractById(id: string): Promise<Contract> {
    return fetchData(`/contracts/${id}`);
}
 export async function updateStatusContract(id: string, status: ContractStatus) {
    return sendData(`/contracts/${id}/status`, "PATCH", { status });
}
export async function updateContract(
    id: string,
    data: UpdateContractDto,
): Promise<Contract> {
    return sendData(`/contracts/${id}`, "PATCH", data);
}

export async function deleteContract(id: string): Promise<Contract> {
    return deleteData(`/contracts/${id}`);
}

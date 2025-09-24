import {
  fetchData,
  sendData,
  deleteData,
} from "../../api-client";

export interface TemplateContract {
  id: string;
  title: string;
  description: string;
  urlFile: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTemplateContractDto {
  title: string;
  description: string;
  urlFile: string;
}

export interface UpdateTemplateContractDto {
  title?: string;
  description?: string;
  urlFile?: string;
}

// Criar template
export async function createTemplateContract(
  data: CreateTemplateContractDto,
): Promise<TemplateContract> {
  return sendData("/template-contract", "POST", data);
}

// Listar todos (sem paginação)
export async function getTemplateContracts(): Promise<TemplateContract[]> {
  return fetchData("/template-contract");
}

// Buscar por ID
export async function getTemplateContractById(
  id: string,
): Promise<TemplateContract> {
  return fetchData(`/template-contract/${id}`);
}

// Atualizar
export async function updateTemplateContract(
  id: string,
  data: UpdateTemplateContractDto,
): Promise<TemplateContract> {
  return sendData(`/template-contract/${id}`, "PUT", data);
}

// Remover
export async function deleteTemplateContract(
  id: string,
): Promise<TemplateContract> {
  return deleteData(`/template-contract/${id}`);
}

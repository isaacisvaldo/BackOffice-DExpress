import type { UserType } from "@/enums/user-type";
import { type FilterParams, fetchDataWithFilter, fetchData, sendData, deleteData } from "../api-client";


interface GetUsersParams extends FilterParams {
  firstName?: string;
  lastName?: string;
  email?: string;
  type?: UserType;
}

// Define a interface para o objeto de usuário, para tipagem
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  type: UserType;
  avatar: string;
  createdAt: string;
  updatedAt: string;
  clientProfile?: any[]; // Defina o tipo de perfil de cliente, se necessário
  clientCompanyProfile?: any[]; // Defina o tipo de perfil de empresa, se necessário
}

// Define a interface para a resposta paginada
export interface PaginatedUsersResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Busca uma lista paginada e filtrada de usuários.
 * Usa a função genérica fetchDataWithFilter.
 */
export async function getUsers(
  params: GetUsersParams = {},
): Promise<PaginatedUsersResponse> {
  return fetchDataWithFilter("/users", params);
}

/**
 * Busca um único usuário pelo seu ID.
 */
export async function getUserById(id: string): Promise<User> {
  return fetchData(`/users/${id}`);
}

/**
 * Busca uma lista de usuários que não têm um perfil associado,
 * com suporte a paginação e filtros.
 * Usa a função genérica fetchDataWithFilter.
 */
export async function getUsersWithoutProfile(
  params: GetUsersParams = {}, 
): Promise<PaginatedUsersResponse> { // O retorno é paginado
  return fetchDataWithFilter("/users/without-profile", params);
}

// Opcional: Função para criar um novo usuário
export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  type: UserType;
}

export interface ApiResponseCreateUser{
  message:string
  userId:string

}
export async function createUser(data: CreateUserDto): Promise<ApiResponseCreateUser> {
  return sendData("/users", "POST", data);
}

// Opcional: Função para atualizar um usuário existente
export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  type?: UserType;
  isActive?: boolean;
}

export async function updateUser(id: string, data: UpdateUserDto): Promise<User> {
  return sendData(`/users/${id}`, "PATCH", data);
}

/**
 * Desativa um usuário existente.
 */
export async function deactivateUser(id: string): Promise<User> {
  return sendData(`/users/${id}/deactivate`, "PATCH", {});
}

/**
 * Remove um usuário existente.
 */
export async function deleteUser(id: string): Promise<User> {
  return deleteData(`/users/${id}`);
}
import {
  type FilterParams,
  fetchDataWithFilter,
  fetchData,
  sendData,
  deleteData,
} from "../api-client";
import type { Gender } from "../shared/gender/gender.service";

// ✅ Interfaces para as novas configurações
export interface SecuritySettings {
  id: string;
  userId: string;
  loginNotifications: boolean;
  lastPasswordChange?: string | null;
}

export interface NotificationSettings {
  id: string;
  userId: string;
  email: boolean;
  push: boolean;
  marketing: boolean;
  weekly: boolean;
}

// Define a interface para o objeto de permissão
export interface Permission {
  id: string;
  name: string;
  label:string
}

// Define a interface para o objeto de perfil
export interface Profile {
  id: string;
  name: string;
  label: string;
  description?: string;
  permissions: Permission[];
}


// A interface do seu modelo AdminUser, agora com o perfil e as novas configurações
export interface AdminUser {
  id: string;
  name: string;
  numberphone: string;
  isActive: boolean;
  identityNumber: string;
  birthDate: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  gender: Gender; // ✅ O campo 'gender' agora é do tipo Gender
  profile: Profile;
  address:string
  avatar?:string;
  securitySettings?: SecuritySettings;
  notificationSettings?: NotificationSettings;
}

// Resposta paginada da API
export interface PaginatedAdminUsersResponse {
  data: AdminUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface GetAdminUsersParams extends FilterParams {
  search?: string;
}

// ✅ DTO para a criação de um novo administrador
export interface CreateAdminUserDto {
  name: string;
  numberphone: string;
  identityNumber: string;
  genderId: string;
  birthDate: string;
  email: string;
  password?: string;
  profileId: string;
}

// ✅ DTO para a atualização de um administrador
export interface UpdateAdminUserDto {
  name?: string;
  numberphone?: string;
  identityNumber?: string;
  genderId?: string;
  birthDate?: string;
  email?: string;
  password?: string;
  profileId?: string;
}

/**
 * Busca uma lista paginada e filtrada de administradores.
 * Corresponde ao endpoint GET /admin/users.
 * @param params Parâmetros de paginação e filtro.
 */
export async function getAdminUsers(
  params: GetAdminUsersParams = {},
): Promise<PaginatedAdminUsersResponse> {
  return fetchDataWithFilter("/admin/users", params); 
}

/**
 * Cria um novo administrador.
 * Corresponde ao endpoint POST /admin/users.
 * @param data O DTO para a criação do administrador.
 */
export async function createAdminUser(data: CreateAdminUserDto): Promise<AdminUser> {
  return sendData("/admin/users", "POST", data);
}

/**
 * Busca um administrador específico pelo ID.
 * Corresponde ao endpoint GET /admin/users/:id.
 * @param id O ID do administrador.
 */
export async function getAdminUserById(id: string): Promise<AdminUser> {
  return fetchData(`/admin/users/${id}`);
}

/**
 * Atualiza um administrador existente.
 * Corresponde ao endpoint PATCH /admin/users/:id.
 * @param id O ID do administrador a ser atualizado.
 * @param data O objeto com os dados a serem atualizados.
 */
export async function updateAdminUser(
  id: string,
  data: UpdateAdminUserDto,
): Promise<AdminUser> {
  return sendData(`/admin/users/${id}`, "PATCH", data);
}

/**
 * Remove um administrador existente.
 * Corresponde ao endpoint DELETE /admin/users/:id.
 * @param id O ID do administrador a ser removido.
 */
export async function deleteAdminUser(id: string): Promise<AdminUser> {
  return deleteData(`/admin/users/${id}`);
}

/**
 * Busca os dados do usuário atualmente autenticado.
 * Corresponde ao endpoint GET /admin/profile.
 */
export async function getCurrentUser(): Promise<AdminUser> {
   return fetchData(`/admin/profile`);
}

/**
 * Atualiza a URL da imagem de perfil de um profissional.
 * @param id O ID do profissional.
 * @param imageUrl A nova URL da imagem.
 * @returns O objeto Professional atualizado.
 */
export async function updateAdminImageUrl(
  adminId: string,
  imageUrl: string,
): Promise<AdminUser> {
  return sendData(`/admin/users/${adminId}/profile-image`, "PATCH", { imageUrl });
}





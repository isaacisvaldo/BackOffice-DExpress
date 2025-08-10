// src/services/courses/course.service.ts

import {
  type FilterParams,
  fetchDataWithFilter,
  fetchData,
  sendData,
  deleteData,
} from "../../api-client";

export interface Course {
  id: string;
  name: string;
  label: string;
  createdAt: string;
  updatedAt: string;
}

interface GetCoursesParams extends FilterParams {
  name?: string;
}

export interface PaginatedCoursesResponse {
  data: Course[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Busca uma lista paginada e filtrada de cursos.
 * Corresponde ao endpoint GET /courses.
 * @param params Parâmetros de paginação e filtro.
 */
export async function getCourses(
  params: GetCoursesParams = {},
): Promise<PaginatedCoursesResponse> {
  return fetchDataWithFilter("/courses", params);
}

/**
 * Busca uma lista completa de cursos, sem paginação.
 * Corresponde ao endpoint GET /courses/list.
 * @returns Um array com todos os objetos de curso.
 */
export async function getCoursesList(): Promise<Course[]> {
  return fetchData("/courses/list");
}

export interface CreateCourseDto {
  name: string;
  label: string;
}

/**
 * Cria um novo curso.
 * Corresponde ao endpoint POST /courses.
 * @param data O objeto de dados do novo curso.
 * @returns O objeto de curso criado.
 */
export async function createCourse(
  data: CreateCourseDto,
): Promise<Course> {
  return sendData("/courses", "POST", data);
}

/**
 * Busca um curso específico pelo ID.
 * Corresponde ao endpoint GET /courses/:id.
 * @param id O ID do curso.
 * @returns O objeto de curso encontrado.
 */
export async function getCourseById(id: string): Promise<Course> {
  return fetchData(`/courses/${id}`);
}

export interface UpdateCourseDto {
  name?: string;
  label?: string;
}

/**
 * Atualiza um curso existente.
 * Corresponde ao endpoint PATCH /courses/:id.
 * @param id O ID do curso a ser atualizado.
 * @param data O objeto com os dados a serem atualizados.
 * @returns O objeto de curso atualizado.
 */
export async function updateCourse(
  id: string,
  data: UpdateCourseDto,
): Promise<Course> {
  return sendData(`/courses/${id}`, "PATCH", data);
}

/**
 * Remove um curso existente.
 * Corresponde ao endpoint DELETE /courses/:id.
 * @param id O ID do curso a ser removido.
 * @returns O objeto de curso removido.
 */
export async function deleteCourse(id: string): Promise<Course> {
  return deleteData(`/courses/${id}`);
}
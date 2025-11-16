import { sendData, fetchData } from "../api-client";

// ===============================
// 🔐 Interfaces e Tipos
// ===============================

/**
 * Representa o usuário autenticado.
 */
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

/**
 * Estrutura da resposta de autenticação (login).
 */
export interface AuthResponse {
  user: AuthUser;
  message: string;
}

/**
 * DTO para login.
 */
export interface LoginDto {
  email: string;
  password: string;
}

/**
 * DTO para redefinir senha.
 */
export interface ResetPasswordDto {
  token: string;
  newPassword: string;
}

/**
 * DTO para solicitar recuperação de senha.
 */
export interface RequestPasswordResetDto {
  email: string;
}

/**
 * DTO para verificação do código de recuperação.
 */
export interface VerifyResetCodeDto {
  token: string;
}

// ===============================
// 🔑 Funções de Autenticação
// ===============================

/**
 * Realiza login do usuário e armazena os cookies HTTP-only.
 * @param data Credenciais de login.
 * @returns Usuário autenticado e mensagem de sucesso.
 */
export async function login(data: LoginDto): Promise<AuthResponse> {
  return sendData("/admin/auth/login", "POST", data, );
}

/**
 * Faz logout do usuário (limpa cookies HTTP-only).
 */
export async function logout(): Promise<void> {
  await sendData("/admin/auth/logout", "POST", undefined,"Sessão Terminada");
  window.location.href = "/";
}

/**
 * Valida se o usuário está autenticado.
 * @returns Dados do usuário autenticado, se válido.
 */
export async function isAuthenticated(): Promise<{ valid: boolean; user?: AuthUser } | null> {
  try {
    return await fetchData("/admin/auth/validate");
  } catch {
    return null;
  }
}

/**
 * Atualiza o token de acesso usando cookies.
 */
export async function refreshAccessToken(): Promise<{ accessToken: string }> {
  return sendData("/admin/auth/refresh", "POST", undefined, );
}

// ===============================
// 🔒 Funções de Recuperação de Senha
// ===============================

/**
 * Solicita o envio de um código de recuperação de senha.
 * @param data Objeto contendo o e-mail do usuário.
 */
export async function requestPasswordReset(
  data: RequestPasswordResetDto,
): Promise<{ message: string }> {
  return sendData("/admin/auth/request-reset", "POST", data);
}

/**
 * Verifica se o código de recuperação é válido.
 * @param data Objeto contendo o token/código.
 */
export async function verifyResetCode(
  data: VerifyResetCodeDto,
): Promise<{ valid: boolean; userId?: string }> {
  return sendData("/admin/auth/verify-reset", "POST", data);
}

/**
 * Redefine a senha de um usuário usando o código de recuperação.
 * @param data Objeto contendo token e nova senha.
 */
export async function resetPassword(
  data: ResetPasswordDto,
): Promise<{ message: string }> {
  return sendData("/admin/auth/reset-password", "POST", data);
}

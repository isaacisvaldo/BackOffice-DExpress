
import { type FilterParams, fetchDataWithFilter, deleteData } from "../api-client"
export interface AuditLog {
    id: string;
    userId: string | null;
    action: string;
    entity: string;
    entityId: string | null;
    description: string;
    ipAddress: string | null;
    userAgent: string | null;
    requestMethod: string | null;
    requestUrl: string | null;
    requestBody: unknown | null;
    previousData: unknown | null;
    newData: unknown | null;
    status: 'SUCCESS' | 'FAILED' | string;
    source: 'CRON_JOB' | 'API' | string;
    read: boolean;
    createdAt: string;
    user: unknown | null;
}
interface GetAuditLogParams extends FilterParams {
    userId?: string;
    action?: string;
    entity?: string;
    status?: string;
    source?: string;
    search?: string;
    page?: number;
    limit?: number;
}

export interface PaginatedAuditLogResponse {
    data: AuditLog[]
    total: number
    page: number
    limit: number
    totalPages: number
}
export async function getAuditLog(
    params: GetAuditLogParams = {},
): Promise<PaginatedAuditLogResponse> {
    return fetchDataWithFilter("/audit-logs", params)
}
export async function deleteAuditLog(id: string): Promise<void> {
    return deleteData(`/audit-logs/${id}`)
}
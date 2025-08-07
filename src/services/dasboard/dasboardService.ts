
const API_URL = import.meta.env.VITE_API_URL

interface IDashboardSummary {

    totalProfessionals: number,
    totalClients: number,
    activeServices: number,
    canceledRequests: number,
}
export async function getDashboardSummary(): Promise<IDashboardSummary> {
    try {
        const response = await fetch(`${API_URL}/dashboard/summary`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            const errorMessage = errorData?.message || "Erro ao criar profissional.";
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error: any) {
        throw new Error(error.message || "Erro inesperado ao criar profissional.");
    }

}
export async function getGrowthData(timeRange: string): Promise<any> {
    try {
        const response = await fetch(`${API_URL}/dashboard/growth/clients-profissionals/registrations?range=${timeRange}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            const errorMessage = errorData?.message || "Erro ao criar profissional.";
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error: any) {
        throw new Error(error.message || "Erro inesperado ao criar profissional.");
    }
}

export async function getCompaniesBySector() {

}




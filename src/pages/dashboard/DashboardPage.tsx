import { AppSidebar } from "@/components/app-sidebar"
import { columns, type Application } from "@/components/candidacy/columns"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { ChartPieInteractive } from "@/components/ui/chart-pie-interactive"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { getApplications } from "@/services/candidacy/candidacyService"
import { useState, useEffect } from "react"
import { PageHeader } from "@/components/page-header"

export default function DashboardPage() {
  const [data, setData] = useState<Application[]>([])
  const [, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const columnsWithoutActions = columns.filter((col) => col.id !== "actions")

  const [emailFilter, setEmailFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("")

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const result = await getApplications({
          page,
          limit: limit === 0 ? undefined : limit,
          status: statusFilter,
        })

        const mappedData: Application[] = result.data.map((item: any) => ({
          id: item.id,
          candidateName: item.fullName,
          email: item.email,
          phone: item.phoneNumber || "-",
          location: `${item.location?.city?.name ?? ""} - ${item.location?.district?.name ?? ""}`,
          position: item.desiredPosition,
          status: item.status,
          appliedAt: new Date(item.createdAt).toLocaleDateString("pt-PT"),
        }))

        setData(mappedData)
        setTotalPages(result.totalPages || 1)
      } catch (error) {
        console.error("Erro ao carregar candidaturas", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [page, limit, statusFilter])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
      
       <PageHeader
         onSearch={(val) => console.log("Pesquisando:", val)}

        />

        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />

              <div className="px-4 lg:px-6 flex-1">
                <ChartAreaInteractive />
              </div>

              <div className="px-4 lg:px-6 flex flex-wrap gap-4">
                <div className="flex-1 min-w-[300px]">
                  <ChartPieInteractive />
                </div>
                <div className="flex-[2] min-w-[450px]">
                  <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-4 h-[450px] flex flex-col">
                    <div className="flex-1 overflow-y-auto">
                      <DataTable
                        className="flex-1 h-full"
                        columns={columnsWithoutActions}
                        data={data}
                        page={page}
                        setPage={setPage}
                        totalPages={totalPages}
                        limit={limit}
                        setLimit={setLimit}
                        filters={[
                          {
                            type: "input",
                            column: "email",
                            placeholder: "Filtrar emails...",
                            value: emailFilter,
                            onChange: setEmailFilter,
                          },
                          {
                            type: "select",
                            placeholder: "Filtrar status",
                            value: statusFilter || "all",
                            onChange: (val) => setStatusFilter(val === "all" ? "" : val),
                            options: [
                              { label: "Todos", value: "all" },
                              { label: "Pendente", value: "PENDING" },
                              { label: "Em Análise", value: "IN_REVIEW" },
                              { label: "Entrevista", value: "INTERVIEW" },
                              { label: "Aprovado", value: "ACCEPTED" },
                              { label: "Rejeitado", value: "REJECTED" },
                            ],
                          },
                        ]}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

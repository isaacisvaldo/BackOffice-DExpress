'use client'

import { useEffect, useState } from "react"
import { AppSidebar } from "@/components/app-sidebar";
import { columns, type Application } from "@/components/candidacy/columns";
import { DataTable } from "@/components/data-table";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import { getApplications } from "@/services/candidacy/candidacyService";

export default function ApplicationsPage() {
  const [data, setData] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10) // Agora controlável
  const [totalPages, setTotalPages] = useState(1)


  // Estados para filtros
  const [emailFilter, setEmailFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("")
  
  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const result = await getApplications({ 
          page, 
          limit: limit === 0 ? undefined : limit, // 0 = todos
          status: statusFilter 
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
        setTotalPages(result.totalPages || 1) // previne totalPages undefined
      } catch (error) {
        console.error("Erro ao carregar candidaturas", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [page, limit, statusFilter]) // atualiza quando mudam

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Applications</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Listar</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col p-6">
          <h1 className="text-2xl font-bold mb-4">Lista de Candidaturas</h1>
          <div className="container mx-auto py-10">
            {loading ? (
              <div className="flex justify-center items-center py-10">
                <span className="text-blue-500 text-lg">🌀 Carregando...</span>
              </div>
            ) : (
 <DataTable
  columns={columns}
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
      onChange: setEmailFilter
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
      ]
    }
  ]}
/>

            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

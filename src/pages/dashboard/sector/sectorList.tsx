import { useEffect, useState } from "react"
import { DataTable } from "@/components/data-table"
import { sectorColumns, type Sector } from "@/components/sector/sectorColumns"
import { getSector } from "@/services/sector/sector.service"
import { formatDate } from "@/util"


export default function SectorList() {
  const [data, setData] = useState<Sector[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(5)
  const [totalPages, setTotalPages] = useState(1)

  // ✅ Estado para o valor do input (atualiza em tempo real)
  const [nameFilter, setNameFilter] = useState<string>("")

  // ✅ Novo estado para o valor debounced (usado na chamada da API)
  const [debouncedNameFilter, setDebouncedNameFilter] = useState<string>("")

  // ✅ 1. useEffect para o Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedNameFilter(nameFilter)
    }, 500)

    return () => {
      clearTimeout(timer)
    }
  }, [nameFilter])

  // ✅ 2. useEffect para a Chamada da API
  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const result = await getSector({
          page,
          limit: limit === 0 ? undefined : limit,
          name: debouncedNameFilter || undefined, 
        })

        const mappedData: Sector[] = result.data.map((item: any) => ({
          id: item.id,
          name: item.name,
          label: item.label,
           createdAt: formatDate(item.createdAt),
          updatedAt: formatDate(item.updatedAt),
        }))

        setData(mappedData)
        setTotalPages(result.totalPages || 1)
      } catch (error) {
        console.error("Erro ao carregar setores", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [page, limit, debouncedNameFilter])

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold mb-4">Lista de Cargos e Posições</h1>
      <div className="container mx-auto py-6">
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <DataTable
            columns={sectorColumns}
            data={data}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
            limit={limit}
            setLimit={setLimit}
            filters={[
              {
                type: "input",
                column: "name",
                placeholder: "Filtrar por nome...",
                value: nameFilter,
                onChange: setNameFilter,
              },
            ]}
          />
        )}
      </div>
    </div>
  )
}

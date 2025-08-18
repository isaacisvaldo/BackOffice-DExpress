import { useEffect, useState } from "react"
import { DataTable } from "@/components/data-table"
import { disponibilityColumns, type Disponibility } from "@/components/disponibility/disponibilityColumns"
import { getDisponibilities } from "@/services/disponibilty/disponibilty.service"

export default function DisponibilityList() {
  const [data, setData] = useState<Disponibility[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(5)
  const [totalPages, setTotalPages] = useState(1)

  // filtro
  const [nameFilter, setNameFilter] = useState<string>("")
  const [debouncedNameFilter, setDebouncedNameFilter] = useState<string>("")

  // debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedNameFilter(nameFilter)
    }, 500)
    return () => clearTimeout(timer)
  }, [nameFilter])

  // chamada API
  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const result = await getDisponibilities({
          page,
          limit: limit === 0 ? undefined : limit,
          name: debouncedNameFilter || undefined,
        })

        const mappedData: Disponibility[] = result.data.map((item: any) => ({
          id: item.id,
          name: item.name,
          description: item.description,
        }))

        setData(mappedData)
        setTotalPages(result.totalPages || 1)
      } catch (error) {
        console.error("Erro ao carregar disponibilidades", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [page, limit, debouncedNameFilter])

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold mb-4">Lista de Disponibilidades</h1>
      <div className="container mx-auto py-6">
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <DataTable
            columns={disponibilityColumns}
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

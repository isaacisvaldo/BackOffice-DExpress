import { useEffect, useState } from "react"
import { DataTable } from "@/components/data-table"
import { cityColumns, type City } from "@/components/location/citiesColunn"
import getCities from "@/services/location/cities"

export default function CitiesPage() {
  const [data, setData] = useState<City[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [nameFilter, setNameFilter] = useState<string>("")

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const result = await getCities({
          page,
          limit: limit === 0 ? undefined : limit,
          name: nameFilter || undefined,
        })

        const mappedData: City[] = result.data.map((item: any) => ({
          id: item.id,
          name: item.name,
          createdAt: new Date(item.createdAt).toLocaleDateString("pt-PT"),
        }))

        setData(mappedData)
        setTotalPages(result.totalPages || 1)
      } catch (error) {
        console.error("Erro ao carregar cidades", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [page, limit, nameFilter])

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold mb-4">Lista de Cidades</h1>
      <div className="container mx-auto py-6">
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <DataTable
            columns={cityColumns}
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

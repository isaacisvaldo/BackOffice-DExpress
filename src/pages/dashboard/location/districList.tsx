import { useEffect, useState } from "react"
import { DataTable } from "@/components/data-table"
import { getDistricts } from "@/services/location/districts.service"
import type { DistrictWithCity } from "@/services/location/districts.service"
import { districtColumns } from "@/components/location/districtsColunn"

export default function DistrictList() {
  const [data, setData] = useState<DistrictWithCity[]>([]) 
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(5)
  const [totalPages, setTotalPages] = useState(1)

  const [nameFilter, setNameFilter] = useState<string>("")
  const [debouncedNameFilter, setDebouncedNameFilter] = useState<string>("")

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedNameFilter(nameFilter)
    }, 500)

    return () => {
      clearTimeout(timer)
    }
  }, [nameFilter])

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const result = await getDistricts({
          page,
          limit: limit === 0 ? undefined : limit,
          search: debouncedNameFilter || undefined,
        })

        // ✅ O mapeamento agora inclui o objeto da cidade
        const mappedData: DistrictWithCity[] = result.data.map((item) => ({
          ...item,
          createdAt: new Date(item.createdAt).toLocaleDateString("pt-PT"),
          updatedAt: new Date(item.updatedAt).toLocaleDateString("pt-PT"),
        }))

        setData(mappedData)
        setTotalPages(result.totalPages || 1)
      } catch (error) {
        console.error("Erro ao carregar distritos", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [page, limit, debouncedNameFilter])
  
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold mb-4">Lista de Distritos</h1>
      <div className="container mx-auto py-6">
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <DataTable
            columns={districtColumns}
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

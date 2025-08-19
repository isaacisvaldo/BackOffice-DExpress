import { useEffect, useState } from "react"
import { DataTable } from "@/components/data-table"
import { getExperienceLevels } from "@/services/experience-levels/experience-levels.service"
import { experienceLevelColumns, type ExperienceLevel } from "@/components/experience-levels/experienceLevelsColumns"

export default function ExperienceLevelList() {
  const [data, setData] = useState<ExperienceLevel[]>([])
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
        const result = await getExperienceLevels({
          page,
          limit: limit === 0 ? undefined : limit,
          name: debouncedNameFilter || undefined,
        })

        const mappedData: ExperienceLevel[] = result.data.map((item: any) => ({
          id: item.id,
          name: item.name,
          description: item.description,
        }))

        setData(mappedData)
        setTotalPages(result.totalPages || 1)
      } catch (error) {
        console.error("Erro ao carregar níveis de experiência", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [page, limit, debouncedNameFilter])

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold mb-4">Níveis de Experiência</h1>
      <div className="container mx-auto py-6">
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <DataTable
            columns={experienceLevelColumns}
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

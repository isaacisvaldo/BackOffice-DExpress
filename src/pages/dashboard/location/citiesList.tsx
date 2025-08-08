import { useEffect, useState } from "react"
import { DataTable } from "@/components/data-table"
import { cityColumns, type City } from "@/components/location/citiesColunn"
import { getCities } from "@/services/location/cities.service"

export default function CitiesPage() {
  const [data, setData] = useState<City[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)

  // ✅ Estado para o valor do input (atualiza em tempo real)
  const [nameFilter, setNameFilter] = useState<string>("")
  
  // ✅ Novo estado para o valor debounced (usado na chamada da API)
  const [debouncedNameFilter, setDebouncedNameFilter] = useState<string>("")

  // ✅ 1. useEffect para o Debounce
  // Ele aguarda 500ms após a última digitação antes de atualizar o estado `debouncedNameFilter`.
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedNameFilter(nameFilter)
    }, 500) // ✅ Atraso de 500ms

    // A função de limpeza (cleanup) é crucial para evitar chamadas duplicadas.
    // Ela cancela o timer anterior se o usuário digitar novamente antes que o tempo se esgote.
    return () => {
      clearTimeout(timer)
    }
  }, [nameFilter]) // ✅ Este useEffect só é executado quando `nameFilter` muda.

  // ✅ 2. useEffect para a Chamada da API
  // Ele agora depende do `debouncedNameFilter`, não do `nameFilter` em tempo real.
  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const result = await getCities({
          page,
          limit: limit === 0 ? undefined : limit,
          search: debouncedNameFilter || undefined, // ✅ Usa o estado debounced
        })

        const mappedData: City[] = result.data.map((item: any) => ({
          id: item.id,
          name: item.name,
          createdAt: new Date(item.createdAt).toLocaleDateString("pt-PT"),
          updatedAt: new Date(item.updatedAt).toLocaleDateString("pt-PT"),
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
  }, [page, limit, debouncedNameFilter]) // ✅ Este useEffect é executado apenas quando `page`, `limit` ou `debouncedNameFilter` muda.

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
                value: nameFilter, // ✅ O input continua usando o estado em tempo real
                onChange: setNameFilter,
              },
            ]}
          />
        )}
      </div>
    </div>
  )
}

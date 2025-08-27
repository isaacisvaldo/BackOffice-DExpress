import { useEffect, useState } from "react"
import { DataTable } from "@/components/data-table"
import { sectorColumns, type Sector } from "@/components/sector/sectorColumns"
import { getSector, createSector, updateSector, deleteSector } from "@/services/sector/sector.service"
import { formatDate } from "@/util"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function SectorList() {
  const [data, setData] = useState<Sector[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(5)
  const [totalPages, setTotalPages] = useState(1)

  // Filtros
  const [nameFilter, setNameFilter] = useState<string>("")
  const [debouncedNameFilter, setDebouncedNameFilter] = useState<string>("")

  // Estados do Dialog
  const [open, setOpen] = useState(false)
  const [editingSector, setEditingSector] = useState<Sector | null>(null)
  const [name, setName] = useState("")
  const [label, setLabel] = useState("")
  const [saving, setSaving] = useState(false)

  // Estado do delete
  const [deletingSector, setDeletingSector] = useState<Sector | null>(null)
  const [deleting, setDeleting] = useState(false)

  // Debounce filtro
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedNameFilter(nameFilter), 500)
    return () => clearTimeout(timer)
  }, [nameFilter])

  // Buscar setores
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

  useEffect(() => {
    fetchData()
  }, [page, limit, debouncedNameFilter])

  // Abrir para editar
  function openEditDialog(sector: Sector) {
    setEditingSector(sector)
    setName(sector.name)
    setLabel(sector.label)
    setOpen(true)
  }

  // Abrir para criar
  function openCreateDialog() {
    setEditingSector(null)
    setName("")
    setLabel("")
    setOpen(true)
  }

  // Criar ou atualizar
  async function handleSave() {
    setSaving(true)
    try {
      if (editingSector) {
        await updateSector(editingSector.id, { name, label })
      } else {
        await createSector({ name, label })
      }
      setOpen(false)
      fetchData()
    } catch (err) {
      console.error("Erro ao salvar setor:", err)
    } finally {
      setSaving(false)
    }
  }

  // Deletar
  async function handleDelete() {
    if (!deletingSector) return
    setDeleting(true)
    try {
      await deleteSector(deletingSector.id)
      setDeletingSector(null)
      fetchData()
    } catch (err) {
      console.error("Erro ao excluir setor:", err)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Lista de Cargos e Posições</h1>
        <Button onClick={openCreateDialog}>Novo Setor</Button>
      </div>

      <div className="container mx-auto py-6">
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <DataTable
            columns={sectorColumns({
              onEdit: openEditDialog,
              onDelete: (sector) => setDeletingSector(sector),
            })}
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

      {/* Dialog Criar/Editar */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingSector ? "Editar Setor" : "Cadastrar Novo Setor"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Nome</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="label" className="text-right">Rótulo</Label>
              <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={saving || !name || !label}>
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Confirmar Exclusão */}
      <AlertDialog open={!!deletingSector} onOpenChange={() => setDeletingSector(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita. O setor{" "}
              <b>{deletingSector?.label}</b> será excluído permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
              disabled={deleting}
            >
              {deleting ? "Excluindo..." : "Confirmar Exclusão"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

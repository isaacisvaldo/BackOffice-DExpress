import { useEffect, useState } from "react"
import { DataTable } from "@/components/data-table"
import { disponibilityColumns, type Disponibility } from "@/components/disponibility/disponibilityColumns"
import {
  getDisponibilities,
  createDisponibility,
  updateDisponibility,
  deleteDisponibility,
} from "@/services/disponibilty/disponibilty.service"
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

export default function DisponibilityList() {
  const [data, setData] = useState<Disponibility[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(5)
  const [totalPages, setTotalPages] = useState(1)

  // filtro
  const [nameFilter, setNameFilter] = useState<string>("")
  const [debouncedNameFilter, setDebouncedNameFilter] = useState<string>("")

  // estados dialog
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Disponibility | null>(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [saving, setSaving] = useState(false)

  // excluir
  const [deleting, setDeleting] = useState(false)
  const [deletingItem, setDeletingItem] = useState<Disponibility | null>(null)

  // debounce
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedNameFilter(nameFilter), 500)
    return () => clearTimeout(timer)
  }, [nameFilter])

  // chamada API
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

  useEffect(() => {
    fetchData()
  }, [page, limit, debouncedNameFilter])

  // abrir novo
  function openCreate() {
    setEditing(null)
    setName("")
    setDescription("")
    setOpen(true)
  }

  // abrir editar
  function openEdit(d: Disponibility) {
    setEditing(d)
    setName(d.name)
    setDescription(d.description)
    setOpen(true)
  }

  // salvar
  async function handleSave() {
    setSaving(true)
    try {
      if (editing) {
        await updateDisponibility(editing.id, { name, description })
      } else {
        await createDisponibility({ name, description })
      }
      setOpen(false)
      fetchData()
    } catch (err) {
      console.error("Erro ao salvar:", err)
    } finally {
      setSaving(false)
    }
  }

  // excluir
  async function handleDelete() {
    if (!deletingItem) return
    setDeleting(true)
    try {
      await deleteDisponibility(deletingItem.id)
      setDeletingItem(null)
      fetchData()
    } catch (err) {
      console.error("Erro ao excluir:", err)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Lista de Disponibilidades</h1>
        <Button onClick={openCreate}>Nova Disponibilidade</Button>
      </div>

      <div className="container mx-auto py-6">
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <DataTable
            columns={disponibilityColumns({
              onEdit: openEdit,
              onDelete: (d) => setDeletingItem(d),
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

      {/* Dialog criar/editar */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing ? "Editar Disponibilidade" : "Nova Disponibilidade"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Nome</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Descrição</Label>
              <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={saving || !name || !description}>
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmar exclusão */}
      <AlertDialog open={!!deletingItem} onOpenChange={() => setDeletingItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita. A disponibilidade <b>{deletingItem?.name}</b> será removida.
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

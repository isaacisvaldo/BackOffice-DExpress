"use client"

import { useEffect, useState } from "react"
import { DataTable } from "@/components/data-table"
import {
  getDisponibilities,
  createDisponibility,
  updateDisponibility,
  deleteDisponibility,
  type Disponibility,
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
import { disponibilityColumns } from "@/components/disponibility/disponibilityColumns"

export default function DisponibilityList() {
  const [data, setData] = useState<Disponibility[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(5)
  const [totalPages, setTotalPages] = useState(1)

  // filtro (mantido por nome, como estava)
  const [nameFilter, setNameFilter] = useState<string>("")
  const [debouncedNameFilter, setDebouncedNameFilter] = useState<string>("")

  // dialog criar/editar
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Disponibility | null>(null)
  const [name, setName] = useState("")
  const [label, setLabel] = useState("")
  const [saving, setSaving] = useState(false)

  // excluir
  const [deletingItem, setDeletingItem] = useState<Disponibility | null>(null)
  const [deleting, setDeleting] = useState(false)

  // debounce filtro
  useEffect(() => {
    const t = setTimeout(() => setDebouncedNameFilter(nameFilter), 500)
    return () => clearTimeout(t)
  }, [nameFilter])

  // fetch
  async function fetchData() {
    setLoading(true)
    try {
      const result = await getDisponibilities({
        page,
        limit: limit === 0 ? undefined : limit,
        name: debouncedNameFilter || undefined,
      })
      setData(result.data) // já vem com { id, name, label }
      setTotalPages(result.totalPages || 1)
    } catch (e) {
      console.error("Erro ao carregar disponibilidades", e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [page, limit, debouncedNameFilter])

  // abrir criar
  function openCreate() {
    setEditing(null)
    setName("")
    setLabel("")
    setOpen(true)
  }

  // abrir editar
  function openEdit(item: Disponibility) {
    setEditing(item)
    setName(item.name ?? "")
    setLabel(item.label ?? "")
    setOpen(true)
  }

  // salvar (criar/editar)
  async function handleSave() {
    setSaving(true)
    try {
      if (editing) {
        await updateDisponibility(editing.id, { name, label })
      } else {
        await createDisponibility({ name, label })
      }
      setOpen(false)
      fetchData()
    } catch (e) {
      console.error("Erro ao salvar disponibilidade", e)
    } finally {
      setSaving(false)
    }
  }

  // confirmar excluir
  async function handleDelete() {
    if (!deletingItem) return
    setDeleting(true)
    try {
      await deleteDisponibility(deletingItem.id)
      setDeletingItem(null)
      setData((prev) => prev.filter((i) => i.id !== deletingItem.id))
    } catch (e) {
      console.error("Erro ao excluir disponibilidade", e)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Disponibilidades</h1>
        <Button onClick={openCreate}>Nova Disponibilidade</Button>
      </div>

      <div className="container mx-auto py-6">
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <DataTable
            columns={disponibilityColumns({
              onEdit: openEdit,
              onDelete: (item) => setDeletingItem(item),
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
            <DialogTitle>{editing ? "Editar Disponibilidade" : "Nova Disponibilidade"}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Nome</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="label" className="text-right">Label</Label>
              <Input
                id="label"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="col-span-3"
              />
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

      {/* Confirmar exclusão */}
      <AlertDialog open={!!deletingItem} onOpenChange={() => setDeletingItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita. A disponibilidade{" "}
              <b>{deletingItem?.name}</b> será removida permanentemente.
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

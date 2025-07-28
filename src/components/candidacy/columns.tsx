import type { ColumnDef } from "@tanstack/react-table"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Checkbox } from "@radix-ui/react-checkbox"
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
import toast from "react-hot-toast"

export type Application = {
  id: string
  candidateName: string
  email: string
  phone: string
  location: string
  position: string
  status: "PENDING" | "IN_REVIEW" | "INTERVIEW" | "ACCEPTED" | "REJECTED"
  appliedAt: string
}

const statusStyles: Record<string, { label: string; className: string }> = {
  PENDING: {
    label: "Pendente",
    className: "bg-gray-100 text-gray-800 border border-gray-300",
  },
  IN_REVIEW: {
    label: "Em Análise",
    className: "bg-yellow-100 text-yellow-800 border border-yellow-300",
  },
  INTERVIEW: {
    label: "Entrevista",
    className: "bg-blue-100 text-blue-800 border border-blue-300",
  },
  ACCEPTED: {
    label: "Aprovado",
    className: "bg-green-100 text-green-800 border border-green-300",
  },
  REJECTED: {
    label: "Rejeitado",
    className: "bg-red-100 text-red-800 border border-red-300",
  },
}

export const columns: ColumnDef<Application>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "candidateName",
    header: "Candidato",
    cell: ({ row }) => <div className="capitalize">{row.getValue("candidateName")}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Email
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  { accessorKey: "phone", header: "Telefone" },
  { accessorKey: "location", header: "Localização" },
  { accessorKey: "position", header: "Posição" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      const style = statusStyles[status] || {
        label: status,
        className: "bg-gray-100 text-gray-800 border border-gray-300",
      }
      return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${style.className}`}>
          {style.label}
        </span>
      )
    },
  },
  { accessorKey: "appliedAt", header: "Data" },
  {
    id: "actions",
    cell: ({ row }) => {
      const app = row.original
      const [openApprove, setOpenApprove] = useState(false)
      const [openReject, setOpenReject] = useState(false)

      const handleApprove = async () => {
        console.log(`Aprovando ${app.candidateName}...`)
        await new Promise((r) => setTimeout(r, 1000)) // simula API
       
        toast.success("Aprovado com sucesso!") 
        setOpenApprove(false)
      }

      const handleReject = async () => {
        console.log(`Rejeitando ${app.candidateName}...`)
        await new Promise((r) => setTimeout(r, 1000))
       toast.error("Rejeitado !")
        setOpenReject(false)
      }

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => console.log(`Ver detalhes de ${app.candidateName}`)}>
                Ver Detalhes
              </DropdownMenuItem>
              <DropdownMenuItem className="text-green-600" onClick={() => setOpenApprove(true)}>
                Aprovar
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600" onClick={() => setOpenReject(true)}>
                Rejeitar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Dialog Aprovar */}
          <AlertDialog open={openApprove} onOpenChange={setOpenApprove}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Aprovar Candidatura</AlertDialogTitle>
                <AlertDialogDescription>
                  Tens certeza que queres aprovar <strong>{app.candidateName}</strong>?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setOpenApprove(false)}>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleApprove}>Confirmar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Dialog Rejeitar */}
          <AlertDialog open={openReject} onOpenChange={setOpenReject}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Rejeitar Candidatura</AlertDialogTitle>
                <AlertDialogDescription>
                  Tens certeza que queres rejeitar <strong>{app.candidateName}</strong>?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setOpenReject(false)}>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleReject}>Confirmar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )
    },
  },
]
            
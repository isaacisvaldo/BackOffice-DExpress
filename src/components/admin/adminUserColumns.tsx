// src/components/admin/adminUserColumns.ts

import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { AdminUser } from "@/services/admin/admin.service"


export const adminUserColumns: ColumnDef<AdminUser>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Nome
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div className="font-medium">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "role",
    header: "Cargo",
    cell: ({ row }) => <div className="font-medium">{row.getValue("role")}</div>,
  },
  {
    // ✅ Alterado de "genderId" para "gender.name"
    accessorKey: "gender.name",
    header: "Gênero",
    cell: ({ row }) => <div className="font-medium">{row.original.gender.name}</div>,
  },
  {
    accessorKey: "createdAt",
    header: "Criado em",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"))
      return date.toLocaleDateString("pt-PT")
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const admin = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => alert(`Ver detalhes de ${admin.name}`)}>
              Ver Detalhes
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => alert(`Editar ${admin.name}`)}>
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => alert(`Excluir ${admin.name}`)}>
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

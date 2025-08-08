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

// ✅ O tipo de distrito precisa incluir o objeto da cidade para que possamos mostrar o nome
export type DistrictWithCity = {
  id: string
  name: string
  cityId: string
  createdAt: string
  updatedAt: string
  city: {
    id: string
    name: string
  }
}

// ✅ O array de colunas usa o novo tipo "DistrictWithCity"
export const districtColumns: ColumnDef<DistrictWithCity>[] = [
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
    accessorKey: "city.name", 
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Cidade
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    // ✅ Para a célula, você pode usar o "accessorKey" ou o "row.original"
    cell: ({ row }) => <div className="font-medium">{row.original.city.name}</div>,
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
    accessorKey: "updatedAt",
    header: "Atualizado em",
    cell: ({ row }) => {
      const date = new Date(row.getValue("updatedAt"))
      return date.toLocaleDateString("pt-PT")
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const district = row.original

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
            <DropdownMenuItem onClick={() => alert(`Ver detalhes de ${district.name}`)}>
              Ver Detalhes
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => alert(`Editar ${district.name}`)}>
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => alert(`Excluir ${district.name}`)}>
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

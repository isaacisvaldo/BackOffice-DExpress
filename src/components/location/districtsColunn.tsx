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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog"

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
export const districtColumns= (
  onDelete: (id: string) => void,
  isDeleting: boolean
):ColumnDef<DistrictWithCity>[] => [
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
           
            <DropdownMenuItem onClick={() => alert(`Editar ${district.name}`)}>
              Editar
            </DropdownMenuItem>
            {/* Início do AlertDialog para exclusão */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  {/* onSelect para prevenir o fechamento imediato do DropdownMenu */}
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    Excluir
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Essa ação não pode ser desfeita. Isso excluirá permanentemente o distrito{" "}
                      **{district.name}** e removerá seus dados de nossos servidores.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    {/* Chama a função onDelete passada como prop e desabilita enquanto estiver excluindo */}
                    <AlertDialogAction
                      className="bg-red-500 hover:bg-red-600 text-white"
                      onClick={() => onDelete(district.id)}
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Excluindo..." : "Confirmar Exclusão"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

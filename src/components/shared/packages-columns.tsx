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
import type { Package } from "@/services"


export const packageColumns = (
  onDelete: (id: string) => void,
  isDeleting: boolean
): ColumnDef<Package>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-center"
      >
        Nome
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="text-center font-medium">{row.getValue("name")}</div>, // Adicionado para centralizar o conteúdo
  },
  {
    accessorKey: "cost",
    header: () => <div className="text-center">Custo</div>,
    cell: ({ row }) => {
      const cost = parseFloat(row.getValue("cost"))
      return (
        <div className="text-center">
          {new Intl.NumberFormat("pt-AO", {
            style: "currency",
            currency: "AOA",
          }).format(cost)}
        </div>
      )
    },
  },
  {
    accessorKey: "hours",
    header: () => <div className="text-center">Horas</div>,
    cell: ({ row }) => <div className="text-center">{row.getValue("hours")}h</div>, // Corrigido para text-center
  },
  {
    accessorKey: "employees",
    header: () => <div className="text-center">Funcionários</div>,
    cell: ({ row }) => <div className="text-center">{row.getValue("employees")}</div>, // Corrigido para text-center
  },
  {
    accessorKey: "createdAt",
    header: () => <div className="text-center">Criado em</div>,
       cell: ({ row }) => <div className="text-center">{row.getValue("createdAt")}</div>,
   
  },
  {
    accessorKey: "updatedAt",
    header: () => <div className="text-center">Atualizado em</div>,
   cell: ({ row }) => <div className="text-center">{row.getValue("updatedAt")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    header: () => <div className="text-center">Ações</div>,
    cell: ({ row }) => {
      const pkg = row.original

      return (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              
              <DropdownMenuItem onClick={() => alert(`Editar ${pkg.name}`)}>
                Editar
              </DropdownMenuItem>
              
              {/* Início do AlertDialog para exclusão */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    Excluir
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Essa ação não pode ser desfeita. Isso excluirá permanentemente o pacote de serviço{" "}
                      **{pkg.name}** e removerá seus dados de nossos servidores.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-red-500 hover:bg-red-600 text-white"
                      onClick={() => onDelete(pkg.id)}
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Excluindo..." : "Confirmar Exclusão"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]
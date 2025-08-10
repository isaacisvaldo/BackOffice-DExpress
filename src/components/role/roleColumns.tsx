import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {  MoreHorizontal } from "lucide-react"
import { Checkbox } from "@radix-ui/react-checkbox"
import type { Profile } from "@/services/shared/role/role.service"


// Definição das colunas da tabela de perfis.
export const roleColumns: ColumnDef<Profile>[] = [
  // Coluna de seleção (checkbox).
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Selecionar todos"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Selecionar linha"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  // Coluna com o rótulo do perfil.
  {
    accessorKey: "label",
    header: "Rótulo",
    cell: ({ row }) => <div className="capitalize">{row.getValue("label")}</div>,
  },
  // Coluna com a descrição do perfil.
  {
    accessorKey: "description",
    header: "Descrição",
  },
  // Coluna com a data de criação do perfil.
  {
    accessorKey: "createdAt",
    header: "Criado em",
  },
  // Coluna de ações com menu dropdown.
  {
    id: "actions",
    cell: ({ row, table }) => {
      const profile = row.original;
      // Obtém a função onViewDetails passada pelo componente pai
      const onViewDetails = (table.options.meta as { onViewDetails: (profile: Profile) => void }).onViewDetails;

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
            {/* Chama a função onViewDetails com o perfil da linha */}
            <DropdownMenuItem onClick={() => onViewDetails(profile)}>
                Ver Detalhes
            </DropdownMenuItem>
           
            <DropdownMenuItem className="text-red-600" onClick={() => alert(`Deletar perfil ${profile.name}`)}>
                Deletar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

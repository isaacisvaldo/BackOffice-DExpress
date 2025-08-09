// src/components/admin/adminUserColumns.tsx

import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AdminUser } from "@/services/admin/admin.service";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// É uma função que recebe 'onDelete' e 'isDeleting'
export const adminUserColumns = (
  onDelete: (id: string) => void,
  isDeleting: boolean
): ColumnDef<AdminUser>[] => [
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
      accessorKey: "profile.label",
      header: "Perfil",
      cell: ({ row }) => <div className="font-medium">{row.original.profile?.label}</div>,
    },
    {
      accessorKey: "gender.label",
      header: "Gênero",
      cell: ({ row }) => <div className="font-medium">{row.original.gender?.label}</div>,
    },
    {
      accessorKey: "createdAt",
      header: "Criado em",
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return date.toLocaleDateString("pt-PT");
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const admin = row.original;

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
                      Essa ação não pode ser desfeita. Isso excluirá permanentemente a conta de{" "}
                      **{admin.name}** e removerá seus dados de nossos servidores.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    {/* Chama a função onDelete passada como prop e desabilita enquanto estiver excluindo */}
                    <AlertDialogAction
                      className="bg-red-500 hover:bg-red-600 text-white"
                      onClick={() => onDelete(admin.id)}
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Excluindo..." : "Confirmar Exclusão"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              {/* Fim do AlertDialog para exclusão */}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
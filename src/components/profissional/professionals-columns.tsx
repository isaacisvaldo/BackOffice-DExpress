// src/components/profissional/professionals-columns.tsx

// ... (Suas outras importações) ...
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { ArrowUpDown, MoreHorizontal, Trash2,InfoIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

export type MappedProfessional = {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  isAvailable: boolean;
  availabilityType: string;
  experienceLevel: string;
  desiredPosition: string;
  location: string;
};

// Modifique a assinatura para receber a nova função
export const professionalColumns = (onDelete: (id: string) => void, isDeleting: boolean, onAvailabilityChange: (id: string, newAvailability: boolean) => void): ColumnDef<MappedProfessional>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
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
    accessorKey: "fullName",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Nome
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="capitalize">{row.getValue("fullName")}</div>,
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "desiredPosition",
    header: "Posição",
    cell: ({ row }) => <div className="capitalize">{row.getValue("desiredPosition")}</div>,
  },
  {
    accessorKey: "location",
    header: "Localização",
    cell: ({ row }) => <div>{row.getValue("location")}</div>,
  },
  
  // --- Coluna de Disponibilidade com Atualização Otimista ---
  {
    accessorKey: "isAvailable",
    header: "Disponibilidade",
    cell: ({ row }) => {
      const professional = row.original;
      const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
      const [pendingAvailability, setPendingAvailability] = useState(professional.isAvailable);

      const handleSwitchChange = (newAvailability: boolean) => {
        // Abre o modal e salva o estado futuro, mas não muda a UI ainda
        setPendingAvailability(newAvailability);
        setIsAlertDialogOpen(true);
      };

      const handleConfirmChange = () => {
        // Fecha o modal e chama a função de atualização no componente pai
        setIsAlertDialogOpen(false);
        onAvailabilityChange(professional.id, pendingAvailability);
      };

      const handleCancelChange = () => {
        // Apenas fecha o modal sem fazer nada
        setIsAlertDialogOpen(false);
      };

      return (
        <div className="flex items-center space-x-2">
          {/* O checked do switch é sempre o valor do backend */}
          <Switch checked={professional.isAvailable} onCheckedChange={handleSwitchChange} />
          <span className="text-sm">{professional.isAvailable ? "Disponível" : "Indisponível"}</span>

          <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmação de Disponibilidade</AlertDialogTitle>
                <AlertDialogDescription>
                  Você tem certeza que deseja alterar a disponibilidade de **{professional.fullName}** para **{pendingAvailability ? 'Disponível' : 'Indisponível'}**?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={handleCancelChange}>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmChange}>Confirmar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
  },

  // --- Coluna de Ações com AlertDialog para exclusão ---
  {
    id: "actions",
    cell: ({ row }) => {
      const professional = row.original;
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
            <DropdownMenuItem asChild>
              <Link to={`/professional/${professional.id}/details`}>
               <InfoIcon className="mr-2 h-4 w-4" />
              <span>Detalhes</span></Link>
            </DropdownMenuItem>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Deletar</span>
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Essa ação não pode ser desfeita. Isso excluirá permanentemente a conta de{" "}
                    **{professional.fullName}** e removerá seus dados.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-500 hover:bg-red-600 text-white"
                    onClick={() => onDelete(professional.id)}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Excluindo..." : "Confirmar Exclusão"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
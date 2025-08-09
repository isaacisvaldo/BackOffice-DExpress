import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox"; // Usando a versão do shadcn/ui
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge"; // Componente para o status de disponibilidade

// Reutilizamos o tipo Professional definido acima
export type Professional = {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  isAvailable: boolean;
  availabilityType: string;
  experienceLevel: string;
  desiredPosition: string;
  location: {
    street: string;
    city: {
      name: string;
    };
    district: {
      name: string;
    };
  };
};

export const columns: ColumnDef<Professional>[] = [
  // Coluna de seleção (Checkbox)
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
  
  // Coluna de Nome Completo
  {
    accessorKey: "fullName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Nome
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="capitalize">{row.getValue("fullName")}</div>,
  },

  // Coluna de Email
  {
    accessorKey: "email",
    header: "Email",
  },

  // Coluna de Posição Desejada
  {
    accessorKey: "desiredPosition",
    header: "Posição",
    cell: ({ row }) => <div className="capitalize">{row.getValue("desiredPosition")}</div>,
  },

  // Coluna de Localização (combina cidade e distrito)
  {
    accessorKey: "location",
    header: "Localização",
    cell: ({ row }) => {
      const location = row.original.location;
      return <div>{`${location.city.name} - ${location.district.name}`}</div>;
    },
  },
  
  // Coluna de Status de Disponibilidade
  {
    accessorKey: "isAvailable",
    header: "Disponibilidade",
    cell: ({ row }) => {
      const isAvailable = row.getValue("isAvailable") as boolean;
      return (
        <Badge variant={isAvailable ? "secondary" : "destructive"}>
          {isAvailable ? "Disponível" : "Indisponível"}
        </Badge>
      );
    },
  },
  
  // Coluna de Ações
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
              <Link to={`/professionals/${professional.id}`}>
                Ver Perfil
              </Link>
            </DropdownMenuItem>
            {/* Outras ações podem ser adicionadas aqui, como editar, deletar, etc. */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
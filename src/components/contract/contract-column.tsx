import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import type { Contract, ContractPackageProfessional } from "@/services/contract/contract.service";
import { UserType } from "@/services/serviceRequest/service-request.service";


// Define a função que retorna as colunas para a tabela
export const contractsColumns = (
  onDelete: (id: string) => void,
): ColumnDef<Contract>[] => {
  return [
    {
      accessorKey: "title",
      header: "Título",
    },
    {
      accessorKey: "client",
      header: "Cliente",
      cell: ({ row }) => {
        const contract = row.original;
        // Exibe o nome da empresa ou do cliente individual com base no tipo
        if (contract.clientType === UserType.CORPORATE && contract.companyClient) {
          return contract.companyClient.companyName;
        }
        if (contract.clientType === UserType.INDIVIDUAL && contract.individualClient) {
          return contract.individualClient.fullName;
        }
        return "N/A";
      },
    },
    {
      accessorKey: "professional",
      header: "Profissional",
      cell: ({ row }) => {
        const contract = row.original;
        // Exibe o nome do profissional ou a lista de profissionais
        if (contract.clientType === UserType.INDIVIDUAL && contract.professional) {
          return contract.professional.fullName;
        }
        if (contract.clientType === UserType.CORPORATE && contract.contractPackegeProfissional) {
          // Extrai os nomes dos profissionais da tabela de junção
          const professionalNames = contract.contractPackegeProfissional
            .map((cpp: ContractPackageProfessional) => cpp.professional?.fullName)
            .filter(name => name)
            .join(", ");
          return professionalNames || "N/A";
        }
        return "N/A";
      },
    },
    {
      accessorKey: "startDate",
      header: "Data de Início",
      cell: ({ row }) => {
        const date = new Date(row.original.startDate);
        return format(date, "dd/MM/yyyy");
      },
    },
    {
      accessorKey: "endDate",
      header: "Data de Fim",
      cell: ({ row }) => {
        const date = new Date(row.original.endDate);
        return format(date, "dd/MM/yyyy");
      },
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const contract = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(contract.id)}>
                Copiar ID do Contrato
              </DropdownMenuItem>
              <DropdownMenuItem>
                Ver detalhes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(contract.id)}>
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};

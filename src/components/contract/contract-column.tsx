import {  MoreHorizontal } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  statusLabels,
  type Contract,
  type ContractPackageProfessional,
  type ContractStatus,
} from "@/services/contract/contract.service";
import { UserType } from "@/services/serviceRequest/service-request.service";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Badge } from "../ui/badge";
export const statusColors: Record<string, string> = {
  DRAFT: "bg-gray-500",
  PENDING_SIGNATURE: "bg-yellow-500",
  EXPIRED: "bg-red-500",
  ACTIVE: "bg-green-600",
  TERMINATED: "bg-orange-500",
  CANCELED: "bg-gray-700",
  PAUSED: "bg-blue-500",
  COMPLETED: "bg-purple-600",
};
export const contractsColumns = (
  onDelete: (id: string) => void,
  isDeleting: boolean
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
      accessorKey: "clientType",
      header: "Tipo de Cliente",
      cell: ({ row }) => {
        const contract = row.original;
        if (contract.clientType === UserType.CORPORATE) {
          return (
            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 font-medium">
              Empresa
            </span>
          );
        }
        if (contract.clientType === UserType.INDIVIDUAL) {
          return (
            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 font-medium">
              Individual
            </span>
          );
        }
        return "N/A";
      },
    },
    {
      accessorKey: "contractNumber",
      header: "Num* Contrato",
      cell: ({ row }) => row.original.contractNumber,
    },
    {
      accessorKey: "professional",
      header: "Profissional",
      cell: ({ row }) => {
        const contract = row.original;
        const isIndividual = contract.clientType === UserType.INDIVIDUAL;
        const professionals =
          isIndividual && contract.professional
            ? [contract.professional] // transforma em array para usar no mesmo modal
            : contract.contractPackegeProfissional?.map(
              (cpp: ContractPackageProfessional) => cpp.professional
            ) ?? [];

        if (!professionals.length) return "N/A";

        return (
          <Dialog>
            <DialogTrigger asChild>

              <Button variant="outline" size="sm">
                {isIndividual ? "Ver Profissional" : "Ver Profissionais"}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {isIndividual ? "Profissional" : "Profissionais do Contrato"}
                </DialogTitle>
              </DialogHeader>

              <div className="mt-4 space-y-3 max-h-64 overflow-y-auto pr-2">
                {professionals.map((prof, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-xl border p-3 shadow-sm hover:bg-muted transition"
                  >
                    <div>
                      <p className="font-medium text-sm text-foreground">
                        {prof?.fullName ?? "Sem nome"}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        📞 {prof?.phoneNumber ?? "Sem telefone"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        );
      },
    },

    {
      accessorKey: "startDate",
      header: "Data de Início",
      cell: ({ row }) =>
        row.original.startDate
          ? format(new Date(row.original.startDate), "dd/MM/yyyy")
          : "-",
    },
    {
      accessorKey: "endDate",
      header: "Data de Fim",
      cell: ({ row }) =>
        row.original.endDate
          ? format(new Date(row.original.endDate), "dd/MM/yyyy")
          : "-",
    },
{
  accessorKey: "status",
  header: "Status",
  cell: ({ row }) => {
 const status = row.original.status as ContractStatus;
const label = statusLabels[status] ?? status;
    return (
      <Badge className={`${statusColors[status]} text-white`}>
  {label}
</Badge>
    );
  },
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
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(contract.contractNumber)}
              >
                Copiar Cod* do Contrato
              </DropdownMenuItem>
              <DropdownMenuItem>Ver detalhes</DropdownMenuItem>

              {/* AlertDialog dentro do Dropdown */}

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
                     Essa ação não pode ser desfeita. Isso excluirá permanentemente o
                      Contrato <b>{contract.contractNumber}</b> e removerá seus dados de nossos
                      servidores.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    {/* Chama a função onDelete passada como prop e desabilita enquanto estiver excluindo */}
                    <AlertDialogAction
                      className="bg-red-500 hover:bg-red-600 text-white"
                      onClick={() => onDelete(contract.id)}
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
};

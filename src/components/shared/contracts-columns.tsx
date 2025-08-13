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

// Para este exemplo, as interfaces são redefinidas aqui para funcionar de forma isolada.
// Em um projeto real, você as importaria do seu `src/services/index.ts`.
interface CompanyPackage {
  id: string;
  clientCompanyProfileId: string;
  packageId: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  companyName?: string; // Adicionado para exibição
  packageName?: string; // Adicionado para exibição
  type: 'company'; // Distingue o tipo na tabela
}

interface IndividualContract {
  id: string;
  clientProfileId: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  agreedHours: number;
  isActive: boolean;
  createdAt: string;
  clientName?: string; // Adicionado para exibição
  employeeName?: string; // Adicionado para exibição
  type: 'individual'; // Distingue o tipo na tabela
}

// Tipo unificado para os dados da tabela
type ContractListItem = CompanyPackage | IndividualContract;


export const contractsColumns = (
  onDelete: (id: string) => void
): ColumnDef<ContractListItem>[] => [
  {
    accessorKey: "type",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-center"
      >
        Tipo
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-center font-medium">
        {row.original.type === 'company' ? 'Empresa' : 'Pessoa Singular'}
      </div>
    ),
  },
  {
    accessorKey: "name", // Este é um campo virtual para a tabela
    header: () => <div className="text-center">Contratante</div>,
    cell: ({ row }) => {
      const contract = row.original;
      return (
        <div className="text-center">
          {contract.type === 'company' ? contract.companyName : contract.clientName}
        </div>
      );
    },
  },
  {
    accessorKey: "item", // Este é um campo virtual para a tabela
    header: () => <div className="text-center">Serviço/Funcionário</div>,
    cell: ({ row }) => {
      const contract = row.original;
      return (
        <div className="text-center">
          {contract.type === 'company' ? contract.packageName : contract.employeeName}
        </div>
      );
    },
  },
  {
    accessorKey: "startDate",
    header: () => <div className="text-center">Início</div>,
    cell: ({ row }) => {
      const date = new Date(row.getValue("startDate"));
      return <div className="text-center">{date.toLocaleDateString("pt-PT")}</div>;
    },
  },
  {
    accessorKey: "endDate",
    header: () => <div className="text-center">Fim</div>,
    cell: ({ row }) => {
      const date = new Date(row.getValue("endDate"));
      return <div className="text-center">{date.toLocaleDateString("pt-PT")}</div>;
    },
  },
  {
    accessorKey: "agreedHours",
    header: () => <div className="text-center">Horas Acordadas</div>,
    cell: ({ row }) => {
      const contract = row.original;
      // Horas Acordadas só existem para contratos individuais
      return (
        <div className="text-center">
          {contract.type === 'individual' ? `${contract.agreedHours}h` : 'N/A'}
        </div>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: () => <div className="text-center">Ativo</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {row.getValue("isActive") ? 'Sim' : 'Não'}
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    header: () => <div className="text-center">Ações</div>,
    cell: ({ row }) => {
      const contract = row.original;

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
              
              <DropdownMenuItem onClick={() => alert(`Editar contrato ${contract.id} (${contract.type})`)}>
                Editar
              </DropdownMenuItem>
              
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
                      Essa ação não pode ser desfeita. Isso excluirá permanentemente o contrato{" "}
                      **{contract.type === 'company' ? contract.companyName + ' - ' + contract.packageName : contract.clientName + ' - ' + contract.employeeName}** e removerá seus dados de nossos servidores.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-red-500 hover:bg-red-600 text-white"
                      onClick={() => onDelete(contract.id)}
                    >
                      Confirmar Exclusão
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
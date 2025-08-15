// src/components/service-request/service-requests-columns.tsx

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
import { ArrowUpDown, MoreHorizontal, Trash2, InfoIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";

import { StatusRequest } from "@/services/serviceRequest/service-request.service";


// Tipo para os dados mapeados para a tabela (o que será exibido)
export type MappedServiceRequest = {
    id: string;
    requesterEmail: string;
    requesterType: string;
    name: string | undefined
    nif: string | undefined
    status: StatusRequest;
    description: string;
    createdAt:string;
    startDate: string;
    endDate: string;
};


// Define as opções de status para o dropdown
const statusStyles: Record<string, { label: string; className: string }> = {
    PENDING: {
        label: "Pendente",
        className: "bg-gray-100 text-gray-800 border border-gray-300",
    },
    IN_REVIEW: {
        label: "Em Análise",
        className: "bg-yellow-100 text-yellow-800 border border-yellow-300",
    },
    PLAN_OFFERED: {
        label: "Plano Oferecido",
        className: "bg-blue-100 text-blue-800 border border-blue-300",
    },
    CONTRACT_GENERATED: {
        label: "Contrato Gerado",
        className: "bg-green-100 text-green-800 border border-green-300",
    },
    COMPLETED: {
        label: "Aprovado",
        className: "bg-green-100 text-green-800 border border-green-300",
    },
    REJECTED: {
        label: "Rejeitado",
        className: "bg-red-100 text-red-800 border border-red-300",
    },
}

// Define a função que retorna as colunas da tabela
export const serviceRequestColumns = (
    onDelete: (id: string) => void,
    isDeleting: boolean,

): ColumnDef<MappedServiceRequest>[] => [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
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
        {
            accessorKey: "name",
            header: "Nome",
            cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
        },
        {
            accessorKey: "requesterEmail",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Email
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
        },
          {
            accessorKey: "nif",
            header: "Nif*",
            cell: ({ row }) => <div className="capitalize">{row.getValue("nif")}</div>,
        },
        {
            accessorKey: "requesterType",
            header: "Tipo",
            cell: ({ row }) => <div className="capitalize">{row.getValue("requesterType")}</div>,
        },
        {
            accessorKey: "description",
            header: "Descrição",
            cell: ({ row }) => <div className="truncate max-w-xs">{row.getValue("description")}</div>,
        },
           {
            accessorKey: "createdAt",
            header: "Criado em",
            cell: ({ row }) => <div className="truncate max-w-xs">{row.getValue("createdAt")}</div>,
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue("status") as string
                const style = statusStyles[status] || {
                    label: status,
                    className: "bg-gray-100 text-gray-800 border border-gray-300",
                }
                return (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${style.className}`}>
                        {style.label}
                    </span>
                )
            },
        },
        {
            id: "actions",
            header: "Ações",
            cell: ({ row }) => {
                const request = row.original;
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
                                <Link to={`/admin/service-requests/${request.id}/details`}>
                                    <InfoIcon className="mr-2 h-4 w-4" />
                                    <span>Detalhes</span>
                                </Link>
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
                                            Essa ação não pode ser desfeita. Isso excluirá permanentemente a solicitação de{" "}
                                            **{request.requesterEmail}**.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction
                                            className="bg-red-500 hover:bg-red-600 text-white"
                                            onClick={() => onDelete(request.id)}
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
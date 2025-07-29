"use client"
import { Calendar } from "@/components/ui/calendar"  // o componente correto
import { ChevronDownIcon } from "lucide-react"       // ícone separado

import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "./ui/button"
import React from "react"
import { Input } from "./ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// Agora com suporte para "date" e reset individual
interface FilterConfig {
  type: "input" | "select" | "date"
  column?: string
  placeholder?: string
  options?: { label: string; value: string }[]
  value: string
  onChange: (value: string) => void
  reset?: () => void
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  page: number
  setPage: (page: number) => void
  totalPages: number
  limit: number
  setLimit: (limit: number) => void
  filters?: FilterConfig[]
  className?: string
  
}

export function DataTable<TData, TValue>({
  columns,
  data,
  page,
  setPage,
  totalPages,
  limit,
  setLimit,
  filters = [],
  className = "",

}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const handleResetFilters = () => {
    filters.forEach((f) => {
      f.onChange("")
      if (f.reset) f.reset()
      if (f.column) table.getColumn(f.column)?.setFilterValue("")
    })
  }

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Filtros */}
      <div className="flex flex-wrap gap-4 items-center py-4">
        {/* Itens por página */}
        <Select
          value={String(limit)}
          onValueChange={(value) => {
            setLimit(value === "all" ? 0 : parseInt(value))
            setPage(1)
          }}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Itens por página" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="all">Todos</SelectItem>
          </SelectContent>
        </Select>

        {/* Renderizar filtros dinamicamente */}
        {filters.map((filter, idx) => {
          if (filter.type === "input") {
            return (
              <Input
                key={idx}
                placeholder={filter.placeholder || "Filtrar..."}
                value={filter.value}
                onChange={(e) => {
                  filter.onChange(e.target.value)
                  if (filter.column) {
                    table.getColumn(filter.column)?.setFilterValue(e.target.value)
                  }
                }}
                className="max-w-sm"
              />
            )
          }
          if (filter.type === "select" && filter.options) {
            return (
              <Select
                key={idx}
                value={filter.value}
                onValueChange={(val) => {
                  filter.onChange(val)
                  if (filter.column) {
                    table.getColumn(filter.column)?.setFilterValue(val)
                  }
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={filter.placeholder || "Selecione"} />
                </SelectTrigger>
                <SelectContent>
                  {filter.options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )
          }
        if (filter.type === "date") {
    return (
      <div key={idx} className="flex flex-col">
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-48 justify-between font-normal"
            >
              {filter.value ? new Date(filter.value).toLocaleDateString("pt-PT") : "Selecionar data"}
              <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={filter.value ? new Date(filter.value) : undefined}
              captionLayout="dropdown"
              onSelect={(date) => {
                const selected = date ? date.toISOString().split("T")[0] : ""
                filter.onChange(selected)
                if (filter.column) {
                  table.getColumn(filter.column)?.setFilterValue(selected)
                }
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    )
  }
          return null
        })}

        {/* Botão para limpar filtros */}
        {filters.length > 0 && (

          <Button
            variant="destructive"
            size="sm"
            onClick={handleResetFilters}
          >
            Limpar Filtros
          </Button>
        )}

        {/* Mostrar/ocultar colunas */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Colunas
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Tabela */}
      <div className="flex-1 overflow-auto rounded-md border">
        <Table className="min-w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginação */}
      <div className="flex items-center justify-between py-4">
        <span>Página {page} de {totalPages}</span>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page - 1)}
            disabled={page <= 1}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPages}
          >
            Próxima
          </Button>
        </div>
      </div>
    </div>
  )
}

// src/components/PageHeader.tsx
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Input } from "@/components/ui/input"
import { ModeToggle } from "@/components/mode-toggle"
import { Search, Bell } from "lucide-react"
import { type ReactNode, useState, useRef } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface PageHeaderProps {
  breadcrumb?: string[]
  onSearch?: (value: string) => void
  actions?: ReactNode
}

export function PageHeader({ breadcrumb = [], onSearch, actions }: PageHeaderProps) {
  const [search, setSearch] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearch(value)
    if (onSearch) onSearch(value)
  }

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 px-4 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      {/* Esquerda: Sidebar + Pesquisa + Breadcrumb */}
      <div className="flex items-center gap-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />

        {/* Campo de pesquisa com ícone */}
        <div className="relative w-48">
          <Search
            size={16}
            className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer"
            onClick={() => inputRef.current?.focus()}
          />
          <Input
            ref={inputRef}
            placeholder="Pesquisar..."
            className="pl-8"
            value={search}
            onChange={handleSearch}
          />
        </div>

        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumb.length > 0 && (
              <>
                <BreadcrumbSeparator className="hidden md:block" />
                {breadcrumb.map((item, idx) => (
                  <BreadcrumbItem key={idx}>
                    <BreadcrumbPage>{item}</BreadcrumbPage>
                  </BreadcrumbItem>
                ))}
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Direita: Dropdown de notificações + Toggle + Ações */}
      <div className="flex items-center gap-4">
        {/* Sino com dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="relative p-2 rounded-md hover:bg-accent transition"
              aria-label="Notificações"
            >
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 max-h-64 overflow-y-auto">
            <DropdownMenuLabel>Notificações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* Lista de notificações (mock) */}
            {[
              { id: 1, title: "Nova candidatura recebida", time: "Há 5 min" },
              { id: 2, title: "Servidor atualizado", time: "Há 2 horas" },
              { id: 3, title: "Novo comentário no projeto", time: "Há 3 horas" },
              { id: 4, title: "Backup concluído", time: "Ontem" },
              { id: 5, title: "Manutenção agendada", time: "2 dias atrás" },
              { id: 6, title: "Usuário registrado", time: "3 dias atrás" },
            ].map((notif) => (
              <DropdownMenuItem key={notif.id} className="flex flex-col items-start gap-1">
                <span className="font-medium">{notif.title}</span>
                <span className="text-xs text-muted-foreground">{notif.time}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center justify-center">
              Ver todas as notificações
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Toggle de tema */}
        <ModeToggle />

        {actions}
      </div>
    </header>
  )
}

// src/components/app-sidebar.tsx

import * as React from "react"
import {
  Users,
  Briefcase,
  MapPin,
  ClipboardList,
  Settings2,
  Shield,
  FileText,
  PieChart,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavMain } from "./nav-main"
import { NavProjects } from "./nav-projects"
import { NavUser } from "./nav-user"
import { NavDashboard } from "./nav-dashboard"

// Pega a URL do logo do .env ou usa uma imagem padrão
const logoUrl = import.meta.env.VITE_LOGO_URL || "/logo.png"

// Dados reais do DExpress (menus e atalhos)
const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
const data = {
  user: {
    name: storedUser.name || 'Usuário',
    email: storedUser.email || '',
    avatar: "/avatars/admin.jpg",
  },
    dashboard: {
    name: "Dashboard",
    url: "/dashboard",
    icon: PieChart,
  },
  navMain: [
    
    {
      title: "Clientes",
      url: "/clients",
      icon: Users,
      isActive: true,
      items: [
        { title: "Clientes (PF)", url: "/clients/individual" },
        { title: "Empresas (PJ)", url: "/clients/company" },
      ],
    },
    {
      title: "Profissionais",
      url: "/professionals",
      icon: Briefcase,
      items: [
        { title: "Lista de Profissionais", url: "/professionals" },
        { title: "Especialidades", url: "/professionals/specialties" },
        { title: "Disponibilidades", url: "/professionals/availability" },
      ],
    },
    {
      title: "Candidaturas & Vagas",
      url: "/applications",
      icon: ClipboardList,
      items: [
        { title: "Candidaturas", url: "/applications" },
        { title: "Vagas", url: "/jobs" },
      ],
    },
    {
      title: "Localizações",
      url: "/locations",
      icon: MapPin,
      items: [
        { title: "Cidades", url: "/locations/cities" },
        { title: "Distritos", url: "/locations/districts" },
      ],
    },
    {
      title: "Administração",
      url: "/admin",
      icon: Shield,
      items: [
        { title: "Usuários Internos", url: "/admin/users" },
        { title: "Perfis e Permissões", url: "/admin/roles" },
      ],
    },
    {
      title: "Relatórios",
      url: "/reports",
      icon: FileText,
      items: [
        { title: "Relatório de Clientes", url: "/reports/clients" },
        { title: "Relatório de Profissionais", url: "/reports/professionals" },
        { title: "Relatório Financeiro", url: "/reports/finance" },
      ],
    },
    {
      title: "Configurações",
      url: "/settings",
      icon: Settings2,
      items: [
        { title: "Geral", url: "/settings/general" },
        { title: "Notificações", url: "/settings/notifications" },
      ],
    },
  ],
  projects: [
    {
      name: "Operações Ativas",
      url: "/dashboard/operations",
      icon: PieChart,
    },
    {
      name: "Gestão de Equipes",
      url: "/dashboard/teams",
      icon: Users,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      {/* Header com o Logo */}
  <SidebarHeader className="flex justify-start items-center px-4 py-4">
  <a href="/dashboard" className="flex items-center">
    <img
      src={logoUrl}
      alt="DExpress Logo"
      className="h-10 w-auto"
    />
  </a>
</SidebarHeader>

      <SidebarContent>
        <NavDashboard dashboard={data.dashboard} />  
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}

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
  List,
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
import { Link } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Pega a URL do logo do .env ou usa uma imagem padrão
const logoUrl = import.meta.env.VITE_LOGO_URL || "/logo.png"

// Dados reais do DExpress (menus e atalhos)
const { user } = useAuth()
console.log("USER:",user);

const data = {
  user: {
    name: user?.name || 'Usuário',
    email: user?.email || '',
    avatar: "/avatars/admin.jpg",
  },
  dashboard: [
    {
      name: "Dashboard",
      url: "/dashboard",
      icon: PieChart,
    }
  ],
  navMain: [
    // CRM – Relacionamento com clientes
    {
      title: "CRM - Gestão de Clientes",
      url: "/clients",
      icon: Users,
      items: [
        { title: "Clientes (Pessoa Física)", url: "/clients/individual" },
        { title: "Clientes (Empresas)", url: "/clients/company" },
      ],
    },

    // Gestão de Profissionais
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

    // Processo de Contratação
    {
      title: "Contratações",
      url: "/hires",
      icon: ClipboardList,
      items: [
        { title: "Solicitações de Contratação", url: "/hires/requests" },
        { title: "Candidaturas", url: "/hires/applications" },
        { title: "Vagas", url: "/hires/jobs" },
      ],
    },

    // Localização geográfica
    {
      title: "Localizações",
      url: "/locations",
      icon: MapPin,
      items: [
        { title: "Cidades", url: "/locations/cities" },
        { title: "Distritos", url: "/locations/districts" },
      ],
    },

    // NOVO BLOCO: Gerenciamento de Dados Compartilhados
    {
      title: "Gerenciamento de Dados",
      url: "/shared-data",
      icon: List, // Usando List para representar lista de dados
      items: [
        { title: "Cargos e Posições", url: "/shared-data/positions" },
        { title: "Idiomas", url: "/shared-data/languages" },
        { title: "Habilidades", url: "/shared-data/skills" },
        { title: "Cursos e Certificados", url: "/shared-data/courses" },
        { title: "Grau Acadêmico", url: "/shared-data/highest-degrees" },
        { title: "Estados Civis", url: "/shared-data/marital-status" },
        { title: "Gêneros", url: "/shared-data/genders" },
        { title: "Setores", url: "/shared-data/sectors" }
      ],
    },

    // Administração interna da plataforma
    {
      title: "Administração",
      url: "/admin",
      icon: Shield,
      items: [
        { title: "Usuários Internos", url: "/admin/users" },
        { title: "Perfis e Permissões", url: "/admin/roles" },
      ],
    },

    // Relatórios
    {
      title: "Relatórios",
      url: "/reports",
      icon: FileText,
      items: [
        { title: "Clientes", url: "/reports/clients" },
        { title: "Profissionais", url: "/reports/professionals" },
        { title: "Financeiro", url: "/reports/finance" },
      ],
    },

    // Configurações gerais
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

  // Projetos ou dashboards específicos
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


  return (
    <Sidebar collapsible="icon" {...props}>
      {/* Header com o Logo */}
  <SidebarHeader className="flex justify-start items-center px-4 py-4">
 <Link to="/dashboard" className="flex items-center">
  <img
    src={logoUrl}
    alt="DExpress Logo"
    className="h-10 w-auto"
  />
</Link>
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

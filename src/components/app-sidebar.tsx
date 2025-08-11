import * as React from "react"
import {
  Users,
  MapPin,
  Settings2,
  Shield,
  FileText,
  PieChart,
  List,
  BriefcaseBusiness,
  Landmark,
  Briefcase,

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
import { NavRh } from "./nav-rh"
import { NavFinancas } from "./nav-financas"


import { Link } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { NavOperacoes } from "./nav-operacoes"


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const logoUrl = import.meta.env.VITE_LOGO_URL || "/logo.png"
  const { user } = useAuth()
  const data = {
    user: {
      name: user?.name || 'Usuário',
      email: user?.email || '',
      avatar: "/user.png",
    },
    dashboard: [
      {
        name: "Dashboard",
        url: "/dashboard",
        icon: PieChart,
      }
    ],
    navMain: [
      {
        title: "CRM - Gestão de Clientes",
        url: "/clients",
        icon: Users,
        items: [
          { title: "Clientes (Pessoa Física)", url: "/clients/individual" },
          { title: "Clientes (Empresas)", url: "/clients/company" },
        ],
      },
      {
        title: "Relatórios",
        url: "/reports",
        icon: FileText,
        items: [
          { title: "Clientes", url: "/reports/clients" },
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
        title: "Gerenciamento de Dados",
        url: "/shared-data",
        icon: List,
        items: [
          { title: "Idiomas", url: "/shared-data/languages" },
          { title: "Habilidades", url: "/shared-data/skills" },
        
          { title: "Cursos e Certificados", url: "/shared-data/courses" },
          { title: "Grau Acadêmico", url: "/shared-data/highest-degrees" },
          { title: "Estados Civis", url: "/shared-data/marital-status" },
          { title: "Gêneros", url: "/shared-data/genders" },
        ],
      },
    
      
      
    ],
    navRh: [
      {
        title: "Recursos Humanos",
        url: "/rh",
        icon: BriefcaseBusiness,
        items: [
          { title: "Profissionais", url: "/rh/professionals" },
          { title: "Vagas", url: "/rh/jobs" },
          { title: "Candidaturas", url: "/rh/applications" },
          { title: "Solicitações de Contratação", url: "/rh/requests" },
          { title: "Relatórios de RH", url: "/rh/reports" },
          { title: "Cargos e Posições", url: "/rh/positions" },
          { title: "Disponibilidade", url: "/rh/disponibilidade" },
          { title: "Nível de Experiência", url: "/rh/nivel-experiencia" },
          { title: "Setores-empresa", url: "/rh/sectors" }
        ],
      },
        {
        title: "Administração",
        url: "/admin",
        icon: Shield,
        items: [
          { title: "Usuários Internos", url: "/admin/users" },
          { title: "Perfis e Permissões", url: "/admin/roles-permissions" },
        ],
      },
    ],
    navFinancas: [
      {
        title: "Finanças",
        url: "/financas",
        icon: Landmark,
        items: [
          { title: "Dashboard Financeiro", url: "/financas/dashboard" },
          { title: "Relatórios Financeiros", url: "/financas/relatorios" },
          { title: "Contas a Pagar", url: "/financas/contas-pagar" },
          { title: "Contas a Receber", url: "/financas/contas-receber" },
          { title: "Fluxo de Caixa", url: "/financas/fluxo-caixa" }
        ],
      },
    ],
    navOperacoes: [
      {
        title: "Operações e Projetos",
        url: "/operacoes",
        icon: Briefcase,
        items: [
          { title: "Projetos", url: "/operacoes/projects" },
          { title: "Gestão de Tarefas", url: "/operacoes/tasks" },
          { title: "Contratos e Propostas", url: "/operacoes/contracts" },
          { title: "Equipes", url: "/operacoes/teams" },
        ],
      },
    ],
    projects: [
      {
        name: "Geral",
        url: "/settings/general",
        icon: Settings2,
      },
      {
        name: "Notificações",
        url: "settings/notifications",
        icon: Users,
      },
    ]
   
  }


  return (
    <Sidebar collapsible="icon" {...props}>
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
        <NavOperacoes items={data.navOperacoes} />
        <NavRh items={data.navRh} />
        <NavFinancas items={data.navFinancas} />
        <NavProjects projects={data.projects} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}

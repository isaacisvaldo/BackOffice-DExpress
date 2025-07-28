"use client"

import { MoreHorizontal } from "lucide-react"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import type { LucideIcon } from "lucide-react"

export function NavDashboard({
  dashboard,
}: {
  dashboard: {
    name: string
    url: string
    icon: LucideIcon
  }
}) {
  useSidebar()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Principal</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <a href={dashboard.url}>
              <dashboard.icon />
              <span>{dashboard.name}</span>
            </a>
          </SidebarMenuButton>
          <SidebarMenuAction showOnHover>
            <MoreHorizontal />
            <span className="sr-only">Mais ações</span>
          </SidebarMenuAction>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}

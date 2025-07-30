"use client"


import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import type { LucideIcon } from "lucide-react"
import { Link } from "react-router-dom"

export function NavDashboard({
  dashboard,
}: {
  dashboard: {
    name: string
    url: string
    icon: LucideIcon
  }[]
}) {
  useSidebar()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Principal</SidebarGroupLabel>
     <SidebarMenu>
  {dashboard.map((item) => (
    <SidebarMenuItem key={item.name}>
      <SidebarMenuButton asChild>
        <Link to={item.url}>
          <item.icon />
          <span>{item.name}</span>
        </Link>
      </SidebarMenuButton>

    </SidebarMenuItem>
  ))}
</SidebarMenu>
    </SidebarGroup>
  )
}

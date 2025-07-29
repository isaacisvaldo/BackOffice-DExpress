import { AppSidebar } from "@/components/app-sidebar";
import { PageHeader } from "@/components/page-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

import { AlertTriangle } from "lucide-react"; 

export default function NotFoundPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
    <PageHeader
         onSearch={(val) => console.log("Pesquisando:", val)}

        />

        {/* Conteúdo principal */}
        <div className="flex flex-col items-center justify-center h-screen text-center space-y-4">
          {/* Ícone animado */}
          <AlertTriangle className="w-16 h-16 text-blue-500 animate-bounce" />

          <h1 className="text-3xl font-bold">404 - Página Não Encontrada</h1>
          <p className="text-gray-500">A página que você procura não existe ou foi movida.</p>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

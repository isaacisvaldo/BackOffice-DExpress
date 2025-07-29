import { AppSidebar } from "@/components/app-sidebar";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";

interface ErrorPageProps {
  title?: string;
  message?: string;
  breadcrumb?: string; 
  onRetry?: () => void; 
  backTo?: string; 
}

export default function ErrorPage({
  title = "Algo deu errado",
  message = "Não conseguimos carregar as informações. Tente novamente mais tarde.",

  onRetry,
  backTo,
}: ErrorPageProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <PageHeader
         onSearch={(val) => console.log("Pesquisando:", val)}

        />

        {/* Conteúdo central */}
        <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] text-center space-y-4">
          <AlertTriangle className="w-16 h-16 text-red-500 animate-pulse" />
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-gray-500">{message}</p>

          <div className="flex gap-4 mt-4">
            {onRetry && (
              <Button variant="default" onClick={onRetry}>
                Tentar Novamente
              </Button>
            )}
            {backTo && (
              <Button variant="outline" asChild>
                <a href={backTo}>Voltar</a>
              </Button>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

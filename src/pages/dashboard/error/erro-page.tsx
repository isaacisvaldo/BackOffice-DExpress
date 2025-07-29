import { AppSidebar } from "@/components/app-sidebar";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  breadcrumb = "Erro",
  onRetry,
  backTo,
}: ErrorPageProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">{breadcrumb}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Página de Erro</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

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


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

  onRetry,
  backTo,
}: ErrorPageProps) {


   return (
     <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
               {/* Conteúdo principal */}
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
            </div>
          </div>
        </div>
   
  );
}

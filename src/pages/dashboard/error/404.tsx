

import { AlertTriangle } from "lucide-react"; 

export default function NotFoundPage() {
  return (
     <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
               {/* Conteúdo principal */}
        <div className="flex flex-col items-center justify-center h-screen text-center space-y-4">
          {/* Ícone animado */}
          <AlertTriangle className="w-16 h-16 text-blue-500 animate-bounce" />

          <h1 className="text-3xl font-bold">404 - Página Não Encontrada</h1>
          <p className="text-gray-500">A página que você procura não existe ou foi movida.</p>
        </div>
            </div>
          </div>
        </div>
   
  );
}

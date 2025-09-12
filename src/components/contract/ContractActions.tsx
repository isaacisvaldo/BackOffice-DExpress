import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Play, Pause, Square, Calendar, FileText, Mail, CheckCircle, Download
} from "lucide-react";

interface ContractActionsProps {
  contractId: string;
  currentStatus: "active" | "completed" | "cancelled" | "suspended";
  onStatusChange: (newStatus: string, actionData?: any) => Promise<void>;
}

interface ContractDocument {
  id: string;
  name: string;
  url: string;
}

export function ContractActions({ 
  contractId, 
  currentStatus, 
  onStatusChange 
}: ContractActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [notes, setNotes] = useState("");
  const [documents, setDocuments] = useState<ContractDocument[]>([]);

  // 🔹 Mock inicial
  useEffect(() => {
    const mockDocs: ContractDocument[] = [
      {
        id: "1",
        name: "Contrato_Assinado.pdf",
        url: "/mock/Contrato_Assinado.pdf",
      },
      {
        id: "2",
        name: "Comprovativo_Pagamento.png",
        url: "/mock/Comprovativo_Pagamento.png",
      },
    ];
    setDocuments(mockDocs);
  }, [contractId]);

  const handleAction = async (action: string, actionData?: any) => {
    setIsLoading(true);
    try {
      await onStatusChange(action, actionData);
      setNotes("");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newDocs: ContractDocument[] = Array.from(files).map((file, idx) => ({
      id: `${Date.now()}-${idx}`,
      name: file.name,
      url: URL.createObjectURL(file), // 🔹 Simula o link do arquivo
    }));

    setDocuments((prev) => [...prev, ...newDocs]);
    e.target.value = "";
  };

  const getAvailableActions = () => {
    switch (currentStatus) {
      case "active":
        return [
          { action: "suspend", label: "Suspender Contrato", icon: Pause, variant: "outline" as const },
          { action: "complete", label: "Marcar como Concluído", icon: CheckCircle, variant: "default" as const },
          { action: "cancel", label: "Cancelar Contrato", icon: Square, variant: "destructive" as const }
        ];
      case "suspended":
        return [
          { action: "reactivate", label: "Reativar Contrato", icon: Play, variant: "default" as const },
          { action: "cancel", label: "Cancelar Contrato", icon: Square, variant: "destructive" as const }
        ];
      default:
        return [];
    }
  };

  const quickActions = [
    { action: "schedule_service", label: "Agendar Próximo Serviço", icon: Calendar, variant: "outline" as const },
    { action: "send_notification", label: "Notificar Cliente", icon: Mail, variant: "outline" as const },
  
  ];

  const availableActions = getAvailableActions();

  return (
    <div className="space-y-6">
      {/* STATUS */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Status do Contrato</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">Status Atual:</span>
            <Badge variant={currentStatus === "active" ? "default" : "secondary"}>
              {currentStatus === "active" && "Ativo"}
              {currentStatus === "suspended" && "Suspenso"}
              {currentStatus === "completed" && "Concluído"}
              {currentStatus === "cancelled" && "Cancelado"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            ID do Contrato: {contractId}
          </p>
        </CardContent>
      </Card>

      {/* AÇÕES RÁPIDAS */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.action}
                variant={action.variant}
                className="w-full justify-start"
                onClick={() => handleAction(action.action)}
                disabled={isLoading}
              >
                <Icon className="h-4 w-4 mr-2" />
                {action.label}
              </Button>
            );
          })}
        </CardContent>
      </Card>

      {/* DOCUMENTOS */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Documentos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <input type="file" multiple onChange={handleUpload} />
          <p className="text-xs text-muted-foreground">
            Formatos permitidos: PDF, DOCX, JPG, PNG
          </p>

          {/* Lista de documentos */}
          <ul className="space-y-2 mt-3">
            {documents.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum documento enviado ainda.</p>
            ) : (
              documents.map((doc) => (
                <li key={doc.id} className="flex items-center justify-between border p-2 rounded-md">
                  <span className="text-sm">{doc.name}</span>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    asChild
                  >
                    <a href={doc.url} download>
                      <Download className="h-4 w-4 mr-1" /> Baixar
                    </a>
                  </Button>
                </li>
              ))
            )}
          </ul>
        </CardContent>
      </Card>

      {/* AÇÕES DO CONTRATO */}
      {availableActions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ações do Contrato</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="notes" className="text-sm font-medium">
                Observações (opcional)
              </label>
              <Textarea
                id="notes"
                placeholder="Adicione observações sobre a ação..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              {availableActions.map((action) => {
                const Icon = action.icon;
                return (
                  <div key={action.action}>
                    <Button
                      variant={action.variant}
                      className="w-full justify-start"
                      onClick={() => handleAction(action.action, { notes })}
                      disabled={isLoading}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {action.label}
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

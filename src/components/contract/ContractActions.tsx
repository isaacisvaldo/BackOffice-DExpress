import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Play, Pause, Square, CheckCircle, Download,
  Trash
} from "lucide-react";
import { deleteContractDoc, type ContractStatus, type Document } from "@/services/contract/contract.service";
import DocumentUploader from "./DocumentUploader";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from "@/components/ui/alert-dialog";
interface ContractActionsProps {
  docs: Document[];
  contractId: string;
  contractNumber: string;
  currentStatus: ContractStatus
  onStatusChange: (newStatus: string, actionData?: any) => Promise<void>;
}


const statusConfig: Record<
  ContractStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  DRAFT: { label: "Rascunho", variant: "outline" },
  PENDING_SIGNATURE: { label: "Pendente de Assinatura", variant: "default" },
  EXPIRED: { label: "Expirado", variant: "destructive" },
  ACTIVE: { label: "Ativo", variant: "default" },
  TERMINATED: { label: "Terminado", variant: "secondary" },
  CANCELED: { label: "Cancelado", variant: "destructive" },
  PAUSED: { label: "Pausado", variant: "outline" },
  COMPLETED: { label: "Concluído", variant: "secondary" },
};

export function ContractActions({
  docs,
  contractId,
  contractNumber,
  currentStatus,
  onStatusChange
}: ContractActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [notes, setNotes] = useState("");
  const [documents, setDocuments] = useState<Document[]>([]);

  const [isDeleting, setIsDeleting] = useState(false);


  useEffect(() => {
    setDocuments(docs);
  }, []);


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

  const handleDelete = async (docId: string) => {
    try {
      setIsDeleting(true);
     
     await  deleteContractDoc(docId);

      setDocuments((prev) => prev.filter((doc) => doc.id !== docId));
    } catch (error) {
      console.error("Erro ao deletar documento:", error);
    } finally {
      setIsDeleting(false);
     
    }
  };

  const getAvailableActions = () => {
    switch (currentStatus) {
      case "ACTIVE":
        return [
          {
            action: "suspend",
            label: "Suspender Contrato",
            icon: Pause,
            variant: "outline" as const,
          },
          {
            action: "complete",
            label: "Marcar como Concluído",
            icon: CheckCircle,
            variant: "default" as const,
          },
          {
            action: "cancel",
            label: "Cancelar Contrato",
            icon: Square,
            variant: "destructive" as const,
          },
        ];

      case "PAUSED":
        return [
          {
            action: "reactivate",
            label: "Reativar Contrato",
            icon: Play,
            variant: "default" as const,
          },
          {
            action: "cancel",
            label: "Cancelar Contrato",
            icon: Square,
            variant: "destructive" as const,
          },
        ];

      default:
        return [];
    }
  };


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
            <Badge variant={statusConfig[currentStatus].variant}>
              {statusConfig[currentStatus].label}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            ID do Contrato: {contractNumber}
          </p>
        </CardContent>
      </Card>




      {/* DOCUMENTOS */}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Documentos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <DocumentUploader
            contractId={contractId}
            onAdd={(newDoc) => setDocuments((prev) => [...prev, newDoc])}
          />

          <ul className="space-y-2 mt-3">
            {documents?.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhum documento enviado ainda.
              </p>
            ) : (
              documents?.map((doc) => (
                <li
                  key={doc.id}
                  className="flex items-center justify-between border p-2 rounded-md"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-semibold">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {doc.description}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <a href={doc.url} download>
                        <Download className="h-4 w-4 mr-1" /> Baixar
                      </a>
                    </Button>

                    {/* Botão de deletar com AlertDialog */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive">
                          <Trash className="h-4 w-4 mr-1" /> Deletar
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Isso excluirá permanentemente o documento{" "}
                            <span className="font-semibold">{doc.name}</span>.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-500 hover:bg-red-600 text-white"
                            onClick={() => handleDelete(doc.id)}
                             disabled={isDeleting}
                          >
                             {isDeleting ? "Excluindo..." : "Confirmar Exclusão"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
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

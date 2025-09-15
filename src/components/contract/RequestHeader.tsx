import { Calendar, Clock, User, Mail } from "lucide-react";
import { Card } from "@/components/ui/card";
import { StatusRequest } from "@/services/serviceRequest/service-request.service";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import EmailEditor from "../EmailEditor";

interface RequestHeaderProps {
  status: StatusRequest;
  clientEmail: string;
  clientName: string;
  requestDate: string;
 
}

const statusConfig: Record<
  StatusRequest,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  [StatusRequest.PENDING]: { label: "Pendente", variant: "default" },
  [StatusRequest.IN_REVIEW]: { label: "Em Análise", variant: "secondary" },
  [StatusRequest.PLAN_OFFERED]: { label: "Plano Oferecido", variant: "outline" },
  [StatusRequest.CONTRACT_GENERATED]: { label: "Contrato Gerado", variant: "outline" },
  [StatusRequest.COMPLETED]: { label: "Concluído", variant: "default" },
  [StatusRequest.REJECTED]: { label: "Rejeitado", variant: "destructive" },
  [StatusRequest.APPROVED]: { label: "Aprovado", variant: "default" },
};

export function RequestHeader({
  status,
  clientEmail,
  clientName,
  requestDate,
}: RequestHeaderProps) {
  const statusInfo = statusConfig[status];
  const [open, setOpen] = useState(false);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Detalhes do Pedido
          </h1>
        </div>
       
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <User className="h-4 w-4" />
          <span className="font-medium">Cliente:</span>
          <span>{clientName}</span>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span className="font-medium">Data:</span>
          <span>{requestDate}</span>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span className="font-medium">Status:</span>
          <span>{statusInfo.label}</span>
        </div>
      </div>

      {/* Ação de Enviar Nota */}
       {status !== StatusRequest.APPROVED && (
      <div className="mt-6 flex items-center justify-between p-3 border rounded-lg bg-muted/30">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-primary" />
          <span className="text-sm text-foreground">{clientEmail}</span>
        </div>
        <Button
          size="sm"
          className="flex items-center gap-2"
          onClick={() => setOpen(true)}
        >
          <Mail className="h-4 w-4" />
          Enviar Nota
        </Button>
      </div>
 )}

      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar Nota ao solicitante</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <EmailEditor
              recipient={clientEmail}
              subject="Contrato de prestação de serviços - Importante"
            />
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

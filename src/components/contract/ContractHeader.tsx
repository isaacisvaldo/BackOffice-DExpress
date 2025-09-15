import {  Calendar, User, FileText, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { ContractStatus } from "@/services/contract/contract.service";
import { formatDate } from "@/util";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import EmailEditor from "../EmailEditor";
interface ContractHeaderProps {
  contractId: string;
  status: ContractStatus;
  clientName: string;
  startDate: string;
  clientEmail:string;

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


export function ContractHeader({ 
  contractId, 
  status, 
  clientName, 
  startDate, 
  clientEmail,


}: ContractHeaderProps) {
  const statusInfo = statusConfig[status];
   const [open, setOpen] = useState(false);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
         
          <div>
            <h1 className="text-2xl font-bold text-foreground" >
              {contractId}
            </h1>
          
          </div>
        </div>
        <Badge variant={statusInfo.variant} className="text-sm px-3 py-1">
          {statusInfo.label}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <User className="h-4 w-4" />
          <span className="font-medium">Cliente:</span>
          <span>{clientName}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span className="font-medium">Início:</span>
          <span>{formatDate(startDate)}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <FileText className="h-4 w-4" />
          <span className="font-medium">Status:</span>
          <span>{statusInfo.label}</span>
        </div>
      </div>
     {/* Ação de Enviar Nota */}
       {status === "ACTIVE"  && (
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
  subject={`Nota ao cliente - Contrato de prestação de serviços - ${contractId}`}
/>

          </div>
        </DialogContent>
      </Dialog>
    </Card>
    
  );
}
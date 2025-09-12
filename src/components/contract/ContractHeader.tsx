import { ArrowLeft, Calendar, Clock, User, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface ContractHeaderProps {
  contractId: string;
  status: "active" | "completed" | "cancelled" | "suspended";
  clientName: string;
  startDate: string;
  serviceType: string;
  onBack: () => void;
}

const statusConfig = {
  active: { label: "Ativo", variant: "default" as const },
  completed: { label: "Concluído", variant: "secondary" as const },
  cancelled: { label: "Cancelado", variant: "destructive" as const },
  suspended: { label: "Suspenso", variant: "outline" as const },
};

export function ContractHeader({ 
  contractId, 
  status, 
  clientName, 
  startDate, 
  serviceType, 
  onBack 
}: ContractHeaderProps) {
  const statusInfo = statusConfig[status];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
         
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Contrato #{contractId}
            </h1>
            <p className="text-muted-foreground">{serviceType}</p>
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
          <span>{startDate}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <FileText className="h-4 w-4" />
          <span className="font-medium">Status:</span>
          <span>{statusInfo.label}</span>
        </div>
      </div>
    </Card>
  );
}
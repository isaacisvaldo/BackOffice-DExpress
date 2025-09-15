import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Check, X, Clock, MessageSquare } from "lucide-react";

import { createContractInRequest, StatusRequest, UserType } from "@/services/serviceRequest/service-request.service";

import ContractForm from "./ContractForm";
import { useContractFormData } from "./useContractFormData";
import type { MappedServiceRequest } from "@/pages/dashboard/contract/ServiceRequestDetails";

interface RequestActionsProps {
  requestService: MappedServiceRequest;
  TheProfissional?:any
  requestId:string
  requestClientType: UserType;
  currentStatus: any;
  onStatusChange: (requestId:string,status: StatusRequest) => void;
}

export function RequestActions({requestService, TheProfissional,requestId,requestClientType, currentStatus, onStatusChange }: RequestActionsProps) {
  const [selectedAction, setSelectedAction] = useState<StatusRequest | "">("");

  const [isSubmitting, setIsSubmitting] = useState(false);
   const [newContract, setNewContract] = useState<any>(() => ({
      firstName: requestClientType === UserType.INDIVIDUAL 
    ? requestService.name?.split(" ")[0] ?? "" 
    : "" ,

  lastName: requestClientType === UserType.INDIVIDUAL 
    ? requestService.name?.split(" ").slice(1).join(" ") ?? "" 
    : "",
  companyName: requestService.name ?? "",
  nif: requestService.nif ?? "",
  phone: requestService.phone ?? "",
  email: requestService.requesterEmail ?? "",
 title: `Contrata-Serviço - ${
  requestClientType === UserType.INDIVIDUAL ? "Individual" : "Empresa"
}`,
  description: requestService.description ?? "",
  clientType: requestClientType,
  professionalId: TheProfissional?.id || requestService.professional?.id || null,
  sectorId: requestService.companySector?.id ?? "",
  packageId: requestService.package?.id ?? "",
  agreedValue: requestService.package?.price ?? 0,
  finalValue: requestService.package?.price ?? 0,
  location: { cityId: "", districtId: "", street: requestService.address ?? "" },
  discountPercentage: 0,
  paymentTerms: "",
  startDate: "",
  endDate: "",
  notes: "",
}));


  const {
    
sectors,
    packages,
    professionals,
    desiredPositions,
    cities,
    districts,
  } = useContractFormData(newContract?.location?.cityId);
const handleActionSubmit = async () => {
  if (!selectedAction) return;
  setIsSubmitting(true);

  try {
    if (selectedAction === StatusRequest.APPROVED) {

   
      
      // Cria contrato
      const createdContract = await createContractInRequest(requestId, newContract);
      if (createdContract) {
        // Atualiza status no pai, passando o id do contrato
        await onStatusChange(requestId,selectedAction);
      }
    } else {
      // Apenas altera status
      await onStatusChange(requestId,selectedAction);
    }

    setSelectedAction("");
    setNewContract({});
  } catch (error) {
    console.error(error);
  } finally {
    setIsSubmitting(false);
  }
};



  const getStatusBadge = (status: StatusRequest) => {
    const config: Record<StatusRequest, { label: string; variant: "default" | "secondary" | "destructive"; icon: any }> = {
      [StatusRequest.PENDING]: { label: "Pendente", variant: "default", icon: Clock },
      [StatusRequest.APPROVED]: { label: "Aprovado", variant: "default", icon: Check },
      [StatusRequest.REJECTED]: { label: "Rejeitado", variant: "destructive", icon: X },
      [StatusRequest.IN_REVIEW]: { label: "Em Análise", variant: "secondary", icon: MessageSquare },
      [StatusRequest.PLAN_OFFERED]: { label: "Plano Oferecido", variant: "default", icon: MessageSquare },
      [StatusRequest.CONTRACT_GENERATED]: { label: "Contrato Gerado", variant: "default", icon: MessageSquare },
      [StatusRequest.COMPLETED]: { label: "Concluído", variant: "default", icon: Check },
    };

    const statusInfo = config[status];
    const Icon = statusInfo.icon;

    return (
      <Badge variant={statusInfo.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {statusInfo.label}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          Ações da Solicitação
          {getStatusBadge(currentStatus)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
      {currentStatus !== StatusRequest.APPROVED && (
  <div className="space-y-2">
    <Label htmlFor="action">Ação a Tomar</Label>
    <Select
      value={selectedAction}
      onValueChange={(v) => setSelectedAction(v as StatusRequest)}
      disabled={currentStatus === StatusRequest.APPROVED } 
    >
      <SelectTrigger>
        <SelectValue placeholder="Selecione uma ação" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={StatusRequest.APPROVED}>Aprovar Solicitação</SelectItem>
        <SelectItem value={StatusRequest.REJECTED}>Rejeitar Solicitação</SelectItem>
        <SelectItem value={StatusRequest.IN_REVIEW}>Colocar em Análise</SelectItem>
      </SelectContent>
    </Select>
  </div>
)}


        {selectedAction === StatusRequest.APPROVED && (
           <ContractForm
           requestService={requestService}
           TheProfissional={TheProfissional}
     clientType={requestClientType}
     initialData={newContract}
       sectorOptions={sectors}
     professionals={professionals}
     desiredPositions={desiredPositions}
     packages={packages}
     cities={cities}
    districts={districts}
    onChange={setNewContract}
  />
        )}

      

        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleActionSubmit}
            disabled={!selectedAction || isSubmitting}
            className="flex-1"
            variant={selectedAction === StatusRequest.REJECTED ? "destructive" : "default"}
          >
            {isSubmitting ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                {selectedAction === StatusRequest.APPROVED && <Check className="h-4 w-4 mr-2" />}
                {selectedAction === StatusRequest.REJECTED && <X className="h-4 w-4 mr-2" />}
                {selectedAction === StatusRequest.IN_REVIEW && <MessageSquare className="h-4 w-4 mr-2" />}
                {selectedAction === StatusRequest.APPROVED && "Aprovar"}
                {selectedAction === StatusRequest.REJECTED && "Rejeitar"}
                {selectedAction === StatusRequest.IN_REVIEW && "Analisar"}
                {!selectedAction && "Selecione uma ação"}
              </>
            )}
          </Button>
          
          {selectedAction && (
            <Button
              variant="outline"
              onClick={() => {
                setSelectedAction("");
               
              }}
            >
              Cancelar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

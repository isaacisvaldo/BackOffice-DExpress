import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MapPin,
  Phone,
  Mail,
  User,
  Calendar,
  DollarSign,
  FileText,
 
} from "lucide-react";
import type { MappedContract } from "@/pages/dashboard/contract/ContractView";
import { UserType } from "@/services/serviceRequest/service-request.service";
import { formatDate } from "@/util";

interface ContractDetailsProps {
  contract: MappedContract;
}

export function ContractDetails({ contract }: ContractDetailsProps) {

  console.log("LOGOLOGLO:",contract);
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Informações do Cliente */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informações do Cliente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent rounded-lg">
              <User className="h-4 w-4 text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">Nome</p>
              <p className="text-sm text-muted-foreground">{contract.client.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent rounded-lg">
              <Mail className="h-4 w-4 text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{contract.client.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent rounded-lg">
              <Phone className="h-4 w-4 text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">Telefone</p>
              <p className="text-sm text-muted-foreground">{contract.client.phoneNumber}</p>
            </div>
          </div>

          {contract.client.address && (
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent rounded-lg">
                <MapPin className="h-4 w-4 text-accent-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">Endereço</p>
                <p className="text-sm text-muted-foreground">{contract.client.address}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detalhes do Contrato */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Detalhes do Contrato</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent rounded-lg">
              <FileText className="h-4 w-4 text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">Serviço Contratado</p>
              <p className="text-sm text-muted-foreground">{contract.desiredPosition}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent rounded-lg">
              <DollarSign className="h-4 w-4 text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">Valor Final</p>
              <p className="text-sm text-muted-foreground">{contract.finalValue} Kz</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Período do Contrato</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{  formatDate(contract.startDate)}</span>
              {contract.endDate && (
                <>
                  <span>até</span>
                  <span>{  formatDate(contract.endDate)}</span>
                </>
              )}
            </div>
          </div>

        </CardContent>
      </Card>

    
       {/* Profissional ou Plano */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {contract.client.type === UserType.CORPORATE
              ? "Plano Escolhido"
              : "Profissional Selecionado"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {contract.client.type === UserType.CORPORATE ? (
            <div className="space-y-2">
              <p className="text-sm font-medium">Plano</p>
              <p className="text-sm text-muted-foreground">
                {contract?.package?.name ? contract?.package?.name : "N/A"}
                
              </p>
              <p className="text-sm text-muted-foreground">{contract?.package?.description ?  contract?.package.description :"N/A" }</p>

                 {/* Renderizar os detalhes */}
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
  {(contract?.package?.details ?? []).map((detail: string, index: number) => (
  <li key={index}>{detail}</li>
))}
      </ul>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm font-medium">Profissional Responsável</p>
              {contract.professional ? (
                <div className="flex items-center gap-4 p-3 border rounded-lg shadow-sm">
                  {/* Foto */}
                  {contract.professional.profileImage ? (
                    <img
                      src={contract.professional.profileImage}
                      alt={contract.professional.fullName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                      Sem foto
                    </div>
                  )}

                  {/* Dados */}
                  <div className="space-y-1">
                    <p className="text-sm font-semibold">{contract.professional.fullName}</p>
                    <p className="text-xs text-muted-foreground">{contract.professional.email}</p>
                    <p className="text-xs text-muted-foreground">{contract.professional.phoneNumber}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Nenhum profissional associado
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Termos de Pagamentos</CardTitle>
        </CardHeader>
        <CardContent>
          
          {contract.paymentTerms && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Termos</p>
              <p className="text-sm text-muted-foreground">{contract.paymentTerms}</p>
              <p className="text-sm text-muted-foreground">  Acordado: {contract.agreedValue} Kz | Final: {contract.finalValue} Kz</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

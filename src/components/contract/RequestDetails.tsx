import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail, Calendar } from "lucide-react";
import { StatusRequest, ServiceFrequency, UserType } from "@/services/serviceRequest/service-request.service";
import type { Professional } from "@/services/profissional/profissional.service";
import type { Package } from "@/services";

export interface RequestDetailsProps {
  request: {
    id: string;
    requesterEmail: string;
    requesterType: UserType;
    name: string;
    nif: string;
    status: StatusRequest;
    description: string;
    serviceFrequency: ServiceFrequency;
    createdAt: string;
    phone?: string;
    address?: string;
    professional:Professional;
    package:Package
  };
}

export function RequestDetails({ request }: RequestDetailsProps) {

  
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
              <Mail className="h-4 w-4 text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{request.requesterEmail}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent rounded-lg">
              <Phone className="h-4 w-4 text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">Telefone</p>
              <p className="text-sm text-muted-foreground">{request.phone || "N/A"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent rounded-lg">
              <MapPin className="h-4 w-4 text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">Endereço</p>
              <p className="text-sm text-muted-foreground">{request.address || "N/A"}</p>
            </div>
          </div>
            <div className="flex items-center gap-3">
            <div className="p-2 bg-accent rounded-lg">
              <MapPin className="h-4 w-4 text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">Nif</p>
              <p className="text-sm text-muted-foreground">{request.nif || "N/A"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detalhes do Serviço */}
    <Card>
  <CardHeader>
    <CardTitle className="text-lg">Detalhes do Serviço</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    {/* Frequência */}
    <div className="flex items-center gap-3">
      <div className="p-2 bg-accent rounded-lg">
        <Calendar className="h-4 w-4 text-accent-foreground" />
      </div>
      <div>
        <p className="text-sm font-medium">Frequência</p>
        <p className="text-sm text-muted-foreground">
          {request.serviceFrequency}
        </p>
      </div>
    </div>

    {/* Data da Solicitação */}
    <div className="space-y-2">
      <p className="text-sm font-medium">Data da Solicitação</p>
      <p className="text-sm text-muted-foreground">{request.createdAt}</p>
    </div>

  

    {/* Condicional Empresa vs Individual */}
 {/* Condicional Empresa vs Individual */}
{request.requesterType === UserType.CORPORATE ? (
  <div className="space-y-2">
    <p className="text-sm font-medium">Plano Escolhido</p>
    <p className="text-sm text-muted-foreground">
      {request.package ? request.package.name : "Nenhum plano associado"}
    </p>
  </div>
) : (
  <div className="space-y-4">
    <p className="text-sm font-medium">Funcionário Selecionado</p>
    {request.professional ? (
      <div className="flex items-center gap-4 p-3 border rounded-lg shadow-sm">
        {/* Foto do profissional */}
        <img
          src={request.professional.profileImage}
          alt={request.professional.fullName}
          className="w-12 h-12 rounded-full object-cover"
        />

        {/* Informações */}
        <div className="space-y-1">
          <p className="text-sm font-semibold">{request.professional.fullName}</p>
          <p className="text-xs text-muted-foreground">{request.professional.email}</p>
          <p className="text-xs text-muted-foreground">{request.professional.phoneNumber}</p>
        </div>
      </div>
    ) : (
      <p className="text-sm text-muted-foreground">Nenhum funcionário associado</p>
    )}
  </div>
)}

  </CardContent>
</Card>


      {/* Descrição do Serviço */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Descrição do Serviço</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{request.description}</p>
        </CardContent>
      </Card>
    </div>
  );
}

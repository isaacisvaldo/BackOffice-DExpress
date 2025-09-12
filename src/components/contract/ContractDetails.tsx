import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, Home, Calendar, DollarSign, Clock, FileText } from "lucide-react";

interface ContractDetailsProps {
  contract: {
    id: string;
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    address: string;
    serviceType: string;
    serviceDetails: string;
    startDate: string;
    endDate?: string;
    monthlyValue: number;
    rooms: number;
    frequency: "weekly" | "biweekly" | "monthly";
    nextServiceDate: string;
    totalServices: number;
    completedServices: number;
    terms?: string;
  };
}

const frequencyConfig = {
  weekly: "Semanal",
  biweekly: "Quinzenal", 
  monthly: "Mensal",
};

export function ContractDetails({ contract }: ContractDetailsProps) {
  const completionPercentage = Math.round((contract.completedServices / contract.totalServices) * 100);

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
              <p className="text-sm text-muted-foreground">{contract.clientEmail}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent rounded-lg">
              <Phone className="h-4 w-4 text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">Telefone</p>
              <p className="text-sm text-muted-foreground">{contract.clientPhone}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent rounded-lg">
              <MapPin className="h-4 w-4 text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">Endereço</p>
              <p className="text-sm text-muted-foreground">{contract.address}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detalhes do Contrato */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Detalhes do Contrato</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent rounded-lg">
                <Home className="h-4 w-4 text-accent-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">Cômodos</p>
                <p className="text-sm text-muted-foreground">{contract.rooms}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent rounded-lg">
                <Clock className="h-4 w-4 text-accent-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">Frequência</p>
                <p className="text-sm text-muted-foreground">{frequencyConfig[contract.frequency]}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent rounded-lg">
              <DollarSign className="h-4 w-4 text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">Valor Mensal</p>
              <p className="text-sm text-muted-foreground">€{contract.monthlyValue}</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Período do Contrato</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{contract.startDate}</span>
              {contract.endDate && (
                <>
                  <span>até</span>
                  <span>{contract.endDate}</span>
                </>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Próximo Serviço</p>
            <p className="text-sm text-muted-foreground">{contract.nextServiceDate}</p>
          </div>
        </CardContent>
      </Card>

      {/* Progresso do Contrato */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Progresso do Contrato</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Serviços Realizados</span>
            <Badge variant="secondary">{completionPercentage}%</Badge>
          </div>
          
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300" 
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{contract.completedServices} de {contract.totalServices} serviços</span>
            <span>{contract.totalServices - contract.completedServices} restantes</span>
          </div>
        </CardContent>
      </Card>

      {/* Descrição do Serviço */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Descrição do Serviço</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">{contract.serviceDetails}</p>
          
          {contract.terms && (
            <div className="border-t pt-4">
              <p className="text-sm font-medium mb-2">Termos e Condições</p>
              <p className="text-sm text-muted-foreground">{contract.terms}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
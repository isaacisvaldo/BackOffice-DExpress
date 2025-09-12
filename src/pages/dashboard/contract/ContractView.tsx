import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";


import { ContractActions } from "@/components/contract/ContractActions";
import { ContractDetails } from "@/components/contract/ContractDetails";
import { ContractHeader } from "@/components/contract/ContractHeader";

// Mock data - in a real app, this would come from an API
const mockContract = {
  id: "CONT-2024-001",
  clientName: "Maria Silva",
  clientEmail: "maria.silva@email.com",
  clientPhone: "+351 912 345 678",
  address: "Rua das Flores, 123, 4º Andar, 1200-123 Lisboa",
  serviceType: "Limpeza Residencial Mensal",
  serviceDetails: "Limpeza completa de apartamento T3 incluindo todas as divisões: sala, cozinha, 2 quartos, 2 casas de banho e hall de entrada. Limpeza profunda de janelas, aspiração e limpeza de chão, limpeza de superfícies e mobiliário. Organização geral dos espaços.",
  startDate: "01/01/2024",
  endDate: "31/12/2024",
  monthlyValue: 150,
  rooms: 5,
  frequency: "monthly" as const,
  nextServiceDate: "15/01/2025 às 10:00",
  totalServices: 12,
  completedServices: 8,
  terms: "Contrato de prestação de serviços de limpeza com duração de 12 meses. Cliente fornece produtos de limpeza. Acesso via chaves na portaria. Animais de estimação presentes no local."
};

export default function ContractView() {
  const { id } = useParams();
  const navigate = useNavigate();
  //const { toast } = useToast();
  const [status, setStatus] = useState<"active" | "completed" | "cancelled" | "suspended">("active");

  useEffect(() => {
    // In a real app, fetch contract data based on ID
    document.title = `DExpress - Contrato ${id}`;
  }, [id]);

  const handleStatusChange = async (newStatus: string, actionData?: any) => {
    try {
      // In a real app, this would make an API call
      console.log('Status change:', { newStatus, actionData, contractId: id });
      
      // Map actions to status changes
      const statusMap: Record<string, typeof status> = {
        suspend: "suspended",
        reactivate: "active", 
        complete: "completed",
        cancel: "cancelled"
      };

      if (statusMap[newStatus]) {
        setStatus(statusMap[newStatus]);
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const handleBack = () => {
    navigate("/contratos");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="space-y-6">
          <ContractHeader
            contractId={mockContract.id}
            status={status}
            clientName={mockContract.clientName}
            startDate={mockContract.startDate}
            serviceType={mockContract.serviceType}
            onBack={handleBack}
          />

          <div className="grid grid-cols-1 gap-6">
        
              <ContractDetails contract={mockContract} />
          
            
            <div className="xl:col-span-1">
              <ContractActions
                contractId={mockContract.id}
                currentStatus={status}
                onStatusChange={handleStatusChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
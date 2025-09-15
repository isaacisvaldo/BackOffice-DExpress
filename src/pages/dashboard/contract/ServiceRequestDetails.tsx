import { RequestActions } from "@/components/contract/RequestActions";
import { RequestDetails } from "@/components/contract/RequestDetails";
import { RequestHeader } from "@/components/contract/RequestHeader";
import SwirlingEffectSpinner from "@/components/customized/spinner/spinner-06";
import type { Professional } from "@/services/profissional/profissional.service";

import  type { Package } from "@/services/client/company/package/package.service";

import { getServiceRequestById, ServiceFrequency, StatusRequest, updateStatusServiceRequest, UserType, type ServiceRequest } from "@/services/serviceRequest/service-request.service";
import { formatDate } from "@/util/formatDate";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom"
import type { Sector } from "@/services/sector/sector.service";
import type { Location } from "@/types/types";


export type MappedServiceRequest = {
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
  companySector:Sector
  location:Location
 };


export default function ServiceRequestDetails() {
  const { id } = useParams<{ id: string }>()
  const [serviceRequest, setServiceRequest] = useState<MappedServiceRequest | null>(null)
const [status, setStatus]= useState<StatusRequest | "PENDING">("PENDING");



  useEffect(() => {
    if (!id) return
    const fetchData = async () => {
      try {
        const data: ServiceRequest = await getServiceRequestById(id);
       
     
      const mappedData: MappedServiceRequest = {
          id: data.id,
          requesterEmail: data.requesterEmail,
          requesterType: data.requesterType ,
          name: data.requesterType === UserType.INDIVIDUAL 
            ? data.individualRequesterName || "" 
            : data.companyRequesterName || "",
          nif: data.requesterType === UserType.INDIVIDUAL 
            ? data.individualIdentityNumber || "" 
            : data.companyNif || "",
          status: data.status,
          description: data.description || "",
          serviceFrequency: data.serviceFrequency,
          createdAt: formatDate(data.createdAt),
          phone: data.requesterPhoneNumber || "",
          address: data.individualAddress || data.companyAddress || "",
          professional:data.professional,
          package:data.package,
          companySector:data.companySector,
          location:data.location
        };
        setServiceRequest(mappedData);
        setStatus(mappedData.status)

      } catch (error) {
        toast.error("Erro ao carregar dados da candidatura");
        console.error(error);
      }
    };

    fetchData();
  }, [id]);



const handleStatusChange = async (requestId:string,newStatus: StatusRequest) => {
  try {
    // Atualiza a UI imediatamente
 
    setServiceRequest(prev => prev ? { ...prev, status: newStatus } : prev);
    await updateStatusServiceRequest(requestId, newStatus);
      setStatus(newStatus);
  } catch (error) {
    toast.error("Erro ao atualizar status");
    console.error(error);
  }
};



  if (!serviceRequest) return <div className="flex justify-center items-center py-10">
    <SwirlingEffectSpinner></SwirlingEffectSpinner>
  </div>

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="space-y-6">
          <RequestHeader
          
            status={status}
            clientEmail={serviceRequest?.requesterEmail}
            clientName={serviceRequest?.name}
            requestDate={serviceRequest.createdAt}
          

          />

          <div className="grid grid-cols-1 gap-6">
            {/* Detalhes */}
            <RequestDetails request={serviceRequest} />

          

            {/* Ações */}
            <RequestActions
            requestService={serviceRequest}
            TheProfissional={serviceRequest.professional}
               requestId={serviceRequest.id}
              requestClientType={serviceRequest.requesterType}
              currentStatus={status}
              onStatusChange={handleStatusChange}
            />
          </div>

        </div>
      </div>
    </div>
  );


}



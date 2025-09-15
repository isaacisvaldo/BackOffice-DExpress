import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";


import { ContractActions } from "@/components/contract/ContractActions";
import { ContractDetails } from "@/components/contract/ContractDetails";
import { ContractHeader } from "@/components/contract/ContractHeader";
import { ContractStatus, getContractById, updateStatusContract, type Contract, type ContractDoc, type Document } from "@/services/contract/contract.service";
import type { UserType } from "@/services/serviceRequest/service-request.service";
import SwirlingEffectSpinner from "@/components/customized/spinner/spinner-06";
import type { Package } from "@/services";





export type MappedContract = {
  id: string;
  contractNumber: string;
  title: string;
  client: {
    id: string;
    type: UserType
    name: string;
    email: string;
    phoneNumber: string;
    identityNumber?: string | null;
    address?: string | null;
  };
  professional: {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    profileImage?: string | null;
  };
  desiredPosition: string;
  location: string;
  agreedValue: number;
  finalValue: number;
  paymentTerms: string;
  startDate: string;
  endDate: string;
  status: ContractStatus;
  package: Package
   contractDoc:ContractDoc[]

};

export function mapContract(data: Contract): MappedContract {
  const client =
    data.clientType === "INDIVIDUAL" && data.individualClient
      ? {
        id: data.individualClient.id,
        type: "INDIVIDUAL" as const,
        name: data.individualClient.fullName,
        email: data.individualClient.email,
        phoneNumber: data.individualClient.phoneNumber,
        identityNumber: data.individualClient.identityNumber,
        address: data.individualClient.address,
      }
      : data.companyClient
        ? {
          id: data.companyClient.id,
          type: "CORPORATE" as const,
          name: data.companyClient.companyName,
          email: data.companyClient.email,
          phoneNumber: data.companyClient.phoneNumber,
          identityNumber: data.companyClient.nif,
          address: data.companyClient.address,
        }
        : {
          id: "",
          type: "INDIVIDUAL" as const,
          name: "N/A",
          email: "N/A",
          phoneNumber: "N/A",
        };

  return {
    id: data.id,
    contractNumber: data.contractNumber,
    title: data.title,
    client,
    professional: {
      id: data.professional?.id,
      fullName: data.professional?.fullName,
      email: data.professional?.email,
      phoneNumber: data.professional?.phoneNumber,
      profileImage: data.professional?.profileImage,
    },
    desiredPosition: data.desiredPosition?.label ?? "",
    location: data.location.city.name + ", " + data.location.district.name || "",
    agreedValue: data.agreedValue,
    finalValue: data.finalValue,
    paymentTerms: data.paymentTerms,
    startDate: data.startDate,
    endDate: data.endDate,
    status: data.status as ContractStatus,
    package: data.package,
    contractDoc: data.contractDoc
  };
}



export default function ContractView() {
  const { id } = useParams();
  const [contract, setContract] = useState<MappedContract | null>(null)
  const [status, setStatus] = useState<ContractStatus | "DRAFT">("DRAFT");
  const [documents, setDocuments]=useState<Document[]>([])

  ContractStatus
  useEffect(() => {
    if (!id) return
    const fetchData = async () => {
      const apiResponse: Contract = await getContractById(id);
      const mapped = mapContract(apiResponse);
  const aux: Document[] = apiResponse.contractDoc.map(cd => cd.document);
  setDocuments(aux)
      setContract(mapped);
      setStatus(mapped.status)

    }
    fetchData();
  }, [id]);

  const handleStatusChange = async (action: string, actionData?: any) => {
    try {
      console.log("Status change:", { action, actionData });

      // Ações que mudam o status
      const statusMap: Record<string, ContractStatus> = {
        suspend: "PAUSED",
        reactivate: "ACTIVE",
        complete: "COMPLETED",
        cancel: "CANCELED",
      };

      if (statusMap[action]) {
        if (!id) return
        await updateStatusContract(id, statusMap[action]);
        setStatus(statusMap[action]);


      }



      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  };


  if (!contract) return <div className="flex justify-center items-center py-10">
    <SwirlingEffectSpinner></SwirlingEffectSpinner>
  </div>
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="space-y-6">
          <ContractHeader
            contractId={contract.contractNumber}
            status={status}
            clientName={contract.client.name}
            startDate={contract.startDate}
            clientEmail={contract.client.email}

          />

          <div className="grid grid-cols-1 gap-6">
            <ContractDetails contract={contract} />


            <div className="xl:col-span-1">
              <ContractActions
               docs={documents}
                contractId={contract.id}
                contractNumber={contract.contractNumber}
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
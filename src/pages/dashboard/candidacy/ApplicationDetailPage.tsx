import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import toast from "react-hot-toast"

import ApplicationHeader from "@/components/candidacy/ApplicationHeader"
import { ApplicationDetailTabs } from "@/components/candidacy/ApplicationDetailTabs"
import type { Application } from "@/components/candidacy/columns"
import { checkCandidateHasProfile, getApplicationById, updateApplicationStatus } from "@/services/candidacy/candidacyService"

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [application, setApplication] = useState<Application | null>(null)
const [hasProfile, setHasProfile] = useState<boolean>(false)
const [status, setStatus] = useState("PENDING") 

useEffect(() => {
  if (!id) return;

  const fetchData = async () => {
    try {
      const data = await getApplicationById(id);
      setApplication(data);

      const exists = await checkCandidateHasProfile(id)
   
      setHasProfile(exists)
    } catch (error) {
      toast.error("Erro ao carregar dados da candidatura");
      console.error(error);
    }
  };

  fetchData();
}, [id]);
useEffect(() => {
  if (application?.status) {
    setStatus(application.status)
  }
}, [application])


const handleStatusChange = async (newStatus: string) => {
  if (!id || !application) return;

  try {
    const updatedApp = await updateApplicationStatus(id, newStatus)
    setApplication(updatedApp)
    setStatus(updatedApp.status)
    toast.success("Status atualizado com sucesso")
  } catch (error) {
    console.error("Erro ao atualizar status:", error)
    toast.error("Falha ao atualizar o status da candidatura")
  }
}

  if (!application) return <div className="p-6">Carregando detalhes...</div>

  return (
    <div className="p-6 space-y-6">
      <ApplicationHeader
        application={application}
        status={status}
        onStatusChange={handleStatusChange}
      />

      <ApplicationDetailTabs
        application={application}
        status={status}
        onStatusChange={handleStatusChange}
        hasProfile={hasProfile}
      />
    </div>
  )
}

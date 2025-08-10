
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import toast from "react-hot-toast"
import ApplicationHeader from "@/components/application/ApplicationHeader"
import { ApplicationDetailTabs } from "@/components/application/ApplicationDetailTabs"
import { checkCandidateHasProfile, getApplicationById, updateApplicationStatus } from "@/services/application/application.service"
import type { JobApplication } from "@/types/types"
import ImageUploadStage from "@/components/ImageUploadStage"
import type { Professional } from "@/services/profissional/profissional.service"


export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [application, setApplication] = useState<JobApplication | null>(null)
  const [hasProfile, setHasProfile] = useState<Professional| null>(null)
  const [status, setStatus] = useState("PENDING") 
  // Novo estado para controlar o estágio de upload de imagem
  const [showImageUpload, setShowImageUpload] = useState<boolean>(false);
  const [professionalIdForUpload, setProfessionalIdForUpload] = useState<string | null>(null);


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

  // Função para abrir o estágio de upload de imagem
  const handleOpenImageUpload = (profId: string) => {
    setProfessionalIdForUpload(profId);
    setShowImageUpload(true);
  };

  // Função para fechar o estágio de upload
  const handleCloseImageUpload = () => {
    setShowImageUpload(false);
    setProfessionalIdForUpload(null);
    // Opcional: Recarregar a aplicação para refletir o upload da imagem, se necessário
    // fetchData(); 
  };


  if (!application) return <div className="p-6">Carregando detalhes...</div>

  return (
    <div className="p-6 space-y-6">
      <ApplicationHeader
        application={application}
        status={status}
        onStatusChange={handleStatusChange}
      />

      {/* Renderização condicional para o estágio de upload da imagem */}
      {showImageUpload && professionalIdForUpload ? (
        <ImageUploadStage 
          professionalId={professionalIdForUpload} 
          onClose={handleCloseImageUpload} 
        />
      ) : (
        <ApplicationDetailTabs
          application={application}
          status={status}
          onStatusChange={handleStatusChange}
          hasProfile={hasProfile}
          
          onProfessionalCreated={handleOpenImageUpload} 
        />
      )}
    </div>
  )
}
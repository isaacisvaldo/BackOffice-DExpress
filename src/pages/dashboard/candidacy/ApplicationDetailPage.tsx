import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import ApplicationHeader from "@/components/candidacy/ApplicationHeader"

import toast from "react-hot-toast"
import {ApplicationDetailTabs} from "@/components/candidacy/ApplicationDetailTabs"

// Mock de candidatura
const mockApplication: any = {
  id: "1",
  fullName: "Joana Silva",
  email: "joana@example.com",
  phoneNumber: "+244923456789",
  location: {
    city: { name: "Luanda" },
    district: { name: "Talatona" },
  },
  desiredPosition: "Desenvolvedora Frontend",
  status: "PENDING",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

export default function ApplicationDetailPage() {
  
  const { id } = useParams()
  const [application, setApplication] = useState<any | null>(null)
  const [status, setStatus] = useState("")

  useEffect(() => {
    if (!id) return
    setApplication(mockApplication)
    setStatus(mockApplication.status)
  }, [id])

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus)
    setApplication((prev:any) => prev ? { ...prev, status: newStatus } : prev)
    toast.success("Status alterado localmente")
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
/>
    </div>
  )
}

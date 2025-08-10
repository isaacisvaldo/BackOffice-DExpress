import {
  Calendar,
  CheckCircle,
  Mail,
  MapPin,
  Camera,
} from "lucide-react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"


interface ApplicationHeaderProps {
  application: any
  status: string
  onStatusChange: (status: string) => void
}

const statusLabels: Record<string, string> = {
  PENDING: "Pendente",
  IN_REVIEW: "Em Análise",
  INTERVIEW: "Entrevista",
  ACCEPTED: "Aprovado",
  REJECTED: "Rejeitado",
}

export default function ApplicationHeader({
  application,
  status,
}: ApplicationHeaderProps) {
  const initials = application?.fullName
    ? application.fullName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "??"

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
          <div className="relative">
            <Avatar className="h-24 w-24 text-3xl">
              <AvatarImage src={application.avatar || ""} alt="Avatar" />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              variant="outline"
              className="absolute -right-2 -bottom-2 h-8 w-8 rounded-full"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <h1 className="text-2xl font-bold">{application.fullName}</h1>
              <Badge
                variant="secondary"
                className="flex items-center gap-1 border border-blue-500 bg-blue-50 text-blue-600"
              >
                <CheckCircle className="h-4 w-4 text-blue-500" />
                {statusLabels[status] || status}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              
              {application.desiredPosition?.label || "N/A"}
            </p>

            <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Mail className="size-4" />
                {application.email}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="size-4" />
                {application.location?.city?.name} -{" "}
                {application.location?.district?.name}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="size-4" />
                Aplicado em{" "}
                {new Date(application.createdAt).toLocaleDateString("pt-PT")}
              </div>
            </div>
          </div>
        </div>

       
      </CardContent>
    </Card>
  )
}

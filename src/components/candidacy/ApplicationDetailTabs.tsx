
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { User2 } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import EmailEditor from "../EmailEditor"


interface ApplicationDetailTabsProps {
    application: any
    status: string // VEM DA API
    onStatusChange: (status: string) => void
}

const statusOptions = [
    { label: "Pendente", value: "PENDING" },
    { label: "Em Análise", value: "IN_REVIEW" },
    { label: "Entrevista", value: "INTERVIEW" },
    { label: "Aprovado", value: "ACCEPTED" },
    { label: "Rejeitado", value: "REJECTED" },
]

export function ApplicationDetailTabs({
    application,
    status,
    onStatusChange,
}: ApplicationDetailTabsProps) {
   
 
    application.hasProfile = true // Mock para simular se o perfil já existe



    return (
        <Tabs defaultValue="info" className="w-full space-y-6">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="info">Informações</TabsTrigger>
                <TabsTrigger value="notes">Notas</TabsTrigger>
                <TabsTrigger value="profile" disabled={status !== "ACCEPTED"}>
                    Perfil do Colaborador
                </TabsTrigger>
            </TabsList>

            {/* Informações */}
            <TabsContent value="info">
                <Card>
                    <CardHeader>
                        <CardTitle>Informações da Candidatura</CardTitle>
                        <CardDescription>Dados fornecidos pelo candidato.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <Label>Nome Completo</Label>
                                <Input value={application.fullName} disabled />
                            </div>
                            <div>
                                <Label>Email</Label>
                                <Input value={application.email} disabled />
                            </div>
                            <div>
                                <Label>Telefone</Label>
                                <Input value={application.phoneNumber || "-"} disabled />
                            </div>
                            <div>
                                <Label>Localização</Label>
                                <Input
                                    value={`${application.location?.city?.name || ""} - ${application.location?.district?.name || ""}`}
                                    disabled
                                />
                            </div>
                            <div>
                                <Label>Data de Aplicação</Label>
                                <Input
                                    value={new Date(application.createdAt).toLocaleDateString("pt-PT")}
                                    disabled
                                />
                            </div>
                            <div>
                                <Label>Status</Label>
                                <Select value={status} onValueChange={onStatusChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {statusOptions.map((opt) => (
                                            <SelectItem key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div>
                            <Label>Cargo Desejado</Label>
                            <Input value={application.desiredPosition} disabled />
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            {/* Notas */}
   <TabsContent value="notes">
  <Card>
    <CardHeader>
      <CardTitle>Anotações</CardTitle>
      <CardDescription>Escreva uma nota com formatação avançada.</CardDescription>
    </CardHeader>
    <CardContent>
<EmailEditor recipient="idaliana.ngombo@gmail.com" />



    </CardContent>
  </Card>
</TabsContent>

            {/* Perfil do Colaborador (só aparece se status = ACCEPTED) */}
            <TabsContent value="profile">
                <Card>
                    <CardHeader>
                        <CardTitle>Perfil do Colaborador</CardTitle>
                        <CardDescription>
                            {application.hasProfile
                                ? "Este candidato já possui um perfil de colaborador."
                                : "Preencha os dados adicionais do colaborador aprovado."}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {application.hasProfile ? (
                            <Button
                                onClick={() => console.log("Redirecionar para perfil")}
                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-xl shadow-md transition-all duration-200"
                            >
                                <User2 className="w-5 h-5" />
                                Ver Perfil do Colaborador
                            </Button>
                        ) : (
                            <>
                                {/* Pegar alguns dados da candidatura para poder criar perfil */}
                                <div>
                                    <Label>Departamento</Label>
                                    <Input placeholder="Departamento do colaborador" />
                                </div>
                                <div>
                                    <Label>Data de Início</Label>
                                    <Input type="date" />
                                </div>
                                <div>
                                    <Label>Responsável Direto</Label>
                                    <Input placeholder="Nome do supervisor" />
                                </div>
                                <Button onClick={() => console.log("Perfil do colaborador salvo")}>
                                    Salvar Perfil
                                </Button>
                            </>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>

        </Tabs>
    )
}

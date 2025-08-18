
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
import ProfessionalForm from "../profissional/profissionalForm"
import type { Professional } from "@/services/profissional/profissional.service"
import { Link } from "react-router-dom"
import type { JobApplication } from "@/types/types"
import { Textarea } from "../ui/textarea"


interface ApplicationDetailTabsProps {
  application: JobApplication
  status: string
  onStatusChange: (status: string) => void
  hasProfile: Professional | null;
  onProfessionalCreated?: (professionalId: string) => void;
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
  hasProfile, // novo prop para verificar se o candidato tem perfil
  onProfessionalCreated,
}: ApplicationDetailTabsProps) {





  return (
    <Tabs defaultValue="info" className="w-full space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="info" >Informações</TabsTrigger>
        <TabsTrigger value="notes" disabled={!!hasProfile}>Notas</TabsTrigger>
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
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Dados Pessoais</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-5">Nome Completo</Label>
                  <Input value={application.fullName} disabled />
                </div>
                <div>
                  <Label className="mb-5">Email</Label>
                  <Input value={application.email} disabled />
                </div>
                <div>
                  <Label className="mb-5">Telefone</Label>
                  <Input value={application.phoneNumber || "-"} disabled />
                </div>
                <div>
                  <Label className="mb-5">Telefone Opcional</Label>
                  <Input value={application.optionalPhoneNumber || "-"} disabled />
                </div>
                <div>
                  <Label className="mb-5">Data de Nascimento</Label>
                  <Input value={application.birthDate} disabled />
                </div>
                <div>
                  <Label className="mb-5">Gênero</Label>
                  <Input value={application.gender?.label || "-"} disabled />
                </div>
                <div>
                  <Label className="mb-5">Estado Civil</Label>
                  <Input value={application.maritalStatus?.label || "-"} disabled />
                </div>
                <div>
                  <Label className="mb-5">Tem Filhos?</Label>
                  <Input value={application.hasChildren ? "Sim" : "Não"} disabled />
                </div>
                <div className="md:col-span-2">
                  <Label className="mb-5">Doenças Conhecidas</Label>
                  <div className="w-full flex flex-col gap-2">

                    <Textarea id="message" placeholder={application.knownDiseases} />
                   
                  </div>

                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Qualificações e Preferências</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-5">Cargo Desejado</Label>
                  <Input value={application.desiredPosition?.label || "-"} disabled />
                </div>
                <div>
                  <Label className="mb-5">Nível de Experiência</Label>
                  <Input value={application.experienceLevel?.label || "-"} disabled />
                </div>
                <div>
                  <Label className="mb-5">Grau de Escolaridade</Label>
                  <Input value={application.highestDegree?.label || "-"} disabled />
                </div>
                <div>
                  <Label className="mb-5">Disponibilidade</Label>
                  <Input value={application.generalAvailability?.label || "-"} disabled />
                </div>
                <div>
                  <Label className="mb-5">Disponível a Partir de</Label>
                  <Input value={application.availabilityDate || "-"} disabled />
                </div>
                <div>
                  <Label className="mb-5">Localização</Label>
                  <Input value={`${application.location?.city?.name || "-"} - ${application.location?.district?.name || "-"}`} disabled />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Experiência Profissional</h3>
              <div className="space-y-2">
                {application.ProfessionalExperience?.length > 0 ? (
                  application.ProfessionalExperience.map((exp: any, index: any) => (
                    <div key={index} className="border p-3 rounded-md">
                      <p><strong>Empresa:</strong> {exp.localTrabalho}</p>
                      <p><strong>Cargo:</strong> {exp.cargo}</p>

                      <p><strong>Período:</strong> {exp.startDate} - {exp.endDate} / {exp.tempo} anos</p>
                      <p><strong>Descrição:</strong> {exp.description || "Sem informação adicional"}</p>
                    </div>
                  ))
                ) : (
                  <p>Nenhuma experiência profissional cadastrada.</p>
                )}
              </div>

            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Idiomas, Habilidades e Cursos</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-5">Idiomas</Label>
                  <div className="border p-2 rounded-md">
                    <ul className="list-disc list-inside">
                      {application.languages?.length > 0 ? (
                        application.languages.map((lang, index) => (
                          <li key={index}>{lang.label}</li>
                        ))
                      ) : (
                        <li>Nenhum idioma cadastrado.</li>
                      )}
                    </ul>
                  </div>
                </div>
                <div>
                  <Label className="mb-5">Habilidades</Label>
                  <div className="border p-2 rounded-md">
                    <ul className="list-disc list-inside">
                      {application.skills?.length > 0 ? (
                        application.skills.map((skill, index) => (
                          <li key={index}>{skill.label}</li>
                        ))
                      ) : (
                        <li>Nenhuma habilidade cadastrada.</li>
                      )}
                    </ul>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <Label className="mb-5">Cursos</Label>
                  <div className="border p-2 rounded-md">
                    <ul className="list-disc list-inside">
                      {application.courses?.length > 0 ? (
                        application.courses.map((course, index) => (
                          <li key={index}>{course.label}</li>
                        ))
                      ) : (
                        <li>Nenhum curso cadastrado.</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Documentos e Status</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-5">Número de Identificação</Label>
                  <Input value={application.identityNumber || "-"} disabled />
                </div>
                <div>

                  <Label className="mb-5">Status</Label>
                
                  <Select value={status} onValueChange={onStatusChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions
                        .filter((opt) => {
                          const availableTransitions: Record<string, string[]> = {
                            PENDING: ["IN_REVIEW", "REJECTED"],
                            IN_REVIEW: ["INTERVIEW", "REJECTED"],
                            INTERVIEW: ["ACCEPTED", "REJECTED"],
                            ACCEPTED: [],
                            REJECTED: [],
                          }

                          // Permitir reexibir o status atual como selecionado
                          return (
                            status === opt.value ||
                            availableTransitions[status]?.includes(opt.value)
                          )
                        })
                        .map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                   <p className="text-sm text-muted-foreground">
                       Atualize o estado da candidatura de acordo a analise!
                    </p>
                </div>

              </div>
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
            <EmailEditor recipient={application.email} />



          </CardContent>
        </Card>
      </TabsContent>

      {/* Perfil do Colaborador (só aparece se status = ACCEPTED) */}
      <TabsContent value="profile">
        <Card>
          <CardHeader>
            <CardTitle>Perfil do Colaborador</CardTitle>
            <CardDescription>
              {hasProfile
                ? "Este candidato já possui um perfil de colaborador."
                : "Preencha os dados adicionais do colaborador aprovado."}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {hasProfile ? (
              <Link
                to={`/rh/professional/${hasProfile.id}/details`}

              >
                <Button
                  // Remova o onClick, pois o Link já fará o redirecionamento
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-xl shadow-md transition-all duration-200"
                >
                  <User2 className="w-5 h-5" />
                  Ver Perfil do Colaborador
                </Button>
              </Link>
            ) : (
              <ProfessionalForm application={application} onProfessionalCreated={onProfessionalCreated} />

            )}
          </CardContent>


        </Card>
      </TabsContent>

    </Tabs>
  )
}

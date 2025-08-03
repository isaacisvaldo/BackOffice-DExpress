import { useEffect, useState } from "react"
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { getEspecialities } from "@/services/especialities/especialityService"

export default function ProfessionalForm({ application }: { application: any }) {
    const [imagePreview, setImagePreview] = useState<string>("")
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phoneNumber: "",
        identityNumber: "",
        isAvailable: false,
        availabilityType: "FULL_TIME",
        experienceLevel: "JUNIOR",
        jobApplicationId: application.id,
        description: "",
        expectedAvailability: "",
        hasCriminalRecord: false,
        hasMedicalCertificate: false,
        hasTrainingCertificate: false,
        hasPhoto: false,
        locationId: application.location?.id || "",
        profileImage: "",
        gender: "MALE",
        birthDate: "",
        maritalStatus: "Não informado",
        hasChildren: false,
        knownDiseases: "",
        desiredPosition: application.desiredPosition || "HOUSEKEEPER",
        expectedSalary: 0,
        highestDegree: "Não informado",
        courses: "",
        languages: "",
        skillsAndQualities: "",
        specialties: [] as string[],
    })
    const [specialtiesList, setSpecialtiesList] = useState<{ id: string, name: string }[]>([])
  

    useEffect(() => {
        getEspecialities()
            .then((res) => setSpecialtiesList(res))
            .catch((err) => console.error("Erro ao buscar especialidades:", err))
    }, [])
    useEffect(() => {
        if (application) {
            setForm((prev) => ({
                ...prev,
                fullName: application.fullName || "",
                email: application.email || "",
                phoneNumber: application.phoneNumber || "",
            }))
        }
    }, [application])

    const handleChange = (key: string, value: any) => {
        setForm((prev) => ({ ...prev, [key]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Dados do profissional a enviar:", form)
        // Enviar via API aqui (use FormData se for multipart/form-data)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Cadastro do Profissional</CardTitle>
                    <CardDescription>Preencha os dados abaixo</CardDescription>
                </CardHeader>

                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Foto de Perfil</Label>
                        <img
                            src={
                                imagePreview ||
                                "https://ui-avatars.com/api/?name=Foto&background=eeeeee&color=555&size=128&rounded=true"
                            }
                            alt="Preview da Foto"
                            className="w-32 h-32 object-cover rounded-full border"
                            style={{ backgroundColor: "#f3f4f6" }}
                        />

                        <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                    setForm((prev: any) => ({ ...prev, profileImage: file }))
                                    setImagePreview(URL.createObjectURL(file))
                                }
                            }}
                        />
                    </div>
                    <div></div>

                    <div>
                        <Label>Nome Completo</Label>
                        <Input value={form.fullName} onChange={(e) => handleChange("fullName", e.target.value)} />
                    </div>

                    <div>
                        <Label>Email</Label>
                        <Input value={form.email} onChange={(e) => handleChange("email", e.target.value)} />
                    </div>

                    <div>
                        <Label>Telefone</Label>
                        <Input value={form.phoneNumber} onChange={(e) => handleChange("phoneNumber", e.target.value)} />
                    </div>

                    <div>
                        <Label>Número de Identificação</Label>
                        <Input value={form.identityNumber} onChange={(e) => handleChange("identityNumber", e.target.value)} />
                    </div>

                    <div>
                        <Label>Disponibilidade</Label>
                        <Select value={form.availabilityType} onValueChange={(value) => handleChange("availabilityType", value)}>
                             <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="FULL_TIME">Tempo Integral</SelectItem>
                                <SelectItem value="PART_TIME">Parcial</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Nível de Experiência</Label>
                        <Select value={form.experienceLevel} onValueChange={(value) => handleChange("experienceLevel", value)}>
                             <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="JUNIOR">Júnior</SelectItem>
                                <SelectItem value="MID">Pleno</SelectItem>
                                <SelectItem value="SENIOR">Sênior</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Data Esperada de Disponibilidade</Label>
                        <Input type="date" value={form.expectedAvailability} onChange={(e) => handleChange("expectedAvailability", e.target.value)} />
                    </div>

                    <div>
                        <Label>Data de Nascimento</Label>
                        <Input type="date" value={form.birthDate} onChange={(e) => handleChange("birthDate", e.target.value)} />
                    </div>

                    <div>
                        <Label>Estado Civil</Label>
                        <Select value={form.maritalStatus} onValueChange={(v) => handleChange("maritalStatus", v)}>
                             <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Solteiro">Solteiro</SelectItem>
                                <SelectItem value="Casado">Casado</SelectItem>
                                <SelectItem value="Divorciado">Divorciado</SelectItem>
                                <SelectItem value="Viúvo">Viúvo</SelectItem>
                                <SelectItem value="Não informado">Não informado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Deseja Trabalhar como</Label>
                        <Select
                            value={form.desiredPosition}
                            onValueChange={(value) => handleChange("desiredPosition", value)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="BABYSITTER">Babá</SelectItem>
                                <SelectItem value="HOUSEKEEPER">Diarista / Empregada doméstica</SelectItem>
                                <SelectItem value="COOK">Cozinheira</SelectItem>
                                <SelectItem value="CAREGIVER">Cuidadora de idosos ou pessoas especiais</SelectItem>
                                <SelectItem value="GARDENER">Jardineiro</SelectItem>
                                <SelectItem value="IRONING">Passadeira</SelectItem>
                                <SelectItem value="CLEANING_ASSISTANT">Auxiliar de limpeza</SelectItem>
                                <SelectItem value="OTHER">Outro (cargo personalizado)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>



                    <div>
                        <Label>Salário Esperado</Label>
                        <Input type="number" value={form.expectedSalary} onChange={(e) => handleChange("expectedSalary", parseInt(e.target.value) || 0)} />
                    </div>

                    <div>
                        <Label>Grau Acadêmico</Label>
                        <Select value={form.highestDegree} onValueChange={(v) => handleChange("highestDegree", v)}>
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Ensino Fundamental">Ensino Fundamental</SelectItem>
                                <SelectItem value="Ensino Médio">Ensino Médio</SelectItem>
                                <SelectItem value="Superior Incompleto">Superior Incompleto</SelectItem>
                                <SelectItem value="Superior Completo">Superior Completo</SelectItem>
                                <SelectItem value="Pós-graduação">Pós-graduação</SelectItem>
                                <SelectItem value="Não informado">Não informado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Doenças Conhecidas</Label>
                        <Textarea value={form.knownDiseases} onChange={(e) => handleChange("knownDiseases", e.target.value)} />
                    </div>

                    <div>
                        <Label>Cursos Realizados</Label>
                        <Textarea value={form.courses} onChange={(e) => handleChange("courses", e.target.value)} />
                    </div>

                    <div>
                        <Label>Idiomas</Label>
                        <Textarea value={form.languages} onChange={(e) => handleChange("languages", e.target.value)} />
                    </div>

                    <div>
                        <Label>Habilidades e Qualidades</Label>
                        <Textarea value={form.skillsAndQualities} onChange={(e) => handleChange("skillsAndQualities", e.target.value)} />
                    </div>

                    <div>
                        <Label>Especialidades</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn("w-full justify-between")}
                                >
                                    {form.specialties.length > 0
                                        ? specialtiesList
                                            .filter((s) => form.specialties.includes(s.id))
                                            .map((s) => s.name)
                                            .join(", ")
                                        : "Selecione as especialidades"}
                                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full max-h-64 overflow-auto p-2">
                                {specialtiesList.map((s) => (
                                    <div
                                        key={s.id}
                                        className="flex items-center space-x-2 cursor-pointer hover:bg-muted rounded px-2 py-1"
                                        onClick={() => {
                                            if (form.specialties.includes(s.id)) {
                                                handleChange(
                                                    "specialties",
                                                    form.specialties.filter((id: string) => id !== s.id)
                                                )
                                            } else {
                                                handleChange("specialties", [...form.specialties, s.id])
                                            }
                                        }}
                                    >
                                        <Checkbox checked={form.specialties.includes(s.id)} />
                                        <span>{s.name}</span>
                                    </div>
                                ))}
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Checkboxes */}
                    <div className="flex items-center gap-2">
                        <Checkbox checked={form.isAvailable} onCheckedChange={(v) => handleChange("isAvailable", v)} />
                        <Label>Está Disponível</Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <Checkbox checked={form.hasCriminalRecord} onCheckedChange={(v) => handleChange("hasCriminalRecord", v)} />
                        <Label>Tem Registo Criminal</Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <Checkbox checked={form.hasMedicalCertificate} onCheckedChange={(v) => handleChange("hasMedicalCertificate", v)} />
                        <Label>Tem Atestado Médico</Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <Checkbox checked={form.hasTrainingCertificate} onCheckedChange={(v) => handleChange("hasTrainingCertificate", v)} />
                        <Label>Tem Certificado de Formação</Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <Checkbox checked={form.hasChildren} onCheckedChange={(v) => handleChange("hasChildren", v)} />
                        <Label>Tem Filhos</Label>
                    </div>
                </CardContent>
            </Card>
            <Button type="submit">Salvar Profissional</Button>
        </form>
    )
}

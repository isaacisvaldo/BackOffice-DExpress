import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { getEspecialities } from "@/services/especialities/especialityService";
import { create } from "@/services/profissional/profissionalService";

interface FormDataState {
  fullName: string;
  email: string;
  phoneNumber: string;
  identityNumber?: string;
  availabilityType: string;
  experienceLevel: string;
  jobApplicationId?: string;
  description?: string;
  expectedAvailability: string;
  hasCriminalRecord: boolean;
  hasMedicalCertificate: boolean;
  hasTrainingCertificate: boolean;
  locationId: string;
  gender: string;
  birthDate: string;
  maritalStatus: string;
  hasChildren: boolean;
  knownDiseases?: string;
  desiredPosition: string;
  expectedSalary: number;
  highestDegree: string;
  courses: string[];
  languages: string[];
  skillsAndQualities: string[];
  specialties: string[];
  profileImage?: File;
}

export default function ProfessionalForm({ application }: { application: any }) {
  const [imagePreview, setImagePreview] = useState<string>("");
  const [form, setForm] = useState<FormDataState>({
    fullName: "",
    email: "",
    phoneNumber: "",
    identityNumber: "",
    availabilityType: "FULL_TIME",
    experienceLevel: "LESS_THAN_1",
    jobApplicationId: application?.id,
    description: "",
    expectedAvailability: "",
    hasCriminalRecord: false,
    hasMedicalCertificate: false,
    hasTrainingCertificate: false,
    locationId: application?.location?.id || "",
    gender: "MALE",
    birthDate: "",
    maritalStatus: "Não informado",
    hasChildren: false,
    knownDiseases: "",
    desiredPosition: application?.desiredPosition || "HOUSEKEEPER",
    expectedSalary: 0,
    highestDegree: "Não informado",
    courses: [],
    languages: [],
    skillsAndQualities: [],
    specialties: [],
    profileImage: undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [specialtiesList, setSpecialtiesList] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    getEspecialities()
      .then((res) => setSpecialtiesList(res))
      .catch((err) => console.error("Erro ao buscar especialidades:", err));
  }, []);

  useEffect(() => {
    if (application) {
      setForm((prev) => ({
        ...prev,
        fullName: application.fullName || "",
        email: application.email || "",
        phoneNumber: application.phoneNumber || "",
      }));
    }
  }, [application]);

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.fullName) newErrors.fullName = "Nome completo é obrigatório.";
    if (!form.email) newErrors.email = "Email é obrigatório.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Formato de email inválido.";
    if (!form.phoneNumber) newErrors.phoneNumber = "Telefone é obrigatório.";
    if (!form.locationId) newErrors.locationId = "Localização é obrigatória.";
    if (!form.birthDate) newErrors.birthDate = "Data de nascimento é obrigatória.";
    if (!form.highestDegree) newErrors.highestDegree = "Grau acadêmico é obrigatório.";
    if (form.expectedSalary <= 0) newErrors.expectedSalary = "Salário esperado deve ser maior que zero.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
        console.error("Formulário inválido. Corrija os erros.");
        return;
    }

    const toISOString = (dateString: string): string | null => {
        if (!dateString) return null;
        try {
            const date = new Date(dateString);
            return date.toISOString();
        } catch (error) {
            console.error(`Erro ao converter a data "${dateString}":`, error);
            return null;
        }
    };

    const payload = {
        fullName: form.fullName,
        email: form.email,
        phoneNumber: form.phoneNumber,
        identityNumber: form.identityNumber,
        availabilityType: form.availabilityType,
        experienceLevel: form.experienceLevel,
        applicationId: form.jobApplicationId,
        description: form.description,
        
        expectedAvailability: toISOString(form.expectedAvailability),
        
        hasCriminalRecord: form.hasCriminalRecord,
        hasMedicalCertificate: form.hasMedicalCertificate,
        hasTrainingCertificate: form.hasTrainingCertificate,
        locationId: form.locationId,
        gender: form.gender,
        
        birthDate: toISOString(form.birthDate),
        
        maritalStatus: form.maritalStatus,
        hasChildren: form.hasChildren,
        knownDiseases: form.knownDiseases,
        desiredPosition: form.desiredPosition,
        expectedSalary: Number(form.expectedSalary),
        highestDegree: form.highestDegree,
        courses: form.courses,
        languages: form.languages,
        skillsAndQualities: form.skillsAndQualities,
        specialtyIds: form.specialties,
    };

    try {
        const result = await create(payload);
        console.log("Profissional criado:", result);
    } catch (error) {
        console.error("Erro ao salvar profissional:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Cadastro do Profissional</CardTitle>
          <CardDescription>Preencha os dados abaixo</CardDescription>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Foto */}
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
                const file = e.target.files?.[0];
                if (file) {
                  handleChange("profileImage", file);
                  setImagePreview(URL.createObjectURL(file));
                }
              }}
            />
          </div>

          <InputBlock label="Nome Completo" value={form.fullName} onChange={(v) => handleChange("fullName", v)} error={errors.fullName} />
          <InputBlock label="Email" value={form.email} onChange={(v) => handleChange("email", v)} error={errors.email} />
          <InputBlock label="Telefone" value={form.phoneNumber} onChange={(v) => handleChange("phoneNumber", v)} error={errors.phoneNumber} />
          
          {/* CORREÇÃO: Garante que o valor é uma string vazia se for nulo/indefinido */}
          <InputBlock label="Número de Identificação" value={form.identityNumber || ""} onChange={(v) => handleChange("identityNumber", v)} error={errors.identityNumber} />

          {/* Selects */}
          <SelectBlock label="Disponibilidade" value={form.availabilityType} onChange={(v) => handleChange("availabilityType", v)}
            options={[
              { value: "FULL_TIME", label: "Tempo Integral" },
              { value: "PART_TIME", label: "Parcial" },
              { value: "DAILY", label: "Diário" },
              { value: "WEEKENDS", label: "Fins de Semana" },
              { value: "ANY", label: "Qualquer" },
            ]}
          />

          <SelectBlock label="Nível de Experiência" value={form.experienceLevel} onChange={(v) => handleChange("experienceLevel", v)}
            options={[
              { value: "LESS_THAN_1", label: "Menos de 1 ano" },
              { value: "ONE_TO_THREE", label: "1 a 3 anos" },
              { value: "THREE_TO_FIVE", label: "3 a 5 anos" },
              { value: "MORE_THAN_FIVE", label: "Mais de 5 anos" },
            ]}
          />

          {/* CORREÇÃO: Garante que o valor é uma string vazia se for nulo/indefinido */}
          <InputBlock type="date" label="Data Esperada de Disponibilidade" value={form.expectedAvailability || ""} onChange={(v) => handleChange("expectedAvailability", v)} error={errors.expectedAvailability} />
          <InputBlock type="date" label="Data de Nascimento" value={form.birthDate} onChange={(v) => handleChange("birthDate", v)} error={errors.birthDate} />

          <SelectBlock label="Estado Civil" value={form.maritalStatus} onChange={(v) => handleChange("maritalStatus", v)}
            options={[
              { value: "Solteiro", label: "Solteiro" },
              { value: "Casado", label: "Casado" },
              { value: "Divorciado", label: "Divorciado" },
              { value: "Viúvo", label: "Viúvo" },
              { value: "Não informado", label: "Não informado" },
            ]}
          />

          <SelectBlock label="Gênero" value={form.gender} onChange={(v) => handleChange("gender", v)}
            options={[
              { value: "MALE", label: "Masculino" },
              { value: "FEMALE", label: "Feminino" },
            ]}
          />

          <SelectBlock label="Grau Acadêmico" value={form.highestDegree} onChange={(v) => handleChange("highestDegree", v)}
            options={[
              { value: "Ensino Fundamental", label: "Ensino Fundamental" },
              { value: "Ensino Médio", label: "Ensino Médio" },
              { value: "Superior Incompleto", label: "Superior Incompleto" },
              { value: "Superior Completo", label: "Superior Completo" },
              { value: "Pós-graduação", label: "Pós-graduação" },
              { value: "Não informado", label: "Não informado" },
            ]}
            error={errors.highestDegree}
          />

          <SelectBlock label="Deseja Trabalhar como" value={form.desiredPosition} onChange={(v) => handleChange("desiredPosition", v)}
            options={[
              { value: "BABYSITTER", label: "Babá" },
              { value: "HOUSEKEEPER", label: "Diarista / Empregada doméstica" },
              { value: "COOK", label: "Cozinheira" },
              { value: "CAREGIVER", label: "Cuidadora" },
              { value: "GARDENER", label: "Jardineiro" },
              { value: "IRONING", label: "Passadeira" },
              { value: "CLEANING_ASSISTANT", label: "Auxiliar de Limpeza" },
              { value: "OTHER", label: "Outro" },
            ]}
          />

          <InputBlock label="Salário Esperado" type="number" value={form.expectedSalary} onChange={(v) => handleChange("expectedSalary", parseInt(v) || 0)} error={errors.expectedSalary} />

          <div className="grid gap-2">
            <Label htmlFor="knownDiseases">Doenças Conhecidas</Label>
            <Textarea
              id="knownDiseases"
              value={form.knownDiseases || ""}
              onChange={(e) => handleChange("knownDiseases", e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="courses">Cursos Realizados</Label>
            <Textarea
              id="courses"
              value={form.courses.join(", ")}
              onChange={(e) =>
                handleChange(
                  "courses",
                  e.target.value.split(",").map((c) => c.trim()).filter(Boolean)
                )
              }
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="languages">Idiomas</Label>
            <Textarea
              id="languages"
              value={form.languages.join(", ")}
              onChange={(e) =>
                handleChange(
                  "languages",
                  e.target.value.split(",").map((l) => l.trim()).filter(Boolean)
                )
              }
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="skillsAndQualities">Habilidades e Qualidades</Label>
            <Textarea
              id="skillsAndQualities"
              value={form.skillsAndQualities.join(", ")}
              onChange={(e) =>
                handleChange(
                  "skillsAndQualities",
                  e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                )
              }
            />
          </div>

          {/* Especialidades */}
          <div>
            <Label>Especialidades</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {form.specialties.length > 0
                    ? specialtiesList.filter((s) => form.specialties.includes(s.id)).map((s) => s.name).join(", ")
                    : "Selecione as especialidades"}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full max-h-64 overflow-auto p-2">
                {specialtiesList.map((s) => (
                  <div key={s.id} className="flex items-center space-x-2 cursor-pointer hover:bg-muted rounded px-2 py-1"
                    onClick={() => {
                      if (form.specialties.includes(s.id)) {
                        handleChange("specialties", form.specialties.filter((id: string) => id !== s.id));
                      } else {
                        handleChange("specialties", [...form.specialties, s.id]);
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
          <CheckboxField label="Tem Registo Criminal" checked={form.hasCriminalRecord} onChange={(v) => handleChange("hasCriminalRecord", v)} />
          <CheckboxField label="Tem Atestado Médico" checked={form.hasMedicalCertificate} onChange={(v) => handleChange("hasMedicalCertificate", v)} />
          <CheckboxField label="Tem Certificado de Formação" checked={form.hasTrainingCertificate} onChange={(v) => handleChange("hasTrainingCertificate", v)} />
          <CheckboxField label="Tem Filhos" checked={form.hasChildren} onChange={(v) => handleChange("hasChildren", v)} />
        </CardContent>
      </Card>

      <Button type="submit">Salvar Profissional</Button>
    </form>
  );
}

// Componentes reutilizáveis
function InputBlock({ label, type = "text", value, onChange, error }: { label: string, value: any, onChange: (v: any) => void, type?: string, error?: string }) {
  return (
    <div>
      <Label>{label}</Label>
      <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

function SelectBlock({ label, value, onChange, options, error }: { label: string, value: string, onChange: (v: string) => void, options: { value: string, label: string }[], error?: string }) {
  return (
    <div>
      <Label>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

function CheckboxField({ label, checked, onChange }: { label: string, checked: boolean, onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center gap-2">
      <Checkbox checked={checked} onCheckedChange={onChange} />
      <Label>{label}</Label>
    </div>
  );
}
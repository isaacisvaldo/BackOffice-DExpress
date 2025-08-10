import { useEffect, useState } from "react";
import { CardContent } from "@/components/ui/card";
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
import { createProfessional } from "@/services/profissional/profissional.service";
import { z } from "zod";
import toast from "react-hot-toast";

// Importe as funções de serviço reais da sua API

import { getSkillsList } from "@/services/shared/skills/skills.service";
import { getLanguagesList } from "@/services/shared/language/language.service";
import { getGendersList } from "@/services/shared/gender/gender.service";
import { getDesiredPositionsList } from "@/services/shared/desired-positions/desired-positions.service";
import { getMaritalStatusesList } from "@/services/shared/marital-statuses/marital-statuses.service";
import { getExperienceLevelsList } from "@/services/shared/experience-levels/experience-levels.service";
import { getHighestDegreesList } from "@/services/shared/highest-degrees/highest-degree.service";
import { getCoursesList } from "@/services/shared/courses/course.service";
import { getGeneralAvailabilitiesList } from "@/services/shared/general-availabilities/general-availability.service";


const professionalFormSchema = z.object({
  fullName: z.string().min(1, "Nome completo é obrigatório."),
  email: z.string().email("Formato de email inválido."),
  phoneNumber: z.string().min(1, "Telefone é obrigatório."),
  identityNumber: z.string().optional(),
  availabilityTypeId: z.string().uuid("ID de disponibilidade inválido."),
  experienceLevelId: z.string().uuid("ID de nível de experiência inválido."),
  jobApplicationId: z.string().uuid().optional(),
  description: z.string().optional(),
  expectedAvailability: z
    .string()
    .date("Data de disponibilidade inválida.")
    .optional(),
  hasCriminalRecord: z.boolean(),
  hasMedicalCertificate: z.boolean(),
  hasTrainingCertificate: z.boolean(),
  locationId: z.string().uuid("ID de localização inválido."),
  genderId: z.string().uuid("ID de gênero inválido."),
  birthDate: z.string().date("Data de nascimento inválida."),
  maritalStatusId: z.string().uuid("ID de estado civil inválido."),
  hasChildren: z.boolean(),
  knownDiseases: z.string().optional(),
  desiredPositionId: z.string().uuid("ID de cargo desejado inválido."),
  expectedSalary: z
    .number()
    .min(1, "Salário esperado deve ser maior que zero."),
  highestDegreeId: z.string().uuid("ID de grau acadêmico inválido."),
  courseIds: z.array(z.string().uuid()),
  languageIds: z.array(z.string().uuid()),
  skillIds: z.array(z.string().uuid()),
  profileImage: z.any().optional(),
});

type FormDataState = z.infer<typeof professionalFormSchema>;

export default function ProfessionalForm({
  application,
  onProfessionalCreated,
}: {
  application: any;
  onProfessionalCreated?: (professionalId: string) => void;
}) {
  const [availabilityList, setAvailabilityList] = useState<any[]>([]);
  const [experienceList, setExperienceList] = useState<any[]>([]);
  const [genderList, setGenderList] = useState<any[]>([]);
  const [maritalStatusList, setMaritalStatusList] = useState<any[]>([]);
  const [highestDegreeList, setHighestDegreeList] = useState<any[]>([]);
  const [desiredPositionList, setDesiredPositionList] = useState<any[]>([]);
  const [coursesList, setCoursesList] = useState<any[]>([]);
  const [languagesList, setLanguagesList] = useState<any[]>([]);
  const [skillsList, setSkillsList] = useState<any[]>([]);

  const [form, setForm] = useState<FormDataState>({
    fullName: "",
    email: "",
    phoneNumber: "",
    identityNumber: "",
    availabilityTypeId: "",
    experienceLevelId: "",
    jobApplicationId: application?.id,
    description: "",
    expectedAvailability: "",
    hasCriminalRecord: false,
    hasMedicalCertificate: false,
    hasTrainingCertificate: false,
    locationId: application?.location?.id || "",
    genderId: "",
    birthDate: "",
    maritalStatusId: "",
    hasChildren: false,
    knownDiseases: "",
    desiredPositionId: "",
    expectedSalary: 0,
    highestDegreeId: "",
    courseIds: [],
    languageIds: [],
    skillIds: [],
    profileImage: undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadDataFromApi = async () => {
      try {
        setAvailabilityList(await getGeneralAvailabilitiesList());
        setExperienceList(await getExperienceLevelsList());
        setGenderList(await getGendersList());
        setMaritalStatusList(await getMaritalStatusesList());
        setHighestDegreeList(await getHighestDegreesList());
        setDesiredPositionList(await getDesiredPositionsList());
        setCoursesList(await getCoursesList());
        setLanguagesList(await getLanguagesList());
        setSkillsList(await getSkillsList()); 
      } catch (error) {
        console.error("Erro ao carregar dados da API:", error);
        toast.error("Falha ao carregar as opções do formulário.");
      }
    };

    loadDataFromApi();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = professionalFormSchema.safeParse(form);

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path.length > 0) {
          newErrors[issue.path[0] as keyof FormDataState] = issue.message;
        }
      });
      setErrors(newErrors);
      toast.error("Formulário inválido. Corrija os erros.");
      console.error("Formulário inválido. Corrija os erros.", newErrors);
      return;
    }

    const payload = result.data;

    const finalPayload = {
      ...payload,
      birthDate: payload.birthDate
        ? new Date(payload.birthDate).toISOString()
        : payload.birthDate,
      expectedAvailability: payload.expectedAvailability
        ? new Date(payload.expectedAvailability).toISOString()
        : payload.expectedAvailability,
    };

    try {
      const createPayload = { ...finalPayload, profileImage: undefined };
      const createdProfessional = await createProfessional(createPayload);

      toast.success("Profissional criado com sucesso!");
      console.log("Profissional criado:", createdProfessional);

      if (
        createdProfessional &&
        createdProfessional.id &&
        onProfessionalCreated
      ) {
        onProfessionalCreated(createdProfessional.id);
      }
    } catch (error) {
      console.error("Erro ao salvar profissional:", error);
      toast.error("Falha ao salvar o profissional.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputBlock
          label="Nome Completo"
          value={form.fullName}
          onChange={(v) => handleChange("fullName", v)}
          error={errors.fullName}
        />
        <InputBlock
          label="Email"
          value={form.email}
          onChange={(v) => handleChange("email", v)}
          error={errors.email}
        />
        <InputBlock
          label="Telefone"
          value={form.phoneNumber}
          onChange={(v) => handleChange("phoneNumber", v)}
          error={errors.phoneNumber}
        />
        <InputBlock
          label="Número de Identificação"
          value={form.identityNumber || ""}
          onChange={(v) => handleChange("identityNumber", v)}
          error={errors.identityNumber}
        />

        <SelectBlock
          label="Disponibilidade"
          value={form.availabilityTypeId}
          onChange={(v) => handleChange("availabilityTypeId", v)}
          options={availabilityList}
        />
        <SelectBlock
          label="Nível de Experiência"
          value={form.experienceLevelId}
          onChange={(v) => handleChange("experienceLevelId", v)}
          options={experienceList}
        />

        <InputBlock
          type="date"
          label="Data Esperada de Disponibilidade"
          value={form.expectedAvailability || ""}
          onChange={(v) => handleChange("expectedAvailability", v)}
          error={errors.expectedAvailability}
        />
        <InputBlock
          type="date"
          label="Data de Nascimento"
          value={form.birthDate}
          onChange={(v) => handleChange("birthDate", v)}
          error={errors.birthDate}
        />

        <SelectBlock
          label="Estado Civil"
          value={form.maritalStatusId}
          onChange={(v) => handleChange("maritalStatusId", v)}
          options={maritalStatusList}
        />
        <SelectBlock
          label="Gênero"
          value={form.genderId}
          onChange={(v) => handleChange("genderId", v)}
          options={genderList}
        />
        <SelectBlock
          label="Grau Acadêmico"
          value={form.highestDegreeId}
          onChange={(v) => handleChange("highestDegreeId", v)}
          options={highestDegreeList}
          error={errors.highestDegreeId}
        />
        <SelectBlock
          label="Deseja Trabalhar como"
          value={form.desiredPositionId}
          onChange={(v) => handleChange("desiredPositionId", v)}
          options={desiredPositionList}
        />

        <InputBlock
          label="Salário Esperado"
          type="number"
          value={form.expectedSalary}
          onChange={(v) => handleChange("expectedSalary", parseInt(v) || 0)}
          error={errors.expectedSalary}
        />

        <div className="grid gap-2">
          <Label htmlFor="knownDiseases">Doenças Conhecidas</Label>
          <Textarea
            id="knownDiseases"
            value={form.knownDiseases || ""}
            onChange={(e) => handleChange("knownDiseases", e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            value={form.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </div>

        <MultiSelectPopover
          label="Cursos Realizados"
          options={coursesList}
          selectedIds={form.courseIds}
          onChange={(ids) => handleChange("courseIds", ids)}
        />
        <MultiSelectPopover
          label="Idiomas"
          options={languagesList}
          selectedIds={form.languageIds}
          onChange={(ids) => handleChange("languageIds", ids)}
        />
        <MultiSelectPopover
          label="Habilidades e Qualidades"
          options={skillsList}
          selectedIds={form.skillIds}
          onChange={(ids) => handleChange("skillIds", ids)}
        />

        <CheckboxField
          label="Tem Registo Criminal"
          checked={form.hasCriminalRecord}
          onChange={(v) => handleChange("hasCriminalRecord", v)}
        />
        <CheckboxField
          label="Tem Atestado Médico"
          checked={form.hasMedicalCertificate}
          onChange={(v) => handleChange("hasMedicalCertificate", v)}
        />
        <CheckboxField
          label="Tem Certificado de Formação"
          checked={form.hasTrainingCertificate}
          onChange={(v) => handleChange("hasTrainingCertificate", v)}
        />
        <CheckboxField
          label="Tem Filhos"
          checked={form.hasChildren}
          onChange={(v) => handleChange("hasChildren", v)}
        />
      </CardContent>
      <Button type="submit">Salvar Profissional</Button>
    </form>
  );
}

// Reusable Components (with adjusted spacing)
function InputBlock({
  label,
  type = "text",
  value,
  onChange,
  error,
}: {
  label: string;
  value: any;
  onChange: (v: any) => void;
  type?: string;
  error?: string;
}) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}

function SelectBlock({
  label,
  value,
  onChange,
  options,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { id: string; label: string }[];
  error?: string;
}) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Array.isArray(options) &&
            options.map((opt) => (
              <SelectItem key={opt.id} value={opt.id}>
                {opt.label}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}

function MultiSelectPopover({
  label,
  options,
  selectedIds,
  onChange,
}: {
  label: string;
  options: any[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}) {
  const getOptionText = (option: any) => {
    return option.label || option.name || "N/A";
  };

  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            {selectedIds.length > 0 && Array.isArray(options)
              ? options
                  .filter((s) => selectedIds.includes(s.id))
                  .map((s) => getOptionText(s))
                  .join(", ")
              : "Selecione as opções"}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full max-h-64 overflow-auto p-2">
          {Array.isArray(options) &&
            options.map((option) => (
              <div
                key={option.id}
                className="flex items-center space-x-2 cursor-pointer hover:bg-muted rounded px-2 py-1"
                onClick={() => {
                  if (selectedIds.includes(option.id)) {
                    onChange(
                      selectedIds.filter((id: string) => id !== option.id)
                    );
                  } else {
                    onChange([...selectedIds, option.id]);
                  }
                }}
              >
                <Checkbox checked={selectedIds.includes(option.id)} />
                <span>{getOptionText(option)}</span>
              </div>
            ))}
        </PopoverContent>
      </Popover>
    </div>
  );
}

function CheckboxField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Checkbox checked={checked} onCheckedChange={onChange} />
      <Label>{label}</Label>
    </div>
  );
}
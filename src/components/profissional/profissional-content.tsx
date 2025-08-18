import { useState, useEffect } from 'react';
import {
  Button
} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Input
} from "@/components/ui/input";
import {
  Label
} from "@/components/ui/label";
import {
  Switch
} from "@/components/ui/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import {
  Textarea
} from "@/components/ui/textarea";
import {
  Badge
} from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import {
  ChevronDown,
  CirclePlus,
  Trash2
} from "lucide-react";
import {
  Checkbox
} from "@/components/ui/checkbox";
import toast from 'react-hot-toast';
import {
  z
} from 'zod';

import SwirlingEffectSpinner from "@/components/customized/spinner/spinner-06";
import {
  getGendersList
} from '@/services/shared/gender/gender.service';
import {
  getDesiredPositionsList
} from '@/services/shared/desired-positions/desired-positions.service';
import {
  getExperienceLevelsList
} from '@/services/shared/experience-levels/experience-levels.service';
import {
  getSkillsList
} from '@/services/shared/skills/skills.service';
import {
  getLanguagesList
} from '@/services/shared/language/language.service';
import {
  getCoursesList
} from '@/services/shared/courses/course.service';
import { updateProfessional, type Professional } from '@/services/profissional/profissional.service';

// Interfaces
interface SimplifiedItem {
  id: string;
  label: string;
}

interface SimplifiedItemExp {
  id?: string;
  localTrabalho: string;
  cargo: string;
  description?: string;
  startDate: string;
  tempo?: string;
  endDate?: string;
}

interface EditedProfessionalState {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  identityNumber?: string;
  birthDate: string;
  genderId: string;
  description?: string;
  desiredPositionId: string;
  experienceLevelId: string;
  isAvailable: boolean;
  professionalSkills: SimplifiedItem[];
  professionalLanguages: SimplifiedItem[];
  professionalCourses: SimplifiedItem[];
  professionalExperiences: SimplifiedItemExp[];
  contracts: any;
  highestDegreeId: string;
  maritalStatusId: string;
  knownDiseases?: string;
  hasChildren: boolean;
}

// Schemas de Validação Zod parciais
const personalSchema = z.object({
  fullName: z.string().min(1, "Nome completo é obrigatório."),
  email: z.string().email("Formato de email inválido."),
  phoneNumber: z.string().min(1, "Telefone é obrigatório."),
  identityNumber: z.string().optional(),
  birthDate: z.string().date("Data de nascimento inválida."),
  genderId: z.string().uuid("ID de gênero inválido."),
  description: z.string().optional(),
});

const professionalSchema = z.object({
  desiredPositionId: z.string().uuid("ID de cargo desejado inválido."),
  experienceLevelId: z.string().uuid("ID de nível de experiência inválido."),
  isAvailable: z.boolean(),
  professionalSkills: z.array(z.object({
    id: z.string().uuid(),
    label: z.string()
  })).optional(),
  professionalLanguages: z.array(z.object({
    id: z.string().uuid(),
    label: z.string()
  })).optional(),
  professionalCourses: z.array(z.object({
    id: z.string().uuid(),
    label: z.string()
  })).optional(),
});

const experienceSchema = z.object({
  localTrabalho: z.string().min(1, "O local de trabalho é obrigatório."),
  cargo: z.string().min(1, "O cargo é obrigatório."),
  startDate: z.string().date("Data de início inválida."),
  tempo: z.string().optional(),
  endDate: z.string().date("Data de término inválida.").optional(),
  description: z.string().optional(),
});

interface ProfessionalContentProps {
  professional: Professional;
}


export default function ProfessionalContent({
  professional
}: ProfessionalContentProps) {
  const [editedProfessional, setEditedProfessional] = useState < EditedProfessionalState > ({
    ...professional,
    professionalSkills: professional.professionalSkills?.map(s => s.skill ? {
      id: s.skill.id,
      label: s.skill.label
    } : null).filter(Boolean) as SimplifiedItem[] || [],
    professionalLanguages: professional.professionalLanguages?.map(l => l.language ? {
      id: l.language.id,
      label: l.language.label
    } : null).filter(Boolean) as SimplifiedItem[] || [],
    professionalCourses: professional.professionalCourses?.map(c => c.course ? {
      id: c.course.id,
      label: c.course.label
    } : null).filter(Boolean) as SimplifiedItem[] || [],
    professionalExperiences: professional.ProfessionalExperience?.map(exp => ({
      ...exp,
      tempo: exp.tempo,
      localTrabalho: exp.localTrabalho,
      cargo: exp.cargo,
      startDate: exp.startDate,
      endDate: exp.endDate,
      description: exp.description
    })) || [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState < Record < string, string >> ({});
  const [newExperience, setNewExperience] = useState < SimplifiedItemExp > ({
    localTrabalho: '',
    tempo: "",
    cargo: '',
    startDate: '',
    endDate: '',
    description: '',
  });

  const [gendersList, setGendersList] = useState < any[] > ([]);
  const [desiredPositionsList, setDesiredPositionsList] = useState < any[] > ([]);
  const [experienceLevelsList, setExperienceLevelsList] = useState < any[] > ([]);
  const [availableSkills, setAvailableSkills] = useState < any[] > ([]);
  const [availableLanguages, setAvailableLanguages] = useState < any[] > ([]);
  const [availableCourses, setAvailableCourses] = useState < any[] > ([]);
  const [isAddingExperience, setIsAddingExperience] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [
          genders,
          positions,
          levels,
          skills,
          languages,
          courses,
        ] = await Promise.all([
          getGendersList(),
          getDesiredPositionsList(),
          getExperienceLevelsList(),
          getSkillsList(),
          getLanguagesList(),
          getCoursesList(),
        ]);
        setGendersList(genders);
        setDesiredPositionsList(positions);
        setExperienceLevelsList(levels);
        setAvailableSkills(skills);
        setAvailableLanguages(languages);
        setAvailableCourses(courses);
      } catch (error) {
        console.error("Erro ao carregar listas de opções:", error);
        toast.error("Falha ao carregar as opções.");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleChange = (key: string, value: any) => {
    setEditedProfessional(prev => ({
      ...prev,
      [key]: value
    }));
    setErrors(prev => ({
      ...prev,
      [key]: ""
    }));
  };

  const handleSavePersonal = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = personalSchema.safeParse(editedProfessional);
    if (!result.success) {
      const newErrors = Object.fromEntries(result.error.issues.map(issue => [issue.path[0], issue.message]));
      setErrors(newErrors);
      toast.error("Formulário inválido. Corrija os erros.");
      return;
    }
    try {
      await updateProfessional(editedProfessional.id, result.data);
      toast.success("Informações pessoais atualizadas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      toast.error("Falha ao salvar o perfil.");
    }
  };

  const handleSaveProfessional = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = professionalSchema.safeParse(editedProfessional);
    if (!result.success) {
      const newErrors = Object.fromEntries(result.error.issues.map(issue => [issue.path[0], issue.message]));
      setErrors(newErrors);
      toast.error("Formulário inválido. Corrija os erros.");
      return;
    }
    const payload = {
      ...result.data,
      skillIds: editedProfessional.professionalSkills.map(s => s.id),
      languageIds: editedProfessional.professionalLanguages.map(l => l.id),
      courseIds: editedProfessional.professionalCourses.map(c => c.id),
    };
    try {
      await updateProfessional(editedProfessional.id, payload);
      toast.success("Informações profissionais atualizadas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      toast.error("Falha ao salvar o perfil.");
    }
  };

  const handleMultiSelectChange = (key: string, newIds: string[]) => {
    let list;
    if (key === 'professionalSkills') {
      list = availableSkills;
    } else if (key === 'professionalLanguages') {
      list = availableLanguages;
    } else if (key === 'professionalCourses') {
      list = availableCourses;
    }
    if (list) {
      const newList = list.filter(item => newIds.includes(item.id));
      handleChange(key, newList);
    }
  };

  const handleToggleAvailability = (isAvailable: boolean) => {
    handleChange('isAvailable', isAvailable);
  };

  const handleAddExperience = async () => {
    const result = experienceSchema.safeParse(newExperience);
    if (!result.success) {
      const newErrors = Object.fromEntries(result.error.issues.map(issue => [issue.path[0], issue.message]));
      setErrors(newErrors);
      toast.error("Preencha todos os campos obrigatórios da experiência.");
      return;
    }

    try {
      // Simulação de adição
      const addedExperience = {
        ...newExperience,
        id: Math.random().toString(),
        professionalId: professional.id,
      };

      setEditedProfessional(prev => ({
        ...prev,
        professionalExperiences: [...prev.professionalExperiences, addedExperience]
      }));
      setNewExperience({
        localTrabalho: '',
        cargo: '',
        startDate: '',
        endDate: '',
        description: '',
        tempo: '',
      });
      setIsAddingExperience(false);
      toast.success("Experiência profissional adicionada!");
    } catch (error) {
      toast.error("Falha ao adicionar a experiência.");
    }
  };

  const handleDeleteExperience = (idToDelete: string | undefined) => {
    if (!idToDelete) return;
    setEditedProfessional(prev => ({
      ...prev,
      professionalExperiences: prev.professionalExperiences.filter(exp => exp.id !== idToDelete)
    }));
    toast.success("Experiência profissional removida!");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <SwirlingEffectSpinner />
      </div>
    );
  }

  return (
    <Tabs defaultValue="pessoal" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="pessoal">Pessoal</TabsTrigger>
        <TabsTrigger value="profissional">Profissional</TabsTrigger>
        <TabsTrigger value="habilidades">Habilidades</TabsTrigger>
        <TabsTrigger value="experiencia">Experiência</TabsTrigger>
        <TabsTrigger value="contratos">Contratos</TabsTrigger>
      </TabsList>

      <TabsContent value="pessoal">
        <Card>
          <CardHeader>
            <CardTitle>Dados Pessoais</CardTitle>
            <CardDescription>Informações de perfil e contato.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputBlock
                label="Nome Completo"
                value={editedProfessional.fullName}
                onChange={(v) => handleChange("fullName", v)}
                error={errors.fullName}
              />
              <InputBlock
                label="E-mail"
                value={editedProfessional.email}
                onChange={(v) => handleChange("email", v)}
                error={errors.email}
              />
              <InputBlock
                label="Telefone"
                value={editedProfessional.phoneNumber}
                onChange={(v) => handleChange("phoneNumber", v)}
                error={errors.phoneNumber}
              />
              <InputBlock
                label="Número de Identidade"
                value={editedProfessional.identityNumber || ''}
                onChange={(v) => handleChange("identityNumber", v)}
                error={errors.identityNumber}
                disabled
              />
              <InputBlock
                type="date"
                label="Data de Nascimento"
                value={editedProfessional.birthDate.split('T')[0]}
                onChange={(v) => handleChange("birthDate", v)}
                error={errors.birthDate}
              />
              <SelectBlock
                label="Gênero"
                value={editedProfessional.genderId}
                onChange={(v) => handleChange("genderId", v)}
                options={gendersList}
                error={errors.genderId}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="bio">Descrição/Bio</Label>
              <Textarea
                id="bio"
                value={editedProfessional.description || ''}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </div>
            <Button onClick={handleSavePersonal}>Salvar Dados Pessoais</Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="profissional">
        <Card>
          <CardHeader>
            <CardTitle>Qualificações e Preferências</CardTitle>
            <CardDescription>Dados de carreira e disponibilidade.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="is-available"
                checked={editedProfessional.isAvailable}
                onCheckedChange={handleToggleAvailability}
              />
              <Label htmlFor="is-available">{editedProfessional.isAvailable ? "Disponível para trabalho" : "Indisponível para trabalho"}</Label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectBlock
                label="Posição Desejada"
                value={editedProfessional.desiredPositionId}
                onChange={(v) => handleChange("desiredPositionId", v)}
                options={desiredPositionsList}
                error={errors.desiredPositionId}
              />
              <SelectBlock
                label="Nível de Experiência"
                value={editedProfessional.experienceLevelId}
                onChange={(v) => handleChange("experienceLevelId", v)}
                options={experienceLevelsList}
                error={errors.experienceLevelId}
              />
            </div>
            <Button onClick={handleSaveProfessional}>Salvar Qualificações</Button>
          </CardContent>
        </Card>
      </TabsContent>

     <TabsContent value="habilidades">
        <Card>
          <CardHeader>
            <CardTitle>Habilidades, Idiomas e Cursos</CardTitle>
            <CardDescription>Gerencie as competências e formações do profissional.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Removido o `grid` para que os componentes fiquem um abaixo do outro */}
            <div className="space-y-4">
              <MultiSelectPopover
                label="Habilidades e Qualidades"
                options={availableSkills}
                selectedIds={editedProfessional.professionalSkills.map(s => s.id)}
                onChange={(ids) => handleMultiSelectChange("professionalSkills", ids)}
              />
              <MultiSelectPopover
                label="Idiomas"
                options={availableLanguages}
                selectedIds={editedProfessional.professionalLanguages.map(l => l.id)}
                onChange={(ids) => handleMultiSelectChange("professionalLanguages", ids)}
              />
              <MultiSelectPopover
                label="Cursos Realizados"
                options={availableCourses}
                selectedIds={editedProfessional.professionalCourses.map(c => c.id)}
                onChange={(ids) => handleMultiSelectChange("professionalCourses", ids)}
              />
            </div>
            <Button onClick={handleSaveProfessional}>Salvar Habilidades e Cursos</Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="experiencia">
        <Card>
          <CardHeader>
            <CardTitle>Experiência Profissional</CardTitle>
            <CardDescription>Histórico de empregos do profissional.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {editedProfessional.professionalExperiences.map(exp => (
              <div key={exp.id} className="border p-4 rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-semibold">{exp.cargo} na {exp.localTrabalho}</p>
                  <p className="text-sm text-muted-foreground">
                    {exp.startDate} - {exp.endDate || 'Presente'}
                    {exp.tempo && ` (${exp.tempo})`}
                  </p>
                  {exp.description && <p className="text-sm mt-2">{exp.description}</p>}
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteExperience(exp.id)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
            <Button variant="outline" onClick={() => setIsAddingExperience(!isAddingExperience)}>
              <CirclePlus className="mr-2 h-4 w-4" />
              Adicionar Nova Experiência
            </Button>

            {isAddingExperience && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 border rounded-lg bg-secondary/20">
                <InputBlock
                  label="Local de Trabalho"
                  value={newExperience.localTrabalho}
                  onChange={(v) => setNewExperience(prev => ({ ...prev, localTrabalho: v }))}
                  error={errors.localTrabalho}
                />
                <InputBlock
                  label="Cargo"
                  value={newExperience.cargo}
                  onChange={(v) => setNewExperience(prev => ({ ...prev, cargo: v }))}
                  error={errors.cargo}
                />
                <InputBlock
                  type="date"
                  label="Data de Início"
                  value={newExperience.startDate}
                  onChange={(v) => setNewExperience(prev => ({ ...prev, startDate: v }))}
                  error={errors.startDate}
                />
                <InputBlock
                  type="date"
                  label="Data de Término (Opcional)"
                  value={newExperience.endDate || ''}
                  onChange={(v) => setNewExperience(prev => ({ ...prev, endDate: v }))}
                  error={errors.endDate}
                />
                <div className="md:col-span-2">
                  <InputBlock
                    label="Tempo (Ex: '2 anos', '6 meses')"
                    value={newExperience.tempo || ''}
                    onChange={(v) => setNewExperience(prev => ({ ...prev, tempo: v }))}
                    error={errors.tempo}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Descrição</Label>
                  <Textarea
                    value={newExperience.description || ''}
                    onChange={(e) => setNewExperience(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div className="md:col-span-2">
                  <Button onClick={handleAddExperience}>Salvar Experiência</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="contratos">
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Contratos</CardTitle>
            <CardDescription>Contratos associados a este profissional.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Posição</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {editedProfessional.contracts?.length > 0 ? (
                  editedProfessional.contracts?.map((contract: any) => (
                    <TableRow key={contract.id}>
                      <TableCell>{contract.companyName}</TableCell>
                      <TableCell>{contract.position}</TableCell>
                      <TableCell>{new Date(contract.startDate).toLocaleDateString()} - {contract.endDate ? new Date(contract.endDate).toLocaleDateString() : 'Presente'}</TableCell>
                      <TableCell>
                        <Badge variant={contract.status === 'Active' ? 'default' : 'secondary'}>
                          {contract.status === 'Active' ? 'Ativo' : 'Terminado'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">Nenhum contrato encontrado.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

// ==============================================================================
// Componentes Reutilizáveis (inalterados)
// ==============================================================================
function InputBlock({ label, type = "text", value, onChange, error, disabled = false }: {
  label: string;
  value: any;
  onChange: (v: any) => void;
  type?: string;
  error?: string;
  disabled?: boolean;
}) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

function SelectBlock({ label, value, onChange, options, error }: {
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
          <SelectValue placeholder="Selecione uma opção">
            {options.find(opt => opt.id === value)?.label || "Selecione uma opção"}
          </SelectValue>
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
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

function MultiSelectPopover({ label, options, selectedIds, onChange }: {
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
            {selectedIds.length > 0
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
                  const newIds = selectedIds.includes(option.id)
                    ? selectedIds.filter((id) => id !== option.id)
                    : [...selectedIds, option.id];
                  onChange(newIds);
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
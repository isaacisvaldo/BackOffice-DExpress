import{ useState } from 'react';
import { CheckCircle, XCircle, Trash2 } from "lucide-react"; // Importar ícones para adicionar/remover
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


// --- Interfaces para Tipagem (baseadas no seu modelo Prisma) ---
interface Location {
  id: string;
  address: string;
  city: { id: string; name: string };
  district: { id: string; name: string };
}

interface Gender {
  id: string;
  label: string;
}

interface DesiredPosition {
  id: string;
  label: string;
}

interface MaritalStatus {
    id: string;
    label: string;
}

interface HighestDegree {
    id: string;
    label: string;
}

interface ExperienceLevel {
    id: string;
    label: string;
}

interface ProfessionalSkill {
    id: string;
    label: string;
}

interface ProfessionalLanguage {
    id: string;
    label: string;
}

interface ProfessionalCourse {
    id: string;
    label: string;
}

interface Contract {
    id: string;
    companyName: string;
    position: string;
    startDate: string;
    endDate?: string;
    status: 'Active' | 'Terminated';
}

interface ProfessionalData {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  identityNumber?: string;
  isAvailable: boolean;
  description?: string;
  expectedAvailability?: string;
  hasCriminalRecord: boolean;
  hasMedicalCertificate: boolean;
  hasTrainingCertificate: boolean;
  locationId: string;
  profileImage?: string;
  genderId: string;
  birthDate: string;
  hasChildren: boolean;
  knownDiseases?: string;
  expectedSalary: number;
  createdAt: string;
  updatedAt: string;
  jobApplicationId?: string;
  desiredPositionId: string;
  availabilityTypeId: string;
  experienceLevelId: string;
  maritalStatusId?: string;
  highestDegreeId?: string;

  desiredPosition?: DesiredPosition; // Tornar opcional, se pode não ter valor inicial
  gender?: Gender;
  location?: Location;
  experienceLevel: ExperienceLevel; // Tornar opcional, se pode não ter valor inicial
  maritalStatus: MaritalStatus; // Tornar opcional, se pode não ter valor inicial
  highestDegree: HighestDegree; // Tornar opcional, se pode não ter valor inicial
  professionalSkills: ProfessionalSkill[]; // Tornar opcional, se pode não ter valor inicial
  professionalLanguages: ProfessionalLanguage[]; // Tornar opcional, se pode não ter valor inicial
  professionalCourses: ProfessionalCourse[]; // Tornar opcional, se pode não ter valor inicial
  ProfessionalExperience: Array<{ id: string; description: string }>;

  contracts: Contract[]; // Tornar opcional, se pode não ter valor inicial
}

// --- Dados Mocados ---
const mockProfessional: ProfessionalData = {
  id: "prof_12345",
  fullName: "João Silva",
  email: "joao.silva@example.com",
  phoneNumber: "+244 912 345 678",
  identityNumber: "00112233XY001",
  isAvailable: true,
  description: "Desenvolvedor de software com 5 anos de experiência...",
  expectedAvailability: "2025-09-01T00:00:00Z",
  hasCriminalRecord: false,
  hasMedicalCertificate: true,
  hasTrainingCertificate: true,
  locationId: "loc_abc",
  profileImage: "https://randomuser.me/api/portraits/men/75.jpg",
  genderId: "gender_male",
  birthDate: "1990-05-15T00:00:00Z",
  hasChildren: true,
  knownDiseases: "Nenhuma",
  expectedSalary: 150000,
  createdAt: "2024-01-10T10:00:00Z",
  updatedAt: "2024-08-14T15:30:00Z",
  jobApplicationId: "app_789",
  desiredPositionId: "pos_dev",
  availabilityTypeId: "avail_full",
  experienceLevelId: "exp_mid",
  maritalStatusId: "marital_single",
  highestDegreeId: "deg_bachelor",

  desiredPosition: { id: "pos_dev", label: "Desenvolvedor Pleno" },
  gender: { id: "gender_male", label: "Masculino" },
  location: { 
    id: "loc_abc", 
    address: "Rua Exemplo, 123", 
    city: { id: "city_luanda", name: "Luanda" },
    district: { id: "dist_kilamba", name: "Kilamba" }
  },
  experienceLevel: { id: "exp_mid", label: "Médio" },
  maritalStatus: { id: "marital_single", label: "Solteiro(a)" },
  highestDegree: { id: "deg_bachelor", label: "Licenciatura" },
  professionalSkills: [
    { id: "skill_react", label: "React.js" },
    { id: "skill_node", label: "Node.js" },
    { id: "skill_sql", label: "SQL" },
  ],
  professionalLanguages: [
    { id: "lang_port", label: "Português" },
    { id: "lang_eng", label: "Inglês" },
  ],
  professionalCourses: [
    { id: "course_web", label: "Desenvolvimento Web Avançado" },
  ],
  ProfessionalExperience: [
    { id: "exp1", description: "Desenvolvedor Frontend na Empresa X (2020-2023)" },
    { id: "exp2", description: "Engenheiro de Software na Empresa Y (2023-Presente)" },
  ],
  contracts: [
      { id: "cont_001", companyName: "Empresa Inovadora S.A.", position: "Desenvolvedor Pleno", startDate: "2023-01-15", status: 'Active' },
      { id: "cont_002", companyName: "Tech Solutions Ltda.", position: "Desenvolvedor Júnior", startDate: "2020-03-01", endDate: "2022-12-31", status: 'Terminated' },
  ]
};

const mockGenders = [
    { id: "gender_male", label: "Masculino" },
    { id: "gender_female", label: "Feminino" },
    { id: "gender_other", label: "Outro" },
];

const mockDesiredPositions = [
    { id: "pos_dev", label: "Desenvolvedor Pleno" },
    { id: "pos_ux", label: "Designer UX/UI" },
    { id: "pos_qa", label: "Analista de QA" },
    { id: "pos_pm", label: "Gerente de Projeto" },
];

const mockExperienceLevels = [
    { id: "exp_junior", label: "Júnior" },
    { id: "exp_mid", label: "Médio" },
    { id: "exp_senior", label: "Sênior" },
];

const mockAvailableSkills = [
    { id: "skill_react", label: "React.js" },
    { id: "skill_node", label: "Node.js" },
    { id: "skill_sql", label: "SQL" },
    { id: "skill_aws", label: "AWS" },
    { id: "skill_docker", label: "Docker" },
    { id: "skill_figma", label: "Figma" },
];

const mockAvailableLanguages = [
    { id: "lang_port", label: "Português" },
    { id: "lang_eng", label: "Inglês" },
    { id: "lang_fra", label: "Francês" },
    { id: "lang_spa", label: "Espanhol" },
];


export default function ProfessionalContent() {
  const [profile, setProfile] = useState({
    name: mockProfessional.fullName,
    email: mockProfessional.email,
    phone: mockProfessional.phoneNumber,
    identityNumber: mockProfessional.identityNumber || '',
    birthDate: mockProfessional.birthDate.split('T')[0], 
    genderId: mockProfessional.genderId,
    // Note: profileLabel não será mais necessário diretamente para exibir a posição,
    // pois usaremos o state de desiredPositionId
    bio: mockProfessional.description || '',
    location: mockProfessional.location ? `${mockProfessional.location.address}, ${mockProfessional.location.district.name}, ${mockProfessional.location.city.name}` : 'N/A',
  });

  // Novos estados para a seção profissional
  const [currentDesiredPositionId, setCurrentDesiredPositionId] = useState(mockProfessional.desiredPositionId);
  const [currentExperienceLevelId, setCurrentExperienceLevelId] = useState(mockProfessional.experienceLevelId);
  const [currentProfessionalSkills, setCurrentProfessionalSkills] = useState(mockProfessional.professionalSkills || []);
  const [currentProfessionalLanguages, setCurrentProfessionalLanguages] = useState(mockProfessional.professionalLanguages || []);

  const availableGenders = mockGenders;

  // Filtra as habilidades que ainda não foram adicionadas pelo profissional
  const skillsToAdd = mockAvailableSkills.filter(
    (skill) => !currentProfessionalSkills.some((s) => s.id === skill.id)
  );

  // Filtra os idiomas que ainda não foram adicionados pelo profissional
  const languagesToAdd = mockAvailableLanguages.filter(
    (lang) => !currentProfessionalLanguages.some((l) => l.id === lang.id)
  );

  const handleProfileSubmit = () => {
    console.log("Perfil pessoal salvo:", profile);
    // Lógica para enviar dados pessoais para a API
  };
  
  const handleToggleAvailability = (isAvailable: boolean) => {
      console.log("Status de disponibilidade alterado para:", isAvailable);
      // Lógica para enviar o status de disponibilidade para a API
  };

  const handleProfessionalSubmit = () => {
    console.log("Perfil profissional salvo:", {
      desiredPositionId: currentDesiredPositionId,
      experienceLevelId: currentExperienceLevelId,
      professionalSkills: currentProfessionalSkills,
      professionalLanguages: currentProfessionalLanguages,
    });
    // Lógica para enviar dados profissionais para a API
  };

  const handleAddSkill = (skillId: string) => {
    const skill = mockAvailableSkills.find((s) => s.id === skillId);
    if (skill && !currentProfessionalSkills.some((s) => s.id === skill.id)) {
      setCurrentProfessionalSkills((prev) => [...prev, skill]);
    }
  };

  const handleRemoveSkill = (skillId: string) => {
    setCurrentProfessionalSkills((prev) => prev.filter((skill) => skill.id !== skillId));
  };

  const handleAddLanguage = (languageId: string) => {
    const language = mockAvailableLanguages.find((l) => l.id === languageId);
    if (language && !currentProfessionalLanguages.some((l) => l.id === language.id)) {
      setCurrentProfessionalLanguages((prev) => [...prev, language]);
    }
  };

  const handleRemoveLanguage = (languageId: string) => {
    setCurrentProfessionalLanguages((prev) => prev.filter((lang) => lang.id !== languageId));
  };


  return (
    <Tabs defaultValue="personal" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="personal">Pessoal</TabsTrigger>
        <TabsTrigger value="professional">Profissional</TabsTrigger>
        <TabsTrigger value="history">Histórico</TabsTrigger>
      </TabsList>

      <TabsContent value="personal">
        <Card>
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>Dados de perfil e identidade.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name" className="mb-2 block">Nome Completo</Label>
                <Input id="name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="email" className="mb-2 block">E-mail</Label>
                <Input id="email" type="email" value={profile.email} disabled />
              </div>
              <div>
                <Label htmlFor="phone" className="mb-2 block">Telefone</Label>
                <Input id="phone" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="identityNumber" className="mb-2 block">Número de Identidade</Label>
                <Input id="identityNumber" value={profile.identityNumber} disabled />
              </div>
              <div>
                <Label htmlFor="birthDate" className="mb-2 block">Data de Nascimento</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={profile.birthDate}
                  onChange={(e) => setProfile({ ...profile, birthDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="gender" className="mb-2 block">Gênero</Label>
                <Select
                  value={profile.genderId}
                  onValueChange={(value) => setProfile({ ...profile, genderId: value })}
                >
                  <SelectTrigger className="w-full border rounded-md px-2 py-2 bg-white">
                    <SelectValue placeholder="Selecione o gênero" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Gênero</SelectLabel>
                      {availableGenders.map((gender) => (
                        <SelectItem key={gender.id} value={gender.id}>
                          {gender.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="bio" className="mb-2 block">Biografia</Label>
              <Textarea id="bio" value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="location" className="mb-2 block">Localização</Label>
              <Input id="location" value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} />
            </div>
            <div className="flex flex-col md:flex-row justify-between text-sm text-muted-foreground">
              <span>Conta criada em: {new Date(mockProfessional.createdAt).toLocaleDateString()}</span>
              <span>Última atualização: {new Date(mockProfessional.updatedAt).toLocaleDateString()}</span>
            </div>
            <Button onClick={handleProfileSubmit}>Guardar Alterações</Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="professional">
        <Card>
          <CardHeader>
            <CardTitle>Detalhes Profissionais</CardTitle>
            <CardDescription>Atualize suas informações de carreira, habilidades e idiomas.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-between items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Label htmlFor="is-available" className="text-base">
                  Status de Disponibilidade:
                </Label>
                <Badge
                    variant={mockProfessional.isAvailable ? "default" : "destructive"}
                    className="flex items-center gap-2"
                >
                    {mockProfessional.isAvailable ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                    {mockProfessional.isAvailable ? "Disponível para trabalho" : "Não Disponível"}
                </Badge>
              </div>
              <Switch
                id="is-available"
                checked={mockProfessional.isAvailable}
                onCheckedChange={handleToggleAvailability}
              />
            </div>
            <Separator />
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="desired-position" className="mb-2 block">Posição Desejada</Label>
                <Select
                  value={currentDesiredPositionId}
                  onValueChange={setCurrentDesiredPositionId}
                >
                  <SelectTrigger className="w-full border rounded-md px-2 py-2 bg-white">
                    <SelectValue placeholder="Selecione a posição desejada" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Posições</SelectLabel>
                      {mockDesiredPositions.map((pos) => (
                        <SelectItem key={pos.id} value={pos.id}>
                          {pos.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="experience-level" className="mb-2 block">Nível de Experiência</Label>
                <Select
                  value={currentExperienceLevelId}
                  onValueChange={setCurrentExperienceLevelId}
                >
                  <SelectTrigger className="w-full border rounded-md px-2 py-2 bg-white">
                    <SelectValue placeholder="Selecione o nível de experiência" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Níveis</SelectLabel>
                      {mockExperienceLevels.map((level) => (
                        <SelectItem key={level.id} value={level.id}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-2 block">Habilidades</Label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {currentProfessionalSkills.length > 0 ? (
                    currentProfessionalSkills.map((skill) => (
                      <Badge key={skill.id} className="pr-1">
                        {skill.label}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-1 h-auto p-0"
                          onClick={() => handleRemoveSkill(skill.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">Nenhuma habilidade adicionada</p>
                  )}
                </div>
                <Select onValueChange={handleAddSkill} value=""> {/* Valor vazio para resetar o select */}
                  <SelectTrigger className="w-full border rounded-md px-2 py-2 bg-white">
                    <SelectValue placeholder="Adicionar nova habilidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Habilidades Disponíveis</SelectLabel>
                      {skillsToAdd.length > 0 ? (
                        skillsToAdd.map((skill) => (
                          <SelectItem key={skill.id} value={skill.id}>
                            {skill.label}
                          </SelectItem>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground p-2">Todas as habilidades foram adicionadas</p>
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-2 block">Idiomas</Label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {currentProfessionalLanguages.length > 0 ? (
                    currentProfessionalLanguages.map((lang) => (
                      <Badge key={lang.id} className="pr-1">
                        {lang.label}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-1 h-auto p-0"
                          onClick={() => handleRemoveLanguage(lang.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">Nenhum idioma adicionado</p>
                  )}
                </div>
                <Select onValueChange={handleAddLanguage} value=""> {/* Valor vazio para resetar o select */}
                  <SelectTrigger className="w-full border rounded-md px-2 py-2 bg-white">
                    <SelectValue placeholder="Adicionar novo idioma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Idiomas Disponíveis</SelectLabel>
                      {languagesToAdd.length > 0 ? (
                        languagesToAdd.map((lang) => (
                          <SelectItem key={lang.id} value={lang.id}>
                            {lang.label}
                          </SelectItem>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground p-2">Todos os idiomas foram adicionados</p>
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleProfessionalSubmit}>Guardar Alterações Profissionais</Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="history">
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Contratações</CardTitle>
            <CardDescription>Informações sobre contratos de trabalho e experiência.</CardDescription>
          </CardHeader>
          <CardContent>
            {mockProfessional.contracts?.length > 0 ? (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Empresa</TableHead>
                            <TableHead>Posição</TableHead>
                            <TableHead>Início</TableHead>
                            <TableHead>Fim</TableHead>
                            <TableHead className="text-right">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockProfessional.contracts.map((contract) => (
                            <TableRow key={contract.id}>
                                <TableCell className="font-medium">{contract.companyName}</TableCell>
                                <TableCell>{contract.position}</TableCell>
                                <TableCell>{new Date(contract.startDate).toLocaleDateString()}</TableCell>
                                <TableCell>{contract.endDate ? new Date(contract.endDate).toLocaleDateString() : 'Presente'}</TableCell>
                                <TableCell className="text-right">
                                    <Badge variant={contract.status === 'Active' ? "default" : "secondary"}>
                                        {contract.status === 'Active' ? 'Ativo' : 'Finalizado'}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            ) : (
                <p className="text-sm text-muted-foreground p-4">Nenhum histórico de contratações encontrado.</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
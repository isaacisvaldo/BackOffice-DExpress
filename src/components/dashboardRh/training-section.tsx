import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { ExportButton } from "@/components/ui/export-button";
import { prepareTrainingData } from "@/util/export-utils";
import { BookOpen, GraduationCap, Award, TrendingUp, Star } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export function TrainingSection() {
  const stats = [
    {
      title: "Treinamentos Concluídos",
      value: "342",
      change: { value: "+28% vs trimestre anterior", type: "increase" as const },
      icon: <GraduationCap className="h-4 w-4" />,
      variant: "success" as const,
    },
    {
      title: "Treinamentos em Andamento",
      value: "156",
      change: { value: "87 colaboradores envolvidos", type: "neutral" as const },
      icon: <BookOpen className="h-4 w-4" />,
      variant: "info" as const,
    },
    {
      title: "Avaliações Pendentes",
      value: "23",
      change: { value: "Vencimento próximo", type: "warning" as const },
      icon: <Star className="h-4 w-4" />,
      variant: "warning" as const,
    },
    {
      title: "Certificações Obtidas",
      value: "89",
      change: { value: "+45% este ano", type: "increase" as const },
      icon: <Award className="h-4 w-4" />,
      variant: "primary" as const,
    },
  ];

  const ongoingTrainings = [
    { training: "Gestão de Projetos", participants: 24, progress: 75, endDate: "15/11/2024", category: "gestao" },
    { training: "Segurança da Informação", participants: 156, progress: 45, endDate: "30/10/2024", category: "ti" },
    { training: "Atendimento ao Cliente", participants: 67, progress: 92, endDate: "08/10/2024", category: "vendas" },
    { training: "Liderança e Comunicação", participants: 12, progress: 28, endDate: "22/12/2024", category: "gestao" },
  ];

  const recentEvaluations = [
    { employee: "Ana Silva", position: "Designer", department: "Marketing", score: 4.8, date: "25/09/2024", status: "excelente" },
    { employee: "João Santos", position: "Desenvolvedor", department: "TI", score: 4.5, date: "22/09/2024", status: "bom" },
    { employee: "Maria Costa", position: "Analista", department: "RH", score: 4.9, date: "20/09/2024", status: "excelente" },
    { employee: "Pedro Lima", position: "Consultor", department: "Vendas", score: 4.2, date: "18/09/2024", status: "bom" },
  ];

  const skillsProgress = [
    { skill: "Liderança", level: 78, growth: "+12%" },
    { skill: "Comunicação", level: 85, growth: "+8%" },
    { skill: "Tecnologia", level: 72, growth: "+15%" },
    { skill: "Vendas", level: 69, growth: "+22%" },
    { skill: "Análise de Dados", level: 64, growth: "+18%" },
  ];

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "gestao":
        return <Badge variant="secondary" className="bg-primary/10 text-primary">Gestão</Badge>;
      case "ti":
        return <Badge variant="secondary" className="bg-info/10 text-info">TI</Badge>;
      case "vendas":
        return <Badge variant="secondary" className="bg-success/10 text-success">Vendas</Badge>;
      default:
        return <Badge variant="secondary">Geral</Badge>;
    }
  };

  const getScoreBadge = (status: string) => {
    switch (status) {
      case "excelente":
        return <Badge variant="secondary" className="bg-success/10 text-success">Excelente</Badge>;
      case "bom":
        return <Badge variant="secondary" className="bg-primary/10 text-primary">Bom</Badge>;
      case "regular":
        return <Badge variant="secondary" className="bg-warning/10 text-warning">Regular</Badge>;
      default:
        return <Badge variant="secondary">-</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Relatório de Formação e Avaliação"
        description="Treinamentos, avaliações de desempenho e desenvolvimento de competências"
        actions={
          <div className="flex gap-2">
            <ExportButton data={prepareTrainingData()} />
            <Button>
              <BookOpen className="h-4 w-4 mr-2" />
              Novo Treinamento
            </Button>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ongoing Trainings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-info" />
              Treinamentos em Andamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ongoingTrainings.map((training, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{training.training}</div>
                      <div className="text-sm text-muted-foreground">
                        {training.participants} participantes • {training.endDate}
                      </div>
                    </div>
                    {getCategoryBadge(training.category)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={training.progress} className="flex-1 h-2" />
                    <span className="text-sm text-muted-foreground">{training.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Evaluations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-warning" />
              Avaliações Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Colaborador</TableHead>
                  <TableHead>Pontuação</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentEvaluations.map((evaluation, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{evaluation.employee}</div>
                        <div className="text-sm text-muted-foreground">{evaluation.position}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-warning text-warning" />
                        <span className="font-medium">{evaluation.score}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getScoreBadge(evaluation.status)}
                    </TableCell>
                    <TableCell>{evaluation.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Skills Development */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-success" />
            Desenvolvimento de Competências
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {skillsProgress.map((skill, index) => (
              <div key={index} className="space-y-2 text-center">
                <div className="font-medium">{skill.skill}</div>
                <div className="relative w-16 h-16 mx-auto">
                  <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="hsl(var(--muted))"
                      strokeWidth="2"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="2"
                      strokeDasharray={`${skill.level}, 100`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-medium">{skill.level}%</span>
                  </div>
                </div>
                <div className="text-sm text-success">{skill.growth}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
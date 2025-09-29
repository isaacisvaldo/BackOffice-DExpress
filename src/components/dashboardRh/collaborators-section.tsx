import { useState } from "react";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { ExportButton } from "@/components/ui/export-button";
import { prepareCollaboratorsData } from "@/util/export-utils";
import { Users, UserPlus, UserMinus, Briefcase } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ProfessionalForm from "../profissional/profissionalForm";

export function CollaboratorsSection() {
  const [open, setOpen] = useState(false);

  const stats = [
    {
      title: "Total de Colaboradores",
      value: "1,247",
      change: { value: "+12% vs mês anterior", type: "increase" as const },
      icon: <Users className="h-4 w-4" />,
      variant: "primary" as const,
    },
    {
      title: "Novas Admissões",
      value: "23",
      change: { value: "+4 este mês", type: "increase" as const },
      icon: <UserPlus className="h-4 w-4" />,
      variant: "success" as const,
    },
    {
      title: "Desligamentos",
      value: "8",
      change: { value: "-2 vs mês anterior", type: "decrease" as const },
      icon: <UserMinus className="h-4 w-4" />,
      variant: "warning" as const,
    },
    {
      title: "Colaboradores Ativos",
      value: "1,216",
      change: { value: "97.5% da equipe", type: "neutral" as const },
      icon: <Briefcase className="h-4 w-4" />,
      variant: "info" as const,
    },
  ];

  const recentHires = [
    { name: "Ana Silva", department: "Marketing", position: "Designer", date: "28/09/2024", status: "ativo" },
    { name: "João Santos", department: "TI", position: "Desenvolvedor", date: "25/09/2024", status: "ativo" },
    { name: "Maria Costa", department: "RH", position: "Analista", date: "22/09/2024", status: "ativo" },
    { name: "Pedro Lima", department: "Vendas", position: "Consultor", date: "20/09/2024", status: "ativo" },
  ];

  const departmentStats = [
    { department: "TI", total: 156, percentage: 12.5 },
    { department: "Vendas", total: 234, percentage: 18.8 },
    { department: "Marketing", total: 89, percentage: 7.1 },
    { department: "RH", total: 45, percentage: 3.6 },
    { department: "Operações", total: 298, percentage: 23.9 },
    { department: "Financeiro", total: 78, percentage: 6.3 },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Relatório de Colaboradores"
        description="Visão geral dos colaboradores da empresa"
        actions={
          <div className="flex gap-2">
            <ExportButton data={prepareCollaboratorsData()} />

            {/* BOTÃO QUE ABRE MODAL */}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Novo Colaborador
                </Button>
              </DialogTrigger>
         <DialogContent className="w-[95vw] h-[95vh] max-w-none overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Novo Colaborador</DialogTitle>
                </DialogHeader>

                {/* FORMULÁRIO COMPLETO */}
                <ProfessionalForm
                  application={{} as any} // se não houver JobApplication inicial
                  onProfessionalCreated={() => setOpen(false)} // fecha modal ao criar
                />
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Admissões Recentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-success" />
              Admissões Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentHires.map((hire, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{hire.name}</TableCell>
                    <TableCell>{hire.department}</TableCell>
                    <TableCell>{hire.date}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-success/10 text-success">
                        {hire.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Distribuição por Departamento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              Distribuição por Departamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentStats.map((dept, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-medium">{dept.department}</span>
                    <span className="text-sm text-muted-foreground">{dept.total} colaboradores</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-hr-muted rounded-full h-2">
                      <div
                        className="bg-gradient-primary h-2 rounded-full"
                        style={{ width: `${dept.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">{dept.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

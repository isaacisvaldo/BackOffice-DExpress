import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { ExportButton } from "@/components/ui/export-button";
import { prepareVacationData } from "@/util/export-utils";
import { Calendar, Plane, Heart, Baby, UserMinus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export function VacationSection() {
  const stats = [
    {
      title: "Colaboradores em Férias",
      value: "87",
      change: { value: "7% da equipe", type: "neutral" as const },
      icon: <Plane className="h-4 w-4" />,
      variant: "info" as const,
    },
    {
      title: "Férias Vencidas",
      value: "34",
      change: { value: "Requer atenção", type: "warning" as const },
      icon: <Calendar className="h-4 w-4" />,
      variant: "warning" as const,
    },
    {
      title: "Licenças Médicas",
      value: "12",
      change: { value: "+3 este mês", type: "increase" as const },
      icon: <Heart className="h-4 w-4" />,
      variant: "destructive" as const,
    },
    {
      title: "Licenças Maternidade/Paternidade",
      value: "8",
      change: { value: "6 maternidade, 2 paternidade", type: "neutral" as const },
      icon: <Baby className="h-4 w-4" />,
      variant: "success" as const,
    },
  ];

  const currentVacations = [
    { name: "Carlos Mendes", department: "TI", startDate: "20/09/2024", endDate: "04/10/2024", days: 15, type: "ferias" },
    { name: "Luisa Fernandes", department: "Marketing", startDate: "25/09/2024", endDate: "02/10/2024", days: 8, type: "ferias" },
    { name: "Ana Costa", department: "RH", startDate: "15/09/2024", endDate: "15/12/2024", days: 90, type: "maternidade" },
    { name: "Ricardo Alves", department: "Vendas", startDate: "01/10/2024", endDate: "05/10/2024", days: 5, type: "medica" },
  ];

  const vacationBalance = [
    { department: "TI", totalDays: 1560, usedDays: 892, percentage: 57.2 },
    { department: "Vendas", totalDays: 2340, usedDays: 1458, percentage: 62.3 },
    { department: "Marketing", totalDays: 890, usedDays: 534, percentage: 60.0 },
    { department: "RH", totalDays: 450, usedDays: 267, percentage: 59.3 },
    { department: "Operações", totalDays: 2980, usedDays: 1789, percentage: 60.0 },
  ];

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "ferias":
        return <Badge variant="secondary" className="bg-primary/10 text-primary">Férias</Badge>;
      case "medica":
        return <Badge variant="secondary" className="bg-destructive/10 text-destructive">Médica</Badge>;
      case "maternidade":
        return <Badge variant="secondary" className="bg-success/10 text-success">Maternidade</Badge>;
      case "paternidade":
        return <Badge variant="secondary" className="bg-info/10 text-info">Paternidade</Badge>;
      default:
        return <Badge variant="secondary">Outro</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Relatório de Férias e Licenças"
        description="Gestão de férias, licenças médicas e outros afastamentos"
        actions={
          <div className="flex gap-2">
            <ExportButton data={prepareVacationData()} />
            <Button>
              <Calendar className="h-4 w-4 mr-2" />
              Agendar Férias
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
        {/* Current Vacations/Leaves */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserMinus className="h-5 w-5 text-warning" />
              Afastamentos Atuais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Colaborador</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Dias</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentVacations.map((vacation, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{vacation.name}</div>
                        <div className="text-sm text-muted-foreground">{vacation.department}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{vacation.startDate}</div>
                        <div className="text-muted-foreground">até {vacation.endDate}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getTypeBadge(vacation.type)}
                    </TableCell>
                    <TableCell className="font-medium">{vacation.days} dias</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Vacation Balance by Department */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plane className="h-5 w-5 text-primary" />
              Saldo de Férias por Departamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {vacationBalance.map((dept, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{dept.department}</span>
                    <div className="text-right">
                      <div className="font-medium">{dept.percentage.toFixed(1)}%</div>
                      <div className="text-sm text-muted-foreground">
                        {dept.usedDays}/{dept.totalDays} dias
                      </div>
                    </div>
                  </div>
                  <Progress value={dept.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
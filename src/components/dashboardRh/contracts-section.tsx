import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { ExportButton } from "@/components/ui/export-button";
import { prepareContractsData } from "@/util/export-utils";

import { FileText, FileCheck, FileClock, FileX } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export function ContractsSection() {
  const stats = [
    {
      title: "Contratos Ativos",
      value: "1,089",
      change: { value: "87.3% do total", type: "neutral" as const },
      icon: <FileCheck className="h-4 w-4" />,
      variant: "success" as const,
    },
    {
      title: "Próximos a Expirar",
      value: "47",
      change: { value: "Próximos 30 dias", type: "warning" as const },
      icon: <FileClock className="h-4 w-4" />,
      variant: "warning" as const,
    },
    {
      title: "Contratos Expirados",
      value: "12",
      change: { value: "Requer atenção", type: "decrease" as const },
      icon: <FileX className="h-4 w-4" />,
      variant: "destructive" as const,
    },
    {
      title: "Renovações este Mês",
      value: "34",
      change: { value: "+18% vs mês anterior", type: "increase" as const },
      icon: <FileText className="h-4 w-4" />,
      variant: "info" as const,
    },
  ];

  const expiringContracts = [
    { employee: "Carlos Mendes", department: "TI", type: "Efetivo", expiry: "15/10/2024", daysLeft: 16 },
    { employee: "Luisa Fernandes", department: "Marketing", type: "Temporário", expiry: "22/10/2024", daysLeft: 23 },
    { employee: "Ricardo Alves", department: "Vendas", type: "Estágio", expiry: "28/10/2024", daysLeft: 29 },
    { employee: "Sofia Oliveira", department: "RH", type: "Efetivo", expiry: "05/11/2024", daysLeft: 37 },
  ];

  const contractTypes = [
    { type: "Efetivo", count: 856, percentage: 78.5, color: "bg-primary" },
    { type: "Temporário", count: 134, percentage: 12.3, color: "bg-warning" },
    { type: "Estágio", count: 78, percentage: 7.2, color: "bg-info" },
    { type: "Freelance", count: 21, percentage: 1.9, color: "bg-accent" },
  ];

  const getStatusBadge = (daysLeft: number) => {
    if (daysLeft <= 15) return <Badge variant="destructive">Urgente</Badge>;
    if (daysLeft <= 30) return <Badge variant="secondary" className="bg-warning/10 text-warning">Atenção</Badge>;
    return <Badge variant="secondary" className="bg-success/10 text-success">Normal</Badge>;
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Relatório de Contratos"
        description="Gestão e controle de contratos de trabalho"
        actions={
          <div className="flex gap-2">
            <ExportButton data={prepareContractsData()} />
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              Novo Contrato
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
        {/* Expiring Contracts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileClock className="h-5 w-5 text-warning" />
              Contratos a Expirar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Colaborador</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Expira em</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expiringContracts.map((contract, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{contract.employee}</div>
                        <div className="text-sm text-muted-foreground">{contract.department}</div>
                      </div>
                    </TableCell>
                    <TableCell>{contract.type}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{contract.expiry}</div>
                        <div className="text-sm text-muted-foreground">{contract.daysLeft} dias</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(contract.daysLeft)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Contract Types Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Tipos de Contrato
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {contractTypes.map((type, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${type.color}`}></div>
                      <span className="font-medium">{type.type}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{type.count}</div>
                      <div className="text-sm text-muted-foreground">{type.percentage}%</div>
                    </div>
                  </div>
                  <Progress value={type.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
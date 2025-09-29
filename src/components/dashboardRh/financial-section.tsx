import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { ExportButton } from "@/components/ui/export-button";
import { prepareFinancialData } from "@/util/export-utils";
import { DollarSign, TrendingUp, PieChart, BarChart3, Calculator } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export function FinancialSection() {
  const stats = [
    {
      title: "Custo Total de Pessoal",
      value: "€2.3M",
      change: { value: "+8% vs trimestre anterior", type: "increase" as const },
      icon: <DollarSign className="h-4 w-4" />,
      variant: "primary" as const,
    },
    {
      title: "Salário Médio",
      value: "€1,847",
      change: { value: "+3.2% vs ano anterior", type: "increase" as const },
      icon: <Calculator className="h-4 w-4" />,
      variant: "info" as const,
    },
    {
      title: "Horas Extras",
      value: "€87k",
      change: { value: "+18% este mês", type: "warning" as const },
      icon: <TrendingUp className="h-4 w-4" />,
      variant: "warning" as const,
    },
    {
      title: "Benefícios",
      value: "€456k",
      change: { value: "19.8% do total", type: "neutral" as const },
      icon: <PieChart className="h-4 w-4" />,
      variant: "success" as const,
    },
  ];

  const departmentCosts = [
    { department: "TI", employees: 156, totalCost: 487600, avgSalary: 3125, percentage: 21.2 },
    { department: "Vendas", employees: 234, totalCost: 456780, avgSalary: 1952, percentage: 19.8 },
    { department: "Operações", employees: 298, totalCost: 523400, avgSalary: 1756, percentage: 22.7 },
    { department: "Marketing", employees: 89, totalCost: 234560, avgSalary: 2636, percentage: 10.2 },
    { department: "RH", employees: 45, totalCost: 156780, avgSalary: 3484, percentage: 6.8 },
    { department: "Financeiro", employees: 78, totalCost: 287650, avgSalary: 3688, percentage: 12.5 },
  ];

  const monthlyProjection = [
    { month: "Janeiro", projected: 2100000, actual: 2087000, variance: -0.6 },
    { month: "Fevereiro", projected: 2150000, actual: 2134000, variance: -0.7 },
    { month: "Março", projected: 2200000, actual: 2245000, variance: +2.0 },
    { month: "Abril", projected: 2180000, actual: 2198000, variance: +0.8 },
    { month: "Maio", projected: 2250000, actual: 2267000, variance: +0.8 },
  ];

  const benefitsBreakdown = [
    { benefit: "Seguro de Saúde", cost: 145600, percentage: 31.9 },
    { benefit: "Vale Refeição", cost: 98700, percentage: 21.6 },
    { benefit: "Seguro de Vida", cost: 67800, percentage: 14.9 },
    { benefit: "Formação", cost: 54300, percentage: 11.9 },
    { benefit: "Outros", cost: 89600, percentage: 19.7 },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getVarianceBadge = (variance: number) => {
    if (variance > 0) {
      return <Badge variant="secondary" className="bg-destructive/10 text-destructive">+{variance.toFixed(1)}%</Badge>;
    } else if (variance < 0) {
      return <Badge variant="secondary" className="bg-success/10 text-success">{variance.toFixed(1)}%</Badge>;
    }
    return <Badge variant="secondary">0%</Badge>;
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Relatório Financeiro"
        description="Custos de pessoal, folha de pagamento e análises financeiras"
        actions={
          <div className="flex gap-2">
            <ExportButton data={prepareFinancialData()} />
            <Button>
              <BarChart3 className="h-4 w-4 mr-2" />
              Análise Detalhada
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
        {/* Department Costs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              Custos por Departamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentCosts.map((dept, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{dept.department}</div>
                      <div className="text-sm text-muted-foreground">
                        {dept.employees} colaboradores • Média: {formatCurrency(dept.avgSalary)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(dept.totalCost)}</div>
                      <div className="text-sm text-muted-foreground">{dept.percentage}%</div>
                    </div>
                  </div>
                  <Progress value={dept.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Projections */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-success" />
              Projeções vs Realizado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mês</TableHead>
                  <TableHead>Projetado</TableHead>
                  <TableHead>Realizado</TableHead>
                  <TableHead>Variação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {monthlyProjection.map((month, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{month.month}</TableCell>
                    <TableCell>{formatCurrency(month.projected)}</TableCell>
                    <TableCell>{formatCurrency(month.actual)}</TableCell>
                    <TableCell>
                      {getVarianceBadge(month.variance)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Benefits Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-warning" />
            Análise de Benefícios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {benefitsBreakdown.map((benefit, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="font-medium text-sm">{benefit.benefit}</div>
                <div className="text-2xl font-bold text-foreground">
                  {formatCurrency(benefit.cost)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {benefit.percentage}% do total
                </div>
                <div className="w-full bg-hr-muted rounded-full h-2">
                  <div
                    className="bg-gradient-primary h-2 rounded-full"
                    style={{ width: `${benefit.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
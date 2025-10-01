import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { ExportButton } from "@/components/ui/export-button";
import { 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Clock,
  Calendar,
  DollarSign,
  Target,
  Award
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function IndicatorsOverview() {
  // Key performance indicators
  const kpis = [
    {
      title: "Total Colaboradores",
      value: "1,247",
      change: { value: "+12% vs mês anterior", type: "increase" as const },
      icon: <Users className="h-5 w-5" />,
      variant: "primary" as const,
    },
    {
      title: "Taxa de Retenção",
      value: "97.5%",
      change: { value: "+2.1% este ano", type: "increase" as const },
      icon: <Target className="h-5 w-5" />,
      variant: "success" as const,
    },
    {
      title: "Taxa de Presença",
      value: "94.2%",
      change: { value: "+1.8% vs mês anterior", type: "increase" as const },
      icon: <Clock className="h-5 w-5" />,
      variant: "info" as const,
    },
    {
      title: "Investimento em Formação",
      value: "€54.3k",
      change: { value: "+22% este trimestre", type: "increase" as const },
      icon: <Award className="h-5 w-5" />,
      variant: "warning" as const,
    },
  ];

  // Alerts and warnings
  const alerts = [
    {
      title: "Contratos a Expirar",
      count: 47,
      description: "Próximos 30 dias",
      severity: "warning" as const,
      action: "Revisar contratos",
    },
    {
      title: "Férias Vencidas", 
      count: 34,
      description: "Colaboradores com férias em atraso",
      severity: "warning" as const,
      action: "Agendar férias",
    },
    {
      title: "Avaliações Pendentes",
      count: 23,
      description: "Avaliações de desempenho atrasadas",
      severity: "info" as const,
      action: "Agendar avaliações",
    },
  ];

  // Department efficiency metrics
  const departmentMetrics = [
    { name: "TI", efficiency: 92, satisfaction: 4.7, headcount: 156 },
    { name: "Vendas", efficiency: 88, satisfaction: 4.3, headcount: 234 },
    { name: "Marketing", efficiency: 90, satisfaction: 4.5, headcount: 89 },
    { name: "Operações", efficiency: 85, satisfaction: 4.2, headcount: 298 },
    { name: "RH", efficiency: 94, satisfaction: 4.8, headcount: 45 },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "warning": return "text-warning";
      case "danger": return "text-destructive";
      case "info": return "text-info";
      default: return "text-muted-foreground";
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case "warning": return "bg-warning/10 border-warning/20";
      case "danger": return "bg-destructive/10 border-destructive/20";
      case "info": return "bg-info/10 border-info/20";
      default: return "bg-muted/10 border-border";
    }
  };

  const overviewExportData = {
    title: 'Indicadores Gerais RH',
    summary: {
      title: 'KPIs Principais',
      stats: kpis.map(kpi => ({ label: kpi.title, value: kpi.value }))
    },
    headers: ['Indicador', 'Valor', 'Variação'],
    data: kpis.map(kpi => [
      kpi.title,
      kpi.value,
      kpi.change.value
    ])
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Painel de Indicadores RH"
        description="Visão geral executiva dos principais indicadores de recursos humanos"
        actions={
          <div className="flex gap-2">
            <ExportButton data={overviewExportData} />
            <Button>
              <TrendingUp className="h-4 w-4 mr-2" />
              Dashboard Completo
            </Button>
          </div>
        }
      />

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <StatCard key={index} {...kpi} />
        ))}
      </div>

      {/* Alerts Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Alertas e Ações Necessárias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${getSeverityBg(alert.severity)}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{alert.title}</h4>
                  <span className={`text-2xl font-bold ${getSeverityColor(alert.severity)}`}>
                    {alert.count}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{alert.description}</p>
                <Button size="sm" variant="outline" className="w-full">
                  {alert.action}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Department Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-success" />
            Performance por Departamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {departmentMetrics.map((dept, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">{dept.name}</h4>
                    <p className="text-sm text-muted-foreground">{dept.headcount} colaboradores</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">Eficiência</div>
                        <div className="font-semibold">{dept.efficiency}%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">Satisfação</div>
                        <div className="font-semibold">{dept.satisfaction}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Eficiência</span>
                      <span>{dept.efficiency}%</span>
                    </div>
                    <Progress value={dept.efficiency} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Satisfação</span>
                      <span>{(dept.satisfaction * 20).toFixed(0)}%</span>
                    </div>
                    <Progress value={dept.satisfaction * 20} className="h-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="text-center p-4">
          <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
          <div className="text-2xl font-bold">87</div>
          <div className="text-sm text-muted-foreground">Em Férias</div>
        </Card>
        
        <Card className="text-center p-4">
          <Clock className="h-8 w-8 mx-auto mb-2 text-info" />
          <div className="text-2xl font-bold">1.2k</div>
          <div className="text-sm text-muted-foreground">Horas Extras</div>
        </Card>
        
        <Card className="text-center p-4">
          <Award className="h-8 w-8 mx-auto mb-2 text-success" />
          <div className="text-2xl font-bold">89</div>
          <div className="text-sm text-muted-foreground">Certificações</div>
        </Card>
        
        <Card className="text-center p-4">
          <DollarSign className="h-8 w-8 mx-auto mb-2 text-warning" />
          <div className="text-2xl font-bold">€2.3M</div>
          <div className="text-sm text-muted-foreground">Custo Total</div>
        </Card>
      </div>
    </div>
  );
}
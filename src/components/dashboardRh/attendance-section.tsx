import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { ExportButton } from "@/components/ui/export-button";
import { prepareAttendanceData } from "@/util/export-utils";
import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export function AttendanceSection() {
  const stats = [
    {
      title: "Taxa de Presença",
      value: "94.2%",
      change: { value: "+2.1% vs mês anterior", type: "increase" as const },
      icon: <CheckCircle className="h-4 w-4" />,
      variant: "success" as const,
    },
    {
      title: "Faltas Justificadas",
      value: "156",
      change: { value: "12.5% do total", type: "neutral" as const },
      icon: <Clock className="h-4 w-4" />,
      variant: "info" as const,
    },
    {
      title: "Faltas Injustificadas",
      value: "23",
      change: { value: "-34% vs mês anterior", type: "decrease" as const },
      icon: <XCircle className="h-4 w-4" />,
      variant: "warning" as const,
    },
    {
      title: "Horas Extras",
      value: "1,247h",
      change: { value: "+18% este mês", type: "increase" as const },
      icon: <AlertCircle className="h-4 w-4" />,
      variant: "primary" as const,
    },
  ];

  const attendanceToday = [
    { name: "Ana Silva", checkIn: "08:30", checkOut: "17:30", status: "presente", hours: "9h" },
    { name: "João Santos", checkIn: "09:00", checkOut: "-", status: "presente", hours: "6h 30m" },
    { name: "Maria Costa", checkIn: "-", checkOut: "-", status: "falta", hours: "0h" },
    { name: "Pedro Lima", checkIn: "08:45", checkOut: "18:00", status: "presente", hours: "9h 15m" },
  ];

  const weeklyAttendance = [
    { day: "Segunda", present: 1156, absent: 91, rate: 92.7 },
    { day: "Terça", present: 1189, absent: 58, rate: 95.3 },
    { day: "Quarta", present: 1167, absent: 80, rate: 93.6 },
    { day: "Quinta", present: 1201, absent: 46, rate: 96.3 },
    { day: "Sexta", present: 1134, absent: 113, rate: 90.9 },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "presente":
        return <Badge variant="secondary" className="bg-success/10 text-success">Presente</Badge>;
      case "falta":
        return <Badge variant="destructive">Falta</Badge>;
      case "atraso":
        return <Badge variant="secondary" className="bg-warning/10 text-warning">Atraso</Badge>;
      default:
        return <Badge variant="secondary">-</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Relatório de Frequência"
        description="Controle de presenças, faltas e horas trabalhadas"
        actions={
          <div className="flex gap-2">
            <ExportButton data={prepareAttendanceData()} />
            <Button>
              <Clock className="h-4 w-4 mr-2" />
              Registar Ponto
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
        {/* Today's Attendance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              Frequência de Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Colaborador</TableHead>
                  <TableHead>Entrada</TableHead>
                  <TableHead>Saída</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceToday.map((record, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{record.name}</div>
                        <div className="text-sm text-muted-foreground">{record.hours}</div>
                      </div>
                    </TableCell>
                    <TableCell>{record.checkIn || "-"}</TableCell>
                    <TableCell>{record.checkOut || "-"}</TableCell>
                    <TableCell>
                      {getStatusBadge(record.status)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Weekly Attendance Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Tendência Semanal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weeklyAttendance.map((day, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{day.day}</span>
                    <div className="text-right">
                      <div className="font-medium">{day.rate}%</div>
                      <div className="text-sm text-muted-foreground">
                        {day.present} presentes, {day.absent} faltas
                      </div>
                    </div>
                  </div>
                  <Progress value={day.rate} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
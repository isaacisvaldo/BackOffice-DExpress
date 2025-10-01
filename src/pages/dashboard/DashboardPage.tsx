
import { SectionCards } from "@/components/section-cards"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { ChartPieInteractive } from "@/components/ui/chart-pie-interactive"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ClientSegmentationCard from "./components/ClientSegmentationCard"

export default function DashboardPage() {





  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards />

          <div className="px-4 lg:px-6 flex-1">
            <ChartAreaInteractive />
          </div>

         
                {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Clients */}
        <div className="space-y-4">
              <ChartPieInteractive />
            </div>

        {/* Client Segments */}
          <ClientSegmentationCard 
              
                barHeightClass="h-12"
            />
      </div>

      {/* Alerts Card */}
      <Card>
        <CardHeader>
          <CardTitle>Alertas e Notificações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-warning/10 rounded-lg border border-warning/20">
              <div className="h-2 w-2 mt-2 rounded-full bg-warning" />
              <div className="flex-1">
                <p className="font-medium text-sm">Contratos a Renovar</p>
                <p className="text-sm text-muted-foreground">
                  47 contratos de clientes empresa vencem nos próximos 30 dias
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-primary/10 rounded-lg border border-primary/20">
              <div className="h-2 w-2 mt-2 rounded-full bg-primary" />
              <div className="flex-1">
                <p className="font-medium text-sm">Novos Cadastros</p>
                <p className="text-sm text-muted-foreground">
                  23 novos clientes cadastrados nos últimos 7 dias
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-accent/10 rounded-lg border border-accent/20">
              <div className="h-2 w-2 mt-2 rounded-full bg-accent" />
              <div className="flex-1">
                <p className="font-medium text-sm">Oportunidades de Upgrade</p>
                <p className="text-sm text-muted-foreground">
                  156 clientes elegíveis para upgrade de plano
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
          </div>
        </div>
      </div>
 
  )
}

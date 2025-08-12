import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState, useEffect } from 'react'; // Importa os hooks necessários
import { getDashboardSummary } from "@/services/dasboard/dasboardService";

// Adicione um componente de placeholder para o estado de carregamento
function CardPlaceholder() {
  return (
    <Card className="@container/card animate-pulse">
      <CardHeader>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-3/4 mb-2"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md w-1/2"></div>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-2/3"></div>
      </CardFooter>
    </Card>
  );
}

export function SectionCards() {
  const [dashboardData, setDashboardData] = useState({
    professionals: 0,
    clients: 0,
    activeServices: 0,
    cancellations: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        const data = await getDashboardSummary();
        setDashboardData({
          professionals: data.totalProfessionals,
          clients: data.totalClients,
          activeServices: data.activeServices,
          cancellations: data.canceledRequests,
        });
      } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);


  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        <CardPlaceholder />
        <CardPlaceholder />
        <CardPlaceholder />
        <CardPlaceholder />
      </div>
    );
  }

  // Se os dados estiverem prontos, renderiza os cards
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">

      {/* Profissionais cadastrados */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Profissionais Cadastrados</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {dashboardData.professionals}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +8.2%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Crescimento constante <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Novos profissionais entrando semanalmente
          </div>
        </CardFooter>
      </Card>

      {/* Famílias/clientes cadastrados */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Base de Clientes</CardDescription> {/* Título mais genérico */}
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {dashboardData.clients} {/* Usa a soma total de clientes */}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +12%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Mais clientes estão contratando <IconTrendingUp className="size-4" /> {/* Mensagem também genérica */}
          </div>
          <div className="text-muted-foreground">
            Base de clientes em crescimento
          </div>
        </CardFooter>
      </Card>

      {/* Serviços em andamento */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Serviços em Andamento</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {dashboardData.activeServices}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Mais contratações concluídas <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Taxa de conclusão de serviços acima de 90%
          </div>
        </CardFooter>
      </Card>

      {/* Cancelamentos ou alertas */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Solicitações Canceladas</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {dashboardData.cancellations}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingDown />
              -3.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Cancelamentos reduziram <IconTrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Melhor performance de atendimento este mês
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
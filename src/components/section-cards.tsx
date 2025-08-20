import { useState, useEffect } from 'react';
import { getDashboardSummary } from "@/services/dasboard/dasboard.service";
import { IconTrendingUp, IconTrendingDown } from "@tabler/icons-react";
import { GenericCard } from './ui/generic-card';
import { CardPlaceholder } from './ui/card-placeholder';



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


  const cardsData = [
    {
      title: "Profissionais Cadastrados",
      value: dashboardData.professionals,
      badgeText: "+8.2%",
      badgeIcon: IconTrendingUp, 
      footerText: "Crescimento constante",
      footerDetail: "Novos profissionais entrando semanalmente",
      footerIcon: IconTrendingUp 
    },
    {
      title: "Base de Clientes",
      value: dashboardData.clients,
      badgeText: "+12%",
      badgeIcon: IconTrendingUp,
      footerText: "Mais clientes estão contratando",
      footerDetail: "Base de clientes em crescimento",
      footerIcon: IconTrendingUp
    },
    {
      title: "Serviços em Andamento",
      value: dashboardData.activeServices,
      badgeText: "+5%",
      badgeIcon: IconTrendingUp,
      footerText: "Mais contratações concluídas",
      footerDetail: "Taxa de conclusão de serviços acima de 90%",
      footerIcon: IconTrendingUp
    },
    {
      title: "Solicitações de Seriços Canceladas",
      value: dashboardData.cancellations,
      badgeText: "-3.5%",
      badgeIcon: IconTrendingDown,
      footerText: "Cancelamentos reduziram",
      footerDetail: "Melhor performance de atendimento este mês",
      footerIcon: IconTrendingDown
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      
      {cardsData.map((card, index) => (
        <GenericCard key={index} {...card} />
      ))}
    </div>
  );
}
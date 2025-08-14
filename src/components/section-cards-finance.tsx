import { useState, useEffect } from 'react';
import { GenericCard } from './ui/generic-card';
import { CardPlaceholder } from './ui/card-placeholder';
import {
  IconPigMoney,
  IconWallet,
  IconReceipt2,
  IconChartLine,
 
  IconTrendingUp,
} from "@tabler/icons-react";

// Mock de dados da API de finanças
// Esses dados seriam, na vida real, buscados de um backend
const mockFinanceData = {
  totalRevenue: 150000.50,
  monthlyExpenses: 45000.75,
  netProfit: 105000.75,
  activeProjects: 25,
  totalTransactions: 300,
};

export function SectionCardsFinance() {
  const [financeData, ] = useState(mockFinanceData);
  const [loading, setLoading] = useState(true);

  // Simula a chamada da API com um delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      // Aqui você poderia buscar dados reais em um ambiente de produção
      // setFinanceData(await getFinanceDashboardSummary());
    }, 1000); 

    return () => clearTimeout(timer);
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
      title: "Receita Total",
      value: ` ${financeData.totalRevenue.toFixed(2)} Kz`,
      badgeText: "+15%",
      badgeIcon: IconTrendingUp,
      footerText: "Meta de receita do ano:  250.000 kz",
      footerDetail: "Receita bruta do ano até o momento",
      footerIcon: IconChartLine,
    },
    {
    title: "Ticket Médio",
    value: `${(financeData.totalRevenue / financeData.totalTransactions).toFixed(2)} Kz`,
    badgeText: "+3%",
    badgeIcon: IconTrendingUp,
    footerText: "Valor médio por cliente",
    footerDetail: "Estratégias de up-selling em andamento",
    footerIcon: IconReceipt2,
  },
    {
      title: "Lucro Líquido",
      value: ` ${financeData.netProfit.toFixed(2)} kz`,
      badgeText: "+10%",
      badgeIcon: IconTrendingUp,
      footerText: "Performance sólida",
      footerDetail: "Investimentos em alta",
      footerIcon: IconPigMoney,
    },
    {
      title: "Projetos Ativos",
      value: financeData.activeProjects,
      badgeText: "3 novos projetos",
      badgeIcon: IconTrendingUp,
      footerText: "Aumento na demanda",
      footerDetail: "Novos projetos em andamento",
      footerIcon: IconWallet,
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
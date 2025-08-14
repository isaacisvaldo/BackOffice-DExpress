import SwirlingEffectSpinner from "@/components/customized/spinner/spinner-06";
import { DataTable } from "@/components/data-table";
import { SectionCardsFinance } from "@/components/section-cards-finance";
import { ChartBarInteractive } from "@/components/ui/chart-bar-interactive";
import { ListCardGeneric } from "@/components/ui/generic-card-with-list";
import { useState } from "react";

export default function DashboardFinancial() {
  const [loading, setLoading] = useState(false);
  const users = [
    {
      title: "João Silva",
      subtitle: "joao.silva@email.com",
      avatarUrl: "https://github.com/shadcn.png",
      trailingContent: "Admin",
    },
    {
      title: "João Silva",
      subtitle: "joao.silva@email.com",
      avatarUrl: "https://github.com/shadcn.png",
      trailingContent: "Admin",
    },
    {
      title: "João Silva",
      subtitle: "joao.silva@email.com",
      avatarUrl: "https://github.com/shadcn.png",
      trailingContent: "Admin",
    },
      {
      title: "João Silva",
      subtitle: "joao.silva@email.com",
      avatarUrl: "https://github.com/shadcn.png",
      trailingContent: "Admin",
    },

  ];
  const products = [
    {
      title: "Monitor 27''",
      subtitle: "Eletrônicos",
      avatarUrl: "/images/monitor.png",
      trailingContent: "R$ 1.250",
    },
        {
      title: "Monitor 27''",
      subtitle: "Eletrônicos",
      avatarUrl: "/images/monitor.png",
      trailingContent: "R$ 1.250",
    },
    {
      title: "Teclado Mecânico",
      subtitle: "Periféricos",
      avatarUrl: "/images/keyboard.png",
      trailingContent: "R$ 450",
    },
    {
      title: "Teclado Mecânico",
      subtitle: "Periféricos",
      avatarUrl: "/images/keyboard.png",
      trailingContent: "R$ 450",
    },
  
  ];
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Este componente permanece no topo */}
          <SectionCardsFinance />

          {/* E o gráfico */}
          <div className="px-4 lg:px-6 flex-1">
            <ChartBarInteractive />
          </div>

          {/* --- */}

          {/* Container principal para a tabela e os cards */}
          <div className="px-4 lg:px-6 flex flex-col md:flex-row gap-4">

            {/* Container para a Tabela */}
            <div className="md:w-3/4"> 
              <h3 className="text-xl font-semibold mb-4">Histórico das Transações</h3>
              <p className="text-sm text-gray-500 mb-4">
                Visão geral das últimas transações financeiras.
              </p>
              {loading ? (
                <div className="flex justify-center items-center py-10">
                  <SwirlingEffectSpinner />
                </div>
              ) : (

                <div className="flex-[2] min-w-[450px]">
                  <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-4 h-[600px] flex flex-col">
                    <div className="flex-1 overflow-y-auto">
                      <DataTable
                        columns={[]}
                        data={[]}
                        page={0}
                        setPage={() => 0}
                        totalPages={0}
                        limit={0}
                        setLimit={() => 0}
                        filters={[]}
                      />
                    </div>
                  </div>
                </div>

              )}
            </div>

            {/* Container para os Cards */}
            {/* Este flex-1 fará com que os cards ocupem o espaço restante */}
            <div className="flex-1 flex flex-col gap-4">
              <ListCardGeneric
                title="Pagamentos Agendados"
                description="Agosto 2025"
                items={users}
              />
              <ListCardGeneric
                title="Pagamentos Recentes"
                description="Últimos 30 dias."
                items={products}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
"use client"

import * as React from "react"
import { Label, Pie, PieChart, Sector } from "recharts"
import type { PieSectorDataItem } from "recharts/types/polar/Pie"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const description = "An interactive pie chart for company sectors"

// Dados estáticos de exemplo que serão usados até que a API esteja pronta.
const chartDataStatic = [
  { sector: "Tecnologia", companies: 350, fill: "var(--chart-1)" },
  { sector: "Construção", companies: 280, fill: "var(--chart-2)" },
  { sector: "Saúde", companies: 150, fill: "var(--chart-3)" },
  { sector: "Varejo", companies: 420, fill: "var(--chart-4)" },
  { sector: "Serviços", companies: 200, fill: "var(--chart-5)" },
]

const chartConfig = {
  companies: {
    label: "Empresas",
  },
  Tecnologia: {
    label: "Tecnologia",
    color: "var(--chart-1)",
  },
  Construção: {
    label: "Construção",
    color: "var(--chart-2)",
  },
  Saúde: {
    label: "Saúde",
    color: "var(--chart-3)",
  },
  Varejo: {
    label: "Varejo",
    color: "var(--chart-4)",
  },
  Serviços: {
    label: "Serviços",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig

// Componente para exibir um placeholder de carregamento
function ChartPlaceholder() {
  return (
    <Card className="animate-pulse pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          <div className="h-4 w-72 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
        </div>
        <div className="hidden w-[160px] h-10 bg-gray-200 dark:bg-gray-700 rounded-lg sm:ml-auto sm:flex"></div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <div className="h-[250px] w-full bg-gray-200 dark:bg-gray-700 rounded-md"></div>
      </CardContent>
    </Card>
  );
}

export function ChartPieInteractive() {
  const id = "pie-interactive-companies"
  const [chartData, setChartData] = React.useState(chartDataStatic);
  const [loading, setLoading] = React.useState(false);
  const [activeSector, setActiveSector] = React.useState(chartDataStatic[0].sector);
  
  // Comentário: Quando sua rota de API estiver pronta, você pode descomentar
  // o código abaixo para carregar os dados dinamicamente.
  /*
  React.useEffect(() => {
    async function fetchChartData() {
      try {
        setLoading(true);
        // ✨ Descomente e ajuste esta URL para a sua rota de API real
        // const response = await fetch(`/api/dashboard/companies-by-sector`);
        
        // if (!response.ok) {
        //   throw new Error('Falha ao buscar dados do gráfico.');
        // }
        //
        // const data = await response.json();
        // setChartData(data);
        // // Opcional: define o primeiro item como ativo por padrão
        // if (data.length > 0) {
        //   setActiveSector(data[0].sector);
        // }
      } catch (error) {
        console.error("Erro ao buscar dados do gráfico:", error);
        setChartData([]);
      } finally {
        setLoading(false);
      }
    }
    fetchChartData();
  }, []);
  */
  
  const activeIndex = React.useMemo(
    () => chartData.findIndex((item) => item.sector === activeSector),
    [activeSector, chartData]
  )
  const sectors = React.useMemo(() => chartData.map((item) => item.sector), [chartData])

  if (loading) {
    return <ChartPlaceholder />;
  }

  return (
    <Card data-chart={id} className="flex flex-col">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>Empresas por Setor</CardTitle>
          <CardDescription>
            Distribuição de empresas que adquiriram nossos serviços.
          </CardDescription>
        </div>
        <Select value={activeSector} onValueChange={setActiveSector}>
          <SelectTrigger
            className="ml-auto h-7 w-[160px] rounded-lg pl-2.5"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Selecione um setor" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {sectors.map((key) => {
              const config = chartConfig[key as keyof typeof chartConfig]

              if (!config) {
                return null
              }

              return (
                <SelectItem
                  key={key}
                  value={key}
                  className="rounded-lg [&_span]:flex"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className="flex h-3 w-3 shrink-0 rounded-xs"
                      style={{
                        backgroundColor: `var(--color-${key.replace(/\s+/g, '')})`,
                      }}
                    />
                    {config?.label}
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer
          id={id}
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="companies"
              nameKey="sector"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={activeIndex}
              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 10} />
                  <Sector
                    {...props}
                    outerRadius={outerRadius + 25}
                    innerRadius={outerRadius + 12}
                  />
                </g>
              )}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {chartData[activeIndex].companies.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Empresas
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
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
import { getCompaniesBySector, type ICompaniesBySector } from "@/services/dasboard/dasboard.service"
import { CardPlaceholder } from "./card-placeholder"


export const description = "An interactive pie chart for company sectors"

interface BackendChartDataItem {
  sector: string;
  companies: number;
}

interface FormattedChartDataItem extends BackendChartDataItem {
  fill: string;
}

const colorPalette = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
  "var(--chart-7)",
  "var(--chart-8)",
];

function formatChartData(data: ICompaniesBySector[]): FormattedChartDataItem[] {
  return data.map((item, index) => ({
    ...item,
    fill: colorPalette[index % colorPalette.length],
  }));
}

const chartConfig = {
  companies: {
    label: "Empresas",
  },
} satisfies ChartConfig;


export function ChartPieInteractive() {
  const id = "pie-interactive-companies"
  // --- 1. DECLARAÇÃO DE TODOS OS HOOKS PRIMEIRO ---
  const [chartData, setChartData] = React.useState<FormattedChartDataItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activeSector, setActiveSector] = React.useState("");
  const [currentChartConfig, setCurrentChartConfig] = React.useState<ChartConfig>(chartConfig);

  React.useEffect(() => {
    async function fetchChartData() {
      try {
        const response = await getCompaniesBySector();

        if (!response.success || !response.data) {
          throw new Error('Falha ao buscar dados do gráfico: Resposta inválida.');
        }

        const backendData: ICompaniesBySector[] = response.data;

        const formattedData = formatChartData(backendData);
        setChartData(formattedData);

        const dynamicChartConfig: ChartConfig = { companies: { label: "Empresas" } };
        formattedData.forEach(item => {
          dynamicChartConfig[item.sector as keyof ChartConfig] = {
            label: item.sector,
            color: item.fill,
          };
        });
        setCurrentChartConfig(dynamicChartConfig);

        if (formattedData.length > 0) {
          setActiveSector(formattedData[0].sector);
        }
      } catch (error) {
        console.error("Erro ao buscar dados do gráfico:", error);
        setChartData([]);
        setActiveSector("");
      } finally {
        setLoading(false);
      }
    }
    fetchChartData();
  }, []);

  const activeIndex = React.useMemo(
    () => chartData.findIndex((item) => item.sector === activeSector),
    [activeSector, chartData]
  )
  const sectors = React.useMemo(() => chartData.map((item) => item.sector), [chartData])

  // --- 2. RENDERIZAÇÃO CONDICIONAL APÓS TODOS OS HOOKS ---
  // A partir daqui, a ordem não importa mais.
  if (loading) {
    return <CardPlaceholder />
  }

  if (chartData.length === 0) {
    return (
      <Card data-chart={id} className="flex flex-col">
        <CardHeader>
          <CardTitle>Empresas por Setor</CardTitle>
          <CardDescription>
            Não foi possível carregar os dados das empresas por setor.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 items-center justify-center p-6">
          <p className="text-muted-foreground">Nenhum dado disponível.</p>
        </CardContent>
      </Card>
    );
  }

  const currentActiveData = activeIndex !== -1 ? chartData[activeIndex] : null;

  return (
    <Card data-chart={id} className="flex flex-col">
      <ChartStyle id={id} config={currentChartConfig} />
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
              const config = currentChartConfig[key as keyof typeof currentChartConfig]

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
                        backgroundColor: config?.color,
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
          config={currentChartConfig}
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
                  if (viewBox && "cx" in viewBox && "cy" in viewBox && currentActiveData) {
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
                          {currentActiveData.companies.toLocaleString()}
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
"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
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
  ChartLegend,
  ChartLegendContent,
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
import { getGrowthData, type IGrowthData } from "@/services/dasboard/dasboard.service"

export const description = "An interactive area chart"

const chartConfig = {
  cadastros: {
    label: "Cadastros",
  },
  profissionais: {
    label: "Profissionais",
    color: "var(--chart-1)",
  },
  clientes_fisica: {
    label: "Clientes (Pessoa Física)",
    color: "var(--chart-2)",
  },
  clientes_empresa: {
    label: "Clientes (Empresa)",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const [timeRange, setTimeRange] = React.useState("90d")
  const [chartData, setChartData] = React.useState<IGrowthData[]>([]);
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    async function fetchChartData() {
      setLoading(true)

      try {
        const data = await getGrowthData(timeRange);

        if (data && data.data) {
          setChartData(data.data);
        } else {
          setChartData([]);
        }

      } catch (error) {
        console.error("Erro ao buscar dados do gráfico:", error);
        setChartData([]);
      } finally {
        setLoading(false);
      }
    }

    fetchChartData()
  }, [timeRange])

  const dataForChart = chartData
   if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 space-y-0 py-5 sm:flex-row">
          <div className="grid flex-1 gap-1">
            <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
            <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
          </div>
          <div className="h-10 w-[160px] bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"></div>
        </div>
        <div className="w-full h-[250px] bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"></div>
      </Card>
    );
  }

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Novos Cadastros</CardTitle>
          <CardDescription>
            Evolução diária de novos profissionais e clientes.
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Últimos 3 meses" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Últimos 3 meses
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Últimos 30 dias
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Últimos 7 dias
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={dataForChart}>
            <defs>
              <linearGradient id="fillProfissionais" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-profissionais)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-profissionais)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              {/* Adicionado gradiente para clientes_fisica */}
              <linearGradient id="fillClientesFisica" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-clientes_fisica)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-clientes_fisica)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              {/* Adicionado gradiente para clientes_empresa */}
              <linearGradient id="fillClientesEmpresa" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-clientes_empresa)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-clientes_empresa)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("pt-BR", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("pt-BR", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
           
            <Area
              dataKey="clientes_fisica"
              type="natural"
              fill="url(#fillClientesFisica)" // Referencia o novo gradiente
              stroke="var(--color-clientes_fisica)"
              stackId="a"
            />
            {/* Area para clientes_empresa */}
            <Area
              dataKey="clientes_empresa"
              type="natural"
              fill="url(#fillClientesEmpresa)" // Referencia o novo gradiente
              stroke="var(--color-clientes_empresa)"
              stackId="a"
            />
            {/* Area para profissionais */}
            <Area
              dataKey="profissionais"
              type="natural"
              fill="url(#fillProfissionais)"
              stroke="var(--color-profissionais)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
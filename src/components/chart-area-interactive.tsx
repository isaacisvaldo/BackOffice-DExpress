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

export const description = "An interactive area chart"

// Dados estáticos de exemplo.
// Eles serão usados para renderizar o gráfico até que a API esteja pronta.
const chartDataStatic = [
  { date: "2024-04-01", profissionais: 5, clientes: 3 },
  { date: "2024-04-02", profissionais: 8, clientes: 6 },
  { date: "2024-04-03", profissionais: 12, clientes: 9 },
  { date: "2024-04-04", profissionais: 10, clientes: 7 },
  { date: "2024-04-05", profissionais: 15, clientes: 11 },
  { date: "2024-04-06", profissionais: 13, clientes: 8 },
  { date: "2024-04-07", profissionais: 18, clientes: 14 },
  { date: "2024-04-08", profissionais: 22, clientes: 16 },
  { date: "2024-04-09", profissionais: 9, clientes: 5 },
  { date: "2024-04-10", profissionais: 14, clientes: 10 },
  { date: "2024-04-11", profissionais: 17, clientes: 13 },
  { date: "2024-04-12", profissionais: 20, clientes: 15 },
  { date: "2024-04-13", profissionais: 25, clientes: 18 },
  { date: "2024-04-14", profissionais: 11, clientes: 7 },
  { date: "2024-04-15", profissionais: 16, clientes: 12 },
  { date: "2024-04-16", profissionais: 19, clientes: 14 },
  { date: "2024-04-17", profissionais: 28, clientes: 20 },
  { date: "2024-04-18", profissionais: 30, clientes: 22 },
  { date: "2024-04-19", profissionais: 23, clientes: 17 },
  { date: "2024-04-20", profissionais: 12, clientes: 9 },
  { date: "2024-04-21", profissionais: 15, clientes: 11 },
  { date: "2024-04-22", profissionais: 21, clientes: 16 },
  { date: "2024-04-23", profissionais: 17, clientes: 13 },
  { date: "2024-04-24", profissionais: 24, clientes: 19 },
  { date: "2024-04-25", profissionais: 26, clientes: 21 },
  { date: "2024-04-26", profissionais: 10, clientes: 8 },
  { date: "2024-04-27", profissionais: 35, clientes: 28 },
  { date: "2024-04-28", profissionais: 18, clientes: 13 },
  { date: "2024-04-29", profissionais: 29, clientes: 22 },
  { date: "2024-04-30", profissionais: 38, clientes: 30 },
  { date: "2024-05-01", profissionais: 20, clientes: 15 },
  { date: "2024-05-02", profissionais: 28, clientes: 21 },
  { date: "2024-05-03", profissionais: 22, clientes: 16 },
  { date: "2024-05-04", profissionais: 33, clientes: 25 },
  { date: "2024-05-05", profissionais: 40, clientes: 32 },
  { date: "2024-05-06", profissionais: 42, clientes: 34 },
  { date: "2024-05-07", profissionais: 36, clientes: 29 },
  { date: "2024-05-08", profissionais: 18, clientes: 14 },
  { date: "2024-05-09", profissionais: 25, clientes: 19 },
  { date: "2024-05-10", profissionais: 30, clientes: 23 },
  { date: "2024-05-11", profissionais: 32, clientes: 26 },
  { date: "2024-05-12", profissionais: 21, clientes: 17 },
  { date: "2024-05-13", profissionais: 23, clientes: 18 },
  { date: "2024-05-14", profissionais: 45, clientes: 35 },
  { date: "2024-05-15", profissionais: 48, clientes: 38 },
  { date: "2024-05-16", profissionais: 35, clientes: 27 },
  { date: "2024-05-17", profissionais: 50, clientes: 40 },
  { date: "2024-05-18", profissionais: 32, clientes: 25 },
  { date: "2024-05-19", profissionais: 25, clientes: 19 },
  { date: "2024-05-20", profissionais: 19, clientes: 15 },
  { date: "2024-05-21", profissionais: 11, clientes: 8 },
  { date: "2024-05-22", profissionais: 10, clientes: 7 },
  { date: "2024-05-23", profissionais: 28, clientes: 21 },
  { date: "2024-05-24", profissionais: 31, clientes: 24 },
  { date: "2024-05-25", profissionais: 22, clientes: 17 },
  { date: "2024-05-26", profissionais: 24, clientes: 18 },
  { date: "2024-05-27", profissionais: 45, clientes: 36 },
  { date: "2024-05-28", profissionais: 26, clientes: 20 },
  { date: "2024-05-29", profissionais: 10, clientes: 8 },
  { date: "2024-05-30", profissionais: 34, clientes: 27 },
  { date: "2024-05-31", profissionais: 20, clientes: 16 },
  { date: "2024-06-01", profissionais: 20, clientes: 15 },
  { date: "2024-06-02", profissionais: 48, clientes: 39 },
  { date: "2024-06-03", profissionais: 12, clientes: 9 },
  { date: "2024-06-04", profissionais: 44, clientes: 35 },
  { date: "2024-06-05", profissionais: 11, clientes: 8 },
  { date: "2024-06-06", profissionais: 30, clientes: 23 },
  { date: "2024-06-07", profissionais: 35, clientes: 28 },
  { date: "2024-06-08", profissionais: 39, clientes: 31 },
  { date: "2024-06-09", profissionais: 44, clientes: 36 },
  { date: "2024-06-10", profissionais: 18, clientes: 14 },
  { date: "2024-06-11", profissionais: 12, clientes: 9 },
  { date: "2024-06-12", profissionais: 50, clientes: 41 },
  { date: "2024-06-13", profissionais: 10, clientes: 7 },
  { date: "2024-06-14", profissionais: 43, clientes: 34 },
  { date: "2024-06-15", profissionais: 31, clientes: 25 },
  { date: "2024-06-16", profissionais: 38, clientes: 30 },
  { date: "2024-06-17", profissionais: 48, clientes: 39 },
  { date: "2024-06-18", profissionais: 13, clientes: 10 },
  { date: "2024-06-19", profissionais: 34, clientes: 27 },
  { date: "2024-06-20", profissionais: 41, clientes: 32 },
  { date: "2024-06-21", profissionais: 18, clientes: 14 },
  { date: "2024-06-22", profissionais: 32, clientes: 25 },
  { date: "2024-06-23", profissionais: 48, clientes: 38 },
  { date: "2024-06-24", profissionais: 14, clientes: 11 },
  { date: "2024-06-25", profissionais: 15, clientes: 12 },
  { date: "2024-06-26", profissionais: 44, clientes: 35 },
  { date: "2024-06-27", profissionais: 45, clientes: 36 },
  { date: "2024-06-28", profissionais: 16, clientes: 13 },
  { date: "2024-06-29", profissionais: 12, clientes: 9 },
  { date: "2024-06-30", profissionais: 45, clientes: 37 },
];

const chartConfig = {
  cadastros: {
    label: "Cadastros",
  },
  profissionais: {
    label: "Profissionais",
    color: "var(--chart-1)",
  },
  clientes: {
    label: "Clientes",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const [timeRange, setTimeRange] = React.useState("90d")
  const [chartData, setChartData] = React.useState(chartDataStatic) // Inicia com os dados estáticos
  const [loading, setLoading] = React.useState(false)

  // Comentei a chamada à API para que o código funcione com os dados estáticos
  // até você ter a rota do backend pronta.
  /*
  React.useEffect(() => {
    async function fetchChartData() {
      try {
        setLoading(true)
        
        // ✨ Descomente e ajuste esta URL para a sua rota de API real
        // const response = await fetch(`/api/dashboard/registrations?range=${timeRange}`)
        
        // if (!response.ok) {
        //   throw new Error('Falha ao buscar dados do gráfico.')
        // }
        //
        // const data = await response.json()
        // setChartData(data)

      } catch (error) {
        console.error("Erro ao buscar dados do gráfico:", error)
        setChartData([])
      } finally {
        setLoading(false)
      }
    }

    fetchChartData()
  }, [timeRange])
  */

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-06-30")
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

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
          <AreaChart data={filteredData}>
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
              <linearGradient id="fillClientes" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-clientes)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-clientes)"
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
              dataKey="clientes"
              type="natural"
              fill="url(#fillClientes)"
              stroke="var(--color-clientes)"
              stackId="a"
            />
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
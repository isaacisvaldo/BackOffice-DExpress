// src/components/ChartBarInteractive.tsx
"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
type  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"


const chartData = [
  { date: "2024-04-01", receitas: 2500, despesas: 1800 },
  { date: "2024-04-02", receitas: 1900, despesas: 1500 },
  { date: "2024-04-03", receitas: 3200, despesas: 2100 },
  { date: "2024-04-04", receitas: 4500, despesas: 3200 },
  { date: "2024-04-05", receitas: 3800, despesas: 2900 },
  { date: "2024-04-06", receitas: 5100, despesas: 3500 },
  { date: "2024-04-07", receitas: 3600, despesas: 2800 },
  { date: "2024-04-08", receitas: 6000, despesas: 4500 },
  { date: "2024-04-09", receitas: 1200, despesas: 1000 },
  { date: "2024-04-10", receitas: 4100, despesas: 2500 },
  { date: "2024-04-11", receitas: 4800, despesas: 3500 },
  { date: "2024-04-12", receitas: 4200, despesas: 3000 },
  { date: "2024-04-13", receitas: 5500, despesas: 3800 },
  { date: "2024-04-14", receitas: 2100, despesas: 2200 },
  { date: "2024-04-15", receitas: 1800, despesas: 1700 },
  { date: "2024-04-16", receitas: 2200, despesas: 1900 },
  { date: "2024-04-17", receitas: 6500, despesas: 3600 },
  { date: "2024-04-18", receitas: 5200, despesas: 4100 },
  { date: "2024-04-19", receitas: 3800, despesas: 1800 },
  { date: "2024-04-20", receitas: 1500, despesas: 1500 },
];


const chartConfig = {
  valor: {
    label: "Valor",
  },
  receitas: {
    label: "Receitas",
    color: "var(--chart-1)",
  },
  despesas: {
    label: "Despesas",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig

export function ChartBarInteractive() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("receitas") 
 const [loading, setLoading] = React.useState(false)
  const total = React.useMemo(
    () => ({
      receitas: chartData.reduce((acc, curr) => acc + curr.receitas, 0),
      despesas: chartData.reduce((acc, curr) => acc + curr.despesas, 0),
    }),
    []
  )
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
    <Card className="py-0">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
          <CardTitle>Fluxo de Caixa Mensal</CardTitle> 
          <CardDescription>
            Receitas e despesas dos últimos 30 dias
          </CardDescription> 
        </div>
        <div className="flex">
          {["receitas", "despesas"].map((key) => {
            const chart = key as keyof typeof chartConfig
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-muted-foreground text-xs">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg leading-none font-bold sm:text-3xl">
                  Kz {total[key as keyof typeof total].toLocaleString("pt-BR", { minimumFractionDigits: 2 })} 
                </span>
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("pt-PT", { 
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="valor" 
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("pt-PT", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
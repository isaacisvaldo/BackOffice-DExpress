import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      
      {/* Profissionais cadastrados */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Profissionais Cadastrados</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            856
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
          <CardDescription>Famílias Ativas</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            1,245
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
            Mais famílias estão contratando <IconTrendingUp className="size-4" />
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
            62
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
            14
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
  )
}

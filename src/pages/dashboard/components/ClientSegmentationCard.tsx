import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CardPlaceholder } from "@/components/ui/card-placeholder";
import { Progress } from "@/components/ui/progress";
import { getClientsBySegment } from "@/services/dasboard/dasboard.service";
import { useState, useEffect } from "react"; 

interface ClientSegment {
  segment: string;
  count: number;
  percentage: number;
}

interface ClientSegmentationCardProps {
  barHeightClass?: string;
}

export default function ClientSegmentationCard({
  barHeightClass = "h-4",
}: ClientSegmentationCardProps) {

  const [clientSegments, setClientSegments] = useState<ClientSegment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); 
      setError(null); 
      try {
    
        const result = await getClientsBySegment();

        const dataFromService: ClientSegment[] = result.data || [];
        
        setClientSegments(dataFromService);

      } catch (err) {
        console.error("Erro ao buscar dados da API:", err);
        setError((err as Error).message || "Falha ao carregar dados.");
      } finally {
        setLoading(false); 
      }
    };

    fetchData();
    // NOTA: Removida a função de cleanup do AbortController.
 
  }, []); 

 
  if (loading) {
    return <CardPlaceholder />;
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Segmentação de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-red-500">
            Erro ao carregar: {error}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!clientSegments || clientSegments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Segmentação de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Nenhum dado de segmento disponível.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Segmentação de Clientes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {clientSegments.map((segmentData) => (
            <div key={segmentData.segment} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{segmentData.segment}</span>
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground">
                    {segmentData.count} clientes
                  </span>
                  <span className="font-medium">{segmentData.percentage}%</span>
                </div>
              </div>
              {/* O componente Progress usará a cor padrão definida no seu tema (geralmente 'bg-primary') */}
              <Progress
                value={segmentData.percentage}
                className={barHeightClass}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
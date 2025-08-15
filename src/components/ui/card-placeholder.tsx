import { Card, CardFooter, CardHeader } from "@/components/ui/card";


export function CardPlaceholder(){
  return (
    <Card className="@container/card animate-pulse">
      <CardHeader>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-3/4 mb-2"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md w-1/2"></div>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-2/3"></div>
      </CardFooter>
    </Card>
  );
}


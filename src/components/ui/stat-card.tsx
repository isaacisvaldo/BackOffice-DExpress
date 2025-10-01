
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    type: "increase" | "decrease" | "neutral" | "warning";
  };
  icon?: ReactNode;
  variant?: "default" | "primary" | "success" | "warning" | "info" | "destructive";
  className?: string;
}

export function StatCard({
  title,
  value,
  change,
  icon,
  variant = "default",
  className,
}: StatCardProps) {
  const variantStyles = {
    default: "border-border",
    primary: "border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10",
    success: "border-success/20 bg-gradient-to-br from-success/5 to-success/10",
    warning: "border-warning/20 bg-gradient-to-br from-warning/5 to-warning/10",
    info: "border-info/20 bg-gradient-to-br from-info/5 to-info/10",
    destructive: "border-destructive/20 bg-gradient-to-br from-destructive/5 to-destructive/10",
  };

  const getChangeColor = (type: "increase" | "decrease" | "neutral" | "warning") => {
    switch (type) {
      case "increase":
        return "text-success";
      case "decrease":
        return "text-destructive";
      case "neutral":
        return "text-muted-foreground";
      case "warning":
        return "text-warning";
    }
  };

  return (
    <Card className={cn("shadow-card hover:shadow-hr-md transition-shadow", variantStyles[variant], className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && (
          <div className="h-4 w-4 text-muted-foreground">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {change && (
          <p className={cn("text-xs mt-1", getChangeColor(change.type))}>
            {change.value}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
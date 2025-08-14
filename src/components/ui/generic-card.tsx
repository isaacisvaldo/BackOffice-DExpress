import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ElementType } from 'react';

interface GenericCardProps {
  title: string;
  value: string | number;
  badgeText?: string;
  badgeIcon?: ElementType; 
  footerText?: string;
  footerDetail?: string;
  footerIcon?: ElementType; 
}


export function GenericCard({
  title,
  value,
  badgeText,
  badgeIcon: BadgeIcon,
  footerText,
  footerDetail,
  footerIcon: FooterIcon,
}: GenericCardProps) {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {value}
        </CardTitle>
        <CardAction className="hidden md:block">
          {BadgeIcon && badgeText && (
            <Badge variant="outline" className="flex-1 min-w-0 truncate">
              <BadgeIcon />
              <span className="truncate">{badgeText}</span>
            </Badge>
          )}
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          {footerText} {FooterIcon && <FooterIcon className="size-4" />}
        </div>
        <div className="text-muted-foreground">
          {footerDetail}
        </div>
      </CardFooter>
    </Card>
  );
}
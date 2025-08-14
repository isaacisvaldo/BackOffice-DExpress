// components/list-card.jsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function ListCardGeneric({ title, description, items }:any) {
  return (
    <div className="w-full max-w-md">
      {title && <h2 className="text-xl font-semibold mb-1">{title}</h2>}
      {description && <p className="text-sm text-gray-500 mb-4">{description}</p>}

      {/* A altura fixa foi aumentada para 300px */}
      <div className="grid gap-4 h-[262px] overflow-y-auto">
        {items.map((item:any, index:any) => (
          <div
            key={index}
            className="flex items-center justify-between space-x-4 p-2 rounded-md hover:bg-muted transition-colors"
          >
            <div className="flex items-center space-x-4">
              {item.avatarUrl && (
                <Avatar>
                  <AvatarImage src={item.avatarUrl} alt={item.title} />
                  <AvatarFallback>{item.title.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
              <div>
                <p className="text-sm font-medium leading-none">
                  {item.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  {item.subtitle}
                </p>
              </div>
            </div>
            {item.trailingContent && (
              <div className="text-sm font-semibold">{item.trailingContent}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
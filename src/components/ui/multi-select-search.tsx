import * as React from "react";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface MultiSelectSearchProps {
  options: {
    value: string;
    label: string;
  }[];
  selectedValues: string[];
  onSelectChange: (selected: string[]) => void;
  placeholder?: string;
}

const MultiSelectSearch: React.FC<MultiSelectSearchProps> = ({
  options,
  selectedValues,
  onSelectChange,
  placeholder = "Selecionar...",
}) => {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (value: string) => {
    // Verifica se o valor já está selecionado
    const isSelected = selectedValues.includes(value);

    // Se estiver selecionado, remove. Caso contrário, adiciona.
    const newSelection = isSelected
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];

    onSelectChange(newSelection);
  };

  const getLabelForValue = (value: string) => {
    const option = options.find((o) => o.value === value);
    return option ? option.label : value;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <div className="flex flex-wrap gap-1">
            {selectedValues.length === 0 ? (
              <span>{placeholder}</span>
            ) : (
              selectedValues.map((value) => (
                <Badge key={value} variant="secondary">
                  {getLabelForValue(value)}
                  <X
                    className="ml-1 h-3 w-3 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(value);
                    }}
                  />
                </Badge>
              ))
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Pesquisar..." />
          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                onSelect={() => handleSelect(option.value)}
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-4 w-4 items-center justify-center rounded-sm border border-primary">
                    {selectedValues.includes(option.value) && (
                      <span className="h-2 w-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <span>{option.label}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default MultiSelectSearch;

"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { MultipleSelector } from "@/components/ui/multiple-selector";
import type { MultipleSelectorFormFieldProps } from "./type";
import type { FieldValues } from "react-hook-form";

export function MultipleSelectorFormField<T extends FieldValues>({
  control,
  name,
  label,
  items,
  disabled,
  emptyEndicator,
  placeholder,
  maxSelected,
}: MultipleSelectorFormFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="cursor-pointer">{label}</FormLabel>
          <FormControl>
            <MultipleSelector
              className="data-[disabled]:cursor-not-allowed! data-[disabled]:pointer-events-auto!"
              hideClearAllButton
              disabled={disabled}
              {...field}
              maxSelected={maxSelected}
              defaultOptions={items}
              placeholder={placeholder}
              emptyIndicator={emptyEndicator}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

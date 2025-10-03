import { Textarea } from "../ui/textarea";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import type { TextareaFormFieldProps } from "./type";
import type { FieldValues } from "react-hook-form";

export function TextareaFormField<T extends FieldValues>(
  props: TextareaFormFieldProps<T>,
) {
  const { control, name, placeholder, label, disabled } = props;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea
              {...field}
              className="h-12"
              disabled={disabled}
              placeholder={placeholder}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

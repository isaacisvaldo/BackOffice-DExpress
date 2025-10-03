import { Input } from "../ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import type { InputFormFieldProps } from "./type";
import type { FieldValues } from "react-hook-form";

export function InputFormField<T extends FieldValues>(
  props: InputFormFieldProps<T>,
) {
  const { control, name, placeholder, label, type, disabled } = props;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="cursor-pointer">{label}</FormLabel>
          <FormControl>
            <Input
              {...field}
              disabled={disabled}
              placeholder={placeholder}
              type={type}
              onChange={(e) => {
                if (type === "number") {
                  const value = e.target.value;
                  field.onChange(value === "" ? "" : Number(value));
                } else {
                  field.onChange(e.target.value);
                }
              }}
              value={field.value ?? ""}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

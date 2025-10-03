import type { Control, FieldValues, Path } from "react-hook-form";

export type SelectFormFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  placeholder?: string;
  label?: string;
  items: { value: string; label: string }[];
  disabled?: boolean;
  fullWidth?: boolean;
};

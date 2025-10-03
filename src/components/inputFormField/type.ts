import type { Control, FieldValues, Path } from "react-hook-form";

export type InputFormFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  placeholder?: string;
  label?: string;
  type?: string;
  disabled?: boolean;
};

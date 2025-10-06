import type { Control, FieldValues, Path } from "react-hook-form";

export type TextareaFormFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
};

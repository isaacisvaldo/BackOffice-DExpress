import type { Control, FieldValues, Path } from "react-hook-form";
import type { Option } from "../ui/multiple-selector";
import type React from "react";

export type MultipleSelectorFormFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  items: Option[];
  disabled?: boolean;
  emptyEndicator?: React.ReactNode;
  placeholder?: string;
  maxSelected?: number;
};

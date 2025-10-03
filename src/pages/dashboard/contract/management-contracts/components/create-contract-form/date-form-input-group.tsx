import { InputFormField } from "@/components/inputFormField";
import type { ContractForm } from "../../types";

type DateFormInputGroupProps = {
  form: ContractForm;
};
export const DateFormInputGroup = ({ form }: DateFormInputGroupProps) => {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <InputFormField
        label="Data de início"
        control={form.control}
        name="startDate"
        type="date"
        placeholder="Selecione a data de início"
      />
      <InputFormField
        label="Data de término"
        control={form.control}
        name="endDate"
        type="date"
        placeholder="Selecione a data de término"
      />
    </div>
  );
};

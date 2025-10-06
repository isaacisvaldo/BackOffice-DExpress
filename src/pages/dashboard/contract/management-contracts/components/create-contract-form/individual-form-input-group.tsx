import { SelectFormField } from "@/components/selectFormField";
import type { ContractForm } from "../../types";
import { useIndividualFormInputGroup } from "../../hooks/use-individual-form-input-group";

type IndividualFormInputGroupProps = {
  form: ContractForm;
};

export function IndividualFormInputGroup({
  form,
}: IndividualFormInputGroupProps) {
  const { clientOptions, desiredPositionOptions, professionalOptions } =
    useIndividualFormInputGroup();

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <SelectFormField
        label="Pessoa Singular"
        control={form.control}
        fullWidth
        name="individualClientId"
        placeholder="Selecione a pessoa"
        items={clientOptions}
      />
      <SelectFormField
        label="Posição Desejada"
        control={form.control}
        fullWidth
        name="desiredPositionId"
        placeholder="Selecione a posição desejada"
        items={desiredPositionOptions}
      />
      <SelectFormField
        label="Profissional"
        control={form.control}
        fullWidth
        name="professionalId"
        placeholder="Selecione o profissional"
        items={professionalOptions}
      />
    </div>
  );
}

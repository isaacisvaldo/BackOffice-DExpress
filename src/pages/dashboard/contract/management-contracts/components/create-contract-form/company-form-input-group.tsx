import { MultipleSelectorFormField } from "@/components/multipleSelectorFormField";
import { SelectFormField } from "@/components/selectFormField";
import type { ContractForm } from "../../types";
import { useCompanyFormInputGroup } from "../../hooks/use-company-form-input-group";

type CompanyFormInputGroupProps = {
  form: ContractForm;
};

export function CompanyFormInputGroup({ form }: CompanyFormInputGroupProps) {
  const {
    clientOptions,
    packageOptions,
    professionalOptions,
    limitProfesional,
  } = useCompanyFormInputGroup(form);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid md:grid-cols-2 gap-4">
        <SelectFormField
          label="Empresa"
          control={form.control}
          fullWidth
          name="companyClientId"
          placeholder="Selecione a empresa"
          items={clientOptions}
        />
        <SelectFormField
          label="Pacote de Serviço"
          control={form.control}
          fullWidth
          name="packageId"
          placeholder="Selecione o pacote"
          items={packageOptions}
        />
      </div>
      <MultipleSelectorFormField
        label="Profissional"
        control={form.control}
        name="professionalIds"
        placeholder={
          limitProfesional === 0
            ? "Selecione um pacote"
            : "Selecione os profissionais"
        }
        disabled={limitProfesional === 0}
        maxSelected={limitProfesional}
        items={professionalOptions}
      />
    </div>
  );
}

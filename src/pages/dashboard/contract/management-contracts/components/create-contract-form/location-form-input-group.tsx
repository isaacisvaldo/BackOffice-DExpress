import { SelectFormField } from "@/components/selectFormField";
import type { ContractForm } from "../../types";
import { InputFormField } from "@/components/inputFormField";
import { useGetCitiesList } from "@/hooks/use-get-cities-list";
import { useGetDistrictsByCityId } from "@/hooks/use-get-districts-by-city-id";

type LocationFormInputGroupProps = {
  form: ContractForm;
};

export function LocationFormInputGroup({ form }: LocationFormInputGroupProps) {
  const { cities } = useGetCitiesList();
  const citiesList = cities.map((city) => ({
    value: city.id,
    label: city.name,
  }));
  const { districts, isLoading } = useGetDistrictsByCityId(
    form.watch("cityId"),
  );
  const districtsList = districts.map((district) => ({
    value: district.id,
    label: district.name,
  }));

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <SelectFormField
        label="Cidade"
        control={form.control}
        fullWidth
        name="cityId"
        placeholder="Selecione a cidade"
        items={citiesList}
      />

      <SelectFormField
        label="Distrito"
        control={form.control}
        fullWidth
        name="districtId"
        disabled={districtsList.length === 0 || isLoading}
        placeholder={isLoading ? "Carregando..." : "Selecione o distrito"}
        items={districtsList}
      />
      <InputFormField
        label="Bairro"
        control={form.control}
        name="street"
        placeholder="Digite o nome do bairro"
      />
    </div>
  );
}

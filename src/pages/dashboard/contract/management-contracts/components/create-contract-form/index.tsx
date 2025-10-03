import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";

import { InputFormField } from "@/components/inputFormField";
import { SelectFormField } from "@/components/selectFormField";

import { cn } from "@/lib/utils";

import type { ContractFormValues } from "../../types";

import { Form } from "@/components/ui/form";

import { TextareaFormField } from "@/components/textareaFormField";
import { contractSchema } from "../../schema/schema";
import { CompanyFormInputGroup } from "./company-form-input-group";
import { IndividualFormInputGroup } from "./individual-form-input-group";
import { LocationFormInputGroup } from "./location-form-input-group";
import { DateFormInputGroup } from "./date-form-input-group";
import { PaymentFormInputGroup } from "./payment-form-input-group";
import { useManagementContracts } from "../../hooks/use-management-contracts";

export function CreateContractsForm() {
  const form = useForm<ContractFormValues>({
    resolver: zodResolver(contractSchema),
    defaultValues: {
      clientType: "CORPORATE",
      title: "",
      description: "",
      companyClientId: "",
      packageId: "",
      professionalIds: [],
      agreedValue: 0,
      discountPercentage: 0,
      finalValue: 0,
      paymentTerms: "",
      startDate: "",
      endDate: "",
      cityId: "",
      districtId: "",
      street: "",
      notes: "",
    },
  });

  const { createContract } = useManagementContracts();

  const clientType = form.watch("clientType");
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          createContract(data);
        })}
        className="space-y-4"
      >
        <SelectFormField
          label="Tipo Contrato"
          control={form.control}
          fullWidth
          name="clientType"
          placeholder="Selecione o tipo de cliente"
          items={[
            { value: "CORPORATE", label: "Empresa" },
            { value: "INDIVIDUAL", label: "Pessoa" },
          ]}
        />

        <div className="grid md:grid-cols-2 gap-4">
          <InputFormField
            control={form.control}
            name="title"
            label=" Título do Contrato"
          />

          <InputFormField
            control={form.control}
            name="description"
            label="Descrição"
          />
        </div>

        {clientType === "CORPORATE" && <CompanyFormInputGroup form={form} />}
        {clientType === "INDIVIDUAL" && (
          <IndividualFormInputGroup form={form} />
        )}

        <LocationFormInputGroup form={form} />
        <DateFormInputGroup form={form} />
        <PaymentFormInputGroup form={form} />
        <TextareaFormField name="notes" label="Notas" control={form.control} />

        <div
          className={cn(
            "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
          )}
        >
          <Button
            className="cursor-pointer"
            variant="outline"
            //  onClick={() => setIsModalOpen(false)}
          >
            Cancelar
          </Button>
          <Button className="cursor-pointer" type="submit">
            Enviar
          </Button>
        </div>
      </form>
    </Form>
  );
}

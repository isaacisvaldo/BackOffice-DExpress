import { InputFormField } from "@/components/inputFormField";
import type { ContractForm } from "../../types";
import { useFinalValue } from "../../hooks/use-final-value";

type PaymentFormInputGroupProps = {
  form: ContractForm;
};

export const PaymentFormInputGroup = ({ form }: PaymentFormInputGroupProps) => {
  useFinalValue(form);

  const clientType = form.watch("clientType");

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <InputFormField
        disabled={clientType === "CORPORATE"}
        label="Valor acordado"
        control={form.control}
        name="agreedValue"
        type="number"
        placeholder="Digite o valor acordado"
      />

      <InputFormField
        label="Percentual de desconto"
        control={form.control}
        name="discountPercentage"
        type="number"
        placeholder="Digite o desconto (%)"
      />

      <InputFormField
        label="Valor final"
        control={form.control}
        name="finalValue"
        type="number"
        placeholder="Valor final"
        disabled={true}
      />

      <InputFormField
        label="Condições de pagamento"
        control={form.control}
        name="paymentTerms"
        type="text"
        placeholder="Ex.: 50% na assinatura, 50% na entrega"
      />
    </div>
  );
};

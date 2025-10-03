import { useEffect } from "react";
import { toast } from "sonner";
import { useGetPackages } from "@/hooks/use-get-packages";
import type { ContractForm } from "../types";

export function useFinalValue(form: ContractForm) {
  const { packages } = useGetPackages();

  const clientType = form.watch("clientType");
  const packageId = form.watch("packageId");
  const agreedValue = Number(form.watch("agreedValue") || 0);
  const discountPercentage = Number(form.watch("discountPercentage") || 0);

  useEffect(() => {
    if (clientType === "INDIVIDUAL") {
      form.setValue("agreedValue", 0);
      form.setValue("finalValue", 0);
    }

    if (clientType === "CORPORATE") {
      form.setValue("agreedValue", 0);
      form.setValue("finalValue", 0);
    }
  }, [clientType, form]);

  useEffect(() => {
    if (clientType === "CORPORATE") {
      const pack = packages.find((p) => p.id === packageId);

      if (!pack) {
        form.setValue("finalValue", 0);
        toast.error("Pacote não encontrado");
        return;
      }

      const corporateValue = pack.price * (1 - discountPercentage / 100);
      form.setValue("agreedValue", pack.price);
      form.setValue("finalValue", corporateValue);
      return;
    }

    if (clientType === "INDIVIDUAL") {
      const finalValue = agreedValue * (1 - discountPercentage / 100);
      form.setValue("finalValue", finalValue);
    }
  }, [clientType, packageId, agreedValue, discountPercentage, packages, form]);
}

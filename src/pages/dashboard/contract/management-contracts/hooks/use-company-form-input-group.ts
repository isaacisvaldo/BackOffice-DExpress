import { useGetProfessionals } from "@/hooks/use-get-professionals";
import { useGetCompanyClients } from "@/hooks/use-get-company-clients";
import { useGetPackages } from "@/hooks/use-get-packages";
import { useMemo, useEffect } from "react";
import type { ContractForm } from "../types";

export function useCompanyFormInputGroup(form: ContractForm) {
  const { professionals, isLoading: loadingProfessionals } =
    useGetProfessionals();
  const { companyClients, isLoading: loadingClients } = useGetCompanyClients();
  const { packages, isLoading: loadingPackages } = useGetPackages();

  const professionalOptions = useMemo(
    () => professionals.map((p) => ({ value: p.id, label: p.fullName })),
    [professionals],
  );

  const clientOptions = useMemo(
    () => companyClients.map((c) => ({ value: c.id, label: c.companyName })),
    [companyClients],
  );

  const packageOptions = useMemo(
    () => packages.map((p) => ({ value: p.id, label: p.name })),
    [packages],
  );

  const packageId = form.watch("packageId");

  const limitProfesional = useMemo(() => {
    const pack = packages.find((p) => p.id === packageId);
    return pack ? pack.employees : 0;
  }, [packages, packageId]);

  useEffect(() => {
    const current = form.getValues("professionalIds") || [];
    if (limitProfesional > 0 && current.length > limitProfesional) {
      form.setValue("professionalIds", current.slice(0, limitProfesional), {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [limitProfesional, form]);

  return {
    clientOptions,
    packageOptions,
    professionalOptions,
    limitProfesional,
    loading: {
      clients: loadingClients,
      packages: loadingPackages,
      professionals: loadingProfessionals,
    },
  };
}

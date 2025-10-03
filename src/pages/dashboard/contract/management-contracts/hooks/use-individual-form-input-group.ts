import { useGetIndividualClients } from "@/hooks/use-get-individual-clients";
import { useGetDesiredPositions } from "@/hooks/use-get-desired-positions";
import { useGetProfessionals } from "@/hooks/use-get-professionals";
import { useMemo } from "react";

export function useIndividualFormInputGroup() {
  const { individualClients, isLoading: loadingClients } =
    useGetIndividualClients();
  const { desiredPositions, isLoading: loadingPositions } =
    useGetDesiredPositions();
  const { professionals, isLoading: loadingProfessionals } =
    useGetProfessionals();

  const clientOptions = useMemo(
    () =>
      individualClients.map((client) => ({
        value: client.id,
        label: client.fullName,
      })),
    [individualClients],
  );

  const desiredPositionOptions = useMemo(
    () =>
      desiredPositions.map((pos) => ({
        value: pos.id,
        label: pos.label,
      })),
    [desiredPositions],
  );

  const professionalOptions = useMemo(
    () =>
      professionals.map((p) => ({
        value: p.id,
        label: p.fullName,
      })),
    [professionals],
  );

  return {
    clientOptions,
    desiredPositionOptions,
    professionalOptions,
    loading: {
      clients: loadingClients,
      positions: loadingPositions,
      professionals: loadingProfessionals,
    },
  };
}

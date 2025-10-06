import { z } from "zod";

const baseFields = {
  title: z.string().min(5, "Título deve ser maior que 5 caracteres"),
  description: z.string().min(5, "Descrição deve ser maior que 5 caracteres"),
  cityId: z.string().min(1, "Selecione uma cidade"),
  districtId: z.string().min(1, "Selecione um bairro"),
  street: z.string().min(1, "A rua é obrigatória"),
  notes: z.string().min(1, "As notas são obrigatórias"),
  agreedValue: z
    .number("Valor de acordo deve ser um número")
    .nonnegative("Valor de acordo deve ser maior ou igual a zero"),
  discountPercentage: z
    .number("Porcentagem de desconto deve ser um número")
    .nonnegative("Porcentagem de desconto deve ser maior ou igual a zero"),
  finalValue: z
    .number("Valor final deve ser um número")
    .nonnegative("Valor final deve ser maior ou igual a zero"),

  paymentTerms: z.string().min(1, "Termos de pagamento são obrigatórios"),
  startDate: z.string().min(1, "Data de início é obrigatória"),
  endDate: z.string().min(1, "Data de término é obrigatória"),
};

export const contractSchema = z.discriminatedUnion("clientType", [
  z.object({
    clientType: z.literal("CORPORATE"),
    companyClientId: z.string().min(1, "Selecione uma empresa"),
    packageId: z.string().min(1, "Selecione um pacote"),
    professionalIds: z
      .array(z.object({ label: z.string(), value: z.string() }))
      .min(1, "Selecione pelo menos um profissional"),
    ...baseFields,
  }),

  z.object({
    clientType: z.literal("INDIVIDUAL"),
    individualClientId: z.string().min(1, "Selecione uma pessoa"),
    desiredPositionId: z.string().min(1, "Selecione uma posição desejada"),
    professionalId: z.string().min(1, "Selecione um profissional"),
    ...baseFields,
  }),
]);

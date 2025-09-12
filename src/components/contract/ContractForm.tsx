import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { UserType } from "@/services/serviceRequest/service-request.service"
import MultiSelectSearch from "@/components/ui/multi-select-search"
export type ContractFormData = {
  companyName: string
  nif: string
  phone: string
  fullName: string
  identityNumber: string
  title: string
  description: string
  clientType: UserType
  individualClientId?: string
  companyClientId?: string
  professionalId?: string
  professionalIds: string[]
  packageId?: string
  desiredPositionId?: string
  location: { cityId: string; districtId: string; street: string }
  agreedValue: number
  discountPercentage: number
  finalValue: number
  paymentTerms: string
  startDate: string
  endDate: string
  notes: string

}

type ContractFormProps = {
  clientType: UserType
  initialData?: ContractFormData
  companyClients?: { id: string; companyName: string }[]
  individualClients?: { id: string; fullName: string }[]
  professionals?: { id: string; fullName: string }[]
  desiredPositions?: { id: string; name: string,label:string }[]
  packages?: { id: string; name: string; price: number }[]
  cities?: { id: string; name: string }[]
  districts?: any[]
  onChange: (data: ContractFormData) => void
}

export default function ContractForm({
  clientType,
  initialData,
  companyClients = [],
  individualClients = [],
  professionals = [],
  desiredPositions = [],
  packages = [],
  cities = [],
  districts = [],
  onChange,
}: ContractFormProps) {
  const [form, setForm] = useState<ContractFormData>(
    initialData || {
    companyName: "",
      nif: "",
      phone: "",
      fullName: "",
      identityNumber: "",
      title: "",
      description: "",
   clientType: clientType === UserType.CORPORATE ? UserType.CORPORATE : UserType.INDIVIDUAL,
      individualClientId: "",
      companyClientId: "",
      professionalId: "",
      professionalIds: [],
      packageId: "",
      desiredPositionId: "",
      location: { cityId: "", districtId: "", street: "" },
      agreedValue: 0,
      discountPercentage: 0,
      finalValue: 0,
      paymentTerms: "",
      startDate: "",
      endDate: "",
      notes: "",
    }
  )

 const updateForm = (key: keyof ContractFormData, value: any) => {
  const updated = { ...form, [key]: value, clientType};
  setForm(updated);
  onChange(updated);
};

  return (
    <form className="grid gap-4 py-4">
      {/* Título */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="title" className="text-right">Título</Label>
        <Input
          id="title"
          value={form.title}
          onChange={e => updateForm("title", e.target.value)}
          className="col-span-3"
        />
      </div>

      {/* Descrição */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="description" className="text-right">Descrição</Label>
        <Textarea
          id="description"
          value={form.description}
          onChange={e => updateForm("description", e.target.value)}
          className="col-span-3"
        />
      </div>

      {/* Cliente */}
 {/* Cliente/Empresa */}
{clientType === UserType.CORPORATE ? (
  <>
    {/* Campos para Empresa */}
    <div className="grid grid-cols-4 items-center gap-4">
      <Label className="text-right">Nome da Empresa</Label>
      <Input
        value={form.companyName || ""}
        onChange={e => updateForm("companyName", e.target.value)}
        className="col-span-3"
      />
    </div>

    <div className="grid grid-cols-4 items-center gap-4">
      <Label className="text-right">NIF</Label>
      <Input
        value={form.nif || ""}
        onChange={e => updateForm("nif", e.target.value)}
        className="col-span-3"
      />
    </div>

    <div className="grid grid-cols-4 items-center gap-4">
      <Label className="text-right">Telefone</Label>
      <Input
        value={form.phone || ""}
        onChange={e => updateForm("phone", e.target.value)}
        className="col-span-3"
      />
    </div>
  </>
) : (
  <>
    {/* Campos para Cliente */}
    <div className="grid grid-cols-4 items-center gap-4">
      <Label className="text-right">Nome Completo</Label>
      <Input
        value={form.fullName || ""}
        onChange={e => updateForm("fullName", e.target.value)}
        className="col-span-3"
      />
    </div>

    <div className="grid grid-cols-4 items-center gap-4">
      <Label className="text-right">Documento (BI/Passaporte)</Label>
      <Input
        value={form.identityNumber || ""}
        onChange={e => updateForm("identityNumber", e.target.value)}
        className="col-span-3"
      />
    </div>

    <div className="grid grid-cols-4 items-center gap-4">
      <Label className="text-right">Telefone</Label>
      <Input
        value={form.phone || ""}
        onChange={e => updateForm("phone", e.target.value)}
        className="col-span-3"
      />
    </div>
  </>
)}


      {/* Posição Desejada */}
      {clientType === UserType.INDIVIDUAL && (
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">Posição Desejada</Label>
          <Select
            value={form.desiredPositionId}
            onValueChange={val => updateForm("desiredPositionId", val)}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Selecione a posição" />
            </SelectTrigger>
            <SelectContent>
              {desiredPositions.map(p => (
                <SelectItem key={p.id} value={p.id}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Profissional (único) */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right">Profissional</Label>
        <Select
          value={form.professionalId}
          onValueChange={val => updateForm("professionalId", val)}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Selecione o profissional" />
          </SelectTrigger>
          <SelectContent>
            {professionals.map(p => (
              <SelectItem key={p.id} value={p.id}>
                {p.fullName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Profissionais (múltiplos) */}
        {clientType === UserType.CORPORATE && (
        <div className="grid grid-cols-4 items-center gap-4">
     <MultiSelectSearch
  options={professionals.map(p => ({ value: p.id, label: p.fullName }))}
  selectedValues={form.professionalIds ?? []}
  onSelectChange={(selected: string[]) => updateForm("professionalIds", selected)}
/>
   </div>
      )}

      {/* Pacote de Serviço */}
      {clientType === UserType.CORPORATE && (
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">Pacote</Label>
          <Select
            value={form.packageId}
            onValueChange={val => {
              const selectedPackage = packages.find(p => p.id === val)
              updateForm("packageId", val)
              if (selectedPackage) {
                updateForm("agreedValue", selectedPackage.price)
                updateForm("finalValue", selectedPackage.price)
              }
            }}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Selecione o pacote" />
            </SelectTrigger>
            <SelectContent>
              {packages.map(p => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

     
{/* Localização */}
<div className="grid grid-cols-4 items-center gap-4">
  <Label className="text-right">Cidade</Label>
  <Select
    value={form.location?.cityId ?? ""}
    onValueChange={val =>
      updateForm("location", {
        ...(form.location ?? { cityId: "", districtId: "", street: "" }),
        cityId: val,
        districtId: "", // reset distrito ao trocar cidade
      })
    }
  >
    <SelectTrigger className="col-span-3">
      <SelectValue placeholder="Selecione a cidade" />
    </SelectTrigger>
    <SelectContent>
      {cities.map(c => (
        <SelectItem key={c.id} value={c.id}>
          {c.name}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>

<div className="grid grid-cols-4 items-center gap-4">
  <Label className="text-right">Distrito</Label>
  <Select
    value={form.location?.districtId ?? ""}
    onValueChange={val =>
      updateForm("location", {
        ...(form.location ?? { cityId: "", districtId: "", street: "" }),
        districtId: val,
      })
    }
  >
    <SelectTrigger className="col-span-3">
      <SelectValue placeholder="Selecione o distrito" />
    </SelectTrigger>
    <SelectContent>
      {districts
        .filter(d => d.cityId === form.location?.cityId)
        .map(d => (
          <SelectItem key={d.id} value={d.id}>
            {d.name}
          </SelectItem>
        ))}
    </SelectContent>
  </Select>
</div>

<div className="grid grid-cols-4 items-center gap-4">
  <Label htmlFor="street" className="text-right">Rua</Label>
  <Input
    id="street"
    value={form.location?.street ?? ""}
    onChange={e =>
      updateForm("location", {
        ...(form.location ?? { cityId: "", districtId: "", street: "" }),
        street: e.target.value,
      })
    }
    className="col-span-3"
  />
</div>


      {/* Valores e Pagamento */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right">Valor Acordado</Label>
        <Input
          type="number"
          value={form.agreedValue}
          onChange={e => updateForm("agreedValue", Number(e.target.value))}
          className="col-span-3"
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right">Desconto (%)</Label>
        <Input
          type="number"
          value={form.discountPercentage}
          onChange={e => updateForm("discountPercentage", Number(e.target.value))}
          className="col-span-3"
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right">Valor Final</Label>
        <Input
          type="number"
          value={form.finalValue}
          onChange={e => updateForm("finalValue", Number(e.target.value))}
          className="col-span-3"
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right">Condições de Pagamento</Label>
        <Textarea
          value={form.paymentTerms}
          onChange={e => updateForm("paymentTerms", e.target.value)}
          className="col-span-3"
        />
      </div>

      {/* Datas */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right">Início</Label>
        <Input
          type="date"
          value={form.startDate}
          onChange={e => updateForm("startDate", e.target.value)}
          className="col-span-3"
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right">Fim</Label>
        <Input
          type="date"
          value={form.endDate}
          onChange={e => updateForm("endDate", e.target.value)}
          className="col-span-3"
        />
      </div>

      {/* Notas */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="notes" className="text-right">Notas</Label>
        <Textarea
          id="notes"
          value={form.notes}
          onChange={e => updateForm("notes", e.target.value)}
          className="col-span-3"
        />
      </div>
    </form>
  )
}

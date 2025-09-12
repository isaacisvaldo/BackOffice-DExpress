import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Download, Plus, Trash2, Edit } from "lucide-react";

interface ContractTemplate {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
}

export default function ContractTemplatesPage() {
  const [templates, setTemplates] = useState<ContractTemplate[]>([
    {
      id: "1",
      title: "Contrato de Prestação de Serviços",
      description: "Modelo padrão de prestação de serviços entre duas partes.",
      fileUrl: "/mock/contrato_prestacao_servicos.pdf",
    },
    {
      id: "2",
      title: "Contrato de Fornecimento",
      description: "Modelo para fornecimento de bens e materiais.",
      fileUrl: "/mock/contrato_fornecimento.docx",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newFile, setNewFile] = useState<File | null>(null);

  // Criar ou atualizar modelo
  const handleSave = () => {
    if (!newTitle.trim()) return;

    if (editingId) {
      // Atualizando
      setTemplates((prev) =>
        prev.map((tpl) =>
          tpl.id === editingId
            ? {
                ...tpl,
                title: newTitle,
                description: newDesc || "Sem descrição",
                fileUrl: newFile ? URL.createObjectURL(newFile) : tpl.fileUrl,
              }
            : tpl
        )
      );
    } else {
      // Criando
      const newTemplate: ContractTemplate = {
        id: Date.now().toString(),
        title: newTitle,
        description: newDesc || "Sem descrição",
        fileUrl: newFile ? URL.createObjectURL(newFile) : "#",
      };
      setTemplates((prev) => [...prev, newTemplate]);
    }

    resetForm();
  };

  // Excluir modelo
  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este modelo?")) {
      setTemplates((prev) => prev.filter((tpl) => tpl.id !== id));
    }
  };

  // Editar modelo
  const handleEdit = (tpl: ContractTemplate) => {
    setEditingId(tpl.id);
    setNewTitle(tpl.title);
    setNewDesc(tpl.description);
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setNewTitle("");
    setNewDesc("");
    setNewFile(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-background py-10 px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold">📑 Modelos de Contratos</h1>
        <p className="text-muted-foreground">
          Aqui você encontra modelos de contratos prontos para baixar ou pode criar seu próprio modelo.
        </p>

        {/* LISTA DE MODELOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {templates.map((tpl) => (
            <Card key={tpl.id} className="shadow-md">
              <CardHeader className="flex justify-between items-center">
                <CardTitle className="text-lg">{tpl.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{tpl.description}</p>

                <div className="flex gap-2">
                  <Button asChild className="flex-1">
                    <a href={tpl.fileUrl} download>
                      <Download className="w-4 h-4 mr-2" />
                      Baixar
                    </a>
                  </Button>
                  <Button variant="outline" onClick={() => handleEdit(tpl)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="destructive" onClick={() => handleDelete(tpl.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* CARD DE CRIAR NOVO */}
          <Card
            onClick={() => setShowForm(true)}
            className="cursor-pointer flex items-center justify-center border-dashed border-2 hover:bg-accent hover:text-accent-foreground transition"
          >
            <CardContent className="flex flex-col items-center justify-center py-10">
              <Plus className="w-6 h-6 mb-2" />
              <span>Criar Novo Modelo</span>
            </CardContent>
          </Card>
        </div>

        {/* FORMULÁRIO DE CRIAR/EDITAR */}
        {showForm && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>
                {editingId ? "Editar Modelo de Contrato" : "Novo Modelo de Contrato"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Título do modelo"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
              <Textarea
                placeholder="Descrição do modelo"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
              />
              <Input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setNewFile(e.target.files?.[0] || null)}
              />

              <div className="flex gap-3">
                <Button onClick={handleSave} className="flex-1">
                  {editingId ? "Atualizar" : "Salvar Modelo"}
                </Button>
                <Button variant="outline" onClick={resetForm} className="flex-1">
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

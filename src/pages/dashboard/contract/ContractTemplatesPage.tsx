import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Download, Plus, Trash2, Edit } from "lucide-react";
import {
  getTemplateContracts,
  createTemplateContract,
  updateTemplateContract,
  deleteTemplateContract,
  type TemplateContract,
} from "@/services/contract/template-contract/template-contract.service";
import { uploadFile } from "@/services/api-client";

export default function ContractTemplatesPage() {
  const [templates, setTemplates] = useState<TemplateContract[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newFile, setNewFile] = useState<File | null>(null);

  // Buscar templates ao carregar
  useEffect(() => {
    async function loadTemplates() {
      try {
        setLoading(true);
        const data = await getTemplateContracts();
        setTemplates(data);
      } catch (error) {
        console.error("Erro ao carregar templates:", error);
      } finally {
        setLoading(false);
      }
    }
    loadTemplates();
  }, []);

  // Criar ou atualizar modelo

const handleSave = async () => {
  if (!newTitle.trim()) return;

  try {
    let fileUrl: string | undefined = undefined;

    if (newFile) {
      // 1) Upload do arquivo
      const data = await uploadFile("/upload", newFile);

      if (data && data.url) {
        fileUrl = data.url;
      }
    }

    const metadata = {
      title: newTitle,
      description: newDesc,
      urlFile: fileUrl ?? "#",
    };

    if (editingId) {
      // 2) Atualizar template

      const updated = await updateTemplateContract(editingId, metadata);
      setTemplates((prev) =>
        prev.map((tpl) => (tpl.id === editingId ? updated : tpl))
      );
    } else {
      // 2) Criar novo template
      const created = await createTemplateContract(metadata);
      setTemplates((prev) => [...prev, created]);
    }

    resetForm();
  } catch (err) {
    console.error("Erro ao salvar template:", err);
  }
};


  // Excluir modelo
  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este modelo?")) {
      try {
        await deleteTemplateContract(id);
        setTemplates((prev) => prev.filter((tpl) => tpl.id !== id));
      } catch (err) {
        console.error("Erro ao deletar template:", err);
      }
    }
  };

  // Editar modelo
  const handleEdit = (tpl: TemplateContract) => {
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
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {templates.map((tpl) => (
              <Card key={tpl.id} className="shadow-md">
                <CardHeader className="flex justify-between items-center">
                  <CardTitle className="text-lg">{tpl.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {tpl.description}
                  </p>

                  <div className="flex gap-2">
                    <Button asChild className="flex-1">
                      <a href={tpl.urlFile} download  target="_blank" rel="noopener noreferrer">
                        <Download className="w-4 h-4 mr-2" />
                        Baixar
                      </a>
                    </Button>
                    <Button variant="outline" onClick={() => handleEdit(tpl)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(tpl.id)}
                    >
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
        )}

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
                <Button
                  variant="outline"
                  onClick={resetForm}
                  className="flex-1"
                >
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

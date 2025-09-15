"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { uploadFile } from "@/services/api-client";
import { Upload } from "lucide-react";
import { createContractDoc } from "@/services/contract/contract.service";

type DocumentUploaderProps = {
  contractId: string;
  onAdd: (doc: Document) => void;
};

export type Document = {
  id: string;
  name: string;
  description: string;
  url: string;
};

export default function DocumentUploader({
  contractId,
  onAdd,
}: DocumentUploaderProps) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [docName, setDocName] = useState("");
  const [docDescription, setDocDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    if (!file) return;

    setLoading(true);
    try {
      // 1) Upload do ficheiro
      const formData = new FormData();
      formData.append("file", file);

     const data = await uploadFile('/upload', file);
         if (data && data.url) {
     const metadata = {
        name: docName || file.name,
        description: docDescription,
        url:data.url,
      };
   // 2) Enviar metadados
   const savedDoc = await createContractDoc(contractId,metadata);
     
  
      // 3) Atualizar lista no pai
      onAdd(savedDoc);
   

      // 4) Resetar estado
      setOpen(false);
      setFile(null);
      setDocName("");
      setDocDescription("");
         }

   
    } catch (err) {
      console.error(err);
      alert("Falha no upload do documento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
     <label htmlFor="upload">
          
        </label>
      <Button onClick={() => setOpen(true)}>  <span className="flex items-center gap-2 cursor-pointer">
              <Upload className="h-4 w-4" /> Carregar Documento
            </span></Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Carregar Documento</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Ficheiro</Label>
              <Input type="file" onChange={handleFileChange} />
              <p className="text-xs text-muted-foreground">
                Formatos permitidos: PDF, DOCX, JPG, PNG
              </p>
            </div>

            <div>
              <Label>Nome do Documento</Label>
              <Input
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
              />
            </div>

            <div>
              <Label>Descrição</Label>
              <Textarea
                value={docDescription}
                onChange={(e) => setDocDescription(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={loading || !file}>
              {loading ? "A enviar..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

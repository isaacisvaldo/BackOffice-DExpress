// src/components/EmailEditor.tsx

import { useEffect, useRef, useState } from "react"
import { Editor } from "@tinymce/tinymce-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"
import { sendEmailHtml } from "@/services/email/emailService"

const TINEMCE_API_KEY = import.meta.env.VITE_TINEMCE_API_KEY

function getCurrentTheme(): "dark" | "light" {
  return document.documentElement.classList.contains("dark") ? "dark" : "light"
}

export default function EmailEditor({
  recipient,
  subject: subjectProp = "Nota sobre sua candidatura",

}: {
  recipient: string
  subject?: string
  isBroadcast?: boolean
}) {
  const editorRef = useRef<any>(null)
  const [loading, setLoading] = useState(false)
  const [subject, setSubject] = useState(subjectProp)
  const [theme, setTheme] = useState<"dark" | "light">(getCurrentTheme())

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const newTheme = getCurrentTheme()
      if (newTheme !== theme) {
        setTheme(newTheme)
      }
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => observer.disconnect()
  }, [theme])

  const handleSend = async () => {
    const html = editorRef.current?.getContent()

    toast.dismiss()

    if (!html) return toast.error("Mensagem vazia!")
    if (!recipient) return toast.error("Destinatário não pode ser vazio!")
    if (!TINEMCE_API_KEY) return toast.error("Chave da API do TinyMCE não configurada!")

    try {
        if (recipient === 'broadcast') {
        // Envia uma mensagem para o backend com uma flag de broadcast isBroadcast: true
        setLoading(true)
        toast.success("Estou a Implemetar o Broadcast, aguarde...")
        return 
    }
      setLoading(true)

      await sendEmailHtml({ to: recipient, subject, html })
      toast.success("Nota enviada com sucesso!")
      editorRef.current?.setContent("") 
    } catch {
      toast.error("Erro ao enviar a nota.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Input
        type="text"
        placeholder="Assunto do e-mail"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />

      <Editor
        key={theme} // Força recriação do editor quando tema muda
        apiKey={TINEMCE_API_KEY}
        onInit={(_, editor) => (editorRef.current = editor)}
        init={{
          height: 300,
          menubar: false,
          skin: theme === "dark" ? "oxide-dark" : "oxide",
          content_css: theme === "dark" ? "dark" : "default",
          plugins: [
            "advlist", "autolink", "lists", "link", "image", "charmap",
            "preview", "anchor", "searchreplace", "visualblocks",
            "code", "fullscreen", "insertdatetime", "media", "table",
            "help", "wordcount"
          ],
          toolbar:
            "undo redo | bold italic underline | alignleft aligncenter alignright | bullist numlist outdent indent | link image | code",
          placeholder: "Digite sua mensagem...",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
      />

      <Button onClick={handleSend} disabled={loading}>
        {loading ? "Enviando..." : "Salvar Nota e Enviar"}
      </Button>
    </div>
  )
}

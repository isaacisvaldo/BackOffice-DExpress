// src/services/emailService.ts

const API_URL = import.meta.env.VITE_API_URL || ""

export interface SendEmailParams {
  to: string
  subject?: string
  html: string
 
}

export async function sendEmailHtml({ to, subject, html}: SendEmailParams): Promise<void> {
  const res = await fetch(`${API_URL}/email/send/html`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      to,
      subject,
      html,
    
    }),
  })

  if (!res.ok) {
    throw new Error("Falha ao enviar e-mail")
  }
}

"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Clock, UserCheck, Briefcase, DollarSign, BellOff } from "lucide-react";

function NotificationItem({ notification, onMarkAsRead }: { notification: any; onMarkAsRead: (id: number) => void }) {
  const { id, title, description, time, icon, read } = notification;

  return (
    <div className={`flex items-start gap-4 relative py-4 ${!read ? 'border-l-2 border-primary pl-4' : 'pl-4'} transition-colors duration-200`}>
      <div className="flex flex-col items-center">
        <div className={`rounded-full p-2 ${read ? 'bg-muted text-muted-foreground' : 'bg-primary text-primary-foreground'}`}>
          {read ? <BellOff size={16} /> : icon}
        </div>
        <div className="w-px flex-grow bg-border mt-2"></div>
      </div>

      <div className="flex-1 space-y-2 pb-2">
        <div className={`flex justify-between items-start`}>
          <h3 className={`font-semibold ${read ? 'text-muted-foreground' : 'text-foreground'}`}>{title}</h3>
          <span className={`text-xs ${read ? 'text-muted-foreground' : 'text-foreground'}`}>{time}</span>
        </div>
        <p className={`text-sm ${read ? 'text-muted-foreground' : 'text-foreground'}`}>{description}</p>
        {!read && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onMarkAsRead(id)}
            className="text-xs text-blue-500 hover:bg-transparent hover:text-blue-700 p-0 h-auto"
          >
            Marcar como lido
          </Button>
        )}
      </div>
    </div>
  );
}

export default function NotificationList() {
  const [notifications, setNotifications] = useState([
    // Notificações de Solicitação de Serviço
    {
      id: 1,
      type: 'solicitation',
      title: 'Solicitação de serviço enviada',
      description: 'Sua solicitação para "Conserto de Eletrodoméstico" foi enviada com sucesso.',
      time: '1h atrás',
      icon: <Clock size={16} />,
      read: false,
    },
    {
      id: 2,
      type: 'solicitation',
      title: 'Serviço Concluído',
      description: 'O serviço de "Pintura Residencial" foi marcado como concluído.',
      time: '5min atrás',
      icon: <Clock size={16} />,
      read: true,
    },
    {
      id: 3,
      type: 'solicitation',
      title: 'Pedido de orçamento respondido',
      description: 'O profissional João da Silva respondeu ao seu pedido de orçamento.',
      time: '2 dias atrás',
      icon: <Clock size={16} />,
      read: false,
    },
    // Notificações para o Profissional
    {
      id: 4,
      type: 'professional',
      title: 'Novo profissional enquadrado',
      description: 'O profissional João Silva aceitou o seu pedido.',
      time: '30min atrás',
      icon: <UserCheck size={16} />,
      read: false,
    },
    {
      id: 5,
      type: 'professional',
      title: 'Proposta de serviço recebida',
      description: 'Você tem uma nova proposta de serviço para "Eletricista".',
      time: '12h atrás',
      icon: <UserCheck size={16} />,
      read: false,
    },
    {
      id: 6,
      type: 'professional',
      title: 'Avaliação recebida',
      description: 'Você recebeu uma nova avaliação de 5 estrelas do cliente Maria.',
      time: '1 dia atrás',
      icon: <UserCheck size={16} />,
      read: false,
    },
    {
      id: 7,
      type: 'professional',
      title: 'Perfil verificado',
      description: 'Sua documentação de enquadramento foi aprovada. Seu perfil agora está verificado.',
      time: '3 dias atrás',
      icon: <UserCheck size={16} />,
      read: true,
    },
    // Notificações de Interação
    {
      id: 8,
      type: 'interaction',
      title: 'Mensagem recebida',
      description: 'Você tem uma nova mensagem de João Silva.',
      time: '15min atrás',
      icon: <Briefcase size={16} />,
      read: false,
    },
    {
      id: 9,
      type: 'interaction',
      title: 'Comentário em sua postagem',
      description: 'O usuário Pedro comentou em sua última postagem do portfólio.',
      time: '2h atrás',
      icon: <Briefcase size={16} />,
      read: false,
    },
    // Notificações de Pagamento e Conclusão
    {
      id: 10,
      type: 'payment',
      title: 'Pagamento recebido',
      description: 'O pagamento referente ao serviço de "Consultoria de TI" foi processado.',
      time: 'Agora',
      icon: <DollarSign size={16} />,
      read: false,
    },
    {
      id: 11,
      type: 'payment',
      title: 'Fatura emitida',
      description: 'A fatura para o serviço "Manutenção Predial" foi emitida e enviada para seu e-mail.',
      time: '10h atrás',
      icon: <DollarSign size={16} />,
      read: false,
    },
  ]);

  const handleMarkAsRead = (id: number) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  return (
    <div className="flex flex-col gap-4 p-6 bg-background">
      <h1 className="text-2xl font-bold mb-4">Notificações</h1>
      <div className="container mx-auto max-h-[80vh] overflow-y-auto pr-2">
        {notifications.map((notif) => (
          <div key={notif.id} className="border-b border-border last:border-b-0">
            <NotificationItem
              notification={notif}
              onMarkAsRead={handleMarkAsRead}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
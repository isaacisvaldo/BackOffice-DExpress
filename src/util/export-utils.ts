import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export interface ExportData {
  title: string;
  headers: string[];
  data: any[][];
  summary?: {
    title: string;
    stats: Array<{ label: string; value: string }>;
  };
}

export const exportToPDF = (data: ExportData) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text(data.title, 20, 20);
  doc.setFontSize(10);
  doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-PT')}`, 20, 30);
  
  let yPosition = 40;
  
  // Summary stats if provided
  if (data.summary) {
    doc.setFontSize(14);
    doc.text(data.summary.title, 20, yPosition);
    yPosition += 10;
    
    data.summary.stats.forEach((stat, index) => {
      doc.setFontSize(10);
      doc.text(`${stat.label}: ${stat.value}`, 20, yPosition + (index * 6));
    });
    yPosition += (data.summary.stats.length * 6) + 10;
  }
  
  // Table
  doc.autoTable({
    head: [data.headers],
    body: data.data,
    startY: yPosition,
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [22, 160, 133], // Primary color from our theme
      textColor: 255,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
  });
  
  // Save the PDF
  doc.save(`${data.title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`);
};

export const exportToExcel = (data: ExportData) => {
  const wb = XLSX.utils.book_new();
  
  // Create worksheet data
  const wsData = [
    [data.title],
    [`Gerado em: ${new Date().toLocaleDateString('pt-PT')}`],
    [],
  ];
  
  // Add summary if provided
  if (data.summary) {
    wsData.push([data.summary.title]);
    data.summary.stats.forEach(stat => {
      wsData.push([stat.label, stat.value]);
    });
    wsData.push([]);
  }
  
  // Add headers and data
  wsData.push(data.headers);
  data.data.forEach(row => wsData.push(row));
  
  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  
  // Set column widths
  const colWidths = data.headers.map(() => ({ wch: 15 }));
  ws['!cols'] = colWidths;
  
  // Style the header row
  const headerRowIndex = wsData.findIndex(row => JSON.stringify(row) === JSON.stringify(data.headers));
  if (headerRowIndex >= 0) {
    data.headers.forEach((_, colIndex) => {
      const cellRef = XLSX.utils.encode_cell({ r: headerRowIndex, c: colIndex });
      if (!ws[cellRef]) ws[cellRef] = {};
      ws[cellRef].s = {
        font: { bold: true },
        fill: { fgColor: { rgb: "16A085" } },
        color: { rgb: "FFFFFF" }
      };
    });
  }
  
  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Relatório');
  
  // Save the file
  XLSX.writeFile(wb, `${data.title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.xlsx`);
};

// Utility functions for different sections
export const prepareCollaboratorsData = (): ExportData => ({
  title: 'Relatório de Colaboradores',
  summary: {
    title: 'Resumo Executivo',
    stats: [
      { label: 'Total de Colaboradores', value: '1,247' },
      { label: 'Novas Admissões', value: '23' },
      { label: 'Desligamentos', value: '8' },
      { label: 'Taxa de Retenção', value: '97.5%' },
    ]
  },
  headers: ['Nome', 'Departamento', 'Cargo', 'Data Admissão', 'Status'],
  data: [
    ['Ana Silva', 'Marketing', 'Designer', '28/09/2024', 'Ativo'],
    ['João Santos', 'TI', 'Desenvolvedor', '25/09/2024', 'Ativo'],
    ['Maria Costa', 'RH', 'Analista', '22/09/2024', 'Ativo'],
    ['Pedro Lima', 'Vendas', 'Consultor', '20/09/2024', 'Ativo'],
    // Add more sample data as needed
  ]
});

export const prepareContractsData = (): ExportData => ({
  title: 'Relatório de Contratos',
  summary: {
    title: 'Resumo Executivo',
    stats: [
      { label: 'Contratos Ativos', value: '1,089' },
      { label: 'Próximos a Expirar', value: '47' },
      { label: 'Contratos Expirados', value: '12' },
      { label: 'Taxa de Renovação', value: '89.3%' },
    ]
  },
  headers: ['Colaborador', 'Departamento', 'Tipo Contrato', 'Data Início', 'Data Fim', 'Status'],
  data: [
    ['Carlos Mendes', 'TI', 'Efetivo', '01/01/2023', '15/10/2024', 'Próximo a Expirar'],
    ['Luisa Fernandes', 'Marketing', 'Temporário', '01/06/2024', '22/10/2024', 'Próximo a Expirar'],
    ['Ricardo Alves', 'Vendas', 'Estágio', '01/03/2024', '28/10/2024', 'Próximo a Expirar'],
    ['Sofia Oliveira', 'RH', 'Efetivo', '01/01/2022', '05/11/2024', 'Ativo'],
  ]
});

export const prepareAttendanceData = (): ExportData => ({
  title: 'Relatório de Frequência',
  summary: {
    title: 'Resumo Executivo',
    stats: [
      { label: 'Taxa de Presença', value: '94.2%' },
      { label: 'Faltas Justificadas', value: '156' },
      { label: 'Faltas Injustificadas', value: '23' },
      { label: 'Horas Extras', value: '1,247h' },
    ]
  },
  headers: ['Colaborador', 'Data', 'Entrada', 'Saída', 'Horas Trabalhadas', 'Status'],
  data: [
    ['Ana Silva', '29/09/2024', '08:30', '17:30', '9h', 'Presente'],
    ['João Santos', '29/09/2024', '09:00', '18:00', '9h', 'Presente'],
    ['Maria Costa', '29/09/2024', '-', '-', '0h', 'Falta'],
    ['Pedro Lima', '29/09/2024', '08:45', '18:00', '9h 15m', 'Presente'],
  ]
});

export const prepareVacationData = (): ExportData => ({
  title: 'Relatório de Férias e Licenças',
  summary: {
    title: 'Resumo Executivo',
    stats: [
      { label: 'Colaboradores em Férias', value: '87' },
      { label: 'Férias Vencidas', value: '34' },
      { label: 'Licenças Médicas', value: '12' },
      { label: 'Licenças Maternidade/Paternidade', value: '8' },
    ]
  },
  headers: ['Colaborador', 'Departamento', 'Tipo', 'Data Início', 'Data Fim', 'Dias', 'Status'],
  data: [
    ['Carlos Mendes', 'TI', 'Férias', '20/09/2024', '04/10/2024', '15', 'Em Curso'],
    ['Luisa Fernandes', 'Marketing', 'Férias', '25/09/2024', '02/10/2024', '8', 'Em Curso'],
    ['Ana Costa', 'RH', 'Maternidade', '15/09/2024', '15/12/2024', '90', 'Em Curso'],
    ['Ricardo Alves', 'Vendas', 'Médica', '01/10/2024', '05/10/2024', '5', 'Em Curso'],
  ]
});

export const prepareTrainingData = (): ExportData => ({
  title: 'Relatório de Formação e Avaliação',
  summary: {
    title: 'Resumo Executivo',
    stats: [
      { label: 'Treinamentos Concluídos', value: '342' },
      { label: 'Treinamentos em Andamento', value: '156' },
      { label: 'Avaliações Pendentes', value: '23' },
      { label: 'Certificações Obtidas', value: '89' },
    ]
  },
  headers: ['Treinamento', 'Participantes', 'Progresso', 'Data Fim', 'Categoria', 'Status'],
  data: [
    ['Gestão de Projetos', '24', '75%', '15/11/2024', 'Gestão', 'Em Andamento'],
    ['Segurança da Informação', '156', '45%', '30/10/2024', 'TI', 'Em Andamento'],
    ['Atendimento ao Cliente', '67', '92%', '08/10/2024', 'Vendas', 'Em Andamento'],
    ['Liderança e Comunicação', '12', '28%', '22/12/2024', 'Gestão', 'Em Andamento'],
  ]
});

export const prepareFinancialData = (): ExportData => ({
  title: 'Relatório Financeiro',
  summary: {
    title: 'Resumo Executivo',
    stats: [
      { label: 'Custo Total de Pessoal', value: '€2.3M' },
      { label: 'Salário Médio', value: '€1,847' },
      { label: 'Horas Extras', value: '€87k' },
      { label: 'Benefícios', value: '€456k' },
    ]
  },
  headers: ['Departamento', 'Colaboradores', 'Custo Total', 'Salário Médio', 'Percentual'],
  data: [
    ['TI', '156', '€487,600', '€3,125', '21.2%'],
    ['Vendas', '234', '€456,780', '€1,952', '19.8%'],
    ['Operações', '298', '€523,400', '€1,756', '22.7%'],
    ['Marketing', '89', '€234,560', '€2,636', '10.2%'],
    ['RH', '45', '€156,780', '€3,484', '6.8%'],
    ['Financeiro', '78', '€287,650', '€3,688', '12.5%'],
  ]
});
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Download, FileText, FileSpreadsheet } from "lucide-react";
import { exportToPDF, exportToExcel, type ExportData } from "@/util/export-utils";

interface ExportButtonProps {
  data: ExportData;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

export function ExportButton({ data, variant = "outline", size = "default" }: ExportButtonProps) {
  const handlePDFExport = () => {
    exportToPDF(data);
  };

  const handleExcelExport = () => {
    exportToExcel(data);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size}>
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handlePDFExport} className="cursor-pointer">
          <FileText className="h-4 w-4 mr-2 text-destructive" />
          Exportar PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExcelExport} className="cursor-pointer">
          <FileSpreadsheet className="h-4 w-4 mr-2 text-success" />
          Exportar Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
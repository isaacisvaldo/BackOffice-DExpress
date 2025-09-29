


import { IndicatorsOverview } from "@/components/dashboardRh/indicators-overview";
import { CollaboratorsSection } from "@/components/dashboardRh/collaborators-section";
import { ContractsSection } from "@/components/dashboardRh/contracts-section";
import { AttendanceSection } from "@/components/dashboardRh/attendance-section";
import { VacationSection } from "@/components/dashboardRh/vacation-section";
import { TrainingSection } from "@/components/dashboardRh/training-section";
import { FinancialSection } from "@/components/dashboardRh/financial-section";

import { 
  Users, 
  FileText, 
  Clock, 
  Calendar, 
  BookOpen, 
  DollarSign,
  TrendingUp,

} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DashboardRh = () => {


  return (
     <div className="space-y-8">
       

      

        {/* Main Content Tabs */}
        <Tabs defaultValue="indicadores" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="indicadores" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Indicadores
            </TabsTrigger>
            <TabsTrigger value="colaboradores" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Colaboradores
            </TabsTrigger>
            <TabsTrigger value="contratos" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Contratos
            </TabsTrigger>
            <TabsTrigger value="frequencia" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Frequência
            </TabsTrigger>
            <TabsTrigger value="ferias" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Férias
            </TabsTrigger>
            <TabsTrigger value="formacao" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Formação
            </TabsTrigger>
            <TabsTrigger value="financeiro" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Financeiro
            </TabsTrigger>
          </TabsList>

          <TabsContent value="indicadores">
            <IndicatorsOverview />
          </TabsContent>

          <TabsContent value="colaboradores">
            <CollaboratorsSection />
          </TabsContent>

          <TabsContent value="contratos">
            <ContractsSection />
          </TabsContent>

          <TabsContent value="frequencia">
            <AttendanceSection />
          </TabsContent>

          <TabsContent value="ferias">
            <VacationSection />
          </TabsContent>

          <TabsContent value="formacao">
            <TrainingSection />
          </TabsContent>

          <TabsContent value="financeiro">
            <FinancialSection />
          </TabsContent>
        </Tabs>
      </div>
  );
};

export default DashboardRh;

  
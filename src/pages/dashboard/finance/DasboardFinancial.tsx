import { SectionCardsFinance } from "@/components/section-cards-finance";
import { ChartBarInteractive } from "@/components/ui/chart-bar-interactive";

export default function DashboardFinancial(){
    return (
      <div className="flex flex-1 flex-col">
           <div className="@container/main flex flex-1 flex-col gap-2">
             <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
               <SectionCardsFinance />
                 <div className="px-4 lg:px-6 flex-1">
                    <ChartBarInteractive />
                </div>
               
        </div>
      </div>
      </div>
    )
}
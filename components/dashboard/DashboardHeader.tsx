import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, Settings, Receipt } from "lucide-react";

interface DashboardHeaderProps {
  onAddGasto: () => void;
}

export function DashboardHeader({ onAddGasto }: DashboardHeaderProps) {
  const router = useRouter();

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Receipt className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              Control de Gastos
            </h1>
            <p className="text-xs text-muted-foreground">
              Gestión integral de finanzas personales
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 hover:shadow-[0_0_15px_rgba(124,58,237,0.5)] border-none text-white transition-all duration-300" 
            onClick={onAddGasto}
          >
            <Plus className="w-4 h-4" />
            Agregar gasto
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => router.push("/periodos")}
          >
            <Settings className="w-4 h-4" />
            Períodos
          </Button>
        </div>
      </div>
    </header>
  );
}
